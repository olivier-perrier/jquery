<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <router-link to="/" class="navbar-brand">
        <img src="/img/icon.png" width="30" height="30" alt />
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li v-for="menu in menus" :key="menu.id" class="nav-item">
            <span v-on:click="menuActiveId = menu._id">
              <router-link :to="menu.link" class="nav-link">{{menu.title | capitalize}}</router-link>
            </span>
          </li>
        </ul>
        <div class="navbar-nav border rounded text-right pr-1">
          <!-- Login Logout -->
          <router-link v-if="currentUser" to="/accounts/logout" class="nav-item nav-link">Logout</router-link>
          <router-link v-else to="/accounts/signin" class="nav-item nav-link">Signin</router-link>
          <!-- Admin -->
          <router-link to="/admin" class="nav-item nav-link">Admin</router-link>
          <!-- Current user -->
          <span v-if="currentUser" class="nav-item nav-link">{{currentUser.firstname}}</span>
        </div>
      </div>
    </nav>

    <!-- Sous menu navigation -->
    <nav class="nav justify-content-center">
      <router-link
        v-for="subMenu in subMenus"
        :key="subMenu.id"
        class="nav-item nav-link"
        :to="subMenu.link"
      >{{subMenu.title | capitalize}}</router-link>
    </nav>
  </header>
</template>

<script>
import axios from "axios";

export default {
  name: "Header",
  data: function() {
    return {
      menus: [],
      currentUser: {},
      menuActiveId: ""
    };
  },
  mounted() {
    this.mounthMenus();
    this.mounthCurrentUser();
  },
  methods: {
    mounthCurrentUser() {
      axios.get("http://localhost:3000/API/currentUser").then(response => {
        this.currentUser = response.data.currentUser;
      });
    },
    mounthMenus() {
      axios.get("http://localhost:3000/API/public/menus").then(response => {
        this.menus = response.data.posts;
      });
    }
  },
  computed: {
    subMenus: function() {
      return this.menus.filter(value => {
        if (value.parent) return value.parent._id == this.menuActiveId;
        else return false;
      });
    }
  },
  watch: {
    $route(to, from) {
      if (from.path == "/login" || from.path == "/logout"){
        this.mounthCurrentUser();
      }
    }
  }
};
</script>

<style scoped>
</style>
