<template>
  <n-config-provider :theme="themeValue">
    <router-view />
  </n-config-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { GlobalTheme } from 'naive-ui';
import { NConfigProvider, darkTheme } from 'naive-ui';
import { useStore } from '/@/store';

export default defineComponent({
  name: 'App',
  components: {
    NConfigProvider,
  },
  setup() {
    const store = useStore();
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
});
</script>
