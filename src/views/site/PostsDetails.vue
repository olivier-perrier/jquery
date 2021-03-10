
<template>
  <div class="py-3">
    Post view
    <div class="row">
      <div class="col-8 mb-9">
        <h1 class="p-2">{{post.title}}</h1>
        <div class="card">
          <div class="card-body">
            <p class="card-text">
            <!-- Permet l'éxecution du html -->
              <span v-html="post.content"></span>
            </p>
          </div>
        </div>
      </div>
      <div class="col-4 mb-3">
        <div class="my-5 py-1">
          <h5 class="card-title">Le {{post.createdAt | toLocaleDateString}}</h5>
          <h5 v-if="post.authorId" class="card-title">Ecrit par {{post.authorId.firstname}}</h5>
        </div>
        <p v-show="post.categories" class="card-text">Cathégories {{post.categories}}</p>
        <p v-show="post.tags" class="card-text">Tags {{post.tags}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PostsDetails",
  components: {},
  data: function() {
    return {
      customTypeName: "",
      customType: {},
      post: {}
    };
  },
  mounted() {
    this.mountPost();
    this.mountPostType();
  },
  methods: {
    mountPostType: function() {
      axios
        .get(
          "http://localhost:3000/API/public/post/customTypes/name/" +
            this.customTypeName
        )
        .then(response => {
          this.customType = response.data.post;
        });
    },
    mountPost: function() {
      this.customTypeName = this.$route.params.customTypeName;
      var postId = this.$route.params.postId;
      axios
        .get(
          "http://localhost:3000/API/public/post/" + this.customTypeName + "/" + postId
        )
        .then(response => {
          this.post = response.data.post;
        });
    }
  },
  watch: {
    $route() {
      this.mountPost();
    }
  }
};
</script>
