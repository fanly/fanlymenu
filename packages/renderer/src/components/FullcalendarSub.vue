<template>
  <n-config-provider :theme="themeValue">
    <n-card>
      <n-el
        style="color: var(--primary-color); transition: .3s var(--cubic-bezier-ease-in-out);"
      >
        <full-calendar
          ref="fullcalendar"
          :options="calendarOptions"
          style="color: var(--primary-color); transition: .3s var(--cubic-bezier-ease-in-out);"
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
import { defineComponent, ref } from 'vue';
import { darkTheme, NCard, NElement as NEl, useThemeVars, NConfigProvider } from 'naive-ui';
import '@fullcalendar/core/vdom'; // solve problem with Vite
import FullCalendar from '@fullcalendar/vue3';
import type { CalendarOptions, DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import zhLocale from '@fullcalendar/core/locales/zh-cn';
import CalendarViewService from '../../../services/CalendarViewService';
import { useStore } from '/@/store';

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
    weather: Object,
    events: {
      type: Array,
      default: [] as EventInput[],
    },
  },
  emits: [
    'dateClick',
    'eventClick',
  ],
  setup() {
    const store = useStore();
    const themeVars = ref(useThemeVars());
    return {
      darkTheme,
      store,
      themeVars,
    };
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        headerToolbar: {
          left: 'prev,next',
          center: 'title',
          right: '',
        },
        selectable: true,
        select: this.dateClick,
        initialEvents: this.events,
        eventClick: this.eventClick,
        eventChange: this.updateView,
        editable: false,
        height: Number(import.meta.env.VITE_APP_HEIGHT),
        fixedWeekCount: true,
        views: this.dayCellNewContent(),
        locale: zhLocale,
      } as CalendarOptions,
    };
  },
  computed: {
    themeValue(): any {
      this.updateColors();
      return this.store.state.themeValue == 'darkTheme' ? darkTheme : null;
    },
  },
  watch: {
    changeShowFestivals(): void {
      console.log('changeShowFestivals');
      this.updateView();
    },
    changeShowWeather(): void {
      console.log('changeShowWeather');
      this.updateView();
    },
    weather(): void {
      console.log('weather');
      this.updateView();
    },
    events(): void {
      const calendarArray = this.$refs['fullcalendar'] as any;
      const calendarApi = calendarArray.getApi();
      calendarApi.addEventSource(this.events);
    },
  },
  methods: {
    updateColors() {
      this.calendarOptions.eventColor = this.themeVars.primaryColor;
    },
    updateView() {
      const calendarArray = this.$refs['fullcalendar'] as any;
      console.log(calendarArray);
      const calendarApi = calendarArray.getApi();
      const viewContent = this.dayCellNewContent();
      calendarApi.changeView('dayGridMonth', viewContent['dayGridMonth']);
      // 这种成本可能更高
      // this.calendarApi.render();
    },
    dateClick(selectInfo: DateSelectArg) {
      this.$emit('dateClick', selectInfo.start);
    },
    eventClick(clickInfo: EventClickArg) {
      this.$emit('eventClick', clickInfo.event);
    },
    dayCellNewContent() {
      const that = this;
      return {
        dayGridMonth: {
          titleFormat: { year: 'numeric', month: '2-digit' },
          dayCellContent(item: any) {
            const date = new Date(item.date);
            const calendarViewService = new CalendarViewService();
            return calendarViewService.showView(item.dayNumberText, date, that.changeShowFestivals, that.changeShowWeather, that.weather);
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
  margin-bottom: 0 !important;
}
::v-deep(.fc-daygrid-day-top) {
  display: flex;
  text-align: center;
  flex-direction: column-reverse;
}

::v-deep(.fc-daygrid-day-chinese) {
  position: relative;
  z-index: 4;
  padding: 4px;
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

::v-deep(.fc-day-today) {
  --fc-today-bg-color: var(--green-100);
}

::v-deep(.fc-day-sat) {
  color: var(--cyan-300) !important;
}

::v-deep(.fc-day-sun) {
  color: var(--cyan-300) !important;
}

</style>
