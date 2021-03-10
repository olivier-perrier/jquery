<template>
  <div class="form-group row">
    <label class="col-sm-2 col-form-label">{{customTypeSetting.name | capitalize}}</label>
    <div class="col-sm-10">
      <textarea type="text" class="form-control" rows="10" v-model="post[customTypeSetting.name]"></textarea>
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

