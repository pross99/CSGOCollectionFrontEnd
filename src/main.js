import router from './router'
import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import App from './App.vue'
import { OhVueIcon } from 'oh-vue-icons';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueNavigationBar from 'vue-navigation-bar';
import 'vue-navigation-bar/dist/vue-navigation-bar.css';
import store from './store'

library.add(fas);

const app = createApp(App)
    .component('fa', FontAwesomeIcon)
app.component("v-icon", OhVueIcon);
app.component('vue-navigation-bar', VueNavigationBar)

app.use(router)
app.use(store)
app.use(Toast)
app.mount('#app')
