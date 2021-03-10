<template>
  <div class="my-0">
    <h1 class="m-4">{{customTypeName | capitalize}}</h1>
    <article v-for="post in posts" :key="post._id" class="mb-3">
      <header></header>

      <div class="card">
        <div class="card-body">
          <h5 class="card-title">
            <router-link :to="'/' + customTypeName + '/' + post._id">{{post.title || "-" }}</router-link>
          </h5>

          <p class="card-text">{{post.content | striphtml}}</p>

          <p class="card-text">
            <small class="text-muted">{{post.createdAt}}</small>
          </p>

          <div class="d-flex justify-content-between">
            <router-link :to="'posts?categories='+ post.categories">{{post.categories}}</router-link>
            <router-link :to="'posts?tags='+ post.tags">{{post.tags}}</router-link>
          </div>
          <router-link :to="'/users='+ post.authorId._id">Ecrit par {{post.authorId.firstname}}</router-link>
        </div>
      </div>

      <footer></footer>
    </article>
  </div>
</template>

<script>
import axios from "axios";

// @ is an alias to /src

export default {
  name: "posts",
  components: {},
  data: function() {
    return {
      customTypeName: "",
      posts: []
    };
  },
  methods: {
    mountPosts: function() {
      this.customTypeName = this.$route.params.customTypeName;

      // Récupère la query dans l'url
      var query = this.$route.query.query
      // var sort = this.$route.query.sort

      axios
        .get("http://localhost:3000/API/public/post/" + this.customTypeName + "?query=" + query)
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
