<template>
  <div>
    <div class="row">
      <div class="col-md-10">
        <h2 class="m-3">{{customType.name | capitalize }}</h2>
      </div>
      <div class="col-md-2">
        <button v-on:click="createPost()" class="btn btn-light mt-3">Create</button>
      </div>
    </div>

    <table class="table">
      <col width="5%" />

      <thead>
        <tr>
          <th></th>
          <th
            v-for="customTypeSetting in customTypeSettingsToShow"
            :key="customTypeSetting._id"
          >{{customTypeSetting.name | capitalize}}</th>
        </tr>
      </thead>

      <tbody>
        <!-- Une ligne pour chaque post -->
        <tr v-for="post in posts" :key="post._id">
          <!-- Champ de suppression -->
          <td>
            <button type="button" class="btn btn-link" v-on:click="deletePost(post._id)">
              <i class="far fa-trash-alt"></i>
            </button>
          </td>

          <!-- Une valeur pour chaque paramètres du type paramétré -->
          <td
            v-for="(customTypeSetting, index) in customTypeSettingsToShow"
            :key="customTypeSetting._id"
          >
            <!-- Première colonne permet l'accès au post avec un lien -->
            <div v-if="index == 0">
              <router-link
                :to="'/admin/posts/' + post._id"
                append
              >{{post[customTypeSettings[0].name] || "-" | truncate}}</router-link>
            </div>
            <div v-else>{{post[customTypeSetting.name] | striphtml | truncate}}</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  components: {},
  data: function() {
    return {
      customType: {},
      customTypeSettings: [],
      posts: []
    };
  },
  methods: {
    createPost: function() {
      axios
        .post(
          "http://localhost:3000/API/post/create?postTypeId=" + this.customType._id,
          {}
        )
        .then(response => {
          this.posts.push(response.data.post);
          this.$router.push(
            "/admin/posts/" + response.data.post._id
          );
        });
    },
    deletePost: function(postId) {
      axios
        .delete(
          "http://localhost:3000/API/post/" + postId
        )
        .then(() => {
          var indexToDelete = this.posts.findIndex(function(value) {
            return value._id == postId;
          });
          this.posts.splice(indexToDelete, 1);
        });
    },
    mountType: function() {
      var postTypeId = this.$route.params.postTypeId;

      // Récupération du type paramétré pour l'affichage dynamique des données
      axios
        .get("http://localhost:3000/API/posttypes/" + postTypeId)
        .then(response => {
          this.customType = response.data.post;
          this.customTypeSettings = JSON.parse(this.customType.setting);

        });
    },
    mountPosts: function() {
      var postTypeId = this.$route.params.postTypeId;

      // Récupération de tous les posts du type paramétré à afficher
      axios
        .get("http://localhost:3000/API/posttypes/" + postTypeId + "/posts"  + "?sort=order")
        .then(response => {
          this.posts = response.data.posts;
        });
    }
  },
  computed: {
    customTypeSettingsToShow: function() {
      return this.customTypeSettings.filter(value => !value.hideTab == true);
    }
  },
  mounted: function() {
    this.mountType();
    this.mountPosts();
  },
  watch: {
    $route() {
      // react to route changes...

      this.mountPosts();
      this.mountType();
    }
  }
};
</script>
