<template>
  <div>
    <div>
      <toolbar :initial-mode="mode" :initial-symmetry="symmetry"></toolbar>
    </div>
    <div class="grid" @keydown="handleKeyDown($event)" tabindex="1">
      <table class="container" v-if="!!cwd" @mouseleave="handleMouseExit($event)">
        <div v-for="(row,r) in cwd.cells" :key="r" class="row">
          <cell-component :cell="cell" v-for="(cell,c) in cwd.cells[r]" :key="cell.id" :highlighted="isHighlighted(cell)" :selected="isSelected(cell)" @mouseout.native="handleMouseOut(cell, $event)" @mouseup.native="handleMouseUp(cell, $event)" @mouseover.native="handleMouseOver(cell, $event)" @mousedown.native="handleMouseDown(cell, $event)"></cell-component>
        </div>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Toolbar from "../toolbar.vue";
import bus from "../../bus";
import CellComponent from "./cell-component.vue";
import { GridData, GridHandler } from "./grid-handler";
import getHandler from "./get-handler";
import { Cell, Direction, Mode, Crossword, Symmetry } from "../../types/common";
export default Vue.extend({
  name: "Grid",
  props: ["cwd"],
  data() {
    return initData(this.cwd);
  },
  components: { CellComponent, Toolbar },
  mounted() {
    bus.$on("mode-change", (m: Mode) => (this.mode = m));
    bus.$on("symmetry-change", (m: Symmetry) => (this.symmetry = m));
  },
  computed: {
    handleKeyDown(): Function {
      return this.handler.keyDownHandler;
    },
    handleMouseDown(): Function {
      return this.handler.mouseDownHandler;
    },
    handleMouseOut(): Function {
      return this.handler.mouseOutHandler;
    },
    handleMouseOver(): Function {
      return this.handler.mouseOverHandler;
    },
    handleMouseUp(): Function {
      return this.handler.mouseUpHandler;
    },
    handleMouseExit(): Function {
      return this.handler.mouseExitHandler;
    },
    handler(): GridHandler {
      return getHandler(this.$store, this.$data as GridData)(this.mode);
    },

    isSelected(): Function {
      return (c: Cell) => {
        return (
          this.mode === Mode.Fill &&
          !!this.selected &&
          c.id === this.selected.id
        );
      };
    },
    isHighlighted(): Function {
      return (c: Cell) => {
        return this.mode === Mode.Fill && !!this.highlighted[c.id];
      };
    }
  },
  watch: {
    cwd: function(newCwd: Crossword) {
      Object.assign(this.$data, initData(newCwd));
    }
  }
});
const initData = (cwd: Crossword): GridData => {
  let highlighted: { [id: string]: boolean } = {};
  cwd.cells[0].forEach(c => (highlighted[c.id] = true));
  let selected = cwd.cells[0][0];
  return {
    mode: Mode.Fill,
    symmetry: Symmetry.Radial,
    crossword: cwd,
    selected: selected,
    direction: Direction.Horizontal as Direction,
    highlighted: highlighted
  } as GridData;
};
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
</style>
