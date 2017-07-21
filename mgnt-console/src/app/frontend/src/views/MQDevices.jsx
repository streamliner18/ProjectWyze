import React, { Component } from 'react'
import { IconSL, IconFA } from '../components/Icons'
import { Row, Col, Card, CardHeader, CardBlock, Button, Table } from 'reactstrap'
import { ListGroup, ListGroupItem } from 'reactstrap'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import update from 'immutability-helper'
import { Form, FormGroup, Label, Input } from 'reactstrap'
import { signedHeader, fetchJSON, signedJSONHeader } from '../utils/request'
import { onChange } from '../utils/forms'
import { swalAlert } from '../utils/alerts'

const MQDeviceItem = props =>
  <tr>
    <td><Button color='link' className='py-0 px-0' onClick={props.onEdit}>{props.name}</Button></td>
    <td><Button color='link' className='py-1 text-danger' onClick={props.onDelete}><IconSL i='trash' />Delete</Button></td>
    <td>{props.device_id}</td>
    <td>{props.templates[props.base_template].name}</td>
    <td>{props.description}</td>
    <td>{props.channels.length}</td>
  </tr>

const emptyDevice = {
  name: 'Untitled',
  description: '',
  input_key: 'status',
  output_key: 'command',
  base_template: '',
  device_id: 'device-id',
  channels: []
}

export class MQDevices extends Component {
  constructor (props) {
    super(props)
    this.state = {
      status: 'loading',
      data: [],
      current: {},
      add_form: {has_input: false},
      editing: false,
      templates: {}
    }
    this.reload = this.reload.bind(this)
    this.addDevice = this.addDevice.bind(this)
    this.onChangeModalForm = onChange.bind(this, this, 'add_form')
    this.onChangeModal = onChange.bind(this, this, 'current')
    this.onAddBinding = onChange.bind(this)
  }

  componentWillMount () {
    this.reload()
  }

  editDevice (idx) {
    this.setState({
      editing: true,
      current: this.state.data[Number(idx)],
      add_form: {has_input: false}
    })
  }

  saveDevice (save) {
    if (save) {
      fetch('/api/mqdevices/update', {
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

  onDelete (_id) {
    fetch(`/api/mqdevices/${_id}/delete`, {headers: signedHeader()})
      .then(fetchJSON)
      .then(() => this.reload())
  }

  addDevice () {
    this.setState({
      current: emptyDevice,
      editing: true
    })
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
    fetch('/api/mqdevices/list', {headers: signedHeader()})
      .then(fetchJSON)
      .then(json => {
        console.log(json)
        json.templates[''] = Object.assign({}, emptyDevice, {name: ''})
        this.setState({
          data: json.result,
          templates: json.templates,
          status: 'loaded'
        }
      )})
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
                <Label sm='3'>Device ID: </Label>
                <Col sm='9'><Input name='device_id' value={this.state.current.device_id} onChange={this.onChangeModal} /></Col>
              </FormGroup>
              <FormGroup row>
                <Label sm='3'>Base Template: </Label>
                <Col sm='9'><Input type='select' name='base_template' value={this.state.current.base_template} onChange={(e) =>
                      this.setState({
                        current: Object.assign({}, this.state.current, {
                          channels: this.state.templates[e.target.value].channels,
                          base_template: e.target.value
                        })
                      })
                    }>
                  {
                    Object.keys(this.state.templates).map(i =>
                      <option key={i} value={i}>{this.state.templates[i].name}</option>
                    )
                  }
                </Input>
                </Col>
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
            <Button color='primary' onClick={this.saveDevice.bind(this, true)}>Save</Button>
            <Button color='secondary' onClick={this.saveDevice.bind(this, false)}>Don't save</Button>
          </ModalFooter>
        </Modal>
        <Card className='card-accent-primary'>
          <CardHeader>
            <IconSL i='layers' /> My MQTT Devices
            <Button size='sm' color='primary' outline className='ml-4' onClick={this.addDevice}>
              <IconFA i='plus' /> Create Device
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
                  <th>Device ID</th>
                  <th>Base Template</th>
                  <th>Description</th>
                  <th># Channels</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.data.map(
                    (i, idx) => <MQDeviceItem key={i._id} templates={this.state.templates} onEdit={this.editDevice.bind(this, idx)} onDelete={this.onDelete.bind(this, i._id)} {...i} />
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
