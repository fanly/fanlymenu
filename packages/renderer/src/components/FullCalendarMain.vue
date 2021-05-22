<template>
  <div>
    <fullcalendar-sub
      v-model:changeShowFestivals="changeShowFestivals"
      v-model:changeShowWeather="changeShowWeather"
      v-model:weather="weather"
      @settingClick="visibleFullSetting = true"
    />
    <weather-sub
      v-if="changeShowWeather"
      v-model:changeShowWeather="changeShowWeather"
      v-model:weather="weather"
    />
    <setting-sub
      v-model:visibleFullSetting="visibleFullSetting"
      v-model:changeShowWeather="changeShowWeather"
      v-model:changeShowFestivals="changeShowFestivals"
    />
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue';
import { useStore } from '/@/store';
import 'primeicons/primeicons.css';
import FullcalendarSub from '/@/components/FullcalendarSub.vue';
import WeatherSub from '/@/components/WeatherSub.vue';
import SettingSub from '/@/components/SettingSub.vue';
import WeatherService from '../../../services/WeatherService';

export default defineComponent({
  name: 'FullCalendarMain',
  components: {
    FullcalendarSub,
    WeatherSub,
    SettingSub,
  },
  setup() {
    const visibleFullSetting = ref(false);
    const store = useStore();
    return {
      visibleFullSetting,
      store,
    };
  },
  data() {
    return {
      weather: {},
      location: {},
      changeShowFestivals: true,
      changeShowWeather: true,
    };
  },
  watch: {
    changeShowFestivals(newval) {
      this.store.commit('changeShowFestivals', newval);
    },
    changeShowWeather(newval) {
      this.store.commit('changeShowWeather', newval);
    },
  },
  mounted() {
    this.setShowData();
    this.getWeather();
  },
  methods: {
    setShowData() {
      this.changeShowFestivals = this.store.state.showFestivals;
      this.changeShowWeather = this.store.state.showWeather;
    },
    getWeather() {
      const weatherService = new WeatherService();
      weatherService.getWeathers().then((data) => (this.weather = data));
    },
  },
});
</script>

<style scoped lang="scss">
@import "~/styles/default.scss";
</style>
