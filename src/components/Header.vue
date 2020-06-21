<template>
  <header>
    <div
      style="font-family: 'Amatic SC', cursive;
                color:#ffffff;
                font-size:70px;
                margin-top:10%;
    "
    >
      QuickPaste
    </div>
    <div class="addCard" @click="setRoom(0)">新規保存</div>
    <div class="shorten" @click="shorten()">URL短縮水産</div>
    <div class="shorten-cantainer">
      <input v-model="longUrl" type="text" />
      <button @click="shorten()">短縮</button>
      <div>{{ shortenUrl }}</div>
      <button @click="copy()">コピー</button>
    </div>
    <div class="user-info-container" @click="signOut()">ログアウト</div>
  </header>
</template>

<script>
import firebase from "firebase";
import store from "@/store";
import router from "../router";

export default {
  data: function() {
    return { longUrl: "https://mae.chab.in/archives/2495", shortenUrl: "url" };
  },
  methods: {
    setRoom(id) {
      store.commit("setTittle", "");
      store.commit("setText", "");
      store.commit("setRoom", id);
    },
    shorten() {
      // store.commit("setTittle", "");
      // store.commit("setText", "");
      // store.commit("setRoom", -1);
      let longurl = encodeURIComponent(this.longUrl);
      let OAUTH_TOKEN = "8792769d806d58eaaa2e53740e47fb556534ae52";
      let endpoint =
        "https://api-ssl.bitly.com/v3/shorten?access_token=" +
        OAUTH_TOKEN +
        "&longUrl=" +
        longurl;
      this.$axios
        .get(endpoint)
        .then((response) => {
          this.shortenUrl = response.data.data.url;
        })
        .catch((e) => {
          alert(e);
        });
    },
    copy() {
      let text = this.shortenUrl;
      let listener = function(e) {
        e.clipboardData.setData("text/plain", text);
        // 本来のイベントをキャンセル
        e.preventDefault();
        // 終わったら一応削除
        document.removeEventListener("copy", listener);
      };
      // コピーのイベントが発生したときに、クリップボードに書き込むようにしておく
      document.addEventListener("copy", listener);
      // コピー
      document.execCommand("copy");
    },
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(function() {
          router.push("/signin");
        })
        .catch((error) => {
          this.catch = error;
          router.push("/");
        });
    },
  },
};
</script>

<style scoped>
.shorten-cantainer {
  width: 18%;
  height: 20%;
  top: 33.5%;
  left: 1%;
  background: #f2f2f2;
  position: fixed; /* 位置指定の基準点にする */
  font-family: "Noto Sans JP", sans-serif;
  font-size: 18px;
  border-radius: 0px 0px 20px 20px;
  line-height: 30px;
  font-family: "Noto Sans JP", sans-serif;
}
</style>
