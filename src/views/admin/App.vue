<template>
  <div>
    <admin-header></admin-header>

    <AdminMain></AdminMain>
    

    <footer class="text-center m-5">OP Admin by Olivier Perrier</footer>
  </div>
</template>

<script>
import AdminHeader from "@/components/admin/AdminHeader.vue";
import AdminMain from "@/components/admin/AdminMain.vue";

// @ is an alias to /src

export default {
  name: "app",
  components: {
    AdminHeader,
    AdminMain
  }
};
</script>
