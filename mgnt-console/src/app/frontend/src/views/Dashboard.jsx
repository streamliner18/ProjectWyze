import React, { Component } from 'react'
import { Row, Col, Progress, Button } from 'reactstrap'
import { Alert, Card, CardBlock, CardFooter, CardHeader } from 'reactstrap'
import { IconSL } from '../components/Icons'
import { Line } from 'react-chartjs-2'
import update from 'immutability-helper'
import { fetchJSON } from '../utils/request'

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

class QuickStats extends Component {
  constructor (props) {
    super(props)
    this.state = {
      stats: {}
    }
  }

  componentWillMount () {
    fetch('/api/stats/overview').then(fetchJSON).then(res => {
      this.setState({
        stats: res.result
      })
    })
  }

  render () {
    return (
      <Row>
        <Col sm='6' md='2'>
          <Card inverse color='danger'>
            <CardBlock>
              <div className='h1 text-muted text-right mb-2'>
                <IconSL i='rocket' />
              </div>
              <div className='h4 mb-0'>{(this.state.stats.load && this.state.stats.load.total) || '-?-'}</div>
              <small className='text-muted text-uppercase font-weight-bold'>System Load / Sec</small>
              <Progress className='progress progress-white progress-xs mt-1' value={(this.state.stats.load && this.state.stats.load.active_ratio) || '-?-'} />
            </CardBlock>
          </Card>
        </Col>
        <Col sm='6' md='2'>
          <Card inverse color='success'>
            <CardBlock>
              <div className='h1 text-muted text-right mb-2'>
                <IconSL i='magic-wand' />
              </div>
              <div className='h4 mb-0'>-?-</div>
              <small className='text-muted text-uppercase font-weight-bold'>Total Executions</small>
              <Progress className='progress progress-white progress-xs mt-1' value='25' />
            </CardBlock>
          </Card>
        </Col>
        <Col sm='6' md='2'>
          <Card inverse color='warning'>
            <CardBlock>
              <div className='h1 text-muted text-right mb-2'>
                <IconSL i='pin' />
              </div>
              <div className='h4 mb-0'>{(this.state.stats.mqtt && this.state.stats.mqtt.inputs) || '-?-'}</div>
              <small className='text-muted text-uppercase font-weight-bold'>Active MQTT Channels</small>
              <Progress className='progress progress-white progress-xs mt-1' value={(this.state.stats.mqtt && this.state.stats.mqtt.output_ratio) || 0} />
            </CardBlock>
          </Card>
        </Col>
        <Col sm='6' md='2'>
          <Card inverse color='info'>
            <CardBlock>
              <div className='h1 text-muted text-right mb-2'>
                <IconSL i='layers' />
              </div>
              <div className='h4 mb-0'>{(this.state.stats.lambdas && this.state.stats.lambdas.total) || '-?-'}</div>
              <small className='text-muted text-uppercase font-weight-bold'>Lambdas</small>
              <Progress className='progress progress-white progress-xs mt-1' value={(this.state.stats.lambdas && this.state.stats.lambdas.active_ratio) || 0} />
            </CardBlock>
          </Card>
        </Col>
      </Row>
    )
  }
}

const mainChartOpts = {
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    xAxes: [{
      gridLines: {
        drawOnChartArea: false
      }
    }],
    yAxes: [{
      ticks: {
        beginAtZero: true,
        maxTicksLimit: 5,
        stepSize: Math.ceil(250 / 5),
        // max: 250
      }
    }]
  },
  elements: {
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
      hoverBorderWidth: 3
    }
  },
  animation: {
    duration: 0
  }
}

const ChartInfoCard = (props) =>
  <li className={props.hidden ? 'hidden-sm-down' : ''}>
    <div className='text-muted'>{props.title}</div>
    <strong>{props.progress ? `${props.value} ${props.unit} (${props.progress}%)` : `${props.value} ${props.unit}`}</strong>
    <Progress className='progress-xs mt-2' color={props.color ? props.color : 'success'} value={props.progress || 100} />
  </li>

class MainChart extends Component {
  constructor (props) {
    super(props)
    this.state = {
      labels: [],
      datasets: [
        {
          label: 'Published',
          backgroundColor: 'rgba(99,194,222,0.2)',
          borderColor: '#63c2de',
          pointHoverBackgroundColor: '#fff',
          borderWidth: 2,
          data: []
        },
        {
          label: 'Delivered',
          backgroundColor: 'transparent',
          borderColor: '#4dbd74',
          pointHoverBackgroundColor: '#fff',
          borderWidth: 2,
          data: []
        },
        {
          label: 'No-ack',
          backgroundColor: 'transparent',
          borderColor: 'ff2222',
          pointHoverBackgroundColor: '#fff',
          borderWidth: 2,
          data: []
        }
      ],
      raw_data: {}
    }
  }
  
  componentDidMount () {
    this.timer = setInterval(() => {
      let d = new Date()
      let datestr = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
      fetch('/api/stats/ticks').then(fetchJSON).then(res => {
        console.log(res)
        this.setState(update(this.state, {
          labels: {
            $push: [datestr]
          },
          datasets: {
            0: {
              data: {$push: [res.result.publish || 0]}
            },
            1: {
              data: {$push: [res.result.deliver || 0]}
            },
            2: {
              data: {$push: [res.result.deliver_noack || 0]}
            }
          },
          raw_data: {$set: res.result}
        }))
        if (this.state.labels.length > 20) this.setState(update(this.state, {
          labels: {$splice: [[0, 1]]},
          datasets: {
            0: {data: {$splice: [[0, 1]]}},
            1: {data: {$splice: [[0, 1]]}},
            2: {data: {$splice: [[0, 1]]}}
          }
        }))
      })
    }, 5000)
  }

  componentWillUnmount () {
    clearInterval(this.timer)
  }

  render () {
    return (
      <Card>
        <CardBlock>
          <Row>
            <Col sm='5'>
              <h4 className='card-title mb-0'>Traffic</h4>
              <div className='small text-muted'>Updates in Real Time</div>
            </Col>
            <Col sm='7' className='idden-sm-down'>
              <Button color='primary' className='float-right'><IconSL i='cloud-download' /></Button>
            </Col>
          </Row>
          <div className='chart-wrapper' style={{height: '300px', marginTop: '40px'}}>
            <Line data={this.state} options={mainChartOpts} height={300} />
          </div>
        </CardBlock>
        <CardFooter>
          <ul>
            <ChartInfoCard title='Publishes' value={this.state.raw_data.publish || '-?-'} unit='msg/s' color='primary' />
            <ChartInfoCard title='Deliveries' unit='msg/s' value={this.state.raw_data.deliver || '-?-'} />
            <ChartInfoCard title='Auto Ack' unit='msg/s' value={this.state.raw_data.deliver_no_ack || '-?-'} />
            <ChartInfoCard title='Redeliveries' value={this.state.raw_data.redeliver || '-?-'} unit='msg/s' color='info' />
            <ChartInfoCard title='Bounces' value={this.state.raw_data.return_unroutable || '-?-'} unit='msg/s' color='danger' />
          </ul>
        </CardFooter>
      </Card>
    )
  }
}

const StatListItem = (props) =>
  <li>
    <IconSL i={props.icon ? props.icon : 'layers'} />
    <span className='title'>{props.title}</span>
    <span className='value'>{props.value}</span>
    <div className='bars'>
      <Progress className='progress-xs' color={props.color ? props.color : 'primary'} value={props.progress} />
    </div>
  </li>

class DeviceStats extends Component {
  render () {
    return (
      <Col md='6'>
        <Card>
          <CardHeader>
            Device Report Rates
          </CardHeader>
          <CardBlock>
            <Row>
              <Col sm='6'>
                <div className='callout callout-warning'>
                  <small className='text-muted'>Total Since Start</small><br />
                  <strong className='h4'>78623</strong>
                </div>
              </Col>
              <Col sm='6'>
                <div className='callout callout-success'>
                  <small className='text-muted'>Total Last Hour</small><br />
                  <strong className='h4'>49123</strong>
                </div>
              </Col>
            </Row>
            <hr className='mt-0' />
            <ul className='horizontal-bars type-2'>
              <StatListItem title='kitchen.thermostat' value='459' progress='93' color='danger' icon='location-pin' />
              <StatListItem title='bedroom.light' value='295' progress='52' color='danger' icon='location-pin' />
              <StatListItem title='studio.lamp' value='169' progress='41' icon='location-pin' />
              <StatListItem title='mains.solar-panel' value='97' progress='33' icon='location-pin' />
              <StatListItem title='mains.hydro-pump' value='66' progress='17' icon='location-pin' />
            </ul>
          </CardBlock>
        </Card>
      </Col>
    )
  }
}

class LambdaStats extends Component {
  render () {
    return (
      <Col md='6'>
        <Card>
          <CardHeader>
            Lambda Execution Rates
          </CardHeader>
          <CardBlock>
            <Row>
              <Col sm='6'>
                <div className='callout callout-warning'>
                  <small className='text-muted'>Total Since Start</small><br />
                  <strong className='h4'>113468</strong>
                </div>
              </Col>
              <Col sm='6'>
                <div className='callout callout-success'>
                  <small className='text-muted'>Total Last Hour</small><br />
                  <strong className='h4'>29776</strong>
                </div>
              </Col>
            </Row>
            <hr className='mt-0' />
            <ul className='horizontal-bars type-2'>
              <StatListItem title='rolling_mean' value='1184' progress='98' color='danger' />
              <StatListItem title='estimate_danger' value='879' progress='77' color='danger' />
              <StatListItem title='double_integral' value='551' progress='74' />
              <StatListItem title='light_emit_action' value='452' progress='50' />
              <StatListItem title='pump_emit_action' value='179' progress='14' />
            </ul>
          </CardBlock>
        </Card>
      </Col>
    )
  }
}

export class Dashboard extends Component {
  render () {
    return (
      <div className='animated fadeIn'>
        <QuickStats />
        <MainChart />
        <Row>
          <Col><Alert color='warning'>Note: The following contents are imaginary and U/C.</Alert></Col>
        </Row>
        <Row>
          <DeviceStats />
          <LambdaStats />
        </Row>
      </div>
    )
  }
}
