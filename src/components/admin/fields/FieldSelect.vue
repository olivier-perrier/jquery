<template>
  <div class="form-group row">
    <label class="col-sm-2 col-form-label">{{customTypeSetting.name | capitalize}}</label>
    <div class="col-sm-10">
      <select v-model="post[customTypeSetting.name]" class="custom-select">
        <option v-for="option in options" :key="option.key" :value="option">{{option}}</option>
      </select>
      <small class="form-text text-muted">{{customTypeSetting.shemaDoc}}</small>
    </div>
  </div>
</template>



<script>
export default {
  components: {},
  props: ["post", "customTypeSetting"],
  data: function() {
    return {
      options: this.customTypeSetting.options
    };
  }
};
</script>

