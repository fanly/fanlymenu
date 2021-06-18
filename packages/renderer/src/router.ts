import {createRouter, createWebHashHistory} from 'vue-router';
import Home from '/@/components/FullCalendarMain.vue';
import FocusViewSub from '/@/components/FocusViewSub.vue';

const routes = [
  {path: '/', name: 'Home', component: Home },
  {path: '/focus', name: 'FocusViewSub', component: FocusViewSub },
  {path: '/about', name: 'About', component: () => import('/@/components/About.vue')}, // Lazy load route component
];

export default createRouter({
  routes,
  history: createWebHashHistory(),
});
