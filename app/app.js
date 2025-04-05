import Vue from 'nativescript-vue'
import RadSideDrawer from 'nativescript-ui-sidedrawer/vue'
import { MapboxView } from '@nativescript-community/ui-mapbox';

Vue.registerElement('MapboxView', () => MapboxView);


Vue.use(RadSideDrawer)

import App from './components/App'

Vue.config.silent = !__DEV__

new Vue({
  render: h => h(App)
}).$start()
