<template>
  <div class="login">
    <!-- pc tablet -->
    <div class="tablet">
      <div class="holder">
        <div class="site-title">QuickPaste</div>
        <div class="login-text">いつもの言葉を、もっと手軽に</div>
        <!-- <div class="login-card" @click="googleLogin()">
          <img src="../assets/google_logo.png" class="google-logo" />
          <span class="login-text">Login with Google</span>
        </div>-->
        <div class="signup-card">
          <span class="signup-text" @click="signup()">Login with Google</span>
        </div>
      </div>
      <div class="area">
        <ul class="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
    <!-- iphone -->
    <div class="ios">
      <div class="holder">
        <div class="site-title">QuickPaste</div>
        <div class="dl-card">
          <span class="dl-text" @click="showappstore()">Download a Application</span>
        </div>
      </div>
      <div class="area">
        <ul class="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import router from "../router";
import firebase from "firebase";
import db from "@/firebase.js";
import store from "@/store";

export default {
  name: "Signin",
  data: function() {
    return {
      errorMessage: ""
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      //下のif文の条件はユーザーがログインしているかどうか
      //store内の user が
      //firebase.auth().onAuthStateChangedメソッドで帰ってくる
      //user情報と一致しているかも検証しないといけない
      if (user) {
        let uid = user.uid;
        let self = this;
        db.collection("users")
          .doc(uid)
          .get()
          .then(function(doc) {
            if (doc.exists) {
              // store.commit("isSignin", true);
              router.push("/");
            } else {
              router.push("/signin").catch(err => {
                self.errorMessage = err;
              });
            }
          });
      } else {
        router.push("/signin").catch(err => {
          self.errorMessage = err;
        });
      }
    });
  },
  components: {},
  methods: {
    signup: function() {
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(function() {
          const provider = new firebase.auth.GoogleAuthProvider();
          firebase.auth().signInWithPopup(provider);

          firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              let name = user.displayName;
              let email = user.email;
              let photoUrl = user.photoURL;
              let uid = user.uid;
              db.collection("users")
                .doc(uid)
                .get()
                .then(function(doc) {
                  if (doc.exists) {
                    store.commit("isSignin", true);
                    router.push("/");
                  } else {
                    db.collection("users")
                      .doc(uid)
                      .set({
                        name: name,
                        email: email,
                        id: uid,
                        photoURL: photoUrl,
                        posts: []
                      });
                    router.push("/");
                  }
                });
            }
          });
        });
    },
    showappstore: function() {
      alert("アプリ版は現在開発中です！");
    }
  }
};
</script>

<style scoped>
@media screen and (max-width: 639px) {
  .pc {
    display: none;
  }
  .tablet {
    display: none;
  }
  /*スマホ用のcssを記述*/
  .holder {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    min-height: 40%; /* コンテナの高さ、ユニットとは無関係 */
    z-index: 1;
    background-color: #ffffff;
    border-radius: 50px;
    margin: 0 0 0% 0;
  }
  .site-title {
    font-family: "Amatic SC", cursive;
    color: #858585;
    font-size: 400%;
    z-index: 4;
    top: 23%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
  }
  .dl-card {
    z-index: 5;
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    height: 15%;
    background: #ffffff;
    font-family: "Noto Sans JP", sans-serif;
    color: #a3a3a3;
    border: solid 1px #a3a3a3;
    font-size: 100%;
    border-radius: 100px;
    /* line-height: 50px; */
  }
  .dl-card:hover {
    background: #5da0b4;
    color: #ffffff;
  }
  .dl-text {
    font-size: 80%;
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    z-index: 3;
    width: 100%;
    height: 100%;
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center; /* 縦方向中央揃え（Safari用） */
    align-items: center; /* 縦方向中央揃え */
    -webkit-justify-content: center; /* 横方向中央揃え（Safari用） */
    justify-content: center; /* 横方向中央揃え */
  }
  .google-logo {
    position: absolute;
    z-index: 3;
    width: 8%;
    height: 45%;
    top: 25%;
    left: 10%;
    background-color: #ffffff;
    border-radius: 10px;
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center; /* 縦方向中央揃え（Safari用） */
    align-items: center; /* 縦方向中央揃え */
    -webkit-justify-content: center; /* 横方向中央揃え（Safari用） */
    justify-content: center; /* 横方向中央揃え */
  }
  .horizon-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .horizon {
    height: 3px;
    background-color: #000000;
    width: 50%;
    border: none;
    z-index: 5;
    border-radius: 100px;
  }
  .signup-card {
    z-index: 5;
    width: 50%;
    height: 8%;
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ffffff;
    font-family: "Noto Sans JP", sans-serif;
    color: #a3a3a3;
    border: solid 1px #a3a3a3;
    font-size: 100%;
    border-radius: 100px;
  }
  .signup-card:hover {
    background: #5da0b4;
    color: #ffffff;
  }
  .signup-text {
    font-size: 80%;
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    z-index: 3;
    width: 100%;
    height: 100%;
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center; /* 縦方向中央揃え（Safari用） */
    align-items: center; /* 縦方向中央揃え */
    -webkit-justify-content: center; /* 横方向中央揃え（Safari用） */
    justify-content: center; /* 横方向中央揃え */
  }
  .cover {
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: black;
    opacity: 0.7;
    z-index: 1;
  }
  .f-img-container {
    top: 10%;
    left: 15%;
    width: 70%;
    height: 80%;
    position: fixed;
    z-index: 2;
  }
  /* 背景 */
  @import url("https://fonts.googleapis.com/css?family=Exo:400,700");

  .context h1 {
    text-align: center;
    color: #fff;
    font-size: 50px;
  }

  .area {
    background: #a3a3a3;
    /* background: -webkit-linear-gradient(to left, #8f94fb, #4e54c8); */
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    position: fixed;
  }

  .circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .circles li {
    position: absolute;
    display: block;
    list-style: none;
    width: 20px;
    height: 20px;
    background: #cfcfdb;
    animation: animate 25s linear infinite;
    bottom: -150px;
  }

  .circles li:nth-child(1) {
    left: 25%;
    width: 80px;
    height: 80px;
    animation-delay: 0s;
  }

  .circles li:nth-child(2) {
    left: 10%;
    width: 20px;
    height: 20px;
    animation-delay: 2s;
    animation-duration: 12s;
  }

  .circles li:nth-child(3) {
    left: 70%;
    width: 20px;
    height: 20px;
    animation-delay: 4s;
  }

  .circles li:nth-child(4) {
    left: 40%;
    width: 60px;
    height: 60px;
    animation-delay: 0s;
    animation-duration: 18s;
  }

  .circles li:nth-child(5) {
    left: 65%;
    width: 20px;
    height: 20px;
    animation-delay: 0s;
  }

  .circles li:nth-child(6) {
    left: 75%;
    width: 110px;
    height: 110px;
    animation-delay: 3s;
  }

  .circles li:nth-child(7) {
    left: 35%;
    width: 150px;
    height: 150px;
    animation-delay: 7s;
  }

  .circles li:nth-child(8) {
    left: 50%;
    width: 25px;
    height: 25px;
    animation-delay: 15s;
    animation-duration: 45s;
  }

  .circles li:nth-child(9) {
    left: 20%;
    width: 15px;
    height: 15px;
    animation-delay: 2s;
    animation-duration: 35s;
  }

  .circles li:nth-child(10) {
    left: 85%;
    width: 150px;
    height: 150px;
    animation-delay: 0s;
    animation-duration: 11s;
  }

  @keyframes animate {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
      border-radius: 5%;
    }

    70% {
      transform: translateY(-700px) rotate(650deg);
      opacity: 0.8;
      border-radius: 90%;
    }

    100% {
      transform: translateY(-1000px) rotate(720deg);
      opacity: 0;
      border-radius: 100%;
    }
  }
}

@media only screen and (min-width: 640px) and (max-width: 1500px) {
  .pc {
    display: none;
  }
  .ios {
    display: none;
  }
  /*tablet用のcssを記述*/
  .holder {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 630px;
    min-height: 60vh; /* コンテナの高さ、ユニットとは無関係 */
    z-index: 1;
    background-color: #ffffff;
    border-radius: 50px;
    margin: 0 0 0% 0;
  }
  .site-title {
    font-family: "Amatic SC", cursive;
    color: #858585;
    font-size: 500%;
    z-index: 4;
    top: 23%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
  }
  .login-card {
    z-index: 5;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40%;
    height: 8%;
    background: #ffffff;
    font-family: "Noto Sans JP", sans-serif;
    color: #a3a3a3;
    border: solid 1px #a3a3a3;
    font-size: 100%;
    border-radius: 100px;
    /* line-height: 50px; */
  }
  .login-card:hover {
    background: #5da0b4;
    color: #ffffff;
  }
  .login-text {
    font-size: 160%;
    color: #817f7f;
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    z-index: 3;
    width: 100%;
    height: 100%;
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center; /* 縦方向中央揃え（Safari用） */
    align-items: center; /* 縦方向中央揃え */
    -webkit-justify-content: center; /* 横方向中央揃え（Safari用） */
    justify-content: center; /* 横方向中央揃え */
  }
  .google-logo {
    position: absolute;
    z-index: 3;
    width: 8%;
    height: 45%;
    top: 25%;
    left: 10%;
    background-color: #ffffff;
    border-radius: 10px;
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center; /* 縦方向中央揃え（Safari用） */
    align-items: center; /* 縦方向中央揃え */
    -webkit-justify-content: center; /* 横方向中央揃え（Safari用） */
    justify-content: center; /* 横方向中央揃え */
  }
  .horizon-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .horizon {
    height: 3px;
    background-color: #000000;
    width: 50%;
    border: none;
    z-index: 5;
    border-radius: 100px;
  }
  .signup-card {
    z-index: 5;
    width: 40%;
    height: 8%;
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ffffff;
    font-family: "Noto Sans JP", sans-serif;
    color: #a3a3a3;
    border: solid 1px #a3a3a3;
    font-size: 100%;
    border-radius: 100px;
  }
  .signup-card:hover {
    background: #5da0b4;
    color: #ffffff;
  }
  .signup-text {
    font-size: 90%;
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    z-index: 3;
    width: 100%;
    height: 100%;
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center; /* 縦方向中央揃え（Safari用） */
    align-items: center; /* 縦方向中央揃え */
    -webkit-justify-content: center; /* 横方向中央揃え（Safari用） */
    justify-content: center; /* 横方向中央揃え */
  }
  .cover {
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: black;
    opacity: 0.7;
    z-index: 1;
  }
  .f-img-container {
    top: 10%;
    left: 15%;
    width: 70%;
    height: 80%;
    position: fixed;
    z-index: 2;
  }
  /* 背景 */
  @import url("https://fonts.googleapis.com/css?family=Exo:400,700");

  .context h1 {
    text-align: center;
    color: #fff;
    font-size: 50px;
  }

  .area {
    background: #a3a3a3;
    /* background: -webkit-linear-gradient(to left, #8f94fb, #4e54c8); */
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    position: fixed;
  }

  .circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .circles li {
    position: absolute;
    display: block;
    list-style: none;
    width: 20px;
    height: 20px;
    background: #cfcfdb;
    animation: animate 25s linear infinite;
    bottom: -150px;
  }

  .circles li:nth-child(1) {
    left: 25%;
    width: 80px;
    height: 80px;
    animation-delay: 0s;
  }

  .circles li:nth-child(2) {
    left: 10%;
    width: 20px;
    height: 20px;
    animation-delay: 2s;
    animation-duration: 12s;
  }

  .circles li:nth-child(3) {
    left: 70%;
    width: 20px;
    height: 20px;
    animation-delay: 4s;
  }

  .circles li:nth-child(4) {
    left: 40%;
    width: 60px;
    height: 60px;
    animation-delay: 0s;
    animation-duration: 18s;
  }

  .circles li:nth-child(5) {
    left: 65%;
    width: 20px;
    height: 20px;
    animation-delay: 0s;
  }

  .circles li:nth-child(6) {
    left: 75%;
    width: 110px;
    height: 110px;
    animation-delay: 3s;
  }

  .circles li:nth-child(7) {
    left: 35%;
    width: 150px;
    height: 150px;
    animation-delay: 7s;
  }

  .circles li:nth-child(8) {
    left: 50%;
    width: 25px;
    height: 25px;
    animation-delay: 15s;
    animation-duration: 45s;
  }

  .circles li:nth-child(9) {
    left: 20%;
    width: 15px;
    height: 15px;
    animation-delay: 2s;
    animation-duration: 35s;
  }

  .circles li:nth-child(10) {
    left: 85%;
    width: 150px;
    height: 150px;
    animation-delay: 0s;
    animation-duration: 11s;
  }

  @keyframes animate {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
      border-radius: 5%;
    }

    70% {
      transform: translateY(-700px) rotate(650deg);
      opacity: 0.8;
      border-radius: 90%;
    }

    100% {
      transform: translateY(-1000px) rotate(720deg);
      opacity: 0;
      border-radius: 100%;
    }
  }
}

@media screen and (min-width: 15001px) {
  .tablet {
    display: none;
  }
  .ios {
    display: none;
  }
  /*pc用のcssを記述*/
  .site-title {
    font-family: "Amatic SC", cursive;
    color: #ffffff;
    font-size: 80px;
    z-index: 3;
    top: 35%;
    left: 18.5%;
    position: fixed;
  }
  .login-card {
    z-index: 5;
    position: relative;
    width: 25%;
    height: 8%;
    top: 27%;
    left: 34%;
    background: #ffffff;
    font-family: "Noto Sans JP", sans-serif;
    color: #a3a3a3;
    font-size: 18px;
    border-radius: 100px;
    line-height: 50px;
  }
  .login-card:hover {
    background: #5da0b4;
    color: #ffffff;
  }
  .login-text {
    position: absolute;
    z-index: 3;
    top: 0%;
    left: 27%;
  }
  .google-logo {
    position: absolute;
    z-index: 3;
    width: 8%;
    height: 45%;
    top: 25%;
    left: 10%;
    background-color: #ffffff;
    border-radius: 10px;
  }
  .horizon-container {
    top: 30%;
    left: -3%;
    z-index: 5;
    position: relative;
  }
  .horizon {
    height: 3px;
    background-color: #e8e8e8;
    width: 32%;
    border: none;
    z-index: 5;
    border-radius: 100px;
  }
  .signup-card {
    z-index: 5;
    position: relative;
    width: 25%;
    height: 8%;
    top: 33%;
    left: 34%;
    background: #ffffff;
    font-family: "Noto Sans JP", sans-serif;
    color: #a3a3a3;
    font-size: 18px;
    border-radius: 100px;
    line-height: 50px;
  }
  .signup-card:hover {
    background: #5da0b4;
    color: #ffffff;
  }
  .signup-text {
    position: absolute;
    z-index: 3;
    top: 0%;
    left: 18%;
  }
  .img-container {
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: -1;
  }
  img {
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  .b-img-container {
    top: -6.5%;
    left: 0%;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 0;
  }
  .back-img {
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
  .cover {
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: black;
    opacity: 0.5;
    z-index: 1;
  }
  .f-img-container {
    top: 10%;
    left: 15%;
    width: 70%;
    height: 80%;
    position: fixed;
    z-index: 2;
  }
  .front-img {
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    z-index: 0;
    position: absolute;
    border-radius: 30px;
  }
}
</style>
