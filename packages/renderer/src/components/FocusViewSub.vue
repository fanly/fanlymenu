<template>
  <FanlyCountdownClock
    v-model:height="clockHeight"
    @finish="hideFocus"
  />
</template>

<script lang="ts">
import { defineComponent, ref, provide, computed } from 'vue';
import FanlyCountdownClock from '/@/components/FanlyCountdownClock.vue';
import Moment from 'moment';
import { useStore } from '/@/store';

export default defineComponent({
  name: 'FocusViewSub',
  components: {
    FanlyCountdownClock,
  },
  provide() {
    return {
      deadline: computed(() => Moment().add(this.store.state.focusTime, 'minute').format()),
    };
  },
  setup () {
    const Title = ref('专注还剩时间');
    provide('title', Title);
    const clockHeight = document.documentElement.clientHeight || document.body.clientHeight;
    const store = useStore();
    provide('store', store);
    return {
      clockHeight,
      store,
    };
  },
  methods: {
    hideFocus() {
      this.$router.replace({path: '/'});
      window.electron.ipcRenderer.send('hide-focus-window');
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "~/styles/default.scss";
</style>
