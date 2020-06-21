<template>
  <header>
    <div
      style="font-family: 'Amatic SC', cursive;
                color:#ffffff;
                font-size:70px;
                margin-top:10%;
    "
    >QuickPaste</div>
    <div class="addCard" @click="setRoom(0)">新規保存</div>
    <div class="shorten" @click="shorten()">開発者へメッセージ</div>
    <div class="user-info-container" @click="signOut()">ログアウト</div>
  </header>
</template>

<script>
import firebase from "firebase";
import store from "@/store";
import router from "../router";

export default {
  methods: {
    setRoom(id) {
      store.commit("setTittle", "");
      store.commit("setText", "");
      store.commit("setRoom", id);
    },
    shorten() {
      store.commit("setTittle", "");
      store.commit("setText", "");
      store.commit("setRoom", -1);
    },
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(function() {
          router.push("/signin");
        })
        .catch(error => {
          this.catch = error;
          router.push("/");
        });
    }
  }
};
</script>

<style scoped></style>
