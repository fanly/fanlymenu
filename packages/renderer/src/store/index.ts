import type { InjectionKey } from 'vue';
import type { Store } from 'vuex';
import { createStore, useStore as baseUseStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

export interface State {
  showFestivals: boolean
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

const dataState = createPersistedState({
  paths: ['data'],
});

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
  plugins: [dataState],
});

export function useStore () {
  return baseUseStore(key);
}
