declare module '*.vue' {
  import type { DefineComponent, ComponentCustomProperties } from 'vue';
  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
  const component: DefineComponent<{}, {}, any>;

  interface State {
    showFestivals: boolean
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
  export default component;
}
