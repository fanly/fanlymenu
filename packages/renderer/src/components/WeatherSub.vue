<template>
  <n-badge
    :value="temp"
    class="weather"
  >
    <n-image
      width="40"
      :src="weatherIcon"
    />
  </n-badge>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import { NBadge, NImage } from 'naive-ui';
import weathericons from '~/images/weathericons/100.png';

export default defineComponent({
  name: 'WeatherSub',
  components: {
    NBadge,
    NImage,
  },
  props: {
    weather: Object,
  },
  data() {
    return {
      weatherIcon: '',
      temp: '',
    };
  },
  watch: {
    changeShowWeather(): void {
    },
    weather(): void {
      if (this.weather && this.weather.weatherNow) {
        this.weatherIcon = weathericons + '/../' + this.weather.weatherNow.icon +'.png';
        this.temp = this.weather.weatherNow.temp + '°C';
      }
    },
  },
  methods: {

  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "~/styles/default.scss";

.weather {
  position: absolute;
  top: 15px;
  left: 600px;
  z-index: 1000;
}

.weatherTemp {
  font-size: 0.8rem;
  background-color:#ffffff;
  color: var(--primary-color)
}
</style>
