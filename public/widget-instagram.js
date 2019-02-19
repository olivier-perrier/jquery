Vue.component('widget-instagram', {
  template: `
  <div>
    <h3 class="text-center mb-3">Instagram</h3>   

    {{data.version}}

  </div>
  `,

  data() {
    return {
      data: ""
    }
  },

  mounted: function () {

    console.log("requesting api...")

    $.get("https://cors.io/?https://api.instagram.com/v1/media/fA9uwTtkSN", (data, statut) => {
      
      $.each(data, function (index, value) {
        console.log(value)
      })
      this.data = data
      // for(var index in data) {
      // }
      this.posts = data.posts
    })
  },


})