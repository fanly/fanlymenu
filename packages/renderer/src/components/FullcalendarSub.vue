<template>
  <full-calendar
    ref="fullcalendar"
    :options="calendarOptions"
  >
    <template #eventContent="arg">
      <i>{{ arg.event.title }}</i>
    </template>
  </full-calendar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import '@fullcalendar/core/vdom'; // solve problem with Vite
import FullCalendar from '@fullcalendar/vue3';
import type { CalendarOptions, DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import zhLocale from '@fullcalendar/core/locales/zh-cn';
import CalendarViewService from '../../../services/CalendarViewService';

export default defineComponent({
  name: 'FullcalendarSub',
  components: {
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
  setup() {
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
        eventClick: this.eventClick,
        eventChange: this.updateView,
        editable: false,
        // height: Number(import.meta.env.VITE_APP_HEIGHT) - 10,
        aspectRatio: 1.31, // 单元格宽高的比例，宽是高的2倍
        views: this.dayCellNewContent(),
        locale: zhLocale,
      } as CalendarOptions,
    };
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
      const calendarArray = this.$refs['fullcalendar'] as any;
      const calendarApi = calendarArray.getApi();
      // this.events?.forEach((event: any) => {
      //   return calendarApi.addEvent(event);
      // })
      // const eventsTemp: EventInput[] = this.events;
      calendarApi.addEventSource(this.events);
    },
  },
  methods: {
    updateView() {
      const calendarArray = this.$refs['fullcalendar'] as any;
      const calendarApi = calendarArray.getApi();
      console.log(calendarApi);
      const viewContent = this.dayCellNewContent();
      calendarApi.changeView('dayGridMonth', viewContent['dayGridMonth']);
      // 这种成本可能更高
      // calendar.render();
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
          titleFormat: { year: 'numeric', month: '2-digit'},
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
