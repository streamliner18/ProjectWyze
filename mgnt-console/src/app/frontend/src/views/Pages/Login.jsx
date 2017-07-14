import React, { Component } from 'react'
import { Container, Row, Col, InputGroup, InputGroupAddon, Button, Input, CardGroup, Card, CardBlock } from 'reactstrap'
import { IconSL } from '../../components/'
import store from '../../redux/store'

class LoginForm extends Component {
  constructor (props) {
    super(props)
    this.state = {username: '', password: ''}
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()
    console.log('Logging in')
    let unsubscribe = store.subscribe(
      () => console.log(store.getState())
    )
    store.dispatch({
      type: 'AUTH_LOGIN',
      username: this.state.username,
      password: this.state.password
    })
    unsubscribe()
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <h1>What's up</h1>
        <p className='text-muted'>Welcome to Project Wyze</p>
        <InputGroup className='mb-3'>
          <InputGroupAddon>@</InputGroupAddon>
          <input type='text' className='form-control' placeholder='Email' value={this.state.username} onChange={e => this.setState({username: e.target.value})} />
        </InputGroup>
        <InputGroup className='mb-4'>
          <InputGroupAddon><IconSL i='lock' /></InputGroupAddon>
          <Input type='password' placeholder='Password' value={this.state.password} onChange={e => this.setState({password: e.target.value})} />
        </InputGroup>
        <Row>
          <Col xs='6'>
            <Button type='submit' color='primary' className='px-4'>Let's Go</Button>
          </Col>
          <Col xs='6' className='text-right'>
            <Button color='link' className='px-0'>Forgot password?</Button>
          </Col>
        </Row>
      </form>
    )
  }
}

export class Login extends Component {
  render () {
    return (
      <div className='app flex-row align-items-center'>
        <Container>
          <Row className='justify-content-center'>
            <div className='col-md-8'>
              <CardGroup className='mb-0'>
                <Card className='p-4'>
                  <CardBlock className='card-block'>
                    <LoginForm />
                  </CardBlock>
                </Card>
                <Card inverse color='primary' className='py-5 d-md-down-none' style={{ width: 44 + '%' }}>
                  <CardBlock className='card-block text-center'>
                    <div>
                      <h2>Not a user?</h2>
                      <p>Try out the simplest way to build your next IoT home, rocket control center or hedge fund without worrying about big data infrastructure. Everything is free of charge.</p>
                      <Button color='primary' active className='mt-3'>Register Now!</Button>
                    </div>
                  </CardBlock>
                </Card>
              </CardGroup>
            </div>
          </Row>
        </Container>
      </div>
    )
  }
}