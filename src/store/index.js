import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    roomid: 0,
    post: null,
    displayposts: [],
    currentUser: null,
    posts: [],
  },
  mutations: {
    setRoom(state, id) {
      state.roomid = id;
    },
    setPost(state, payload) {
      state.post = payload;
    },
    setPosts(state, payload) {
      state.posts = payload;
    },
    setDisplayPosts(state, payload) {
      state.displayposts = payload;
    },
    isSignin(state, payload) {
      state.currentUser = payload;
    },
  },
  // actions: {
  //   setText({ commit }) {
  //     commit("setText");
  //   }
  // }
});
