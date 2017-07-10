import history from '../history'

function routes (state = {}, action) {
  switch (action.type) {
    case 'ROUTE_JUMP':
      history.push(action.to)
      return {}
    default:
      return {}
  }
}

export default routes
