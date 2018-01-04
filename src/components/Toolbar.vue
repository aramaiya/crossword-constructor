<template>
  <div class="toolbar">
    <div>
      <button v-on:click="newPuzzleVisible = true">New Puzzle</button>
      <button v-on:click="$emit('save-click')">Save Puzzle</button>
    </div>
    <div>

    </div>
    <div>
      <button @click="$emit('undo-click')">Undo</button>
      <button @click="$emit('redo-click')">Redo</button>
      <button @click="$emit('clear-all-click')">Clear All</button>
      <button @click="$emit('clear-values-click')">Clear Values</button>
    </div>
    <div>
      <input type="radio" id="r" value="Radial" name="symmetry" v-model="symmetry">Radial</input>
      <input type="radio" value="Horizontal" name="symmetry" v-model="symmetry">Horizontal</input>
      <input type="radio" value="Vertical" name="symmetry" v-model="symmetry">Vertical</input>
      <input type="radio" value="None" name="symmetry" v-model="symmetry">None</input>
    </div>
    <div>
      <input type="radio" value="Fill" name="mode" v-model="mode">Fill</input>
      <input type="radio" value="Draw" name="mode" v-model="mode">Draw</input>
    </div>

    <div class="overlay glass" v-if="newPuzzleVisible">
      <new-puzzle-dialog @cancel-click="newPuzzleVisible = false" @create-click="newPuzzleVisible = false"></new-puzzle-dialog>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import NewPuzzleDialog from "./new-puzzle-dialog.vue";
import { Mode, Symmetry } from "../types/common";
import bus from "../bus";
export default Vue.extend({
  name: "Toolbar",
  props: ["initialMode", "initialSymmetry"],
  data() {
    return {
      newPuzzleVisible: false,
      symmetry: this.initialSymmetry,
      mode: this.initialMode
    };
  },
  mounted() {
    //console.log(this.mode);
  },
  watch: {
    initialMode: function(newInitialMode: Mode) {
      this.mode = newInitialMode;
    },
    initialSymmetry: function(newInitialSymmetry: Symmetry) {
      this.symmetry = newInitialSymmetry;
    },
    mode: function(newMode: Mode) {
      console.log("mode change to " + newMode);
      bus.$emit("mode-change", newMode);
    },
    symmetry: function(newSymmetry: Symmetry) {
      console.log("symm change to " + newSymmetry);
      bus.$emit("symmetry-change", newSymmetry);
    }
  },
  components: {
    NewPuzzleDialog
  }
});
</script>
<style lang="scss">
.toolbar {
  width: 100%;
}
.overlay {
  left: calc(50% - 350px);
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
