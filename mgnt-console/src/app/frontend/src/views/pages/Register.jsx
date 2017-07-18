import React, { Component } from 'react'
import { Container, Row, InputGroup, InputGroupAddon, Button, Input, Card, CardBlock, Form, Alert } from 'reactstrap'
import { IconSL } from '../../components/'
import history from '../../history'

const StateAlert = (props) =>
  props.status === 'error'
    ? <Alert color='warning'>Invalid invitation or email address already registered. Check again.</Alert>
    : null

class RegisterForm extends Component {
  constructor (props) {
    super(props)
    this.state = {inv: '', pwd: '', rpwd: '', email: '', status: ''}
    this.handleSubmit = this.handleSubmit.bind(this)
    this.submitEligible = this.submitEligible.bind(this)
    this.checkPassword = this.checkPassword.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()
    this.setState({status: ''})
    let {inv: invitation, email, pwd: password} = this.state
    let data = new FormData()
    data.append('invitation', invitation)
    data.append('email', email)
    data.append('password', password)
    fetch('/api/auth/register', {
      method: 'POST',
      body: data
    }).then(res => res.json())
    .then(json => {
      if (json.status === 'ok') history.push('/login')
        else this.setState({status: 'error'})
    })
  }

  submitEligible () {
    return (
      (this.state.inv) && (this.state.email) &&
      (this.state.pwd) &&
      (this.state.pwd === this.state.rpwd)
    )
  }

  checkPassword () {
    return (this.state.pwd === this.state.rpwd)
  }

  render () {
    return (
      <Form onSubmit={this.handleSubmit}>
        <StateAlert status={this.state.status} />
        <InputGroup className='mb-3'>
          <InputGroupAddon><IconSL i='user' /></InputGroupAddon>
          <Input type='text' placeholder='Invitation Code' onChange={e => this.setState({inv: e.target.value})} />
        </InputGroup>
        <InputGroup className='mb-3'>
          <InputGroupAddon>@</InputGroupAddon>
          <Input type='text' placeholder='Email' onChange={e => this.setState({email: e.target.value})} />
        </InputGroup>
        <InputGroup className={(this.state.pwd ? (this.checkPassword() ? 'has-success' : 'has-danger') : '') + ' mb-3'}>
          <InputGroupAddon><IconSL i='lock' /></InputGroupAddon>
          <Input type='password' placeholder='Password' onChange={e => this.setState({pwd: e.target.value})} state={this.checkPassword()} />
        </InputGroup>
        <InputGroup className={(this.state.pwd ? (this.checkPassword() ? 'has-success' : 'has-danger') : '') + ' mb-3'}>
          <InputGroupAddon><IconSL i='lock' /></InputGroupAddon>
          <Input type='password' placeholder='Repeat Password' onChange={e => this.setState({rpwd: e.target.value})} state={this.state.pwd ? (this.checkPassword() ? 'success' : 'danger') : ''} />
        </InputGroup>
        <Button type='submit' color='success' block disabled={!this.submitEligible()}>Create Account</Button>
      </Form>
    )
  }
}

export class Register extends Component {
  render () {
    return (
      <div className='app flex-row align-items-center'>
        <Container>
          <Row className='justify-content-center'>
            <div className='col-md-6'>
              <Card className='card mx-4'>
                <CardBlock className='card-block p-4'>
                  <h1>Register</h1>
                  <p className='text-muted'>Create your account</p>
                  <RegisterForm />
                </CardBlock>
              </Card>
            </div>
          </Row>
        </Container>
      </div>
    )
  }
}
