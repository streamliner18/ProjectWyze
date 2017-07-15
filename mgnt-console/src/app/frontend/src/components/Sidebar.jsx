import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import store from '../redux/store'

const SideNavLink = (props) => (
  <li className='nav-item'>
    <NavLink to={props.to} className='nav-link' activeClassName='active'>
      <i className={'icon-' + props.icon} /> {props.title}
    </NavLink>
  </li>
)

export class Sidebar extends Component {
  handleClick (e) {
    e.preventDefault()
    e.target.parentElement.classList.toggle('open')
  }

  activeRoute (routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown'
  }

  // secondLevelActive(routeName) {
  //   return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav nav-second-level collapse in' : 'nav nav-second-level collapse'
  // }

  handleLogout (e) {
    e.preventDefault()
    store.dispatch({type: 'AUTH_LOGOUT'})
    store.dispatch({type: 'ROUTE_JUMP', to: '/login'})
  }

  render () {
    return (
      <div className='sidebar'>
        <nav className='sidebar-nav'>
          <ul className='nav'>
            <SideNavLink to='/dashboard' title='Dashboard' icon='speedometer' />
            <li className='nav-title'>Processing</li>
            <SideNavLink to='/prepros' title='Preprocessor' icon='directions' />
            <SideNavLink to='/mqtt-templates' title='MQTT Templates' icon='grid' />
            <SideNavLink to='/mqtt-devices' title='MQTT Devices' icon='location-pin' />
            <SideNavLink to='/lambdas' title='Lambdas' icon='layers' />
            <li className='nav-title'>Management</li>
            <SideNavLink to='/team' title='Team' icon='people' />
            <SideNavLink to='/profile' title='My Account' icon='user' />
            <li className='nav-title'>Debug</li>
            <li className={this.activeRoute('/components')}>
              <a className='nav-link nav-dropdown-toggle' href='#' onClick={this.handleClick.bind(this)}><i className='icon-puzzle' /> Test Pages</a>
              <ul className='nav-dropdown-items'>
                <SideNavLink to='/login' title='Login Page' icon='puzzle' />
                <SideNavLink to='/register' title='Register Page' icon='puzzle' />
                <SideNavLink to='/404' title='404 Error' icon='puzzle' />
                <SideNavLink to='/500' title='500 Error' icon='puzzle' />
              </ul>
            </li>
            <li className='nav-title'>Logout</li>
            <li className='nav-item'>
              <a className='nav-link' onClick={this.handleLogout}>
                <i className='icon-lock' /> Logout
              </a>
            </li>
          </ul>
        </nav>
      </div>
    )
  }
}
