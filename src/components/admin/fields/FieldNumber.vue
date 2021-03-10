<template>
  <div class="form-group row">
    <label class="col-sm-2 col-form-label">{{customTypeSetting.name | capitalize}}</label>
    <div class="col-sm-10">
      <input
        type="number"
        class="form-control"
        v-model="post[customTypeSetting.name]"
        :disabled="customTypeSetting.disabled"
      />
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

