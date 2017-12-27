<template>
  <div class="container">
    <toolbar></toolbar>
    <grid></grid>
    <div class = "overlay new-puzzle" :hidden="!newPuzzleVisible">
      <button>Create</button>
      <button @click="cancelClicked">Cancel</button>
    </div>
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
      newPuzzleVisible: false
    };
  },
  created() {},
  mounted() {
    $eventService.subscribe(EventService.Events.NewPuzzleRequest, this.showNewPuzzle, this);

  },
  methods: {
    showNewPuzzle() {
      this.newPuzzleVisible = true;
    },
    cancelClicked() {
      this.newPuzzleVisible = false;
    }
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
  .overlay {
    position: absolute;
    top: 0px;
    width: 100%;
    height: 100%
  }
  .new-puzzle {
    background: lightblue;
  }
</style>
