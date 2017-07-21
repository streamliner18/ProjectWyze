import history from '../history'

export default (state = {}, action) => {
  switch (action.type) {
    case 'ROUTE_JUMP':
      console.log('[STORE] Redirect processed', action)
      history.push(action.to)
      return {}
    default:
      return {}
  }
}
