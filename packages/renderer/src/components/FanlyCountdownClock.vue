<template>
  <n-card
    :title="title"
    :bordered="false"
    :style="style"
  >
    <template #header-extra>
      <n-button
        text
        style="font-size: 24px;"
        @click="$emit('finish')"
      >
        <n-icon>
          <times-circle-regular-icon />
        </n-icon>
      </n-button>
    </template>
    <n-grid
      x-gap="12"
      :cols="cols"
    >
      <n-gi v-if="cols == 4">
        <n-card
          :title="formatTime(days)"
          size="large"
        >
          天
        </n-card>
      </n-gi>
      <n-gi v-if="cols >= 3">
        <n-card
          :title="formatTime(hours)"
          size="large"
        >
          时
        </n-card>
      </n-gi>
      <n-gi>
        <n-card
          :title="formatTime(minutes)"
          size="large"
        >
          分
        </n-card>
      </n-gi>
      <n-gi>
        <n-card
          :title="formatTime(seconds)"
          size="large"
        >
          秒
        </n-card>
      </n-gi>
    </n-grid>
  </n-card>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { NButton, NIcon, NGrid, NGi, NCard } from 'naive-ui';
import { TimesCircleRegular as TimesCircleRegularIcon } from '@vicons/fa';

export default defineComponent({
  name: 'FanlyCountdownClock',
  components: {
    NButton,
    NIcon,
    TimesCircleRegularIcon,
    NGrid,
    NGi,
    NCard,
  },
  props: {
    speed: {
      type: Number,
      default: 1000,
    },
    height: Number,
  },
  emits: [
    'finish',
  ],
  setup() {
    const deadline: string = inject('deadline') as string;
    const title = inject('title', '');
    return {
      deadline,
      title,
    };
  },
  data() {
    return {
      currentTime: Date.parse(this.deadline as any) - Date.parse(new Date() as any),
    };
  },
  computed: {
    style(): any {
      return {
        height: this.height + 'px',
      };
    },
    seconds(): number {
      return Math.floor((this.currentTime / 1000) % 60);
    },
    minutes(): number {
      return Math.floor((this.currentTime / 1000 / 60) % 60);
    },
    hours(): number {
      return Math.floor((this.currentTime / (1000 * 60 * 60)) % 24);
    },
    days(): number {
      return Math.floor(this.currentTime / (1000 * 60 * 60 * 24));
    },
    cols(): number {
      if (this.days > 0) {
        return 4;
      }

      if (this.hours > 0) {
        return 3;
      }

      return 2;
    },
  },
  mounted() {
    setTimeout(this.countdown, 1000);
  },
  methods: {
    formatTime(value: number): string {
      if (value < 10) {
          return '0' + value;
      }
      return value.toString();
    },
    countdown () {
      this.currentTime = Date.parse(this.deadline) - Date.parse(new Date() as any);
      if (this.currentTime > 0) {
          setTimeout(this.countdown, this.speed);
      } else {
          this.$emit('finish');
      }
    },
  },
});
</script>
<style scoped lang="scss">
::v-deep(.n-card__content) {
  display: inline-grid;
  align-items: center;
}
</style>
