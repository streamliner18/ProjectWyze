import auth from './auth'
import routes from './routes'
import { combineReducers } from 'redux'

const ConsoleApp = combineReducers({ auth, routes })

export default ConsoleApp
