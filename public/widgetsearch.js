Vue.component('widgetsearch', {
  template: `
  <form class="form-inline" v-on:submit.prevent="search">
    <input class="form-control mr-sm-2" v-model="toSearch" type="search" placeholder="Search..." aria-label="Search" >
  </form>
  
  `,

  data() {
    return {
      toSearch: ""
    }
  },

  methods: {
    search: function (event) {
      event.preventDefault()
      window.location = "/search/" + this.toSearch
    }
  }

})