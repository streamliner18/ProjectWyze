import React, { Component } from 'react'
import { Row, Col, Progress, Button } from 'reactstrap'
import { Card, CardBlock, CardFooter, CardHeader } from 'reactstrap'
import { IconSL } from '../components/Icons'
import { Line } from 'react-chartjs-2'

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
var data1 = []
var data2 = []

for (var i = 0; i <= 27; i++) {
  data1.push(random(50, 200))
  data2.push(random(80, 100))
}

class QuickStats extends Component {
  render () {
    return (
      <Row>
        <Col sm='6' md='2'>
          <Card inverse color='danger'>
            <CardBlock>
              <div className='h1 text-muted text-right mb-2'>
                <IconSL i='rocket' />
              </div>
              <div className='h4 mb-0'>173</div>
              <small className='text-muted text-uppercase font-weight-bold'>System Load / Sec</small>
              <Progress className='progress progress-white progress-xs mt-1' value='36' />
            </CardBlock>
          </Card>
        </Col>
        <Col sm='6' md='2'>
          <Card inverse color='success'>
            <CardBlock>
              <div className='h1 text-muted text-right mb-2'>
                <IconSL i='magic-wand' />
              </div>
              <div className='h4 mb-0'>2749</div>
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
              <div className='h4 mb-0'>59</div>
              <small className='text-muted text-uppercase font-weight-bold'>Active MQTT Devices</small>
              <Progress className='progress progress-white progress-xs mt-1' value='25' />
            </CardBlock>
          </Card>
        </Col>
        <Col sm='6' md='2'>
          <Card inverse color='info'>
            <CardBlock>
              <div className='h1 text-muted text-right mb-2'>
                <IconSL i='layers' />
              </div>
              <div className='h4 mb-0'>17</div>
              <small className='text-muted text-uppercase font-weight-bold'>Lambdas</small>
              <Progress className='progress progress-white progress-xs mt-1' value='25' />
            </CardBlock>
          </Card>
        </Col>
      </Row>
    )
  }
}

const mainChart = {
  labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(99,194,222,0.2)',
      borderColor: '#63c2de',
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: data1
    },
    {
      label: 'My Second dataset',
      backgroundColor: 'transparent',
      borderColor: '#4dbd74',
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: data2
    }
  ]
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
        max: 250
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
  }
}

const ChartInfoCard = (props) =>
  <li className={props.hidden ? 'hidden-sm-down' : ''}>
    <div className='text-muted'>{props.title}</div>
    <strong>{props.value ? `${props.value} ${props.unit} (${props.progress}%)` : `${props.progress}%`}</strong>
    <Progress className='progress-xs mt-2' color={props.color ? props.color : 'success'} value={props.progress} />
  </li>

class MainChart extends Component {
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
            <Line data={mainChart} options={mainChartOpts} height={300} />
          </div>
        </CardBlock>
        <CardFooter>
          <ul>
            <ChartInfoCard title='Visits' value='11700' unit='Users' progress='67' color='primary' />
            <ChartInfoCard title='Acknowledgments' progress='100' color='success' value='156' unit='ack/s' />
            <ChartInfoCard title='Delivery Rate' progress='73.16' color='warning' hidden />
            <ChartInfoCard title='Publish' value='186.5' unit='msg/s' progress='59' color='info' hidden />
            <ChartInfoCard title='Bounce Rate' value='0.89' unit='msg/s' progress='15' color='danger' />
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
            Device Report Rates
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
            <DeviceStats />
            <LambdaStats />
          </Row>
      </div>
    )
  }
}
