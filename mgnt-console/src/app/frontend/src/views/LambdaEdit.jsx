import React, { Component } from 'react'
import { IconSL, IconFA } from '../components/Icons'
import { Row, Col, Card, CardHeader, CardBlock, CardFooter, Progress, Button } from 'reactstrap'
import AceEditor from 'react-ace'
import 'brace/mode/python'
import 'brace/theme/github'
import 'brace/snippets/python'
import 'brace/ext/language_tools'
import 'brace/ext/statusbar'
import 'brace/ext/themelist'
import 'brace/ext/searchbox'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import { Form, FormGroup, Label, Input, InputGroup, InputGroupButton } from 'reactstrap'
import { ListGroup, ListGroupItem } from 'reactstrap'
import classnames from 'classnames'
import update from 'immutability-helper'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { signedHeader, fetchJSON } from '../utils/request'

const LambdaStatCard = props =>
  <Row>
    <Col xs='12'>
      <Card>
        <CardBlock className='p-0 clearfix'>
          <i className={`icon-${props.icon} bg-${props.color} p-4 font-2xl mr-3 float-left`}></i>
          <div className={`h5 text-${props.color} mb-0 pt-3`}>{props.value}</div>
          <div className='text-muted text-uppercase font-weight-bold font-xs'>{props.title}</div>
        </CardBlock>
        {props.future
          ? <CardFooter className='px-3 py-2'>
            <a className='font-weight-bold font-xs btn-block text-muted'>
              Coming Soon
            </a>
          </CardFooter>
          : null
        }
      </Card>
    </Col>
  </Row>

export class LambdaEdit extends Component {
  constructor (props) {
    super(props)
    this.state = {
      status: 'loading',
      data: {},
      activeTab: '1',
      modified: false,
      updating: false,
      aceConfig: {
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2
      },
      stats: {
        exec_count: 976,
        exec_latency: 825
      }
    }
    this.reload = this.reload.bind(this)
    this.toggle = this.toggle.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  toggle (tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
  }

  reload () {
    this.setState({status: 'loading'})
    fetch(`/api/lambdas/${this.props.match.params.id}`, {headers: signedHeader()})
      .then(fetchJSON)
      .then(json => {
        this.setState({data: json.result, status: 'loaded'})
      })
      .catch(console.log)
  }

  onChange (e) {
    const t = e.target
    const value = t.type === 'checkbox' ? t.checked : t.value
    const name = t.name
    this.setState({
      data: update(this.state.data, {[name]: {$set: value}}),
      modified: true
    })
  }

  onSubmit (e) {
    console.log('Submitting:', this.state.data)
    this.setState({updating: true})
    let headers = signedHeader()
    headers.append('Content-Type', 'application/json')
    fetch('/api/lambdas/update', {
      method: 'post',
      headers: headers,
      body: JSON.stringify(this.state.data)
    }).then(fetchJSON)
      .then(json => {
        if (json.status === 'ok') this.setState({
          modified: false,
          updating: false
        })
      })
  }

  componentWillMount () {
    this.reload(this.props.match.params.id)
  }

  render () {
    return (
      <div className='animated fadeIn'>
        <Row>
          <div className='col-9'>
            <Card>
              <CardBlock>
                <Form>
                  <Row>
                    <Col xs='8'>
                      <FormGroup>
                        <Label>Name</Label>
                        <InputGroup>
                          <Input type='text' value={this.state.data.name} onChange={this.onChange} name='name' />
                          <InputGroupButton>
                            <Button color={this.state.modified ? 'warning' : 'success'} outline={!this.state.modified} className='ml-3' size='sm' onClick={this.onSubmit}>
                              {this.state.updating ? <IconFA i='refresh' spin /> : <IconSL i='login' />} Save</Button>
                          </InputGroupButton>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup row>
                        <Label sm='2'> # workers</Label>
                        <Col sm='1'>
                          <Input type='number' name='workers' value={this.state.data.workers} onChange={this.onChange} />
                        </Col>
                        <Col sm='3'>
                          <Input type='select' name='language' value={this.state.data.language} onChange={this.onChange}>
                            <option value='python3'>Python 3</option>
                          </Input>
                        </Col>
                      </FormGroup>
                      <FormGroup row className='mb-0'>
                        <Col sm='2' className='pt-1'>
                          <Label>Active</Label>
                          <Label className='switch switch-default switch-primary ml-3'>
                            <input type='checkbox' name='active' className='switch-input' checked={this.state.data.active} onChange={this.onChange} />
                            <span className='switch-label' />
                            <span className='switch-handle' />
                          </Label>
                        </Col>
                        <Col sm='2' className='pt-1'>
                          <Label>Durable</Label>
                          <Label className='switch switch-default switch-warning ml-3'>
                            <input type='checkbox' name='durable' className='switch-input' checked={this.state.data.durable} onChange={this.onChange} />
                            <span className='switch-label' />
                            <span className='switch-handle' />
                          </Label>
                        </Col>
                        <Col sm='2' className='pt-1'>
                          <Label>Recursive</Label>
                          <Label className='switch switch-default switch-warning ml-3'>
                            <input type='checkbox' name='recursive' className='switch-input' checked={this.state.data.recursive} onChange={this.onChange} />
                            <span className='switch-label' />
                            <span className='switch-handle' />
                          </Label>
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col xs='4'>
                      <FormGroup className='mb-0'>
                        <Label>Description</Label>
                        <Input type='textarea' name='description' value={this.state.data.description} style={{height: 130}} onChange={this.onChange} />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBlock>
            </Card>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '1' })}
                  onClick={() => this.toggle('1')}
                >
                  <IconSL i='chemistry' /> Code
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '2' })}
                  onClick={() => this.toggle('2')}
                >
                  <IconSL i='book-open' /> Reference
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '3' })}
                  onClick={() => this.toggle('3')}
                >
                  <IconSL i='graph' /> Logs & Metrics
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId='1'>
                <AceEditor
                  mode='python'
                  theme='github'
                  onChange={code =>
                    this.setState({data: update(this.state.data, {code: {$set: code}}), modified: true})}
                  value={this.state.data.code}
                  name='UNIQUE_ID_OF_DIV'
                  width='100%'
                  height='600px'
                  editorProps={{$blockScrolling: true}}
                  setOptions={this.state.aceConfig}
                />
              </TabPane>
              <TabPane tabId='2'>
                Reference: Coming Soon
              </TabPane>
              <TabPane tabId='3'>
                Logs & Metrics: Coming Soon
              </TabPane>
            </TabContent>
          </div>
          <div className='col-3'>
            <ReactCSSTransitionGroup
              transitionName='collapse200'
              transitionEnterTimeout={300}
              transitionLeaveTimeout={300}
            >
              {this.state.data.remarks
                ? <LambdaStatCard title='Runtime Error: Check log' value='Compiler Warning' color='danger' icon='ban' /> : null
              }
              {this.state.data.bind_multithread
                ? <LambdaStatCard title='Bindings no longer combined' value='Handle duplicates' icon='organization' color='warning' /> : null
              }
              {this.state.data.durable
                ? <LambdaStatCard title='Keeps running after errors' icon='ghost' value='Runtime protection OFF' color='warning' /> : null
              }
              {this.state.data.recursive
                ? <LambdaStatCard title='No output to binded topics' icon='reload' value='May cause dead loop' color='warning' /> : null
              }
            </ReactCSSTransitionGroup>
            <Card>
              <CardHeader><IconSL i='directions' /> Bindings</CardHeader>
              <CardBlock>
                <Form onSubmit={e => {
                    e.preventDefault()
                    console.log(this.add_binding)
                    this.setState({
                      modified: true,
                      data: update(this.state.data, {bindings: {$push: [this.add_binding.value]}})
                    })
                  }}>
                  <FormGroup>
                    <Label>Multithreaded Bindings</Label>
                    <Label className='switch switch-default switch-primary ml-3'>
                      <input type='checkbox' name='bind_multithread' className='switch-input' checked={this.state.data.bind_multithread} onChange={this.onChange} />
                      <span className='switch-label' />
                      <span className='switch-handle' />
                    </Label>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup>
                      <input className='form-control' type='input' ref={i => { this.add_binding = i }} />
                      <InputGroupButton>
                        <Button type='submit'>Add</Button>
                      </InputGroupButton>
                    </InputGroup>
                  </FormGroup>
                </Form>
                  <ListGroup>
                    {
                      this.state.data.bindings ? this.state.data.bindings.map((i, idx) => (
                        <ListGroupItem key={idx}>
                          <IconSL i='pin' /> {i}
                          <Button color='link' className='float-right mr-2 py-0' size='sm' onClick={e => {
                              e.preventDefault()
                              this.setState({modified: true, data:
                                update(this.state.data, {bindings: {$splice: [[Number(idx), 1]]}})
                              })
                            }}><IconSL i='trash' /> Delete</Button>
                        </ListGroupItem>
                      ))
                      : null
                    }
                  </ListGroup>
              </CardBlock>
            </Card>
            <LambdaStatCard title='Cumulative Executions' value='145' color='success' icon='rocket' future />
            <LambdaStatCard title='Average Latency' value='672ms' color='info' icon='speedometer' future />
          </div>
        </Row>
      </div>
    )
  }
}
