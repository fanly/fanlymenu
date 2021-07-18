<template>
  <fullcalendar-sub
    v-model:changeShowFestivals="changeShowFestivals"
    v-model:changeShowWeather="changeShowWeather"
    v-model:events="events"
    v-model:location="location"
    @date-click="dateClick"
    @eventClick="eventClick"
    @settingClick="goSettingView"
  />
  <weather-sub
    v-if="changeShowWeather"
    v-model:changeShowWeather="changeShowWeather"
    v-model:location="location"
  />
  <n-drawer
    v-model:show="showDrawer"
    :width="settingDrawerWidth"
    placement="left"
  >
    <setting-sub
      v-if="visibleFullSetting"
      v-model:changeShowWeather="changeShowWeather"
      v-model:changeShowFestivals="changeShowFestivals"
      @update-location="updateLocation"
      @focusClick="focusClick"
      @updateNotionClick="updateEvents"
      @goCreateEventView="goCreateEventView"
    />
    <date-view-sub
      v-if="visibleFullDateView"
      v-model:date="date"
    />
    <event-create-sub
      v-if="visibleECSub"
      v-model:event="event"
      @add-event-click="addEventClick"
    />
  </n-drawer>
</template>

<script lang='ts'>
import { defineComponent, ref, provide, computed } from 'vue';
import { useStore } from '/@/store';
import FullcalendarSub from '/@/components/FullcalendarSub.vue';
import WeatherSub from '/@/components/WeatherSub.vue';
import { NDrawer } from 'naive-ui';
import SettingSub from '/@/components/SettingSub.vue';
import DateViewSub from '/@/components/DateViewSub.vue';
import WeatherService from '../../../services/WeatherService';
import EventCreateSub from '/@/components/EventCreateSub.vue';
import EventService from '../../../services/EventService';
import type { EventInput } from '@fullcalendar/vue3';
import type { FLocation, WeatherValueMap } from 'types/custom';

export default defineComponent({
  name: 'FullCalendarMain',
  components: {
    FullcalendarSub,
    WeatherSub,
    NDrawer,
    SettingSub,
    DateViewSub,
    EventCreateSub,
  },
  provide() {
    return {
      flocation: computed(() => this.store.state.location),
    };
  },
  setup() {
    const weather = ref({} as WeatherValueMap);
    provide('weather', weather);
    const visibleFullSetting = ref(false);
    const store = useStore();
    const eventService = ref(new EventService(
      store.state.notion.api_key,
      store.state.notion.database_id,
    ));
    const event = ref(undefined);
    return {
      weather,
      eventService,
      visibleFullSetting,
      store,
      event,
    };
  },
  data() {
    return {
      location: {},
      changeShowFestivals: false,
      changeShowWeather: false,
      visibleFullDateView: false,
      date: new Date(),
      visibleECSub: false,
      events: [] as EventInput[],
      settingDrawerWidth: Number(import.meta.env.VITE_APP_WIDTH) / 4.0 * 3,
    };
  },
  computed: {
    showDrawer: {
      get(): boolean {
        return this.visibleFullSetting || this.visibleFullDateView || this.visibleECSub;
      },
      set(newValue: boolean) {
        this.visibleFullSetting = newValue;
        this.visibleFullDateView = newValue;
        this.visibleECSub = newValue;
      },
    },
  },
  watch: {
    changeShowFestivals(newval) {
      this.store.commit('changeShowFestivals', newval);
    },
    changeShowWeather(newval) {
      this.store.commit('changeShowWeather', newval);
      if (this.changeShowWeather) {
        this.getWeather(this.store.state.location);
      }
    },
  },
  mounted() {
    this.updateEvents();
    this.setShowData();
  },
  methods: {
    updateLocation(newval: FLocation): void {
      this.store.commit('changeLocation', newval);
      if (this.changeShowWeather) {
        this.getWeather(newval);
      }
    },
    updateEvents(
      notion_api_key = '',
      notion_database_id = '',
    ): void {
      this.eventService
      .setApiKey(notion_api_key)
      .setDatabaseId(notion_database_id)
      .getEvents().then((data) => {
        this.events = data;
      });
    },
    setShowData(): void {
      this.changeShowFestivals = this.store.state.showFestivals;
      this.changeShowWeather = this.store.state.showWeather;
    },
    getWeather(location: FLocation): void {
      const weatherService = new WeatherService();
      weatherService.getWeathers(location).then((data) => (this.weather = data));
    },
    dateClick(date: Date): void {
      this.date = date;
      this.visibleFullDateView = true;
    },
    eventClick(event: any): void {
      this.event = event;
      this.visibleECSub = true;
    },
    quit(): void {
      window.electron.ipcRenderer.send('quit');
    },
    goCreateEventView(): void {
      this.showDrawer = false;
      this.event = undefined;
      this.visibleECSub = true;
    },
    goSettingView(): void {
      this.showDrawer = false;
      this.visibleFullSetting = true;
    },
    focusClick() {
      this.showDrawer = false;
      this.$router.replace({ path: '/focus' });
    },
    addEventClick(data: EventInput) {
      this.visibleECSub = false;
      if (data.id) {
        this.eventService.patchEvent(data)
        .then(() => {
          this.updateEvents();
        });
      } else {
        this.eventService.postEvent(data)
        .then(() => {
          this.updateEvents();
        });
      }
    },
  },
});
</script>

<style scoped lang="scss">
@import "~/styles/default.scss";

.dropdown {
  position: fixed;
  top: 7.5px;
  left: 10px;
  font-size: 24px;
}
</style>
