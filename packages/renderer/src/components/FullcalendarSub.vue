<template>
  <Fullcalendar
    ref="fullcalendar"
    :events="events"
    :options="calendarOptions"
  />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import '@fullcalendar/core/vdom';
import '@fullcalendar/core';
import {PrimeIcons} from 'primevue/api';
import Fullcalendar from 'primevue/fullcalendar';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import zhLocale from '@fullcalendar/core/locales/zh-cn';
import EventService from '../../../services/EventService';
import CalendarViewService from '../../../services/CalendarViewService';
import 'primeicons/primeicons.css';

export default defineComponent({
  name: 'FullcalendarSub',
  components: {
    Fullcalendar,
  },
  props: {
    changeShowFestivals: Boolean,
    changeShowWeather: Boolean,
    weather: {},
  },
  setup() {
    onMounted(() => {
      eventService.value.getEvents().then((data) => (events.value = data));
    });

    const events: any = ref([]);
    const eventService = ref(new EventService());
    return {
      events,
      eventService,
    };
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        customButtons: {
          settingButton: {
            text: '',
            icon: PrimeIcons.BARS,
            click: this.settingClick,
          },
        },
        headerToolbar: {
          left: 'prev,next',
          center: 'title',
          right: 'settingButton',
        },
        dateClick: this.dateClick,
        editable: false,
        height: 680,
        aspectRatio: 1, // 单元格宽高的比例，宽是高的2倍
        views: this.dayCellNewContent(),
        locale: zhLocale,
      },
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
  },
  methods: {
    updateView() {
      let calendarArray = this.$refs['fullcalendar'] as any;
      let calendar = calendarArray['calendar'];
      const viewContent = this.dayCellNewContent();
      calendar.changeView('dayGridMonth', viewContent['dayGridMonth']);
      // 这种成本可能更高
      // calendar.render();
    },
    settingClick(event: any) {
      this.$emit('settingClick', event);
    },
    dateClick(target: any) {
      this.$emit('dateClick', target.date);
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

@media screen and (max-width: $lg) {
  ::v-deep(.fc-header-toolbar) {
    display: flex;
    flex-wrap: wrap;
  }
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
