import React, { Component } from 'react'
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap'
import { IconFA } from './Icons'
import store from '../redux/store'

export class Header extends Component {
  constructor (props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.state = {
      dropdownOpen: false
    }
  }

  toggle () {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    })
  }

  sidebarToggle (e) {
    e.preventDefault()
    document.body.classList.toggle('sidebar-hidden')
  }

  sidebarMinimize (e) {
    e.preventDefault()
    document.body.classList.toggle('sidebar-minimized')
  }

  mobileSidebarToggle (e) {
    e.preventDefault()
    document.body.classList.toggle('sidebar-mobile-show')
  }

  asideToggle (e) {
    e.preventDefault()
    document.body.classList.toggle('aside-menu-hidden')
  }

  handleLogout (e) {
    e.preventDefault()
    store.dispatch({type: 'AUTH_LOGOUT'})
  }

  render () {
    return (
      <header className='app-header navbar'>
        <button className='navbar-toggler mobile-sidebar-toggler d-lg-none' onClick={this.mobileSidebarToggle} type='button'>&#9776;</button>
        <a className='navbar-brand' href='#' />
        <ul className='nav navbar-nav d-md-down-none mr-auto'>
          <li className='nav-item'>
            <button className='nav-link navbar-toggler sidebar-toggler' type='button' onClick={this.sidebarToggle}>&#9776</button>
          </li>
        </ul>
        <ul className='nav navbar-nav ml-auto'>
          <li className='nav-item'>
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <button onClick={this.toggle} className='nav-link dropdown-toggle' data-toggle='dropdown' type='button' aria-haspopup='true' aria-expanded={this.state.dropdownOpen}>
                <img src={'img/avatars/7.jpg'} className='img-avatar' alt='admin@bootstrapmaster.com' />
                <span className='d-md-down-none'>admin</span>
              </button>

              <DropdownMenu className='dropdown-menu-right'>
                <DropdownItem header className='text-center'><strong>Account</strong></DropdownItem>
                <DropdownItem><IconFA i='bell-o' /> Updates<span className='badge badge-info'>42</span></DropdownItem>

                <DropdownItem header className='text-center'><strong>Settings</strong></DropdownItem>
                <DropdownItem><IconFA i='user' /> Profile</DropdownItem>
                <DropdownItem onClick={this.handleLogout}><IconFA i='lock' /> Logout</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </li>
          <li className='nav-item d-md-down-none'>
            <button className='nav-link navbar-toggler aside-menu-toggler' type='button' onClick={this.asideToggle}>&#9776;</button>
          </li>
        </ul>
      </header>
    )
  }
}
