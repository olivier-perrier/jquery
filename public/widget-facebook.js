Vue.component('widget-facebook', {
  template: `
  <div>
    
    <h3 class="text-center mb-3">Facebook</h3>

    <!--
    <div class="mb-2">
      <div class="fb-page" data-href="https://www.facebook.com/annalovesfood" data-small-header="false" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true">
        <blockquote cite="https://www.facebook.com/annalovesfood" class="fb-xfbml-parse-ignore">
          <a href="https://www.facebook.com/annalovesfood">Annalovesfood</a>
        </blockquote>
      </div>
    </div>
    -->

    <div class="text-center">
      <div class="fb-like" data-href="https://www.facebook.com/annalovesfood/" data-layout="button_count" data-action="like" data-size="large" data-show-faces="true" data-share="true"></div>
    </div>

    </div>
  `,

  data() {
    return {
      page: "annalovesfood"
    }
  },

  mounted: function () {
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  },


})