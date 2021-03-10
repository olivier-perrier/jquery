<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-xl-9">
        <router-view></router-view>
      </div>
      <div class="col-xl-3">
        <Widgets></Widgets>
      </div>
    </div>
  </div>
</template>

<script>
import Widgets from "@/components/site/Widgets.vue";

export default {
  name: "Main",
  components: {
    Widgets
  }
};
</script>
