<template>
  <div>
    <div class="new-puzzle">
      <div class="dim-label">
        <label for="rowsInput">Rows</label><input id="rowsInput" type="number" min="4" max="30" v-model="rows" /></div>
      <div class="dim-label">
        <label for="colsInput">Columns</label><input id="colsInput" type="number" min="4" max="30" v-model="cols" /></div>
      <div>
        <button @click="createClicked">Create</button>
        <button @click="cancelClicked">Cancel</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">

import {$builderModel} from "../models/builder-model";
import Vue from "vue";
export default Vue.extend({
  name: "new-puzzle-dialog",
  data() {
    return {
      rows: 15,
      cols: 15
    };
  },
  methods: {
    cancelClicked() {
      this.$emit("cancel-click");
    },
    createClicked() {
      $builderModel.createNewPuzzle(this.rows, this.cols);
      this.$emit("create-click");
    }
  }
});
</script>
<style lang="scss">
.dim-label {
  display: inline-block;
  width: 100px;
  text-align: center;
  label {
    display: block;
  }
  input {
    text-align: center;
  }
}
</style>
