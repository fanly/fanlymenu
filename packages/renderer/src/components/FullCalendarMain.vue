<template>
  <div>
    <fullcalendar-sub
      v-model:changeShowFestivals="changeShowFestivals"
      v-model:changeShowWeather="changeShowWeather"
      v-model:weather="weather"
      v-model:location="location"
      @settingClick="visibleFullSetting = true"
      @dateClick="dateClick"
    />
    <weather-sub
      v-if="changeShowWeather"
      v-model:changeShowWeather="changeShowWeather"
      v-model:weather="weather"
      v-model:location="location"
    />
    <setting-sub
      v-model:visibleFullSetting="visibleFullSetting"
      v-model:changeShowWeather="changeShowWeather"
      v-model:changeShowFestivals="changeShowFestivals"
      v-model:location="location"
      @focusClick="focusClick"
    />
    <date-view-sub
      v-model:visibleFullDateView="visibleFullDateView"
      v-model:date="date"
    />
    <focus-view-sub
      v-model:visibleFocusView="visibleFocusView"
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
import DateViewSub from '/@/components/DateViewSub.vue';
import FocusViewSub from '/@/components/FocusViewSub.vue';
import WeatherService from '../../../services/WeatherService';

export default defineComponent({
  name: 'FullCalendarMain',
  components: {
    FullcalendarSub,
    WeatherSub,
    SettingSub,
    DateViewSub,
    FocusViewSub,
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
      changeShowFestivals: false,
      changeShowWeather: false,
      visibleFullDateView: false,
      visibleFocusView: false,
      date: new Date(),
    };
  },
  watch: {
    changeShowFestivals(newval) {
      this.store.commit('changeShowFestivals', newval);
    },
    changeShowWeather(newval) {
      this.store.commit('changeShowWeather', newval);
      if (this.changeShowWeather) {
        this.getWeather();
      }
    },
    location(newval) {
      this.store.commit('changeLocation', newval);
      if (this.changeShowWeather) {
        this.getWeather();
      }
    },
  },
  mounted() {
    this.setShowData();
  },
  methods: {
    setShowData() {
      this.changeShowFestivals = this.store.state.showFestivals;
      this.changeShowWeather = this.store.state.showWeather;
      this.location = this.store.state.location;
    },
    getWeather() {
      const weatherService = new WeatherService();
      weatherService.getWeathers(this.location).then((data) => (this.weather = data));
    },
    dateClick(date: string) {
      this.date = new Date(date);
      this.visibleFullDateView = true;
    },
    focusClick() {
      this.visibleFocusView = true;
    },
  },
});
</script>

<style scoped lang="scss">
@import "~/styles/default.scss";
</style>
