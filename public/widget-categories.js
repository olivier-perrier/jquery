Vue.component('widget-categories', {
  template: `
  <div>
        <h3 class="text-center mb-3">Categories</h3>
        <ul class="list-group list-group-flush">
        <div v-for="category in categories">
            <li class="list-group-item">
              <a :href="'/categories/' + category">{{category}}</a>
            </li>
        </div>
        </ul>
    </div>`,

  data() {
    return {
      categories: 0
    }
  },

  mounted: function () {
     $.get(URL + "/API/categories", { query: {}, limit: 5 }, (data, statut) => {
      console.log(data)
      this.categories = data.categories
    })
  },


})