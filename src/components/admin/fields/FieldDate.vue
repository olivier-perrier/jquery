<template>
  <div class="form-group row">
    <label class="col-sm-2 col-form-label">{{customTypeSetting.name | capitalize}}</label>
    <div class="col-sm-10">
      <!-- <input
        type="datetime"
        class="form-control"
        v-model="post[customTypeSetting.name]"
        :disabled="customTypeSetting.disabled"
      /> -->
      <input
        type="datetime-local"
        class="form-control"
        v-model="dateValue"
        :disabled="customTypeSetting.disabled"
      />
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
  },
  computed: {
    dateValue: {
      get: function() {
        if (this.post[this.customTypeSetting.name])
          return this.post[this.customTypeSetting.name].replace("Z", "");
        else return this.post[this.customTypeSetting.name];
      },
      set: function(newValue) {
        this.post[this.customTypeSetting.name] = newValue;
      }
    }
  }
};
</script>

