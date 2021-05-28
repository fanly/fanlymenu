<template>
  <Sidebar
    v-model:visible="sidebarVisible"
    :base-z-index="1000"
    position="full"
    @click="$emit('update:visibleFullDateView', sidebarVisible)"
  >
    <h1>{{ date }}</h1>
  </Sidebar>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import Sidebar from 'primevue/sidebar';

export default defineComponent({
  name: 'DateViewSub',
  components: {
    Sidebar,
  },
  props: {
    visibleFullDateView: Boolean,
    date: String,
  },
  emits: [
    'update:visibleFullDateView',
  ],
  data() {
    return {
      sidebarVisible: false,
    };
  },
  watch: {
    visibleFullDateView(): void {
      this.sidebarVisible = this.visibleFullDateView;
    },
  },
  mounted() {

  },
  methods: {
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "~/styles/default.scss";

h1 {
  text-align: center;
  color: var(--primary-color);
}

@media screen and (max-width: $lg) {
  ::v-deep(.fc-header-toolbar) {
    display: flex;
    flex-wrap: wrap;
  }
}

</style>
