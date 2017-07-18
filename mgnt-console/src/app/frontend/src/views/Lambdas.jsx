import React, { Component } from 'react'
import { Card, CardHeader, CardBlock, Button, Table, Badge } from 'reactstrap'
import { IconSL, IconFA } from '../components/Icons'
import { Link } from 'react-router-dom'

const LambdaItem = (props) =>
  <tr key={props._id}>
    <td><Link to={'/lambdas/edit/' + props._id}>{props.name}</Link></td>
    <td>{props.language}</td>
    <td>{props.bindings.length} {props.bind_multithread ? <IconSL i='directions' /> : null}</td>
    <td>{props.workers}</td>
    <td>{props.active ? 'Active' : 'Inactive'} {props.remarks ? <Badge color='danger'>Attention</Badge> : null}</td>
  </tr>

export class Lambdas extends Component {
  constructor (props) {
    super(props)
    this.state = {
      status: 'loading',
      data: []
    }
    this.reload = this.reload.bind(this)
    this.addLambda = this.addLambda.bind(this)
  }

  componentWillMount (props) {
    this.reload()
  }

  addLambda () {
    setTimeout(() => {
      let newId = Math.random().toString(36).substring(7)
      this.props.history.push('/lambdas/edit/' + newId)
    }, 1000)
  }

  reload () {
    this.setState({status: 'loading'})
    setTimeout(() => {
      this.setState({data: [
        {
          _id: 'lambda1',
          name: 'Test Lambda 1',
          description: 'This is a description',
          bindings: ['esp-mesh.#.operation', 'test.*.message'],
          bind_multithread: true,
          language: 'python3',
          workers: 1,
          active: true
        },
        {
          _id: 'lambda2',
          name: 'Test Lambda 2',
          description: 'This is a description',
          bindings: ['esp-mesh.#.operation'],
          bind_multithread: false,
          language: 'python3',
          workers: 8,
          remarks: 'Exception while compiling the code',
          active: false
        },
        {
          _id: 'lambda3',
          name: 'Test Lambda 3',
          description: 'This is a description',
          bindings: ['esp-mesh.#.operation', 'test.*.message'],
          bind_multithread: true,
          language: 'python3',
          workers: 2,
          active: false
        }
      ]})
      this.setState({status: 'loaded'})
    }, 1500)
  }

  render () {
    return (
      <div className='animated fadeIn'>
        <Card className='card-accent-primary'>
          <CardHeader>
            <IconSL i='layers' /> My Lambdas
            <Button size='sm' color='primary' outline className='ml-4' onClick={this.addLambda}>
              <IconFA i='plus' /> Create Lambda
            </Button>
            <Button color='success' size='sm' outline disabled={this.state.status === 'loading'} onClick={this.reload} className='float-right'>
              <IconFA i='refresh' spin={this.state.status === 'loading'} /> Refresh
            </Button>
          </CardHeader>
          <CardBlock>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Language</th>
                  <th>Bindings</th>
                  <th>Workers</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.data.map(
                    i => <LambdaItem {...i} />
                  )
                }
              </tbody>
            </Table>
          </CardBlock>
        </Card>
      </div>
    )
  }
}
