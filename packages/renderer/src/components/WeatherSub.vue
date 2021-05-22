<template>
  <AvatarGroup class="weather">
    <Avatar
      :image="weatherIcon"
      size="large"
      shape="circle"
    />
    <Avatar
      :label="temp"
      shape="circle"
      class="weatherTemp"
    />
  </AvatarGroup>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import AvatarGroup from 'primevue/avatargroup';
import Avatar from 'primevue/avatar';
import weathericons from '~/images/weathericons/100.png';

export default defineComponent({
  name: 'WeatherSub',
  components: {
    AvatarGroup,
    Avatar,
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
  top: 5px;
  left: 150px;
  z-index: 1000;
}

.weatherTemp {
  font-size: 0.8rem;
  background-color:#ffffff;
  color: var(--primary-color)
}
@media screen and (max-width: $lg) {
  ::v-deep(.fc-header-toolbar) {
    display: flex;
    flex-wrap: wrap;
  }
}

</style>
