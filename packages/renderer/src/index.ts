import {createApp} from 'vue';
import App from '/@/App.vue';
import router from '/@/router';
import { store, key } from '/@/store';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import 'primevue/resources/themes/saga-green/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const app = createApp(App);
app
  .use(PrimeVue, {
    ripple: true,
    config: {
      dayNamesMin: ['一', '二', '三', '四', '五', '六', '日'],
      firstDayOfMonth: 1,
    },
  })
  .use(ToastService)
  .use(router)
  .use(store, key);

app.mount('#app');
