<template>
  <g>
  <rect :height="size" :width="size" :class="cellClass" :x="cellPosition.x" :y="cellPosition.y"></rect>
  <text :height="size" :width="size" :x="cellPosition.x" :y="cellPosition.y" text-anchor="middle" :dx="18" :dy="26">{{cell.value}}</text>
  <rect class="cell selected" v-if="selected" :x="cellPosition.x+3" :y="cellPosition.y+3"></rect>
  </g>
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
        highlighted: this.highlighted
      };
    },
    cellPosition(): any {
      return {
        x: this.cell.position.col * this.size+2,
        y: this.cell.position.row * this.size+2
      }
    },
    size() {
      return 40;
    }
  }
});
</script>

<style scoped lang="scss">
.cell {
  fill: white;
  stroke: black;
  stroke-width: 1px;
}
text {
  font-size: 20px;
}
.cell.blocked {
  fill: black;
}
.selected {
  fill-opacity: 0;
  stroke: teal;
  stroke-width: 4px;
  height: 34px;
  width: 34px;
}

.highlighted:not(.blocked) {
  fill: wheat;
}
</style>
