import { createStore, Commit, Store } from 'vuex'

interface State {
  user: any | null
  token: string
}

export default createStore<State>({
  state: {
    user: null,
    token: localStorage.getItem('token') || ''
  },
  mutations: {
    SET_TOKEN(state, token: string) {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_USER(state, user: any) {
      state.user = user
    },
    CLEAR_USER(state) {
      state.token = ''
      state.user = null
      localStorage.removeItem('token')
    }
  },
  actions: {
    login({ commit }: { commit: Commit }, userInfo: any) {
      // 实现登录逻辑
    },
    logout({ commit }: { commit: Commit }) {
      commit('CLEAR_USER')
    }
  }
}) 