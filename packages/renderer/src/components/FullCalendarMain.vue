<template>
  <div class="p-grid">
    <FullcalendarSub
      v-model:changeShowFestivals="changeShowFestivals"
      @settingClick="visibleFullSetting = true"
    />
    <Sidebar
      v-model:visible="visibleFullSetting"
      :base-z-index="1000"
      position="full"
    >
      <h3>Full Screen</h3>
      <h4>显示节假日</h4>
      <InputSwitch v-model="changeShowFestivals" />
    </Sidebar>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue';
import { useStore } from '/@/store';
import Sidebar from 'primevue/Sidebar';
import InputSwitch from 'primevue/inputswitch';
import 'primeicons/primeicons.css';
import FullcalendarSub from '/@/components/FullcalendarSub.vue';

export default defineComponent({
  name: 'FullCalendarMain',
  components: {
    FullcalendarSub,
    Sidebar,
    InputSwitch,
  },
  setup() {
    const visibleFullSetting = ref(false);
    const store = useStore();
    return {
      visibleFullSetting,
      store,
    };
  },
  data() {
    return {
      changeShowFestivals: true,
    };
  },
  watch: {
    changeShowFestivals(newval) {
      this.store.commit('changeShowFestivals', newval);
    },
  },
  methods: {
    setShowFestivals() {
      this.changeShowFestivals = this.store.state.showFestivals;
    },
  },
  mounte() {
    this.setShowFestivals();
  },
});
</script>

<style scoped lang="scss">
@import "~/styles/default.scss";
</style>
