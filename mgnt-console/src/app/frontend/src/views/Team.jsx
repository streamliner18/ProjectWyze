import React, { Component } from 'react'
import { IconSL, IconFA } from '../components/Icons'
import { Row, Col, Card, CardHeader, CardBlock, Button, Table } from 'reactstrap'
import { ListGroup, ListGroupItem } from 'reactstrap'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import update from 'immutability-helper'
import { Form, FormGroup, Label, Input, InputGroup, InputGroupButton } from 'reactstrap'

const TeamItem = props =>
  <tr className={props.enabled ? '' : 'text-muted'}>
    <td>{props.name}</td>
    <td>{props.enabled
        ? <Button color='link' className='py-0' onClick={props.toggle}>Disable</Button>
        : <Button color='link' className='py-0' onClick={props.toggle}>Enable</Button>
    }</td>
    <td>{props.email}</td>
    <td>{props.role}</td>
    <td>{props.invite_id || 'Registered'}</td>
    <td>{props.invite_id ? <Button color='link' className='py-0' onClick={props.onDelete}>Delete</Button> : null}</td>
  </tr>

export class Team extends Component {
  constructor (props) {
    super(props)
    this.state = {
      status: 'loading',
      data: [],
      current: {},
      editing: false
    }
    this.reload = this.reload.bind(this)
    this.onChangeModal = this.onChangeModal.bind(this, 'current')
    this.addUser = this.addUser.bind(this)
  }

  componentWillMount () {
    this.reload()
  }

  addUser () {
    this.setState({
      current: {
        admin: true,
        name: ''
      },
      editing: true
    })
  }

  saveUser (save) {
    if (save) {
      console.log('Saving user')
      this.setState({
        current: {},
        editing: false
      })
    } else {
      console.log('User not saved')
      this.setState({
        current: {},
        editing: false
      })
    }
  }

  toggleUser (_id, enabled) {
    console.log('User is', (enabled ? 'disabled' : 'enabled'), _id)
  }

  removeUser (_id) {
    console.log('User is removed', _id)
  }

  onChangeModal (label, e) {
    const t = e.target
    const value = t.type === 'checkbox' ? t.checked : t.value
    const name = t.name
    this.setState({
      [label]: update(this.state[label], {[name]: {$set: value}})
    })
  }

  reload () {
    this.setState({status: 'loading'})
    setTimeout(() => {
      this.setState({
        data: [
          {
            _id: 'user1',
            name: 'Sasan Erfan',
            email: 'serfan@badass.com',
            role: 'admin',
            enabled: true
          },
          {
            _id: 'user2',
            name: 'Jimmy He',
            role: 'admin',
            invite_id: '2bd976',
            enabled: false
          },
          {
            _id: 'user3',
            name: 'Chris Schmitz',
            role: 'user',
            invite_id: '02a751',
            enabled: true
          }
        ],
        status: 'loaded'
      })
    }, 1000)
  }

  render () {
    return (
      <div className='animated fadeIn'>
        <Modal isOpen={this.state.editing} size='lg'>
          <ModalHeader>Creating New User</ModalHeader>
          <ModalBody>
            <Form inline>
              <FormGroup>
                <Label className='pr-3'>Name:</Label>
                <Input name='name' value={this.state.current.name} onChange={this.onChangeModal} />
                <IconSL i='arrow-right' className='px-4' />
                <Label className='mx-3'>Admin</Label>
                <Label className='switch switch-default switch-primary'>
                  <input type='checkbox' name='admin' className='switch-input' checked={this.state.current.admin} onChange={this.onChangeModal} />
                  <span className='switch-label' />
                  <span className='switch-handle' />
                </Label>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={this.saveUser.bind(this, true)}>Create</Button>
            <Button color='secondary' onClick={this.saveUser.bind(this, false)}>Give up</Button>
          </ModalFooter>
        </Modal>
        <Card className='card-accent-primary'>
          <CardHeader>
            <IconSL i='layers' /> Users in Team
            <Button size='sm' color='primary' outline className='ml-4' onClick={this.addUser}>
              <IconFA i='plus' /> New User
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
                  <th>Email</th>
                  <th>Role</th>
                  <th>Invitation Code</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {
                  this.state.data.map(
                    (i, idx) => <TeamItem key={i._id} toggle={this.toggleUser.bind(this, i._id, i.enabled)} onDelete={this.removeUser.bind(this, i._id)} {...i} />
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
