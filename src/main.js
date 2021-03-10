import Vue from 'vue'
import App from './App.vue'
import router from './router'

import axios from "axios";

Vue.config.productionTip = false

axios.defaults.withCredentials = true;

// Filters
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.filter('striphtml', function (value) {
  var div = document.createElement("div");
  div.innerHTML = value;
  var text = div.textContent || div.innerText || "";
  return text;
});

Vue.filter('truncate', function (value, length = 20) {
  if (value) {
    if (value.length > (length || 10)) {
      return value.slice(0, length) + "..."
      // return value.substring(0, length) + "..."
    } else {
      return value
    }
  } else { return "" }
});

Vue.filter('toLocaleDateString', function (value) {
  if (value) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(value).toLocaleDateString(undefined, options);
  }
});



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
