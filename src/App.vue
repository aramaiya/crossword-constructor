<template>
  <div id="app">
    Hello!
    <navbar></navbar>
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Navbar from './components/navbar.vue'
export default Vue.extend({
  name: 'app',
  components: {Navbar},
  mounted(){
    this.$store.dispatch("loadSessions")
  }
})
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
