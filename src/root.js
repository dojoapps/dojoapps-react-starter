import React from 'react'
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux'

import routes from './routes'
import store from './store'

export default () => (
  <Provider store={store}><Router history={browserHistory}>{routes}</Router></Provider>
)
