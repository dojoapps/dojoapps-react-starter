import omit from 'lodash/omit'

import { browserHistory } from 'react-router'

const entitiesKey = {}

/* Este Middleware inclui token automaticamente em requests que possuem a propriedade secure */
const tokenMiddleware = (store) => (next) => (action) => {
  if (action.payload && action.payload.request && action.payload.request.secure) {
    const { auth: { token } } = store.getState()
    const secure = action.payload.request.secure

    if (!token && secure) {
      browserHistory.push({ pathname: '/login', query: { next: history.getCurrentLocation().pathname } })
      return Promise.reject(next({ type: 'LOGIN_ERROR', ...omit(action, 'payload') }))
    }

    const request = action.payload.request
    request.headers = request.headers || {}
    request.headers.Authorization = `Bearer ${token}`
  }

  return next(action)
}

/* Este middleware repassa a propriedade meta de uma previousAction utilizada pelo axios-middleware */
const metaMiddleware = () => (next) => (action) => {

  if (action.meta && action.meta.previousAction && action.meta.previousAction.meta) {
    return next({
      ...action,
      meta: {
        ...action.meta.previousAction.meta,
        ...action.meta,
      },
    })
  }
  return next(action)
}

/*
  Este middleware serve para desnormalizar entidades retornadas da API. Uma versão de
  pobre do normalizr
*/
const entitiesMiddleware = () => (next) => (action) => {
  if (!action.payload || action.type.indexOf('_SUCCESS') < 0) {
    return next(action)
  }

  const entities = action.meta.entities

  if (!entities) {
    return next(action)
  }

  const entityKey = entities.key || entitiesKey[entities.model] || 'id'
  switch (entities.type) {
    case 'list':
      entities.result = []
      entities.payload = {}
      action.payload.data.items.forEach((i) => {
        entities.payload[i[entityKey]] = i
        entities.result.push(i[entityKey])
      })
      break
    case 'single':
      entities.payload = { [action.payload.data[entityKey]]: action.payload.data }
      entities.result = action.payload.data[entityKey]
      break
    default:
      break
  }

  return next({ ...action, meta: { ...action.meta, entities } })
}

export { tokenMiddleware, entitiesMiddleware, metaMiddleware }
