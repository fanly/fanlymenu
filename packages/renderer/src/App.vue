<template>
  <n-config-provider :theme="themeValue">
    <router-view />
  </n-config-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
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
    themeValue(): any {
      return this.store.state.themeValue == 'darkTheme' ? darkTheme : null;
    },
  },
});
</script>
