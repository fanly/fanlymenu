<template>
  <n-drawer-content
    title="设置"
    closable
  >
    <n-space vertical>
      <h4>显示节假日</h4>
      <n-switch
        v-model:value="inputSwitchFestivalsModel"
        size="large"
        @update-value="updateFestivalsModel"
      />
      <h4>显示天气预报</h4>
      <n-switch
        v-model:value="inputSwitchWeatherModel"
        size="large"
        @update-value="updateWeatherModel"
      />
      <n-space
        v-if="inputSwitchWeatherModel"
        inline
      >
        <n-input-number
          v-model:value="longitude"
          :min="-180"
          :max="180"
          :show-button="false"
          placeholder="经度"
          @update:value="changeLocalLocation"
        />
        <n-input-number
          v-model:value="latitude"
          :min="-90"
          :max="90"
          :show-button="false"
          placeholder="纬度"
          @update:value="changeLocalLocation"
        />
      </n-space>
      <n-divider dashed>
        专注设置
      </n-divider>
      <n-space vertical>
        <n-slider
          v-model:value="focus_time"
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
      </n-space>
    </n-space>
  </n-drawer-content>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import { useStore } from '/@/store';
import { NDrawerContent, NSpace, NSwitch, NInputNumber, NButton, NIcon, NSlider, NDivider } from 'naive-ui';
import { CaretRight as CaretRightIcon } from '@vicons/fa';

export default defineComponent({
  name: 'SettingSub',
  components: {
    NDrawerContent,
    NSpace,
    NSwitch,
    NInputNumber,
    NButton,
    NIcon,
    CaretRightIcon,
    NSlider,
    NDivider,
  },
  props: {
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
      inputSwitchFestivalsModel: this.changeShowFestivals,
      inputSwitchWeatherModel: this.changeShowWeather,
      longitude: this.location?.longitude,
      latitude: this.location?.latitude,
      focus_time: 40,
    };
  },
  computed: {
    // 计算属性的 getter
    focusLabel(): string {
      return '开始专注' + this.focus_time + '分钟';
    },
  },
  mounted() {
    this.focus_time = this.store.state.focusTime;
  },
  methods: {
    updateFestivalsModel(value: boolean): void {
      this.$emit('update:changeShowFestivals', value);
    },
    updateWeatherModel(value: boolean): void {
      this.$emit('update:changeShowWeather', value);
    },
    changeLocalLocation(): void {
      this.$emit('update:location', {
        'longitude': this.longitude,
        'latitude': this.latitude,
      });
    },
    focus(): void {
      this.store.commit('changeFocusTime', this.focus_time);
      this.$emit('focusClick');
      window.electron.ipcRenderer.send('show-focus-window');
    },
  },
});
</script>
