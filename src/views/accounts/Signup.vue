<template>
  <div class="container my-5">

    TODO signup
    <!-- <div class="card mx-auto" style="width: 450px;">
      <div class="card-body">
        <form>
          <div class="form-group">
            <label>Email</label>
            <input type="text" v-model="user.email" class="form-control" placeholder="Your email" />
            <small class="form-text text-muted">We'll never share your email with anyone else.</small>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input
              type="password"
              v-model="user.password"
              class="form-control"
              placeholder="Password"
            />
          </div>
          <div class="form-check">
            <input type="checkbox" class="form-check-input" />
            <label class="form-check-label">Stay login in</label>
          </div>
          <button type="button" v-on:click="login()" class="btn btn-primary mt-1">Log in</button>
        </form>
      </div>
    </div>

    <div
      v-show="alert.show"
      class="alert alert-danger my-5"
      role="alert"
    >Unknow username or password</div> -->
  </div>
</template>

<script>
import axios from "axios";

export default {
  components: {},
  data: function() {
    return {
      user: { email: "leperenoel38@hotmail.fr", password: "123" },
      alert: { show: false }
    };
  },
  methods: {
    login: function() {
      axios
        .post("http://localhost:3000/API/auth/login", { user: this.user })
        .then(response => {
          if (response.data.user) {
            this.$router.push("/");
          } else {
            this.alert.show = true;
          }
        });
    }
  }
};
</script>
