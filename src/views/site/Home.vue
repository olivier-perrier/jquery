<template>
  <div>
    <Header></Header>

    <main role="main">
      <section id="header" class="text-center py-5">
        <h1>Welcome to OPSI</h1>
        <p class="lead">
          This website allow you to understand the information system managment.
          <br />Create every type you want, contrat, client, module, theme, product, etc and allow custumers, employees or anyone to add any objets, manage it with hight security level.
          <br />You are already working on an other system ? It's ok, OPSI allow you to connect to any existing SI to manage your data.
          <br />Only want to save your datas ? Connect the existing SI and save it here.
          <br />The power of OPSI is that you can add fonctionalities here and connect it to any existing SI to also add datas that are managed here to an other SI
        </p>
        <p class="lead">
          <router-link to="/posts" class="btn btn-lg btn-primary mr-2">Explore</router-link>
          <router-link to="/admin" class="btn btn-lg btn-link">What looks like admin</router-link>
        </p>
      </section>

      <section id="apropos">
        <div class="container pt-5">
          <div class="text-center mb-3">
            <h2 class="section-heading">A propos</h2>
            <h3 class="text-muted">OPSI est une platforme de gestion de système d'information</h3>
          </div>
          <div class="card-deck text-center">
            <div class="card">
              <div class="card-body">
                <i class="fa fa-child"></i>
                <h4>IHM</h4>
                <p
                  class="text-muted"
                >Porté vers le client, le système sera toujours mettre l'intuition au coeur de la technologie pour une gestion accéssible à tout moment et pour tous.</p>
              </div>
            </div>
            <div class="card">
              <div class="card-body">
                <i class="far fa-gear"></i>
                <h4>Adaptabilité</h4>
                <p
                  class="text-muted"
                >Toujours extensible et adapté pour absolument toutes les applications.</p>
              </div>
            </div>
            <div class="card">
              <div class="card-body">
                <i class="fa fa-laptop"></i>
                <h4>Ouvert</h4>
                <p
                  class="text-muted"
                >Ouvert pour l'évolution et l'intégration de pluginet de nouvelles fonctionnalités pour le future.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <section class="container my-5">
      <Widgets></Widgets>
    </section>
  </div>
</template>

<script>
import Header from "@/components/site/Header";
import Widgets from "@/components/site/Widgets.vue";

// @ is an alias to /src

export default {
  name: "Home",
  components: { Header, Widgets },
  data: function() {
    return {};
  },
  mounted() {}
};
</script>

<style scoped>
#header {
  background: url("/img/home/fond2.jpg") fixed;
}
</style>
