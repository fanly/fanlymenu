<template>
  <div class="p-grid">
    <FullcalendarSub
      v-model:changeShowFestivals="changeShowFestivals"
      v-model:weather="weather"
      @settingClick="visibleFullSetting = true"
    />
    <Sidebar
      v-model:visible="visibleFullSetting"
      :base-z-index="1000"
      position="full"
    >
      <h3>Full Screen</h3>
      <h4>显示节假日</h4>
      <InputSwitch v-model="changeShowFestivals" />
    </Sidebar>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue';
import { useStore } from '/@/store';
import Sidebar from 'primevue/Sidebar';
import InputSwitch from 'primevue/inputswitch';
import 'primeicons/primeicons.css';
import FullcalendarSub from '/@/components/FullcalendarSub.vue';
import WeatherService from '../../../services/WeatherService';

export default defineComponent({
  name: 'FullCalendarMain',
  components: {
    FullcalendarSub,
    Sidebar,
    InputSwitch,
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
      weather: Object,
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
