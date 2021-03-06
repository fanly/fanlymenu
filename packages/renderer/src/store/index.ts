import type { InjectionKey } from 'vue';
import type { Store } from 'vuex';
import { createStore, useStore as baseUseStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import type { FLocation } from '../../types/custom';

export interface FNotion {
  api_key: string, // api key
  database_id: string,  // 数据库 id
}

export interface State {
  themeValue: string,
  showFestivals: boolean,
  showWeather: boolean,
  location: FLocation,
  notion: FNotion,
  focusTime: number, // 专注时间
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

const dataState = createPersistedState({
  storage: window.sessionStorage,
});

export const store = createStore<State>({
  state: {
    themeValue: 'lightTheme',
    showFestivals: false,
    showWeather: false,
    location: {
      longitude: 114.52,
      latitude: 38.02,
    } as FLocation,
    notion: {
      api_key: 'secret_OeWua2be357DrrN0y47obPNbzY4KWk6NEoGHoEDd8BA',
      database_id: '577b3228cd15411782430fefbb87d601',
    } as FNotion,
    focusTime: 40,
  },
  mutations: {
    changeThemeValue(state, themeValue) {
      state.themeValue = themeValue;
    },
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
      } as FLocation;
    },
    changeNotion(state, notion) {
      state.notion = {
        api_key: notion.api_key,
        database_id: notion.database_id,
      } as FNotion;
    },
    changeFocusTime(state, focusTime) {
      state.focusTime = focusTime;
    },
  },
  actions: {
    changeThemeValue({ commit }) {
      commit('changeThemeValue');
    },
    changeShowFestivals({ commit }) {
      commit('changeShowFestivals');
    },
    changeShowWeather({ commit }) {
      commit('changeShowWeather');
    },
    changeLocation({ commit }) {
      commit('changeLocation');
    },
    changeNotion({ commit }) {
      commit('changeNotion');
    },
  },
  plugins: [dataState],
});

export function useStore (): Store<State> {
  return baseUseStore(key);
}

export { };
