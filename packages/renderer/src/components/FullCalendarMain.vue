<template>
  <div>
    <Toast />
    <fullcalendar-sub
      v-model:changeShowFestivals="changeShowFestivals"
      v-model:changeShowWeather="changeShowWeather"
      v-model:events="events"
      v-model:weather="weather"
      v-model:location="location"
      @menuClick="menuClick"
      @dateClick="dateClick"
      @eventClick="eventClick"
    />
    <weather-sub
      v-if="changeShowWeather"
      v-model:changeShowWeather="changeShowWeather"
      v-model:weather="weather"
      v-model:location="location"
    />
    <n-drawer
      v-model:show="visibleFullSetting"
      :width="drawerWidth"
      placement="left"
    >
      <n-drawer-content title="设置">
        <setting-sub
          v-model:changeShowWeather="changeShowWeather"
          v-model:changeShowFestivals="changeShowFestivals"
          v-model:location="location"
          @focusClick="focusClick"
        />
      </n-drawer-content>
    </n-drawer>
    <date-view-sub
      v-model:visibleFullDateView="visibleFullDateView"
      v-model:date="date"
    />
    <focus-view-sub
      v-model:visibleFocusView="visibleFocusView"
    />
    <event-create-dialog
      v-model:visibleFullDialog="visibleFullDialog"
      v-model:event="event"
      @addEventClick="addEventClick"
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
import type { FLocation } from '/@/store';
import { useStore } from '/@/store';
import 'primeicons/primeicons.css';
import Toast from 'primevue/toast';
import Menu from 'primevue/menu';
import FullcalendarSub from '/@/components/FullcalendarSub.vue';
import WeatherSub from '/@/components/WeatherSub.vue';
import { NDrawer, NDrawerContent } from 'naive-ui';
import SettingSub from '/@/components/SettingSub.vue';
import DateViewSub from '/@/components/DateViewSub.vue';
import FocusViewSub from '/@/components/FocusViewSub.vue';
import WeatherService from '../../../services/WeatherService';
import EventCreateDialog from '/@/components/EventCreateDialog.vue';
import EventService from '../../../services/EventService';

export default defineComponent({
  name: 'FullCalendarMain',
  components: {
    Toast,
    FullcalendarSub,
    WeatherSub,
    NDrawer,
    NDrawerContent,
    SettingSub,
    DateViewSub,
    FocusViewSub,
    Menu,
    EventCreateDialog,
  },
  setup() {
    const eventService = ref(new EventService());
    const events:any = ref([]);
    const visibleFullSetting = ref(false);
    const store = useStore();

    return {
      eventService,
      events,
      visibleFullSetting,
      store,
    };
  },
  data() {
    return {
      weather: {},
      location: {} as FLocation,
      changeShowFestivals: false,
      changeShowWeather: false,
      visibleFullDateView: false,
      visibleFocusView: false,
      date: new Date(),
      visibleFullDialog: false,
      event: undefined,
      drawerWidth: Number(import.meta.env.VITE_APP_WIDTH) / 2.0,
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
    this.updateEvents();
    this.setShowData();
  },
  methods: {
    updateEvents(): any {
      this.eventService.getEvents().then((data) => {
        this.events = data;
      });
    },
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
    eventClick(event: any): void {
      this.event = event;
      this.visibleFullDialog = true;
    },
    menuClick(event: any): void {
      const menu = this.$refs['menu'] as any;
      menu.toggle(event);
    },
    quit(): void {
      window.electron.ipcRenderer.send('quit');
    },
    goCreateEventView(): void {
      this.event = undefined;
      this.visibleFullDialog = true;
    },
    goSettingView(): void {
      this.visibleFullSetting = true;
    },
    focusClick() {
      this.visibleFullSetting = false;
      this.visibleFocusView = true;
    },
    addEventClick(data: any) {
      if (data.id) {
        this.eventService.patchEvent(data.id, data.title, data.start, data.end)
        .then(() => {
          this.$toast.add({severity:'success', summary: 'Success Message', detail:'event submitted', life: 3000});
          this.updateEvents();
        });
      } else {
        this.eventService.postEvent(data.title, data.start, data.end)
        .then(() => {
          this.$toast.add({severity:'success', summary: 'Success Message', detail:'event submitted', life: 3000});
          this.updateEvents();
        });
      }
    },
  },
});
</script>

<style scoped lang="scss">
@import "~/styles/default.scss";
</style>
