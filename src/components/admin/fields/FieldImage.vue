<template>
  <div class="form-group row">
    <label class="col-sm-2 col-form-label">{{customTypeSetting.name | capitalize}}</label>
    <div class="col-sm-10">
      <div class="row">
        <div class="col-sm-3">
          <img
            v-if="post.image"
            :src="'http://localhost:3000/medias/users/' + post.image"
            alt="alt"
            width="128"
            height="128"
            class="border rounded mx-2 p-1"
          />
        </div>
        <div class="col-sm-9">
          <p>{{post.image}}</p>
          <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" />
          <br />
          <input type="button" v-on:click="submitFile()" class="btn btn-info my-3 mr-3" value="Add" />
          <input
            type="button"
            v-on:click="post[customTypeSetting.name] = ''"
            class="btn btn-outline-default"
            value="Remove"
          />
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
  props: ["post", "customTypeSetting", "customType"],
  data: function() {
    return {
      file: ""
    };
  },
  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    submitFile() {
      let formData = new FormData();

      formData.append("file", this.file);
      formData.append("postType", this.customType.name);

      axios
        .post("http://localhost:3000/API/admin/medias/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(() => {
          // Met à jour le modele du post avec le nouveau nom de l'image
          this.post[this.customTypeSetting.name] = this.file.name;
        });
    }
  }
};
</script>

