<template>
  <div>
    <!-- <h3 v-show="widget.settings.showTitle">{{widget.title || "Recent posts"}}</h3> -->
    <h3>{{widget.title || "Recent posts"}}</h3>
    <ul class="list-group">
      <router-link
        v-for="post in posts"
        :key="post._id"
        :to="'/posts/' + post._id"
        class="list-group-item list-group-item-action"
      >{{post.title}}</router-link>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "rencentPosts",
  props:["widget"],
  data: function() {
    return {
      posts: []
    };
  },
  mounted: function() {
    axios.get("http://localhost:3000/API/post/posts").then(response => {
      this.posts = response.data.posts;
    });
  }
};
</script>