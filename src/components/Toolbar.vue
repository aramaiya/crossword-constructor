<template>
    <div>
        <button v-on:click="newPuzzleClicked">New Puzzle</button>
        <button v-on:click="undoClicked">Undo</button>
        <button v-on:click="clearClicked">Clear</button>
        <input type="radio" name="mode" checked>Fill</input>
        <input type="radio" name="mode">Draw</input>
        <div class="overlay new-puzzle" :hidden="!newPuzzleVisible">
            <button>Create</button>
            <button @click="cancelClicked">Cancel</button>
        </div>
    </div>
</template>
<script lang="ts">
import { $eventService, EventService } from "../infra/event-service";
import Vue from "vue";
export default Vue.extend({
  name: "Toolbar",
  data() {
    return {
      newPuzzleVisible: false
    };
  },
  methods: {
    cancelClicked() {
      this.newPuzzleVisible = false;
    },
    newPuzzleClicked() {
      this.newPuzzleVisible = true;
    },
    undoClicked() {
      $eventService.fire(EventService.Events.UndoRequest);
    },
    clearClicked() {
      $eventService.fire(EventService.Events.ClearRequest);
    }
  }
});
</script>
<style lang="scss">
.overlay {
  position: absolute;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 10;
}
.new-puzzle {
  background: lightblue;
}
</style>
