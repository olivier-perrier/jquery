<template>
  <div>
    <!-- Welcome {{currentUser.name}} -->

    <nav class="nav flex-column">
      <router-link
        v-for="menu in menus"
        :key="menu._id"
        :to="'/admin/posttypes/' + menu._id + '/posts'"
        class="nav-item nav-link pb-3"
      >
        <i :class="menu.icon || 'far fa-file'"></i>
        <span class="d-none d-lg-inline pl-1">{{menu.name | capitalize}}</span>
      </router-link>

      <router-link to="/admin/posttypes" class="nav-item nav-link pb-3">
        <i class="fab fa-suse"></i>
        <span class="d-none d-lg-inline pl-1">Post types</span>
      </router-link>

    </nav>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AdminNav",
  components: {},
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
