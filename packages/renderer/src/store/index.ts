import type { InjectionKey } from 'vue';
import type { Store } from 'vuex';
import { createStore, useStore as baseUseStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

export interface State {
  showFestivals: boolean,
  showWeather: boolean,
  location: {
    longitude: number, // 经度
    latitude: number,  // 纬度
  },
  focusTime: number, // 专注时间
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

const dataState = createPersistedState({
  paths: ['data'],
});

export const store = createStore<State>({
  state: {
    showFestivals: false,
    showWeather: false,
    location: {
      longitude: 114.52,
      latitude: 38.02,
    },
    focusTime: 40,
  },
  mutations: {
    changeShowFestivals(state) {
      state.showFestivals = !state.showFestivals;
    },
    changeShowWeather(state) {
      state.showWeather = !state.showWeather;
    },
    changeLocation(state, location) {
      state.location = {
        longitude: location.longitude,
        latitude: location.latitude,
      };
    },
    changeFocusTime(state, focusTime) {
      state.focusTime = focusTime;
    },
  },
  actions: {
    changeShowFestivals({ commit }) {
      commit('changeShowFestivals');
    },
    changeShowWeather({ commit }) {
      commit('changeShowWeather');
    },
    changeLocation({ commit }) {
      commit('changeLocation');
    },
  },
  plugins: [dataState],
});

export function useStore () {
  return baseUseStore(key);
}
