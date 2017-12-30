<template>
  <div>
    <div class="new-puzzle">
      <div class="dim-label">
        <label for="rowsSelect">Rows</label><select id="rowsSelect" v-model="rows"><option v-for="(i,ix) in 47">{{i +3}}</option></select></div>
      <div class="dim-label">
        <label for="colsSelect">Columns</label><select id="colsSelect" v-model="cols"><option v-for="(i,ix) in 47">{{i +3}}</option></select></div>
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
  mounted() {
    this.rows = $builderModel.rows;
    this.cols = $builderModel.cols;
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
