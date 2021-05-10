import { createStore } from 'vuex';

export type State = { showFestivals: boolean };

const state: State = { showFestivals: true };

export const store = createStore({
  state,
  mutations: {
    changeShowFestivals(state) {
      console.log(state.showFestivals);
      state.showFestivals = !state.showFestivals;
    },
  },
  actions: {
    changeShowFestivals({ commit }) {
      commit('changeShowFestivals');
    },
  },

  getters: {
    showFestivals(state) {
      return state.showFestivals;
    },
  },
});
