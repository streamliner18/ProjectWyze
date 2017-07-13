import history from '../history'

export default (state = {}, action) => {
  switch (action.type) {
    case 'ROUTE_JUMP':
      history.push(action.to)
      return {}
    default:
      return {}
  }
}
