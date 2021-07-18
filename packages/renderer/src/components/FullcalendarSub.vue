<template>
  <n-config-provider :theme="themeValue">
    <n-card style="--padding-top: 0; --padding-bottom: 0; --padding-left: 0; --padding-right: 0;">
      <n-el
        style="color: var(--text-color-base); transition: .3s var(--cubic-bezier-ease-in-out);"
      >
        <full-calendar
          ref="fullcalendar"
          :options="calendarOptions"
          :style="{ '--fc-today-bg-color': fc_today_bg_color }"
        >
          <template #eventContent="arg">
            <i>{{ arg.event.title }}</i>
          </template>
        </full-calendar>
      </n-el>
    </n-card>
  </n-config-provider>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, inject } from 'vue';
import type { GlobalTheme } from 'naive-ui';
import { darkTheme, NCard, NElement as NEl, useThemeVars, NConfigProvider } from 'naive-ui';
import '@fullcalendar/core/vdom'; // solve problem with Vite
import FullCalendar from '@fullcalendar/vue3';
import type {
  CustomButtonInput,
  CalendarApi,
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventInput,
  EventSourceInput,
  DateRangeInput,
  DateInput,
  DayCellContentArg,
} from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import zhLocale from '@fullcalendar/core/locales/zh-cn';
import CalendarViewService from '../../../services/CalendarViewService';
import { useStore } from '/@/store';
import type { WeatherValueMap } from 'types/custom';

export default defineComponent({
  name: 'FullcalendarSub',
  components: {
    NCard,
    NEl,
    NConfigProvider,
    FullCalendar,
  },
  props: {
    changeShowFestivals: Boolean,
    changeShowWeather: Boolean,
    events: {
      type: Array,
      default: [] as EventInput[],
    },
  },
  emits: [
    'dateClick',
    'eventClick',
    'settingClick',
  ],
  setup() {
    const weather = inject('weather', {} as WeatherValueMap);
    const store = useStore();
    const themeVars = ref(useThemeVars());
    const fc_today_bg_color = ref(themeVars.value.primaryColor);
    const fullcalendar = ref(null);
    let fullcalendarApi = ref<InstanceType<typeof CalendarApi>>();
    onMounted(() => {
      fullcalendarApi = Object.getOwnPropertyDescriptor(fullcalendar.value, 'getApi')?.value();
    });
    return {
      weather,
      darkTheme,
      store,
      themeVars,
      fc_today_bg_color,
      fullcalendar,
      fullcalendarApi,
    };
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        customButtons: {
          settingButton: {
            icon: 'setting',
            click: this.settingClick,
          } as CustomButtonInput,
        } as unknown,
        headerToolbar: {
          left: 'settingButton',
          center: 'title',
          right: 'prev,next',
        },
        selectable: true,
        select: this.dateClick,
        initialEvents: this.events,
        eventClick: this.eventClick,
        dayMaxEvents: 1,
        editable: false,
        footerToolbar: false,
        height: Number(import.meta.env.VITE_APP_HEIGHT) - 4,
        aspectRatio: 1,
        fixedWeekCount: false,
        handleWindowResize: false,
        views: this.dayCellNewContent(),
        locale: zhLocale,
      } as CalendarOptions,
    };
  },
  computed: {
    themeValue(): GlobalTheme | null {
      this.updateColors();
      return this.store.state.themeValue == 'darkTheme' ? darkTheme : null;
    },
  },
  watch: {
    changeShowFestivals(): void {
      this.updateView();
    },
    changeShowWeather(): void {
      this.updateView();
    },
    weather(): void {
      this.updateView();
    },
    events(): void {
      if (this.fullcalendarApi == null) {
        this.fullcalendarApi = Object.getOwnPropertyDescriptor(this.fullcalendar, 'getApi')?.value();
      }
      this.fullcalendarApi?.removeAllEventSources();
      this.fullcalendarApi?.addEventSource(this.events as EventSourceInput);
    },
  },
  methods: {
    updateColors() {
      this.calendarOptions.eventColor = this.themeVars.primaryColor;
      this.fc_today_bg_color = this.convertHexToRGBA(this.themeVars.primaryColor, Number(this.themeVars.opacity5));
    },
    updateView() {
      if (this.fullcalendarApi == null) {
        this.fullcalendarApi = Object.getOwnPropertyDescriptor(this.fullcalendar, 'getApi')?.value();
      }
      const viewContent = this.dayCellNewContent();
      this.fullcalendarApi?.changeView('dayGridMonth', viewContent['dayGridMonth'] as DateRangeInput | DateInput);
    },
    dateClick(selectInfo: DateSelectArg) {
      this.$emit('dateClick', selectInfo.start);
    },
    eventClick(clickInfo: EventClickArg): void {
      this.$emit('eventClick', clickInfo.event);
    },
    settingClick(): void {
      this.$emit('settingClick');
    },
    convertHexToRGBA(hex: string, opacity: number) {
      const tempHex = hex.replace('#', '');
      const r = parseInt(tempHex.substring(0, 2), 16);
      const g = parseInt(tempHex.substring(2, 4), 16);
      const b = parseInt(tempHex.substring(4, 6), 16);

      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    },
    dayCellNewContent() {
      const that = this;
      return {
        dayGridMonth: {
          titleFormat: { year: 'numeric', month: '2-digit' },
          dayCellContent(item: DayCellContentArg) {
            const date = new Date(item.date);
            const calendarViewService = new CalendarViewService();
            return calendarViewService.showView(item.dayNumberText, date, that.changeShowFestivals, that.changeShowWeather, that.weather as WeatherValueMap);
          },
        },
      };
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "~/styles/default.scss";
::v-deep(.fc-header-toolbar) {
  height: 64px;
  margin-bottom: 0 !important;
}

::v-deep(.fc .fc-button-primary) {
  color: var(--text-color-base);
  background-color: var(--base-color, #2C3E50);
  border-color: var(--border-color, #2C3E50);
}
::v-deep(.fc .fc-settingButton-button) {
  border-color: var(--base-color);
}

::v-deep(.fc-direction-ltr .fc-button-group > .fc-button:not(:first-child)) {
  /* margin-left: -1px; */
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  margin: 0 3px;
}
::v-deep(.fc-daygrid-day-top) {
  display: flex;
  text-align: center;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
}

::v-deep(.fc-daygrid-day-chinese) {
  position: relative;
  z-index: 4;
  padding: 4px;
}

::v-deep(.fc-day-today .fc-daygrid-day-number) {
  width: 25px;
  height: 25px;
  color: var(--base-color);
  background: var(--primary-color);
  padding: 2px;
  margin: 2px;
  border-radius: 50%;
}

::v-deep(.fc-daygrid-dayweather) {
  text-align: center;
}

::v-deep(.fc-daygrid-dayweather-iconday) {
  padding-top: 4px;
  float: left;
  width: 20px;
}

::v-deep(.fc-daygrid-dayweather-temp) {
  padding-top: 4px;
  font-size: 0.6rem;
}

::v-deep(.fc-day-sat) {
  color: var(--cyan-300) !important;
}

::v-deep(.fc-day-sun) {
  color: var(--cyan-300) !important;
}

</style>
