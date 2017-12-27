<template>
  <div class="grid" @keydown="handleKeyDown" tabindex="1">
    <table class="container">
    <div v-for = "(row,r) in cells" :key="r" class="row">
        <div v-for = "(cell,c) in cells[r]" :key="r+'_'+c" :class="'cell ' + cell.class"
        @mousedown="handleMouseDown(cell,$event)">{{cell.value}}</div>
    </div>
    </table>
    <div class = "overlay">
      
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { $cellModel } from "../models/cell-model";
import { FillModeBehavior } from "./cell-view-provider";
import { CellView } from "./cell-view";
export default Vue.extend({
  name: "Grid",
  data() {
    let cells: Array<Array<CellView>> = [[]];
    for (let r = 0; r < $cellModel.rows; r++) {
      if (!cells[r]) cells[r] = [];
      for (let j = 0; j < $cellModel.cols; j++) {
        cells[r][j] = new CellView(r, j);
      }
    }
    return {
      cells: cells,
      behavior: new FillModeBehavior()
    };
  },
  created() {
    this.behavior.attach(this.$data);
  },
  mounted() {
    this.$el.focus();
    console.log(this.$el);
  },
  methods: {
    handleKeyDown(e: KeyboardEvent) {
      this.behavior.handleKeyDown(e);
    },
    handleMouseDown(cell: CellView, e: MouseEvent) {
      this.behavior.handleMouseDown(cell, e);
    }
  }
});
</script>

<style scoped lang="scss">
.grid {
  display: flex;
  justify-content: center;
  position: relative;
}
.grid:focus {
  outline: 0;
  .overlay {
    display: hidden;
  }
}
.container {
  display: table;
}
.row {
  display: table-row;
}
.cell {
  margin: 10px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  border: black solid 1px;
  height: 28px;
  width: 28px;
  display: table-cell;
  vertical-align: middle;
}
.cell.blocked {
  background: black;
}
.selected {
  background: wheat;
  width: 20px;
  height: 20px;
  border: 4px solid teal;
}
.selected.blocked {
  background: black;
  width: 20px;
  height: 20px;
  border: 4px solid teal;
}
.highlighted:not(.selected):not(.blocked) {
  background: wheat;
}
</style>
