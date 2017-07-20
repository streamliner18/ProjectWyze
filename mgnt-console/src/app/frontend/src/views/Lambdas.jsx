import React, { Component } from 'react'
import { Card, CardHeader, CardBlock, Button, Table, Badge } from 'reactstrap'
import { IconSL, IconFA } from '../components/Icons'
import { Link } from 'react-router-dom'
import { signedHeader, fetchJSON } from '../utils/request'

const LambdaItem = (props) =>
  <tr>
    <td><Link to={'/lambdas/edit/' + props._id}>{props.name}</Link></td>
    <td><Button className='py-0 text-danger' color='link' onClick={props.onDelete}>Delete</Button></td>
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
    fetch('/api/lambdas/add', {headers: signedHeader()})
      .then(fetchJSON)
      .then(json => this.props.history.push('/lambdas/edit/' + json.result))
      .catch(console.log)
  }

  onDelete (_id) {
    fetch(`/api/lambdas/${_id}/delete`, {headers: signedHeader()})
      .then(fetchJSON)
      .then(() => this.reload())
  }

  reload () {
    this.setState({status: 'loading'})
    fetch('/api/lambdas/list', {headers: signedHeader()})
      .then(fetchJSON)
      .then(json => this.setState({
        data: json.result,
        status: 'loaded'
      }))
      .catch(e => {
        this.setState({
          data: [],
          status: 'loaded'
        })
        console.log(e)
      })
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
                  <th />
                  <th>Language</th>
                  <th>Bindings</th>
                  <th>Workers</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.data.map(
                    i => <LambdaItem key={i._id} onDelete={this.onDelete.bind(this, i._id)} {...i} />
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
