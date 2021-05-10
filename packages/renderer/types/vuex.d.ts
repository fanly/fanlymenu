// import type { ComponentCustomProperties } from 'vue';
import type { Store } from '/@/store';
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
