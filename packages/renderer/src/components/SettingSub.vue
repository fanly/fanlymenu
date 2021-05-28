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
    <div
      v-show="inputSwitchWeatherModel"
      class="p-field"
    >
      <label for="location">经纬度：</label>
      <InputMask
        v-model="locationStr"
        mask="999.99,99.99"
        @complete="changeLocalLocation"
      />
    </div>
    <div class="p-p-4">
      <Button
        type="button"
        label="退出应用"
        icon="pi pi-times"
        class="p-d-block p-mx-auto p-button-danger"
        @click="quit"
      />
    </div>
  </Sidebar>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import Sidebar from 'primevue/sidebar';
import InputSwitch from 'primevue/inputswitch';
import InputMask from 'primevue/inputMask';
import Button from 'primevue/button';

export default defineComponent({
  name: 'SettingSub',
  components: {
    Sidebar,
    InputSwitch,
    InputMask,
    Button,
  },
  props: {
    visibleFullSetting: Boolean,
    changeShowFestivals: Boolean,
    changeShowWeather: Boolean,
    location: Object,
  },
  emits: [
    'update:visibleFullSetting',
    'update:changeShowFestivals',
    'update:changeShowWeather',
    'update:location',
  ],
  data() {
    return {
      sidebarVisible: this.visibleFullSetting,
      inputSwitchFestivalsModel: this.changeShowFestivals,
      inputSwitchWeatherModel: this.changeShowWeather,
      locationStr: '',
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
    location(): void {
      this.locationStr = this.location?.longitude + ',' + this.location?.latitude;
    },
  },
  mounted() {

  },
  methods: {
    changeLocalLocation(): void {
      const loc = this.locationStr.split(',', 2);
      this.$emit('update:location', {
        'longitude': loc[0],
        'latitude': loc[1],
      });
    },
    quit(): void {
      window.electron.ipcRenderer.send('quit');
    },
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
