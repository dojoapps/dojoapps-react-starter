/* eslint-disable import/no-unresolved,import/no-extraneous-dependencies,global-require */
import React from 'react'
import { render } from 'react-dom'
import store from './store'

/* import styles */
import './styles/main.scss'

const rootNode = document.getElementById('root')

const renderApp = () => {
  const Root = require('./root').default

  render(<Root />, rootNode)
}

renderApp()

if (module.hot) {
  module.hot.accept('./root', () => {
    renderApp()
  })
}
