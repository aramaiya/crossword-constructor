<template>
  <div :class="cellClass">{{cell.value}}</div>
</template>

<script lang="ts">
import Vue from "vue";

import { Cell, CellType } from "../../types/common";
export default Vue.extend({
  name: "CellComponent",
  props: {
    cell: Cell,
    selected: Boolean,
    highlighted: Boolean
  },
  computed: {
    cellClass(): any {
      return {
        cell: true,
        blocked: this.cell.type === CellType.Block,
        selected: this.selected,
        highlighted: this.highlighted
      };
    }
  }
});
</script>

<style scoped lang="scss">
.cell {
  margin: 10px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  border: black solid 1px;
  height: 35px;
  width: 35px;
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
