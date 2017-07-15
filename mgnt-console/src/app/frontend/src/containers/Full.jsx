import React, { Component } from 'react'
import { Link, Switch, Route, Redirect } from 'react-router-dom'

import { Header, Sidebar, Breadcrumb, Aside, Footer } from '../components/'
import { Dashboard, Preprocessor, MQTemplates, MQDevices, Lambdas, Team, Profile } from '../views/'

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
                <Route path='/prepros' name='Preprocessor' component={Preprocessor} />
                <Route path='/mqtt-templates' name='MQTT Templates' component={MQTemplates} />
                <Route path='/mqtt-devices' name='MQTT Devices' component={MQDevices} />
                <Route path='/lambdas' name='Lambdas' component={Lambdas} />
                <Route path='/team' name='Team' component={Team} />
                <Route path='/profile' name='My Account' component={Profile} />
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
