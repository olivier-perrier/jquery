<template>
  <div>
    <Header></Header>

    <Main></Main>

    <Footer></Footer>
  </div>
</template>

<script>
import Header from "@/components/site/Header";
import Main from "@/components/site/Main";
import Footer from "@/components/site/Footer";

// import Widgets from "@/templates/Widgets";

export default {
  name: "app",
  components: { Header, Main, Footer },
  data: function() {
    return {};
  },
  methods: {},
  mounted() {}
};
</script>
