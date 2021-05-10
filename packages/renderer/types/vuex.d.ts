// import type { ComponentCustomProperties } from 'vue';
import type { Store } from 'vuex';
// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
declare module '@vue/runtime-core' {
  interface State {
    showFestivals: boolean
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
