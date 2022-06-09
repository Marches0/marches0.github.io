import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Tooltip } from 'bootstrap'
import VueGtag from "vue-gtag";
import { NotificationService } from './services/NotificationService';

new NotificationService().start();

const app = createApp(App);
app.use(router);

if (process.env.NODE_ENV === "production") {
  app.use(VueGtag, 
  {
    config: { 
      id: "G-YL0F7L1PHH",
    },
  }, router);
}

app.mount('#app')

app.directive('tooltip', function(el, binding){
    return new Tooltip(el, {
        placement: binding.arg as any,
        title: binding.value,
        html: true
    });
});