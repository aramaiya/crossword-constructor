<template>
  <div class="container">
    <toolbar></toolbar>
    <grid></grid>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Grid from "./Grid.vue";
import Toolbar from "./Toolbar.vue";
import {$eventService, EventService} from '../infra/event-service';
export default Vue.extend({
  name: "Builder",
  data() {
    return {
      
    };
  },
  created() {},
  mounted() {
  },
  methods: {
    
  },
  components: {
    Toolbar,
    Grid
  }
});
</script>

<style scoped lang="scss">
  .container {
    position: relative;
  }
</style>
