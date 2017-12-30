<template>
  <div>
    <button v-on:click="newPuzzleClicked">New Puzzle</button>
    <button v-on:click="undoClicked">Undo</button>
    <button v-on:click="redoClicked">Redo</button>
    <button v-on:click="clearClicked">Clear</button>
    <input type="radio" value="Fill" name="mode" v-model="mode">Fill</input>
    <input type="radio" value="Draw" name="mode" v-model="mode">Draw</input>
    <div class="overlay glass" v-if="newPuzzleVisible">
      <new-puzzle-dialog @cancel-click="hideDialog" @create-click="hideDialog"></new-puzzle-dialog>
    </div>
  </div>
</template>
<script lang="ts">
import { $eventService, EventService } from "../infra/event-service";
import Vue from "vue";
import NewPuzzleDialog from "./new-puzzle-dialog.vue";
import { $crosswordBuilder, Mode } from "./builder/crossword-builder";
export default Vue.extend({
  name: "Toolbar",
  data() {
    console.log($crosswordBuilder.mode);
    return {
      newPuzzleVisible: false,
      mode: $crosswordBuilder.mode
    };
  },
  mounted() {
    console.log(this.mode);
  },
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
  watch: {
    mode: function(newMode: Mode) {
      console.log("mode change to " + newMode);
      $eventService.fire(EventService.Events.ModeChangeRequest, newMode);
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
  background: rgba(black, 0.85);
}
.glass {
  /* background styles */
}
</style>
