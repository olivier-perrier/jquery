
<template>
  <div class="container py-3">
    <h1 class="py-3">{{customTypeName | capitalize}}</h1>

    <div class="card-columns">
      <div v-for="post in this.posts" :key="post._id" class="card">
        <img
          v-if="post.image"
          :src="'http://localhost:3000/medias/users/'+post.image"
          class="card-img-top"
          :alt="post.image"
        />
        <img
          v-else
          :src="'http://localhost:3000/medias/users/defaultUser.png'"
          class="card-img-top"
          :alt="post.image"
        />
        <div class="card-body">
          <h5 class="card-title">
            <router-link
              :to="'/' + customTypeName + '/' + post._id"
            >{{post.firstname + " " + post.lastname || "-" }}</router-link>
          </h5>
          <p class="card-text">
            <small class="text-muted">{{post.role | capitalize}}</small>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Users",
  components: {},
  data: function() {
    return {
      customTypeName: "users",
      posts: []
    };
  },
  methods: {
    mountPosts: function() {

      axios
        .get("http://localhost:3000/API/public/post/users")
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
