<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-2">
        <AdminNav></AdminNav>
      </div>
      <div class="col-10">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import AdminNav from "./AdminNav.vue";

export default {
  name: "AdminMain",
  components: {
    AdminNav
  },
  data: function() {
    return {
      currentUser: {},
      menus: []
    };
  },
  methods: {},
  mounted: function() {
    axios
      .get("http://localhost:3000/API/adminMenus?sort=order")
      .then(response => {
        this.menus = response.data.menus;
      });

    axios.get("http://localhost:3000/API/currentUser").then(response => {
      this.currentUser = response.data.user;
    });
  }
};
</script>
