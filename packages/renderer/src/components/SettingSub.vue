<template>
  <n-drawer-content
    title="设置"
    closable
  >
    <n-tabs
      default-value="normalSetting"
      size="large"
    >
      <n-tab-pane
        name="normalSetting"
        tab="通用设置"
      >
        <n-space vertical>
          <h4>获取节假日</h4>
          <n-switch
            v-model:value="inputSwitchFestivalsModel"
            size="large"
            @update-value="updateFestivalsModel"
          />
          <h4>获取天气预报</h4>
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
        </n-space>
      </n-tab-pane>
      <n-tab-pane
        name="menuSetting"
        tab="菜单栏设置"
      >
        <n-space vertical>
          <h4>显示节假日(农历)</h4>
          <n-switch
            v-model:value="trayFestivalsModel"
            size="large"
            @update-value="updateTraySetting"
          />
          <h4>显示天气预报</h4>
          <n-switch
            v-model:value="trayWeatherModel"
            size="large"
            @update-value="updateTraySetting"
          />
          <h4>显示星期</h4>
          <n-switch
            v-model:value="trayWeekModel"
            size="large"
            @update-value="updateTraySetting"
          />
          <h4>显示秒钟</h4>
          <n-switch
            v-model:value="traySecondsModel"
            size="large"
            @update-value="updateTraySetting"
          />
        </n-space>
      </n-tab-pane>
      <n-tab-pane
        name="focusSetting"
        tab="专注设置"
      >
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
      </n-tab-pane>
    </n-tabs>
  </n-drawer-content>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import { useStore } from '/@/store';
import { NDrawerContent, NTabs, NTabPane, NSpace, NSwitch, NInputNumber, NButton, NIcon, NSlider } from 'naive-ui';
import { CaretRight as CaretRightIcon } from '@vicons/fa';

export default defineComponent({
  name: 'SettingSub',
  components: {
    NDrawerContent,
    NTabs,
    NTabPane,
    NSpace,
    NSwitch,
    NInputNumber,
    NButton,
    NIcon,
    CaretRightIcon,
    NSlider,
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
      trayFestivalsModel: false,
      trayWeatherModel: false,
      trayWeekModel: false,
      traySecondsModel: false,
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
    updateTraySetting(): void {
      window.electron.ipcRenderer.send('updateTraySetting', {
        trayFestivalsModel: this.trayFestivalsModel,
        trayWeatherModel: this.trayWeatherModel,
        trayWeekModel: this.trayWeekModel,
        traySecondsModel: this.traySecondsModel,
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
