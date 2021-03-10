<template>
  <div class="form-group row">
    <label class="col-sm-2 col-form-label">{{customTypeSetting.name | capitalize}}</label>
    <div class="col-sm-10">
      <router-link :to="'/' + 'todo' + '/' + post._id ">{{post._id}}</router-link>
      <small class="form-text text-muted">{{customTypeSetting.shemaDoc}}</small>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["post", "customTypeSetting"]
};
</script>

