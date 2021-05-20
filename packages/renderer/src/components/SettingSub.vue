<template>
  <Sidebar
    v-model:visible="sidebarVisible"
    :base-z-index="1000"
    position="full"
    @click="$emit('update:visibleFullSetting', sidebarVisible)"
  >
    <h3>Full Screen</h3>
    <h4>显示节假日</h4>
    <InputSwitch
      v-model="inputSwitchModel"
      @change="$emit('update:changeShowFestivals', inputSwitchModel)"
    />
  </Sidebar>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import Sidebar from 'primevue/Sidebar';
import InputSwitch from 'primevue/inputswitch';

export default defineComponent({
  name: 'SettingSub',
  components: {
    Sidebar,
    InputSwitch,
  },
  props: {
    visibleFullSetting: Boolean,
    changeShowFestivals: Boolean,
  },
  emits: ['update:visibleFullSetting', 'update:changeShowFestivals'],
  data() {
    return {
      sidebarVisible: this.visibleFullSetting,
      inputSwitchModel: this.changeShowFestivals,
    };
  },
  watch: {
    visibleFullSetting(): void {
      this.sidebarVisible = this.visibleFullSetting;
    },
    changeShowFestivals(): void {
      this.inputSwitchModel = this.changeShowFestivals;
    },
  },
  methods: {
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "~/styles/default.scss";

.weather {
  position: absolute;
  top: 5px;
  left: 150px;
  z-index: 1000;
}

.weatherTemp {
  font-size: 0.8rem;
  background-color:#ffffff;
  color: var(--primary-color)
}
@media screen and (max-width: $lg) {
  ::v-deep(.fc-header-toolbar) {
    display: flex;
    flex-wrap: wrap;
  }
}

</style>
