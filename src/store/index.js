/* eslint-disable global-require */
import { createStore, applyMiddleware, compose } from 'redux'
import axiosMiddleware from 'redux-axios-middleware'
import axios from 'axios'
import thunkMiddleware from 'redux-thunk'

import rootReducer from '../reducers'
import { tokenMiddleware, entitiesMiddleware, metaMiddleware } from './middleware'

const client = axios.create({ // all axios can be used, shown in axios documentation
  // baseURL: BASE_API_URL, URL BASE DA API
  responseType: 'json',
})

/* CONFIGURAÇÕES GERAIS DO AXIOS FICAM AQUI
  ex: client.defaults.headers.common.Accept = 'application/vnd.eventfly.v3+json'
*/

const middlewares = [thunkMiddleware, tokenMiddleware, axiosMiddleware(client), metaMiddleware, entitiesMiddleware]

if (process.env.NODE_ENV === 'development') {
  const createLogger = require('redux-logger')

  const logger = createLogger({ collapsed: true })
  middlewares.push(logger)
}

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middlewares)))

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('../reducers', () => {
    const nextRootReducer = require('../reducers/index').default
    store.replaceReducer(nextRootReducer)
  })
}

export { client }

export default store
