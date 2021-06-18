<template>
  <n-affix
    :trigger-top="24"
    style="margin-left: 24px;"
    position="absolute"
  >
    <n-button
      text
      style="font-size: 24px;"
      @click="hideFocus"
    >
      <n-icon>
        <times-circle-regular-icon />
      </n-icon>
    </n-button>
  </n-affix>
  <Vue3CountdownClock />
</template>

<script lang="ts">
import { defineComponent, ref, provide, computed } from 'vue';
import { NAffix, NButton, NIcon } from 'naive-ui';
import { TimesCircleRegular as TimesCircleRegularIcon } from '@vicons/fa';
import Vue3CountdownClock from 'vue3-clock-countdown';
import Moment from 'moment';
import { useStore } from '/@/store';

export default defineComponent({
  name: 'FocusViewSub',
  components: {
    Vue3CountdownClock,
    NAffix,
    NButton,
    NIcon,
    TimesCircleRegularIcon,
  },
  provide() {
    return {
      deadline: computed(() => Moment().add(this.store.state.focusTime, 'second').format()),
    };
  },
  setup () {
    const Title = ref('专注还剩时间');
    provide('title', Title);

    const timerStyle = ref({
      'text-align': 'center',
      'font-family': 'sans-serif',
      'font-weight': 100,
    });
    provide('timerStyle', timerStyle);

    const h1Style = ref({
      color: '#396',
      'font-weight': 100,
      'font-size': '40px',
      margin: '40px 0px 20px',
    });
    provide('h1Style', h1Style);

    const clockdiv = ref({
      'font-family': 'sans-serif',
      color: '#fff',
      display: 'inline-block',
      'font-weight': 100,
      'text-align': 'center',
      'font-size': '30px',
    });
    provide('clockdiv', clockdiv);

    const clockdivDiv = ref({
      padding: '10px',
      'border-radius': '3px',
      background: '#00BF96',
      display: 'inline-block',
      margin: '1px',
    });
    provide('clockdivDiv', clockdivDiv);

    const clockdivDivSpan = ref({
      padding: '15px',
      'border-radius': '3px',
      background: '#00816A',
      display: 'inline-block',
    });
    provide('clockdivDivSpan', clockdivDivSpan);

    const styleEndTime = ref({
      color: '#fff',
    });
    provide('styleEndTime', styleEndTime);

    const smalltext = ref({
      'padding-top': '5px',
      'font-size': '16px',
    });
    provide('smalltext', smalltext);

    const titleDays = ref('Days');
    provide('titleDays', titleDays);

    const titleHours = ref('Hours');
    provide('titleHours', titleHours);

    const titleMinutes = ref('Minutes');
    provide('titleMinutes', titleMinutes);

    const titleSeconds = ref('Seconds');
    provide('titleSeconds', titleSeconds);

    const titleEndTime = ref('End Time!');
    provide('titleEndTime', titleEndTime);

    const store = useStore();
    provide('store', store);
    return {
      store,
    };
  },
  methods: {
    hideFocus() {
      this.$router.back();
      window.electron.ipcRenderer.send('hide-focus-window');
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "~/styles/default.scss";
</style>
