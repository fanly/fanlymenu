import type { InjectionKey } from 'vue';
import type { Store } from 'vuex';
import { createStore, useStore as baseUseStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

export interface State {
  showFestivals: boolean,
  showWeather: boolean,
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

const dataState = createPersistedState({
  paths: ['data'],
});

export const store = createStore<State>({
  state: {
    showFestivals: true,
    showWeather: true,
  },
  mutations: {
    changeShowFestivals(state) {
      state.showFestivals = !state.showFestivals;
    },
    changeShowWeather(state) {
      state.showWeather = !state.showWeather;
    },
  },
  actions: {
    changeShowFestivals({ commit }) {
      commit('changeShowFestivals');
    },
    changeShowWeather({ commit }) {
      commit('changeShowWeather');
    },
  },
  plugins: [dataState],
});

export function useStore () {
  return baseUseStore(key);
}
