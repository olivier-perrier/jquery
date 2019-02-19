Vue.component('widgetsearch', {
  template: `
  <form class="" v-on:submit.prevent="search">
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
      if (this.toSearch)
        window.location = "/search/" + this.toSearch
    }
  }

})