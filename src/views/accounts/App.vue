<template>
  <div>
    <!-- <admin-header></admin-header> -->

    <!-- <AdminMain></AdminMain> -->
    
        <router-view></router-view>

    <footer class="text-center m-5">OP Admin by Olivier Perrier</footer>
  </div>
</template>

<script>
// import AdminHeader from "../AdminHeader.vue";
// import AdminMain from "../AdminMain.vue";

// @ is an alias to /src

export default {
  name: "app",
  components: {
    // AdminHeader,
    // AdminMain
  }
};
</script>
