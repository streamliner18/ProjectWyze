import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import store from '../../../redux/store'

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
        <div className='input-group mb-3'>
          <span className='input-group-addon'><i className='icon-user' /></span>
          <input type='text' className='form-control' placeholder='Username' value={this.state.username} onChange={e => this.setState({username: e.target.value})} />
        </div>
        <div className='input-group mb-4'>
          <span className='input-group-addon'><i className='icon-lock' /></span>
          <input type='password' className='form-control' placeholder='Password' value={this.state.password} onChange={e => this.setState({password: e.target.value})} />
        </div>
        <div className='row'>
          <div className='col-6'>
            <button type='submit' className='btn btn-primary px-4'>Let's Go</button>
          </div>
          <div className='col-6 text-right'>
            <button type='button' className='btn btn-link px-0'>Forgot password?</button>
          </div>
        </div>
      </form>
    )
  }
}

class Login extends Component {
  render () {
    return (
      <div className='app flex-row align-items-center'>
        <Container>
          <div className='row justify-content-center'>
            <div className='col-md-8'>
              <div className='card-group mb-0'>
                <div className='card p-4'>
                  <div className='card-block'>
                    <LoginForm />
                  </div>
                </div>
                <div className='card card-inverse card-primary py-5 d-md-down-none' style={{ width: 44 + '%' }}>
                  <div className='card-block text-center'>
                    <div>
                      <h2>Not a user?</h2>
                      <p>Try out the simplest way to build your next IoT home, rocket control center or hedge fund without worrying about big data infrastructure. Everything is free of charge.</p>
                      <button type='button' className='btn btn-primary active mt-3'>Register Now!</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    )
  }
}

export default Login
