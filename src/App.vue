<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" :to="{name: 'Home'}">Vue3 Project</router-link>

      <ul class="navbar-nav me-auto">
        <li class="nav-item">
          <router-link class="nav-link" :to="{name:'Todos'}">Todos</router-link>
        </li>
      </ul>
    </div>
  </nav>
  <div class="container">
    <router-view/>
  </div>
</template>

<script>

export default {
  components: {},
}
</script>

<style>
</style>