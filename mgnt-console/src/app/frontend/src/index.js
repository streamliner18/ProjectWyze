import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Switch, Redirect } from 'react-router-dom'
import history from './history'
import store from './redux/store'
import { Provider, connect } from 'react-redux'
import { Full } from './containers/'
import { Login, Register, Page404, Page500 } from './views/pages/'

const loggedIn = () => store.getState().auth.token

const renderMain = (props) =>
  loggedIn() ? <Full {...props} /> : <Redirect to='/login' />

window.store = store

class Application extends Component {
  render () {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path='/login' name='Login Page' component={Login} />
          <Route exact path='/register' name='Register Page' component={Register} />
          <Route exact path='/404' name='Page 404' component={Page404} />
          <Route exact path='/500' name='Page 500' component={Page500} />
          <Route path='/' name='Home' render={renderMain} />
        </Switch>
      </Router>
    )
  }
}
const App = connect(state => state.auth)(Application, store)

ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('root'))
