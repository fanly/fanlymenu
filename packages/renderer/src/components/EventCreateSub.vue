<template>
  <n-drawer-content
    title="创建事件"
    closable
  >
    <n-space vertical>
      <n-input
        id="eventInput"
        v-model:value="eventText"
        placeholder="事件内容"
      />
      <n-date-picker
        v-model:value="dates"
        type="daterange"
        :actions="['confirm']"
        clearable
      />
    </n-space>
    <template #footer>
      <n-button
        type="success"
        @click="add"
      >
        增加
      </n-button>
    </template>
  </n-drawer-content>
</template>

<script lang="ts">
import { ref, defineComponent} from 'vue';
import {NSpace, NInput, NDatePicker, NButton, NDrawerContent } from 'naive-ui';
import EventService from '../../../services/EventService';

export default defineComponent({
  name: 'EventCreateSub',
  components: {
    NSpace,
    NButton,
    NInput,
    NDatePicker,
    NDrawerContent,
  },
  props: {
    event: Object,
  },
  emits: [
    'addEventClick',
  ],
  setup() {
    const eventService = ref(new EventService());
    return {
      eventService,
    };
  },
  data() {
    return {
      locationStr: '',
      eventText: '',
      dates: [Number(Date.now()), Number(Date.now())] as [number, number],
    };
  },
  watch: {
    event(): void {
      if (this.event != null) {
        this.eventText = this.event.title;
        this.dates = [this.event.start, this.event.end];
      } else {
        this.eventText = '';
        this.dates = [Number(Date.now()), Number(Date.now())];
      }
    },
  },
  mounted() {
  },
  methods: {
    add(): void {
      console.log(this.dates);
      const start: Date = new Date(this.dates[0]);
      const end: Date = this.dates[1] == null ? start : new Date(this.dates[1]);
      this.$emit('addEventClick',{
        id: this.event?.id,
        title: this.eventText,
        start: start,
        end: end,
      });
      this.dates = [Number(Date.now()), Number(Date.now())];
      this.eventText = '';
    },
  },
});
</script>
