Vue.component('widget-posts', {
  template: `
  <div>
        <h3 class="text-center mb-3">Recent posts</h3>
        <ul class="list-group list-group-flush">
        <div v-for="post in posts">
            <li class="list-group-item">
              <a :href="'/post/' + post._id">{{post.title}}</a>
            </li>
        </div>
        </ul>
    </div>`,

  data() {
    return {
      posts: 0
    }
  },

  mounted: function () {
    $.post(URL + "/API/posts", { query: { "category": "post" }, limit: 5 }, (data, statut) => {
      // console.log(data)
      this.posts = data.posts
    })
  },


})