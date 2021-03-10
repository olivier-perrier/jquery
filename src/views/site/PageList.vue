
<template>
  <div class="container py-3">
    <h1 class="py-3">{{customTypeName | capitalize}}</h1>
    <div v-for="post in this.posts" :key="post._id" class="row row-cols-1 row-cols-md-2">
      <div class="col mb-4">
        <div class="card">
          <img :src="post.img" class="card-img-top" :alt="post.img" />
          <div class="card-body">
            <h2>
              <router-link :to="'/' + customTypeName + '/' + post._id">{{post.title || "-" }}</router-link>
            </h2>
            <p class="card-text">{{post.content | striphtml | truncate(400)}}</p>
          </div>
        </div>
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
      posts: []
    };
  },
  methods: {
    mountPosts: function() {
      axios
        .get("http://localhost:3000/API/public/post/pages")
        .then(response => {
          this.posts = response.data.posts;
        });
    }
  },
  mounted() {
    this.mountPosts();
  },
  watch: {
    $route() {
      this.mountPosts();
    }
  }
};
</script>
