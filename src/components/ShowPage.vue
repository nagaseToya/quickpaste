<template>
  <div class="c-showpage">
    <div class="text-holder" v-if="this.roomid == -1">
      <div>
        <div class="showtittle">開発者へメッセージ</div>
        <div class="dev-text-container" style="background-color:#f2f2f2;">
          <textarea
            v-model="text"
            class="dev textlines"
            placeholder="使いずらかったポイントを教えてくれると嬉しいです！"
          ></textarea>
          <div class="submit" @click="message()">送信</div>
        </div>
      </div>
    </div>
    <div class="text-holder" v-else-if="this.roomid == 0">
      <div>
        <div class="showtittle">新規保存</div>
        <div class="text-container" style="background-color:#f2f2f2;">
          <div class="text-tittle"></div>
          <input
            v-model="tittle"
            type="text"
            class="input-tittle"
            placeholder="タイトル"
          />
          <textarea
            v-model="text"
            class="textlines"
            placeholder="保存したい文章を記入してください！"
          ></textarea>
          <i
            class="fas fa-paperclip add-icon"
            v-tooltip.top-center="'保存'"
            @click="add()"
          ></i>
        </div>
      </div>
    </div>
    <div class="i-text-holder" v-else>
      <div>
        <div class="showtittle">{{ post.tittle }}</div>
        <div class="show-text-container">
          <div class="i-text-tittle">
            <i
              class="far fa-copy copy-icon"
              v-tooltip.top-center="'コピー'"
              @click="copy()"
            ></i>
            <i
              class="far fa-trash-alt delete-icon"
              v-tooltip.top-center="'削除'"
              @click="del()"
            ></i>
            <i
              class="far fa-star star-icon"
              v-tooltip.top-center="'お気に入り'"
              @click="like"
            ></i>
            <i v-if="post.liked" class="fas fa-star bg-star-icon"></i>
            <i
              class="far fa-edit edit-icon"
              @click="edit"
              v-tooltip.top-center="'文面を編集し上書き'"
            ></i>
          </div>
          <textarea
            id="inputId"
            v-model="post.text"
            class="showtext"
            placeholder
            @change="textCheck()"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import db from "@/firebase";
import firebase from "firebase";
import store from "@/store";

export default {
  data() {
    return { tittle: "", text: "", obj: 0, newpost: {} };
  },
  methods: {
    toDefault() {
      store.commit("setTittle", "");
      store.commit("setText", "");
      store.commit("setRoom", 0);
    },
    textCheck() {
      // this.newpost = {
      //   tittle: this.showtittle,
      //   text: this.showtext
      // };
      // store.commit("setTittle", this.showtittle);
      // store.commit("setText", this.showtext);
    },
    add() {
      let user = firebase.auth().currentUser;
      let uid = user.uid;
      if (this.text != "" && this.tittle != "") {
        const post = {
          id: this.posts.length,
          tittle: this.tittle,
          text: this.text.replace(/\r?\n/g, "<br>"),
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          liked: false,
        };
        db.collection("users")
          .doc(uid)
          .collection("posts")
          .add(post)
          .then((doc) => {
            this.posts.push({
              id: doc.id,
              ...post,
            });
          });

        const ref = db
          .collection("users")
          .doc(uid)
          .collection("posts")
          .orderBy("createdAt");
        this.unsubscribe = ref.onSnapshot((snapshot) => {
          let posts = [];
          snapshot.forEach((doc) => {
            posts.push(doc.data());
          });
          this.posts = posts;
        });
        this.tittle = "";
        this.text = "";
        this.$toasted.success("追加しました！");
      } else {
        this.$toasted.error("まだ書き終わってないです😓");
      }
    },
    edit() {
      let user = firebase.auth().currentUser;
      let uid = user.uid;
      let index = this.roomid - 1;
      db.collection("users")
        .doc(uid)
        .collection("posts")
        .doc(this.posts[index].docid)
        .set({
          tittle: this.post.tittle,
          text: this.post.text,
          liked: this.post.liked,
          createdAt: this.post.createdAt,
        });
      this.$toasted.success("文章を編集しました！");
      // this.toDefault();
    },
    copy() {
      const inputId = document.getElementById("inputId");
      inputId.select();
      document.execCommand("copy");
      this.$toasted.success("クリップボードにコピーしました！");
      // this.toDefault();
    },
    del() {
      let user = firebase.auth().currentUser;
      let uid = user.uid;
      let index = this.roomid - 1;
      db.collection("users")
        .doc(uid)
        .collection("posts")
        .doc(this.posts[index].docid)
        .delete();
      this.$toasted.success("削除しました！");
      // .then(function() {
      //   alert("削除！");
      // });

      this.toDefault();
    },
    like() {
      let user = firebase.auth().currentUser;
      let uid = user.uid;
      let index = this.roomid - 1;
      db.collection("users")
        .doc(uid)
        .collection("posts")
        .doc(this.posts[index].docid)
        .set({
          tittle: this.post.tittle,
          text: this.post.text,
          liked: !this.post.liked,
          createdAt: this.post.createdAt,
        });
      const text = this.post.liked
        ? "お気に入りを外しました！"
        : "お気に入りにしました！";
      this.$toasted.success(text);
      this.toDefault();
    },
    message() {
      if (this.text != "") {
        const post = {
          id: this.posts.length,
          text: this.text.replace(/\r?\n/g, "　"),
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
        db.collection("users")
          .doc("jW7D9yu7IiY88pabMLA20NDofgE2")
          .collection("comments")
          .add(post);

        this.tittle = "";
        this.text = "";
        this.$toasted.info("コメントありがとうございます！");
        this.toDefault();
      } else {
        this.errToast("まだ書き終わってないです😓");
      }
    },
    errToast: function(msg) {
      // main.jsで読み込んだので this.$toasted で呼び出せる
      this.$toasted.error(msg);
    },
  },
  computed: {
    roomid: function() {
      return this.$store.state.roomid;
    },
    posts: function() {
      return this.$store.state.displayposts;
    },
    post: function() {
      return this.$store.state.post;
    },
  },
};
</script>

<style lang="scss" scoped>
.copy-icon {
  top: 0%;
  left: 2%;
  width: 5%;
  height: 50%;
  float: left;
  position: absolute;
  font-size: 25px;
  padding: 2%;
  margin: 0.4% 0 0 1.5%;
}
.copy-icon:hover {
  color: #e64e40;
}
.delete-icon {
  top: 0%;
  left: 10%;
  width: 5%;
  float: left;
  position: absolute;
  font-size: 25px;
  padding: 2%;
  margin: 0.4% 0 0 4%;
}
.delete-icon:hover {
  color: #e64e40;
}
.star-icon {
  top: 0%;
  left: 21%;
  width: 5%;
  float: left;
  position: absolute;
  font-size: 25px;
  padding: 2%;
  margin: 0.4% 0 0 4%;
  z-index: 1;
}
.star-icon:hover {
  color: #e64e40;
}
.bg-star-icon {
  top: 0%;
  left: 21%;
  width: 5%;
  float: left;
  position: absolute;
  font-size: 25px;
  padding: 2%;
  margin: 0.4% 0 0 4%;
  color: #fbd54a;
}
.edit-icon {
  top: 0%;
  left: 32%;
  width: 5%;
  float: left;
  position: absolute;
  font-size: 25px;
  padding: 2%;
  margin: 0.4% 0 0 4%;
  z-index: 1;
}
.edit-icon:hover {
  color: #e64e40;
}

.tooltip {
  display: block !important;
  z-index: 10000;
}
.tooltip .tooltip-inner {
  background: black;
  color: white;
  border-radius: 16px;
  padding: 5px 10px 4px;
}
.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: black;
  z-index: 1;
}
.tooltip[x-placement^="top"] {
  margin-bottom: 5px;
}
.tooltip[x-placement^="top"] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}
.tooltip[x-placement^="bottom"] {
  margin-top: 5px;
}
.tooltip[x-placement^="bottom"] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}
.tooltip[x-placement^="right"] {
  margin-left: 5px;
}
.tooltip[x-placement^="right"] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}
.tooltip[x-placement^="left"] {
  margin-right: 5px;
}
.tooltip[x-placement^="left"] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}
.tooltip.popover .popover-inner {
  background: #f9f9f9;
  color: black;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 5px 30px rgba(black, 0.1);
}
.tooltip.popover .popover-arrow {
  border-color: #f9f9f9;
}
.tooltip[aria-hidden="true"] {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.15s, visibility 0.15s;
}
.tooltip[aria-hidden="false"] {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.15s;
}
</style>
