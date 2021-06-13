<template>
  <div>
    <fullcalendar-sub
      v-model:changeShowFestivals="changeShowFestivals"
      v-model:changeShowWeather="changeShowWeather"
      v-model:weather="weather"
      v-model:location="location"
      @menuClick="menuClick"
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
    <event-create-dialog
      v-model:visibleFullDialog="visibleFullDialog"
    />
    <Menu
      id="overlay_tmenu"
      ref="menu"
      :model="items"
      :popup="true"
    />
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue';
import { useStore } from '/@/store';
import 'primeicons/primeicons.css';
import Menu from 'primevue/menu';
import FullcalendarSub from '/@/components/FullcalendarSub.vue';
import WeatherSub from '/@/components/WeatherSub.vue';
import SettingSub from '/@/components/SettingSub.vue';
import DateViewSub from '/@/components/DateViewSub.vue';
import FocusViewSub from '/@/components/FocusViewSub.vue';
import WeatherService from '../../../services/WeatherService';
import EventCreateDialog from '/@/components/EventCreateDialog.vue';

export default defineComponent({
  name: 'FullCalendarMain',
  components: {
    FullcalendarSub,
    WeatherSub,
    SettingSub,
    DateViewSub,
    FocusViewSub,
    Menu,
    EventCreateDialog,
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
      visibleFullDialog: false,
      menu_width: Number(import.meta.env.VITE_APP_WIDTH) / 2,
      items: [
        {
          label:'操作',
          icon:'pi pi-fw pi-pencil',
          items:[
            {
              label:'创建事件',
              icon:'pi pi-fw pi-plus',
              command: this.goCreateEventView,
            },
            {
              label:'设置',
              icon:'pi pi-fw pi-cog',
              command: this.goSettingView,
            },
            {
              separator:true,
            },
            {
              label:'退出应用',
              icon:'pi pi-fw pi-power-off',
              command: this.quit,
            },
          ],
        },
      ],
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
    setShowData(): void {
      this.changeShowFestivals = this.store.state.showFestivals;
      this.changeShowWeather = this.store.state.showWeather;
      this.location = this.store.state.location;
    },
    getWeather(): void {
      const weatherService = new WeatherService();
      weatherService.getWeathers(this.location).then((data) => (this.weather = data));
    },
    dateClick(date: string): void {
      this.date = new Date(date);
      this.visibleFullDateView = true;
    },
    menuClick(event: any): void {
      const menu = this.$refs['menu'] as any;
      menu.toggle(event);
    },
    quit(): void {
      window.electron.ipcRenderer.send('quit');
    },
    goCreateEventView(): void {
      this.visibleFullDialog = true;
    },
    goSettingView(): void {
      this.visibleFullSetting = true;
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
