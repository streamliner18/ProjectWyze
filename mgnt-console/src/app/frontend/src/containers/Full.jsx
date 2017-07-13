import React, { Component } from 'react'
import { Link, Switch, Route, Redirect } from 'react-router-dom'

import { Header, Sidebar, Breadcrumb, Aside, Footer } from '../components/_all'
import Dashboard from '../views/Dashboard'

export class Full extends Component {
  render () {
    return (
      <div className='app'>
        <Header />
        <div className='app-body'>
          <Sidebar {...this.props} />
          <main className='main'>
            <Breadcrumb />
            <div className='container-fluid'>
              <Switch>
                <Route path='/dashboard' name='Dashboard' component={Dashboard} />
                <Redirect from='/' to='/dashboard' />
              </Switch>
            </div>
          </main>
          <Aside />
        </div>
        <Footer />
      </div>
  )
  }
}
