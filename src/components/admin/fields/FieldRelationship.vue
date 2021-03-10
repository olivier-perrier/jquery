<template>
  <div class="form-group row">
    <label class="col-sm-2 col-form-label">{{customTypeSetting.name | capitalize}}</label>
    <div class="col-sm-10">
      <div class="input-group">
        <select v-model="post[customTypeSetting.name]" class="custom-select">
          <option
            v-for="targetPost in targetPosts"
            :key="targetPost.key"
            :value="targetPost._id"
          >{{targetPost[targetPostField]}}</option>
        </select>
        <div class="input-group-append">
          <button
            v-on:click="post[customTypeSetting.name] = null"
            type="button"
            class="btn btn-outline-secondary"
          >Clear</button>
        </div>
      </div>
      <small class="form-text text-muted">{{customTypeSetting.shemaDoc}}</small>
    </div>
  </div>
</template>



<script>
import axios from "axios";

export default {
  components: {},
  props: ["post", "customTypeSetting"],
  data: function() {
    return {
      targetPostType: {}, //this.customTypeSetting.postType,
      targetPostField: {}, //this.customTypeSetting.postField,
      postField: {}, //this.post[customTypeSetting.name]
      targetPosts: []
    };
  },
  methods: {
    getPosts() {
      // Récupération de tous les posts du type paramétré à afficher
      axios
        .get("http://localhost:3000/API/post/" + this.targetPostType)
        .then(response => {
          this.targetPosts = response.data.posts;
        });
    }
  },
  mounted() {
    this.targetPostType = this.customTypeSetting.postType;
    this.targetPostField = this.customTypeSetting.postField;
    this.postField = this.post[this.customTypeSetting.name];
    this.getPosts();
  }
};
</script>

