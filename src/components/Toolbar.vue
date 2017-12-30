<template>
  <div>
    <button v-on:click="newPuzzleClicked">New Puzzle</button>
    <button v-on:click="undoClicked">Undo</button>
    <button v-on:click="redoClicked">Redo</button>
    <button v-on:click="clearClicked">Clear</button>
    <input type="radio" name="mode" checked>Fill</input>
    <input type="radio" name="mode">Draw</input>
    <div class="overlay glass" v-if="newPuzzleVisible">
      <new-puzzle-dialog @cancel-click="hideDialog" @create-click="hideDialog"></new-puzzle-dialog>
    </div>
  </div>
</template>
<script lang="ts">
import { $eventService, EventService } from "../infra/event-service";
import Vue from "vue";
import NewPuzzleDialog from "./new-puzzle-dialog.vue";
export default Vue.extend({
  name: "Toolbar",
  data() {
    return {
      newPuzzleVisible: false
    };
  },
  mounted() {},
  methods: {
    hideDialog() {
      this.newPuzzleVisible = false;
    },
    newPuzzleClicked() {
      this.newPuzzleVisible = true;
    },
    undoClicked() {
      $eventService.fire(EventService.Events.UndoRequest);
    },
    redoClicked() {
      $eventService.fire(EventService.Events.RedoRequest);
    },
    clearClicked() {
      $eventService.fire(EventService.Events.ClearRequest);
    }
  },
  components: {
    NewPuzzleDialog
  }
});
</script>
<style lang="scss">
.overlay {
  position: absolute;
  top: 0px;
  width: 700px;
  height: 100%;

  z-index: 10;
  background: rgba(lightblue, 1);
}
.glass {
  /* background styles */
}
</style>
