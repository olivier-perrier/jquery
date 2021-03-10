<template>
  <div class="mt-5">
    <div v-for="widget in widgets" :key="widget._id">
      <component v-bind:is="widget.name" :widget="widget"></component>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import recentPosts from "@/widgets/recentPosts";

export default {
  name: "widgets",
  components: { recentPosts },
  data: function() {
    return {
      widgets: []
    };
  },
  mounted: function() {
    axios.get("http://localhost:3000/API/public/post/widgets").then(response => {
      this.widgets = response.data.posts;
    });
  }
};
</script>