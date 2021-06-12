<template>
  <Dialog
    v-model:visible="eventDialogVisible"
    :modal="true"
    @click="$emit('update:visibleFullDialog', eventDialogVisible)"
  >
    <template #header>
      <h3>创建事件</h3>
    </template>
    <div class="p-fluid">
      <div class="p-field">
        <label for="eventInput">事件内容</label>
        <InputText
          id="eventInput"
          v-model="eventText"
          type="text"
        />
      </div>
    </div>
    <div class="p-fluid p-formgrid p-grid">
      <Calendar
        id="range"
        v-model="dates"
        date-format="MM d,yy"
        ::minDate="Date()"
        selection-mode="range"
        :inline="true"
      />
    </div>
    <template #footer>
      <Button
        label="取消"
        icon="pi pi-times"
        class="p-button-text"
        @click="$emit('update:visibleFullDialog', false)"
      />
      <Button
        label="确定"
        icon="pi pi-check"
        autofocus
        @click="add"
      />
    </template>
  </Dialog>
</template>

<script lang="ts">
import { ref, defineComponent} from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import EventService from '../../../services/EventService';

export default defineComponent({
  name: 'EventCreateDialog',
  components: {
    Dialog,
    Button,
    InputText,
    Calendar,
  },
  props: {
    visibleFullDialog: Boolean,
  },
  emits: [
    'focusClick',
    'update:visibleFullDialog',
  ],
  setup() {
    const eventService = ref(new EventService());
    return {
      eventService,
    };
  },
  data() {
    return {
      eventDialogVisible: this.visibleFullDialog,
      locationStr: '',
      eventText: '',
      dates: [],
    };
  },
  watch: {
    visibleFullDialog(): void {
      this.eventDialogVisible = this.visibleFullDialog;
    },
  },
  mounted() {
  },
  methods: {
    add(): void {
      const start: Date = this.dates[0];
      const end: Date = this.dates[1] == null ? this.dates[0] : this.dates[1];

      this.eventService.postEvent(this.eventText, start, end)
        .then(() => {
          this.dates = [];
          this.eventText = '';
        });
      this.$emit('update:visibleFullDialog', false);
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "~/styles/default.scss";
</style>
