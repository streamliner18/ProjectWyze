import React from 'react'

export const IconSL = (props) => <i className={'icon-' + props.i + ' ' + String(props.className)} />

export const IconFA = (props) => <i className={'fa fa-' + props.i + (props.spin ? ' fa-spin' : '') + ' ' + String(props.className)} />
