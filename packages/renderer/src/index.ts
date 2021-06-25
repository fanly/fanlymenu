import {createApp} from 'vue';
import App from '/@/App.vue';
import router from '/@/router';
import { store, key } from '/@/store';
// 等宽字体
import 'vfonts/FiraCode.css';
// 通用字体
// import 'vfonts/Lato.css'
const app = createApp(App);
app
  .use(router)
  .use(store, key);

app.mount('#app');
