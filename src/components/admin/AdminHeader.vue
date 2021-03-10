<template>
  <div>
    <nav class="navbar navbar-light navbar-expand-lgT">
      <router-link to="/admin" class="navbar-brand">
        <img src="/img/icon.png" width="30" height="30" class="d-inline-block" alt />
        OP Admin
      </router-link>
      <router-link to="/" class="btn btn-light" role="button">View site</router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <div class="navbar-nav mr-auto">
          <router-link
            v-for="menu in menus"
            :key="menu._id"
            :to="'/admin/' + menu.name"
            class="nav-item nav-link"
          >
            <i :class="menu.icon"></i>
            {{menu.name | capitalize}}
          </router-link>
        </div>

      </div>
    </nav>
    <!-- Welcome {{currentUser.name}} -->
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "admin-header",
  components: {
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
