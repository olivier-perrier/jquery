<template>
  <div class="navigation-post">
    <div class="border rounded mt-3 p-1 d-flex justify-content-between">
      <router-link
        :to="'/admin/posttypes'"
        class="btn btn-link"
      >Return</router-link>

      <div>
        <button v-on:click="save" class="btn btn-success mx-3" type="button">Save</button>
        <!-- <a href="/{{model.name}}/{{post._id}}" class="btn btn-primary mr-3">View</a> -->
        <button v-on:click="deletePost" class="btn btn-outline-danger">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "NavigationPost",
  components: {},
  props: ["post", "customType"],
  methods: {
    save: function() {
      // console.log("save : " + this.post._id)
      axios
        .put(
          "http://localhost:3000/API/posttypes/" + this.post._id,
          {
            post: this.post
          }
        )
        .then(response => {
          response.data.num;
          this.$router.push("/admin/posttypes/");
        });
    },
    deletePost: function() {
      axios
        .delete(
          "http://localhost:3000/API/posttypes/" + this.post._id
        )
        .then(response => {
          this.$router.push("/admin/posttypes/" + this.customType._id + '/posts');
          response.data.num;
        });
    }
  }
};
</script>
