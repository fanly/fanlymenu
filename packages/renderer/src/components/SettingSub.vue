<template>
  <Sidebar
    v-model:visible="sidebarVisible"
    :base-z-index="1000"
    position="full"
    @click="$emit('update:visibleFullSetting', sidebarVisible)"
  >
    <h1>设置</h1>
    <h2>显示节假日</h2>
    <InputSwitch
      v-model="inputSwitchFestivalsModel"
      @change="$emit('update:changeShowFestivals', inputSwitchFestivalsModel)"
    />
    <h2>显示天气预报</h2>
    <InputSwitch
      v-model="inputSwitchWeatherModel"
      @change="$emit('update:changeShowWeather', inputSwitchWeatherModel)"
    />
  </Sidebar>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import Sidebar from 'primevue/Sidebar';
import InputSwitch from 'primevue/inputswitch';

export default defineComponent({
  name: 'SettingSub',
  components: {
    Sidebar,
    InputSwitch,
  },
  props: {
    visibleFullSetting: Boolean,
    changeShowFestivals: Boolean,
    changeShowWeather: Boolean,
  },
  emits: ['update:visibleFullSetting', 'update:changeShowFestivals', 'update:changeShowWeather'],
  data() {
    return {
      sidebarVisible: this.visibleFullSetting,
      inputSwitchFestivalsModel: this.changeShowFestivals,
      inputSwitchWeatherModel: this.changeShowWeather,
      location:'',
    };
  },
  watch: {
    visibleFullSetting(): void {
      this.sidebarVisible = this.visibleFullSetting;
    },
    changeShowFestivals(): void {
      this.inputSwitchFestivalsModel = this.changeShowFestivals;
    },
    changeShowWeather(): void {
      this.inputSwitchWeatherModel = this.changeShowWeather;
    },
  },
  mounted() {

  },
  methods: {
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "~/styles/default.scss";

h1 {
  text-align: center;
  color: var(--primary-color);
}

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
