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
import { defineComponent, inject } from 'vue';
import { NBadge, NImage } from 'naive-ui';
import WeatherService from '../../../services/WeatherService';

export default defineComponent({
  name: 'WeatherSub',
  components: {
    NBadge,
    NImage,
  },
  setup() {
    const weather = inject('weather', {
      weatherNow: {
        icon: '100',
        temp: '30',
      },
    });
    return {
      weather,
    };
  },
  computed: {
    weatherIcon(): string {
      if (this.weather.weatherNow) {
        return WeatherService.getIcon(this.weather.weatherNow.icon);
      }

      return '';
    },
    temp(): string {
      if (this.weather.weatherNow) {
        return this.weather.weatherNow.temp + '°C';
      }
      return '';
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "~/styles/default.scss";

.weather {
  position: absolute;
  top: 10px;
  left: 550px;
  z-index: 1000;
}

.weatherTemp {
  font-size: 0.8rem;
  background-color:#ffffff;
  color: var(--primary-color)
}
</style>
