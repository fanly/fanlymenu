import {createApp} from 'vue';
import App from '/@/App.vue';
import router from '/@/router';
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/saga-green/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const app = createApp(App);
app.use(PrimeVue).use(router);

app.mount('#app');
