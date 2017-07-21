import React, { Component } from 'react'
import { IconSL, IconFA } from '../components/Icons'
import { Row, Col, Card, CardHeader, CardBlock, Button, Table } from 'reactstrap'
import { ListGroup, ListGroupItem } from 'reactstrap'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import update from 'immutability-helper'
import { Form, FormGroup, Label, Input, InputGroup, InputGroupButton } from 'reactstrap'
import { signedHeader, fetchJSON, signedJSONHeader } from '../utils/request'
import { onChange } from '../utils/forms'

const MQTemplateItem = props =>
  <tr>
    <td><Button color='link' className='py-0 px-0' onClick={props.onEdit}>{props.name}</Button></td>
    <td>
      <Button color='link' className='py-1' onClick={props.onUpdate}><IconSL i='pencil' />Update Devices</Button>
      <Button color='link' className='py-1 text-danger' onClick={props.onDelete}><IconSL i='trash' />Delete</Button>
    </td>
    <td>{props.description}</td>
    <td>{props.channels.length}</td>
  </tr>

export class MQTemplates extends Component {
  constructor (props) {
    super(props)
    this.state = {
      status: 'loading',
      data: [],
      current: {},
      add_form: {has_input: false},
      editing: false
    }
    this.reload = this.reload.bind(this)
    this.addTemplate = this.addTemplate.bind(this)
    this.onChangeModalForm = onChange.bind(this, this, 'add_form')
    this.onChangeModal = onChange.bind(this, this, 'current')
    this.onAddBinding = this.onAddBinding.bind(this)
  }

  componentWillMount () {
    this.reload()
  }

  editTemplate (idx) {
    this.setState({
      editing: true,
      current: this.state.data[Number(idx)],
      add_form: {has_input: false}
    })
  }

  saveTemplate (save, update) {
    if (save) {
      fetch('/api/mqtemplates/update', {
        method: 'post',
        headers: signedJSONHeader(),
        body: JSON.stringify(this.state.current)
      }).then(fetchJSON)
        .then(json => {
          if (json.status === 'ok') {
            this.setState({
              current: {},
              editing: false
            })
            this.reload()
          }
        })
    } else {
      this.setState({
        current: {},
        editing: false
      })
    }
  }

  addTemplate () {
    let emptyTemplate = {
      name: 'Untitled',
      description: '',
      input_key: 'status',
      output_key: 'command',
      channels: []
    }
    this.setState({
      current: emptyTemplate,
      editing: true
    })
  }

  updateDevices (key) {
    console.log('Updating all devices using this key', key)
    fetch(`/api/mqtemplates/${key}/update_devices`, {headers: signedHeader()})
      .then(fetchJSON)
  }

  onDelete (_id) {
    fetch(`/api/mqtemplates/${_id}/delete`, {headers: signedHeader()})
      .then(fetchJSON)
      .then(() => this.reload())
  }

  onAddBinding (e) {
    e.preventDefault()
    const addForm = this.state.add_form
    if (addForm.rule && addForm.alias)
      this.setState({
        current: update(this.state.current, {
          channels: {$push: [addForm]}
        })
      })
  }

  reload () {
    this.setState({status: 'loading'})
    fetch('/api/mqtemplates/list', {headers: signedHeader()})
      .then(fetchJSON)
      .then(json => {
        console.log(json)
        this.setState({
          data: json.result,
          status: 'loaded'
        })
      })
  }

  render () {
    return (
      <div className='animated fadeIn'>
        <Modal isOpen={this.state.editing} size='lg'>
          <ModalHeader>{`Editing: ${this.state.current.name}`}</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup row>
                <Label sm='3'>Name: </Label>
                <Col sm='9'><Input name='name' value={this.state.current.name} onChange={this.onChangeModal} /></Col>
              </FormGroup>
              <FormGroup row>
                <Label sm='3'>Description: </Label>
                <Col sm='9'><Input name='description' value={this.state.current.description} onChange={this.onChangeModal} /></Col>
              </FormGroup>
              <FormGroup row>
                <Label sm='3' md='2'>Input Key: </Label>
                <Col sm='9' md='4'><Input name='input_key' value={this.state.current.input_key} onChange={this.onChangeModal} /></Col>
                <Label sm='3' md='2'>Output Key: </Label>
                <Col sm='9' md='4'><Input name='output_key' value={this.state.current.output_key} onChange={this.onChangeModal} /></Col>
              </FormGroup>
            </Form>
            <Form inline>
              <FormGroup>
                <Label className='pr-3'>Channels:</Label>
                <Input name='rule' value={this.state.add_form.rule} onChange={this.onChangeModalForm} />
                <IconSL i='arrow-right' className='px-4' />
                <Input name='alias' value={this.state.add_form.alias} onChange={this.onChangeModalForm} />
                <Label className='mx-3'>Has Input</Label>
                <Label className='switch switch-default switch-primary'>
                  <input type='checkbox' name='has_input' className='switch-input' checked={this.state.add_form.has_input} onChange={this.onChangeModalForm} />
                  <span className='switch-label' />
                  <span className='switch-handle' />
                </Label>
                <Button color='primary' outline onClick={this.onAddBinding} className='mx-3' ><IconSL i='plus' /> Add</Button>
              </FormGroup>
            </Form>
            <br />
            <ListGroup>
              {this.state.current.channels
                ? this.state.current.channels.map((i, idx) =>
                  <ListGroupItem key={idx}>
                    <span>{i.rule}</span>
                    <IconSL i='arrow-right' className='px-4' />
                    <span>{i.alias}</span>
                    {i.has_input ? <IconFA i='exchange' className='ml-3' /> : null}
                    <Button className='p-0 float-right' color='link' onClick={e => {
                        e.preventDefault()
                        this.setState({
                          current: update(this.state.current, {
                            channels: {$splice: [[idx, 1]]}
                          })
                        })
                      }}>
                      <IconSL i='trash' /> Delete
                    </Button>
                  </ListGroupItem>
                )
                : null
            }
            </ListGroup>
          </ModalBody>
          <ModalFooter>
            <Button color='secondary' onClick={this.saveTemplate.bind(this, true, true)}>Save + update devices</Button>
            <Button color='primary' onClick={this.saveTemplate.bind(this, true, false)}>Save</Button>
            <Button color='secondary' onClick={this.saveTemplate.bind(this, false, false)}>Don't save</Button>
          </ModalFooter>
        </Modal>
        <Card className='card-accent-primary'>
          <CardHeader>
            <IconSL i='layers' /> My MQTT Templates
            <Button size='sm' color='primary' outline className='ml-4' onClick={this.addTemplate}>
              <IconFA i='plus' /> Create Template
            </Button>
            <Button color='success' size='sm' outline disabled={this.state.status === 'loading'} onClick={this.reload} className='float-right'>
              <IconFA i='refresh' spin={this.state.status === 'loading'} /> Refresh
            </Button>
          </CardHeader>
          <CardBlock>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th />
                  <th>Description</th>
                  <th># Channels</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.data.map(
                    (i, idx) =>
                      <MQTemplateItem
                        key={i._id}
                        onEdit={this.editTemplate.bind(this, idx)}
                        onUpdate={this.updateDevices.bind(this, i._id)}
                        onDelete={this.onDelete.bind(this, i._id)}
                        {...i}
                      />
                  )
                }
              </tbody>
            </Table>
          </CardBlock>
        </Card>
      </div>
    )
  }
}
