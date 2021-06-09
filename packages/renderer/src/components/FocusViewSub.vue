<template>
  <Sidebar
    v-model:visible="sidebarVisible"
    class="p-grid nested-grid"
    :base-z-index="1000"
    position="full"
    @click="hideFocus"
  >
    <h1>专注模式</h1>
    <Vue3CountdownClock />
  </Sidebar>
</template>

<script lang="ts">
import { defineComponent, ref, provide, computed } from 'vue';
import Sidebar from 'primevue/sidebar';
import Vue3CountdownClock from 'vue3-clock-countdown';
import Moment from 'moment';
import { useStore } from '/@/store';

export default defineComponent({
  name: 'FocusViewSub',
  components: {
    Sidebar,
    Vue3CountdownClock,
  },
  provide() {
    return {
      deadline: computed(() => Moment().add(this.store.state.focusTime, 'minute').format()),
    };
  },
  props: {
    visibleFocusView: Boolean,
  },
  emits: [
    'update:visibleFocusView',
  ],
  setup () {
    const Title = ref('进入倒计时');
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
  data() {
    return {
      sidebarVisible: false,
    };
  },
  watch: {
    visibleFocusView(): void {
      this.sidebarVisible = this.visibleFocusView;
    },
  },
  methods: {
    hideFocus() {
      this.$emit('update:visibleFocusView', this.sidebarVisible);
      window.electron.ipcRenderer.send('hide-focus-window');
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

</style>
