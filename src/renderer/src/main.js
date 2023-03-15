import { createApp } from 'vue'
import App from './App.vue'
import components from './components/components.lib'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

components.forEach((component) => {
  app.component(component.name, component)
})

app.use(pinia).mount('#app')
