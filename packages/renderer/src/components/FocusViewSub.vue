<template>
  <n-config-provider
    :theme="themeValue"
  >
    <FanlyCountdownClock
      @finish="hideFocus"
    />
  </n-config-provider>
</template>

<script lang="ts">
import { defineComponent, ref, provide, computed } from 'vue';
import type { GlobalTheme } from 'naive-ui';
import { NConfigProvider, darkTheme } from 'naive-ui';
import FanlyCountdownClock from '/@/components/FanlyCountdownClock.vue';
import Moment from 'moment';
import { useStore } from '/@/store';

export default defineComponent({
  name: 'FocusViewSub',
  components: {
    NConfigProvider,
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
    provide('height', window.screen.height);
    const store = useStore();
    provide('store', store);
    return {
      store,
      darkTheme,
    };
  },
  computed: {
    themeValue(): GlobalTheme | null {
      return this.store.state.themeValue == 'darkTheme' ? darkTheme : null;
    },
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
