<template>
  <div class="c-container">
    <div class="topic">
      <input @change="serch()" class="serch" type="text" placeholder="キーワードで検索" v-model="keyword" />
      <i v-if="orderDirection" class="far fa-caret-square-down order-icon" @click="toOldestSort()"></i>
      <i v-else class="far fa-caret-square-up order-icon" @click="toLatestSort()"></i>
      <i class="far fa-star star-icon" @click="starSort()"></i>
      <i v-if="starSorted" class="fas fa-star bg-star-icon"></i>
    </div>
    <div v-if="this.posts.length !== 0" class="card-container">
      <div class="card" v-for="(post, index) in this.posts" :key="index" @click="showText(index)">
        <div class="tweet-card">
          <i class="shortcat-copy far fa-copy" @click="copy(index)"></i>
          <i v-if="post.liked" class="fas fa-star sub-star-icon"></i>
          <div class="card-tittle">{{ post.tittle }}</div>
          <div class="card-text">{{ post.text }}</div>
        </div>
      </div>
    </div>
    <div v-else class="explain-container"></div>
  </div>
</template>

<script>
import db from "@/firebase.js";
import store from "@/store";
import firebase from "firebase";

export default {
  data: function() {
    return {
      serched: false,
      orderDirection: false,
      starSorted: false,
      keyword: ""
    };
  },
  methods: {
    showText: function(index) {
      const id = index + 1;
      store.commit("setPost", this.posts[index]);
      store.commit("setRoom", id);
    },
    setRoom(id) {
      store.commit("setPost", this.posts[id - 1]);
      store.commit("setRoom", id);
    },
    copy(index) {
      let str = this.posts[index].text;
      let listener = function(e) {
        e.clipboardData.setData("text/plain", str);
        // 本来のイベントをキャンセル
        e.preventDefault();
        // 終わったら一応削除
        document.removeEventListener("copy", listener);
      };
      // コピーのイベントが発生したときに、クリップボードに書き込むようにしておく
      document.addEventListener("copy", listener);
      // コピー
      document.execCommand("copy");
      this.$toasted.success("クリップボードにコピーしました！");
    },
    serch() {
      let posts = [];
      if (this.keyword !== "") {
        for (let i in this.$store.state.posts) {
          let post = this.$store.state.posts[i];
          if (
            post.tittle.indexOf(this.keyword) !== -1 ||
            post.text.indexOf(this.keyword) !== -1
          ) {
            posts.push(post);
          }
        }
        this.serched = true;
      } else {
        for (let j in this.$store.state.posts) {
          let post = this.$store.state.posts[j];
          if (
            post.tittle.indexOf(this.keyword) !== -1 ||
            post.text.indexOf(this.keyword) !== -1
          ) {
            posts.push(post);
          }
        }
        this.serched = false;
      }
      store.commit("setDisplayPosts", posts);
    },
    toLatestSort() {
      //配列の複製
      let posts = [];
      for (let i in this.$store.state.posts) {
        let post = this.$store.state.posts[i];
        posts.push(post);
      }
      //ソート
      posts.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
      this.orderDirection = !this.orderDirection;
      store.commit("setPost", posts);
      store.commit("setDisplayPosts", posts);
    },
    toOldestSort() {
      //配列の複製
      let posts = [];
      for (let i in this.$store.state.posts) {
        let post = this.$store.state.posts[i];
        posts.push(post);
      }
      //ソート
      posts.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
      this.orderDirection = !this.orderDirection;
      store.commit("setPost", posts);
      store.commit("setDisplayPosts", posts);
    },
    starSort() {
      let posts = [];
      if (!this.starSorted) {
        if (this.keyword !== "") {
          for (let i in this.$store.state.posts) {
            let post = this.$store.state.posts[i];
            if (post.liked == true) {
              posts.push(post);
            }
          }
        }
      } else {
        posts = this.$store.state.posts;
      }
      store.commit("setDisplayPosts", posts);
      this.starSorted = !this.starSorted;
    },
    toast: function(msg) {
      // main.jsで読み込んだので this.$toasted で呼び出せる
      this.$toasted.error(msg);
    }
  },
  computed: {
    posts: function() {
      return this.$store.state.displayposts;
    }
  },
  created() {
    let user = firebase.auth().currentUser;
    let uid = user.uid;
    const ref = db
      .collection("users")
      .doc(uid)
      .collection("posts")
      .orderBy("createdAt");
    this.unsubscribe = ref.onSnapshot(snapshot => {
      let posts = [];
      snapshot.forEach(doc => {
        const post = {
          docid: doc.id,
          tittle: doc.data().tittle,
          text: doc.data().text.replace(/<br>/g, "\n"),
          liked: doc.data().liked,
          createdAt: doc.data().createdAt
        };
        posts.push(post);
      });
      const pushposts = posts.reverse();

      store.commit("setPosts", pushposts);
      store.commit("setDisplayPosts", pushposts);
    });
  },
  destroyed() {
    this.unsubscribe();
    this.unsubscribe = null;
  }
};
</script>

<style scoped>
.order-icon {
  font-size: 150%;
  position: fixed;
  transform: translate(-50%, -50%);
  top: 7%;
  left: 40%;
  z-index: 10;
}
.order-icon:hover {
  color: #e64e40;
}
.star-icon {
  font-size: 130%;
  position: fixed;
  transform: translate(-50%, -50%);
  top: 7%;
  left: 43%;
  z-index: 10;
}
.star-icon:hover {
  color: #e64e40;
}
.shortcat-copy {
  font-size: 120%;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 107%;
  left: 93%;
  z-index: 1;
}
.shortcat-copy:hover {
  color: #e64e40;
}
.bg-star-icon {
  font-size: 130%;
  position: fixed;
  transform: translate(-50%, -50%);
  top: 7%;
  left: 43%;
  z-index: 1;
  color: #fbd54a;
}
.sub-star-icon {
  font-size: 130%;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 10%;
  left: 93%;
  z-index: 1;
  color: #fbd54a;
}
</style>
