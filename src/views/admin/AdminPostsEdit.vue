<template>
  <div>
    <h2 class="m-3">Edit {{customType.name | capitalize}}</h2>

    <navigation-post :post="post" :customType="customType"></navigation-post>

    <!-- Affiche tous les champs paramétrés -->
    <div class="p-3">
      <form>
        <div v-for="customTypeSetting in customTypeSettings" :key="customTypeSetting._id">
          <component
            :is="'Field' + (customTypeSetting.type || 'String')"
            :post="post"
            :customTypeSetting="customTypeSetting"
            :customType="customType"
          ></component>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import NavigationPost from "@/components/admin/NavigationPost.vue";

import FieldCheckbox from "@/components/admin/fields/FieldCheckbox.vue";
import FieldDate from "@/components/admin/fields/FieldDate.vue";
import FieldId from "@/components/admin/fields/FieldId.vue";
import FieldImage from "@/components/admin/fields/FieldImage.vue";
import FieldString from "@/components/admin/fields/FieldString.vue";
import FieldNumber from "@/components/admin/fields/FieldNumber.vue";
import FieldTextarea from "@/components/admin/fields/FieldTextarea.vue";
import FieldSelect from "@/components/admin/fields/FieldSelect.vue";
import FieldPassword from "@/components/admin/fields/FieldPassword.vue";
import FieldRelationship from "@/components/admin/fields/FieldRelationship.vue";

export default {
  components: {
    NavigationPost,

    FieldCheckbox,
    FieldDate,
    FieldId,
    FieldImage,
    FieldNumber,
    FieldPassword,
    FieldRelationship,
    FieldSelect,
    FieldString,
    FieldTextarea
  },
  data: function() {
    return {
      customType: {},
      customTypeSettings: [],
      post: {}
    };
  },
  methods: {},
  mounted: function() {
    var postId = this.$route.params.postId;

    // Récupère le post
    axios.get("http://localhost:3000/API/post/" + postId)
      .then(response => {
        this.post = response.data.post;

      // Récupèr le type de post pour les paramètres
      axios
        .get("http://localhost:3000/API/posttypes/" + this.post.postTypeId)
        .then(response => {
          this.customType = response.data.post;
          this.customTypeSettings = JSON.parse(this.customType.setting);

        });

      });
  
  }

};
</script>
