import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Tooltip } from 'bootstrap'

const app = createApp(App)
app.use(router)
app.mount('#app')

app.directive('tooltip', function(el, binding){
    return new Tooltip(el, {
        placement: binding.arg as any,
        title: binding.value,
        html: true
    });
});