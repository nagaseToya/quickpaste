import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Toasted from "vue-toasted";
import VTooltip from "v-tooltip";

Vue.use(VTooltip);

var options = {
  theme: "toasted-primary",
  position: "bottom-right",
  duration: 5000,
};

Vue.use(Toasted, options);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

// Vue.config.errorHandler = (err, vm, info) => {
//   console.log(`Captured in Vue.config.errorHandler: ${info}`, err);
// };
// window.addEventListener("error", (event) => {
//   console.log("Captured in error EventListener", event.error);
// });
// window.addEventListener("unhandledrejection", (event) => {
//   console.log("Captured in unhandledrejection EventListener", event.reason);
// });
