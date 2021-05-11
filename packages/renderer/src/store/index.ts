import type { InjectionKey } from 'vue';
import type { Store } from 'vuex';
import { createStore } from 'vuex';

export interface State {
  showFestivals: boolean
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

// const state: State = { showFestivals: true };

export const store = createStore<State>({
  state: {
    showFestivals: true,
  },
  mutations: {
    changeShowFestivals(state) {
      state.showFestivals = !state.showFestivals;
    },
  },
  actions: {
    changeShowFestivals({ commit }) {
      commit('changeShowFestivals');
    },
  },
});
