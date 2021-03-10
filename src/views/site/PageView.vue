
<template>
  <div class="container py-3">
    <div class="card">
      <img :src="post.img" class="card-img-top" :alt="post.img" />
      <div class="card-body">
        <h1>
          <router-link :to="'/' + customTypeName + '/' + post._id">{{post.title || "-" }}</router-link>
        </h1>
        <p v-html="post.content" class="card-text"></p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Page",
  components: {},
  data: function() {
    return {
      customTypeName: "pages",
      post: {}
    };
  },
  methods: {
    mountPost: function() {
      var postId = this.$route.params.postId;

      axios
        .get("http://localhost:3000/API/public/post/pages/" + postId)
        .then(response => {
          this.post = response.data.post;
        });
    }
  },
  mounted() {
    this.mountPost();
  },
  watch: {
    $route() {
      this.mountPosts();
    }
  }
};
</script>
