<template>
  <div class="home">
    <Header></Header>
    <Container></Container>
    <ShowPage></ShowPage>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Container from "@/components/Container";
import ShowPage from "@/components/ShowPage";

export default {
  name: "Home",
  components: {
    Header,
    Container,
    ShowPage
  }
};
</script>
