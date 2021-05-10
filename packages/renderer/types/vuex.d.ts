// import type { ComponentCustomProperties } from 'vue';
import type { Store } from '/@/store';
// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store
  }
}
