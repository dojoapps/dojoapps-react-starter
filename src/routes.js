import React from 'react'
import { Route, IndexRoute, IndexRedirect } from 'react-router'

/* pages */
import App from './pages/App'

export default (
  <Route path="/" component={App} onError={(error) => console.log(error)}>
    {/* AS ROTAS FICAM AQUI */}
  </Route>
)
