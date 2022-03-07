<template>
  <NavBar/>
  <div class="container">
    <router-view/>
  </div>

  <Toast/>
</template>
<script>
import Toast from "@/components/Toast";
import NavBar from "./components/NavBar";

export default {
  components: {
    NavBar,
    Toast
  },
}
</script>

<style scoped>
</style>