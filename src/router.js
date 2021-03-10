import Vue from 'vue'
import Router from 'vue-router'

import Accounts from './views/accounts/App.vue'
import Signin from './views/accounts/Signin.vue'
import Logout from './views/accounts/Logout.vue'
import Signup from './views/accounts/Signup.vue'


import App from './views/site/App.vue'
import Home from './views/site/Home.vue'
import Posts from './views/site/Posts.vue'
import PostsDetails from './views/site/PostsDetails.vue'
import PageList from './views/site/PageList.vue'
import PageView from './views/site/PageView.vue'
import Users from './views/site/Users.vue'



import AdminApp from './views/admin/App.vue'
import AdminDashboard from './views/admin/AdminDashboard.vue'
import AdminPosts from './views/admin/AdminPosts.vue'
import AdminPostsEdit from './views/admin/AdminPostsEdit.vue'

import AdminPosttypes from './views/admin/AdminPosttypes.vue'
import AdminPosttypeEdit from './views/admin/AdminPosttypeEdit.vue'



Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/accounts',
      component: Accounts,
      children: [
        {
          path: 'signin',
          component: Signin
        },
        {
          path: 'logout',
          component: Logout
        }, {
          path: 'signup',
          component: Signup
        }
      ]
    }, {
      path: '/admin',
      component: AdminApp,
      children: [
        {
          path: '',
          component: AdminDashboard
        }, {
          path: 'posts/:postId',
          component: AdminPostsEdit
        }, {
          path: 'posttypes/:postTypeId/posts',
          component: AdminPosts
        },
        {
          path: 'posttypes',
          component: AdminPosttypes
        },{
          path: 'posttypes/:posttypeId',
          component: AdminPosttypeEdit
        }
      ]
    },
    {
      path: '/',
      component: Home
    },
    {
      path: '/pages',
      component: App,
      children: [
        { path: '', component: PageList },
        { path: ':postId', component: PageView }
      ]
    },
    {
      path: '/users',
      component: App,
      children: [
        { path: '', component: Users }]
    },
    {
      path: '/:customTypeName',
      component: App,
      children: [
        { path: '', component: Posts },
        { path: ':postId', component: PostsDetails }
      ]
    },
  ]
})
