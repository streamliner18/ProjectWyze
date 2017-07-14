import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

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

  render () {
    return (
      <div className='sidebar'>
        <nav className='sidebar-nav'>
          <ul className='nav'>
            <SideNavLink to='/dashboard' title='Dashboard' icon='speedometer' />
            <li className={this.activeRoute('/components')}>
              <a className='nav-link nav-dropdown-toggle' href='#' onClick={this.handleClick.bind(this)}><i className='icon-puzzle' /> Test Pages</a>
              <ul className='nav-dropdown-items'>
                <SideNavLink to='/login' title='Login Page' icon='puzzle' />
                <SideNavLink to='/register' title='Register Page' icon='puzzle' />
                <SideNavLink to='/404' title='404 Error' icon='puzzle' />
                <SideNavLink to='/500' title='500 Error' icon='puzzle' />
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    )
  }
}
