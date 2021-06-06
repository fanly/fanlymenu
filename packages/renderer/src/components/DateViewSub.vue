<template>
  <Sidebar
    v-model:visible="sidebarVisible"
    class="p-grid nested-grid"
    :base-z-index="1000"
    position="full"
    @click="$emit('update:visibleFullDateView', sidebarVisible)"
  >
    <h1>黄历</h1>
    <div class="p-grid p-ai-center vertical-container nested-grid border">
      <div class="p-col-2">
        <div class="nongliString">
          {{ lunarData.nongliString }}
        </div>
      </div>
      <div class="p-col-1">
        <div
          v-for="item in lunarData.ganzhi"
          :key="item"
          class="p-col-12 onecn"
        >
          {{ item }}
        </div>
      </div>
      <div class="p-col-9">
        <div class="p-col-12">
          <div class="p-text-bold p-text-center">
            {{ lunarData.yangliString }}
          </div>
        </div>
        <div class="p-col-12">
          <Tag
            class="p-mr-2"
            icon="pi pi-check"
            severity="success"
            value="宜"
          />
          <Tag
            v-for="item in lunarData.yi"
            :key="item"
            severity="success"
            :value="item"
            rounded
          />
        </div>
        <div class="p-col-12">
          <Tag
            class="p-mr-2"
            icon="pi pi-times"
            severity="danger"
            value="忌"
          />
          <Tag
            v-for="item in lunarData.ji"
            :key="item"
            severity="danger"
            :value="item"
            rounded
          />
        </div>
      </div>
    </div>
  </Sidebar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Sidebar from 'primevue/sidebar';
import Tag from 'primevue/tag';
import LunarService from '../../../services/LunarService';

export default defineComponent({
  name: 'DateViewSub',
  components: {
    Sidebar,
    Tag,
  },
  props: {
    visibleFullDateView: Boolean,
    date: Date,
    weather: Object,
  },
  emits: [
    'update:visibleFullDateView',
  ],
  data() {
    return {
      sidebarVisible: false,
      lunarData: {
        nongliString: '',
        ganzhi: [''],
        yangliString: '',
        yi: [''],
        ji: [''],
      },
    };
  },
  watch: {
    visibleFullDateView(): void {
      this.sidebarVisible = this.visibleFullDateView;
    },
    date(): void {
      const lunarService = new LunarService(this.date);
    this.lunarData =  lunarService.getDateViewDate();
    },
  },
  methods: {
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "~/styles/default.scss";

.border {
  height: 600px;
}
.nongliString {
  display: flex;
  /*实现垂直居中*/
  align-items: center;
  margin: 0 auto;
  width: 2.5rem;
  font-size: 2.5em;
  color: #000;
}

.onecn {
  display: flex;
  /*实现垂直居中*/
  align-items: center;
  font-size: 1.4em;
}

@media screen and (max-width: $lg) {
  ::v-deep(.fc-header-toolbar) {
    display: flex;
    flex-wrap: wrap;
  }
}

</style>
