Vue.component('widget-comments', {
  template: `
  <div>
        <h3 class="text-center mb-3">Recent comments</h3>
        <ul class="list-group list-group-flush">
        <div v-for="comment in comments">
            <li class="list-group-item">
              <a :href="'/comment/' + comment._id">{{comment.content}}</a>
            </li>
        </div>
        </ul>
    </div>`,

  data() {
    return {
      comments: []
    }
  },

  mounted: function () {
    $.get(URL + "/API/comments", { query: { }, limit: 10 }, (data, statut) => {
      console.log(data)
      this.comments = data.comments
    })
  },


})