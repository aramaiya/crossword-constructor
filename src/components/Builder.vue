<template>
  <div class="container">
    <toolbar></toolbar>
    <grid></grid>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Grid from "./grid/grid.vue";
import Toolbar from "./toolbar.vue";
import { $eventService, EventService } from "../infra/event-service";
export default Vue.extend({
  name: "Builder",
  data() {
    return {};
  },
  created() {},
  mounted() {},
  components: {
    Toolbar,
    Grid
  }
});
</script>

<style scoped lang="scss">
.container {
  position: relative;
  width: 700px;
  margin: 0 auto;
}
</style>
