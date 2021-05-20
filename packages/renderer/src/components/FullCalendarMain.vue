<template>
  <div>
    <fullcalendar-sub
      v-model:changeShowFestivals="changeShowFestivals"
      v-model:weather="weather"
      @settingClick="visibleFullSetting = true"
    />
    <weather-sub
      v-model:weather="weather"
    />
    <setting-sub
      v-model:visibleFullSetting="visibleFullSetting"
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
      changeShowFestivals: true,
    };
  },
  watch: {
    changeShowFestivals(newval) {
      this.store.commit('changeShowFestivals', newval);
    },
  },
  mounted() {
    this.setShowFestivals();
    this.getWeather();
  },
  methods: {
    setShowFestivals() {
      this.changeShowFestivals = this.store.state.showFestivals;
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
