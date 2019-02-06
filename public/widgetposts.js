Vue.component('widgetposts', {
  template: `
  <div>
        <h3>Lastest posts</h3>
        <div v-for="post in posts">
            <a :href="'post/' + post._id">{{post.title}}</a>
        </div>
    </div>`,

  data() {
    return {
      posts: 0
    }
  },

  mounted: function () {
    $.post(URL + "/API/posts", { "query": { "category": "post" }, "limit": { max: 3 } }, (data, statut) => {
      console.log(data)
      this.posts = data.posts
    })
  },


})