<template>
  <fullcalendar-sub
    v-model:changeShowFestivals="changeShowFestivals"
    v-model:changeShowWeather="changeShowWeather"
    v-model:events="events"
    v-model:weather="weather"
    v-model:location="location"
    @dateClick="dateClick"
    @eventClick="eventClick"
  />
  <weather-sub
    v-if="changeShowWeather"
    v-model:changeShowWeather="changeShowWeather"
    v-model:weather="weather"
    v-model:location="location"
  />
  <n-dropdown
    trigger="hover"
    placement="bottom-start"
    :options="options"
    @select="dropdownClick"
  >
    <n-button
      text
      type="success"
      :keyboard="false"
      class="dropdown"
    >
      <n-icon>
        <list-icon />
      </n-icon>
    </n-button>
  </n-dropdown>
  <n-drawer
    v-model:show="showDrawer"
    :width="settingDrawerWidth"
    placement="left"
  >
    <setting-sub
      v-if="visibleFullSetting"
      v-model:changeShowWeather="changeShowWeather"
      v-model:changeShowFestivals="changeShowFestivals"
      v-model:location="location"
      @focusClick="focusClick"
    />
    <date-view-sub
      v-if="visibleFullDateView"
      v-model:date="date"
    />
    <event-create-sub
      v-if="visibleECSub"
      v-model:event="event"
      @addEventClick="addEventClick"
    />
  </n-drawer>
</template>

<script lang='ts'>
import { defineComponent, ref, h } from 'vue';
import type { FLocation } from '/@/store';
import { useStore } from '/@/store';
import FullcalendarSub from '/@/components/FullcalendarSub.vue';
import WeatherSub from '/@/components/WeatherSub.vue';
import { NDropdown, NDrawer, NButton, NIcon } from 'naive-ui';
import { List as ListIcon, PowerOff as PowerOffIcon } from '@vicons/fa';
import { Add12Filled as Add12FilledIcon, LauncherSettings24Filled as LauncherSettings24FilledIcon } from '@vicons/fluent';
import SettingSub from '/@/components/SettingSub.vue';
import DateViewSub from '/@/components/DateViewSub.vue';
import WeatherService from '../../../services/WeatherService';
import EventCreateSub from '/@/components/EventCreateSub.vue';
import EventService from '../../../services/EventService';

export default defineComponent({
  name: 'FullCalendarMain',
  components: {
    NDropdown,
    FullcalendarSub,
    WeatherSub,
    NDrawer,
    SettingSub,
    DateViewSub,
    EventCreateSub,
    NButton,
    NIcon,
    ListIcon,
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
      date: new Date(),
      visibleECSub: false,
      event: undefined,
      settingDrawerWidth: Number(import.meta.env.VITE_APP_WIDTH) / 4.0 * 3,
      options: [
        {
          label: '创建事件',
          key: 'goCreateEventView',
          icon() {
            return h(NIcon, null, {
              default: () => h(Add12FilledIcon),
            });
          },
          on: this.goCreateEventView,
        },
        {
          label: '设置',
          key: 'goSettingView',
          icon() {
            return h(NIcon, null, {
              default: () => h(LauncherSettings24FilledIcon),
            });
          },
          on: this.goSettingView,
        },
        {
          type: 'divider',
          key: 'd1',
        },
        {
          label: '退出应用',
          key: 'quit',
          icon() {
            return h(NIcon, null, {
              default: () => h(PowerOffIcon),
            });
          },
          on: this.quit,
        },
      ],
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
      this.visibleECSub = true;
    },
    dropdownClick(key: any): void {
      const result = this.options.find((item: { key: string; }) => item.key == key);
      if (result !== undefined && result.on !== undefined) {
        result.on();
      }
    },
    quit(): void {
      window.electron.ipcRenderer.send('quit');
    },
    goCreateEventView(): void {
      this.event = undefined;
      this.visibleECSub = true;
    },
    goSettingView(): void {
      this.visibleFullSetting = true;
    },
    focusClick() {
      this.visibleFullSetting = false;
      this.$router.replace({ path: '/focus' });
    },
    addEventClick(data: any) {
      this.visibleECSub = false;
      if (data.id) {
        this.eventService.patchEvent(data.id, data.title, data.start, data.end)
        .then(() => {
          this.updateEvents();
        });
      } else {
        this.eventService.postEvent(data.title, data.start, data.end)
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
  top: 3px;
  right: 16px;
  font-size: 24px;
}
</style>
