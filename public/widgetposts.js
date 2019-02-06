export default {

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

  template: /*html*/`

    <div>
      <h2>Lastest posts</h2>
      <div v-for="post in posts">
        <a :href="'post/' + post._id">{{post.title}}</a>
      </div>
    </div>`


}
// )