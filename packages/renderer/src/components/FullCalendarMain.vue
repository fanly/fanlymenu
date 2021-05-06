<template>
  <div class="p-grid">
    <Fullcalendar
      :events="events"
      :options="calendarOptions"
    />
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, onMounted } from 'vue';
import '@fullcalendar/core/vdom';
import '@fullcalendar/core';
import {PrimeIcons} from 'primevue/api';
import Fullcalendar from 'primevue/fullcalendar';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import zhLocale from '@fullcalendar/core/locales/zh-cn';
import EventService from '../../../services/EventService';
import { Lunar } from 'lunar-typescript';
import 'primeicons/primeicons.css';

export default defineComponent({
  name: 'FullCalendarMain',
  components: {
    Fullcalendar,
  },
  setup() {
    onMounted(() => {
      eventService.value.getEvents().then((data) => (events.value = data));
    });

    const events = ref([]);
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
            icon: PrimeIcons.COG,
            click: () => {
              alert('设置');
            },
          },
        },
        headerToolbar: {
          left: 'prev,next',
          center: 'title',
          right: 'settingButton',
        },
        editable: false,
        height: 680,
        // contentHeight: 600,
        aspectRatio: 1, // 单元格宽高的比例，宽是高的2倍
        views: {
          dayGridMonth: {
            dayCellContent(item: any) {
              const lunar = Lunar.fromDate(new Date(item.date));
              const dayTextInChinese =
                lunar.getJieQi() ||
                `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;
              return {
                html: `<div class="fc-daygrid-day-number">${item.dayNumberText}</div>
                      <div class="fc-daygrid-day-chinese">${dayTextInChinese}</div>`,
              };
            },
          },
        },
        locale: zhLocale,
      },
    };
  },
});
</script>

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
