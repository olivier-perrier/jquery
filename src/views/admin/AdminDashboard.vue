<template>
  <div>
    Dashboard
  </div>
</template>

<script>
// import axios from "axios";

export default {
  name: "AdminDashboard",
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
    // axios
    //   .get("http://localhost:3000/API/adminMenus?sort=order")
    //   .then(response => {
    //     this.menus = response.data.menus;
    //   });

    // axios.get("http://localhost:3000/API/currentUser").then(response => {
    //   this.currentUser = response.data.user;
    // });
  }
};
</script>
