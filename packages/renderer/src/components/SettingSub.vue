<template>
  <Sidebar
    v-model:visible="sidebarVisible"
    :base-z-index="1000"
    position="full"
    @click="$emit('update:visibleFullSetting', sidebarVisible)"
  >
    <h2>显示节假日</h2>
    <n-switch
      :default-value="inputSwitchFestivalsModel"
      size="large"
      @click="updateFestivalsModel"
    />
    <h2>显示天气预报</h2>
    <n-switch
      :default-value="inputSwitchWeatherModel"
      size="large"
      @click="updateWeatherModel"
    />
    <div
      v-show="inputSwitchWeatherModel"
      class="p-field"
    >
      <label for="location">经纬度：</label>
      <InputMask
        v-model="locationStr"
        mask="999.99,99.99"
        @complete="changeLocalLocation"
      />
    </div>
    <div
      class="p-p-4"
      style="text-align:center;"
    >
      <Knob
        v-model="focus_time"
        :step="5"
        :min="5"
        :max="120"
      />
      <n-button
        type="primary"
        size="large"
        @click="focus"
      >
        <template #icon>
          <n-icon>
            <caret-right-icon />
          </n-icon>
        </template>
        {{ focusLabel }}
      </n-button>
    </div>
  </Sidebar>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import Sidebar from 'primevue/sidebar';
import InputMask from 'primevue/inputmask';
import { NSwitch, NButton, NIcon } from 'naive-ui';
import { CaretRight as CaretRightIcon } from '@vicons/fa';
import Knob from 'primevue/knob';
import { useStore } from '/@/store';

export default defineComponent({
  name: 'SettingSub',
  components: {
    Sidebar,
    NSwitch,
    InputMask,
    NButton,
    NIcon,
    CaretRightIcon,
    Knob,
  },
  props: {
    visibleFullSetting: Boolean,
    changeShowFestivals: Boolean,
    changeShowWeather: Boolean,
    location: Object,
  },
  emits: [
    'focusClick',
    'update:visibleFullSetting',
    'update:changeShowFestivals',
    'update:changeShowWeather',
    'update:location',
  ],
  setup() {
    const store = useStore();
    return {
      store,
    };
  },
  data() {
    return {
      sidebarVisible: this.visibleFullSetting,
      inputSwitchFestivalsModel: this.changeShowFestivals,
      inputSwitchWeatherModel: this.changeShowWeather,
      locationStr: '',
      focus_time: 40,
    };
  },
  computed: {
    // 计算属性的 getter
    focusLabel(): string {
      return '开始专注' + this.focus_time + '分钟';
    },
  },
  watch: {
    visibleFullSetting(): void {
      this.sidebarVisible = this.visibleFullSetting;
    },
    location(): void {
      this.locationStr = this.location?.longitude + ',' + this.location?.latitude;
    },
  },
  mounted() {
    this.focus_time = this.store.state.focusTime;
  },
  methods: {
    updateFestivalsModel(): void {
      this.inputSwitchFestivalsModel = !this.inputSwitchFestivalsModel;
      this.$emit('update:changeShowFestivals', this.inputSwitchFestivalsModel);
    },
    updateWeatherModel(): void {
      this.inputSwitchWeatherModel = !this.inputSwitchWeatherModel;
      this.$emit('update:changeShowWeather', this.inputSwitchWeatherModel);
    },
    changeLocalLocation(): void {
      const loc = this.locationStr.split(',', 2);
      this.$emit('update:location', {
        'longitude': loc[0],
        'latitude': loc[1],
      });
    },
    focus(): void {
      this.store.commit('changeFocusTime', this.focus_time);
      this.$emit('focusClick');
      this.$emit('update:visibleFullSetting', this.sidebarVisible = false);
      window.electron.ipcRenderer.send('show-focus-window');
    },
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
