<template>
  <div class="my-5">
    <div class="alert alert-succes" role="alert">Succesfull logout</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  components: {},
  data: function() {
    return {};
  },
  mounted() {
    axios.post("http://localhost:3000/API/auth/logout", {}).then(response => {
      response;
      this.$router.push("/");
    });
  }
};
</script>
