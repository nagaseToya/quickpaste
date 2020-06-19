import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Signin from "../views/Login.vue";
// import store from "@/store";
import firebase from "firebase";
import db from "@/firebase.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
];

const router = new VueRouter({
  routes,
});

router.beforeResolve((to, from, next) => {
  if (to.path == "/signin") {
    next();
  } else {
    var user = firebase.auth().currentUser;
    if (user != null) {
      var uid = user.uid;
      db.collection("users")
        .doc(uid)
        .get()
        .then(function(doc) {
          if (doc.exists) {
            // store.commit("isSignin", true);
            next();
          } else {
            router.push("/signin");
          }
        });
    } else {
      router.push("/signin");
    }
  }
});

export default router;
