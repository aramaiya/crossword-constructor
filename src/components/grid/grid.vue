<template>
  <div>
    <div class="grid noselect" @mouseleave="$emit('grid-mouse-exit',$event)">
      <svg :height="rows*40+4" :width="cols*40+4">
        <g v-for="(row,r) in rows" :key="r" class="row">
          <cell-component :cell="cell" v-for="(cell,c) in cells[r]" :key="cell.id" :highlighted="isHighlighted(cell)" :selected="isSelected(cell)" @mouseout.native="$emit('cell-mouse-out',cell, $event)" @mouseup.native="$emit('cell-mouse-up',cell, $event)" @mouseover.native="$emit('cell-mouse-over',cell, $event)" @mousedown.native="$emit('cell-mouse-down',cell, $event)"></cell-component>
        </g>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import CellComponent from "./cell-component.vue";

import { Cell, Direction, Mode, Crossword, Symmetry } from "../../types/common";

export default Vue.extend({
  name: "Grid",
  props: ["cells", "selected", "highlighted"],
  components: { CellComponent },

  computed: {
    rows(): number {
      if (!!this.cells) return this.cells.length;
      return 0;
    },
    cols(): number {
      if (!!this.rows) return this.cells[0].length;
      return 0;
    },
    isSelected(): Function {
      return (c: Cell) => {
        return (
          !!this.selected &&
          c.id === this.selected.id
        );
      };
    },
    isHighlighted(): Function {
      return (c: Cell) => {
        return !!this.highlighted && !!this.highlighted[c.id];
      };
    }
  }
});
</script>

<style scoped lang="scss">
.grid {
  display: inline-block;
}
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
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
</style>
