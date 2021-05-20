import {createApp} from 'vue';
import App from '/@/App.vue';
import router from '/@/router';
import { store, key } from '/@/store';
import * as PrimeVue from 'primevue/config';
import 'primevue/resources/themes/saga-green/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const app = createApp(App);
app.use(PrimeVue, {ripple: true}).use(router).use(store, key);

app.mount('#app');
