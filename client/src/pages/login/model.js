import { routerRedux } from 'dva/router'
import { login } from './service'

export default {
  namespace: 'login',

  state: {},

  effects: {
    * login ({ payload }, { put, call, select }) {
      const data = yield call(login, payload)
      const { locationQuery } = yield select(_ => _.app)
      if (data.success) {
        const { from } = locationQuery
        yield put({ type: 'app/query' })
        if (from && from !== '/login') {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/dashboard'))
        }
      } else {
        console.log("you are wrong!")
        throw data
      }
    },
    * login2 ({ payload }, { put }){
      yield put({ type: 'app/query2', payload:payload })
    },
  },
  

}
