<template>
  <div>
    <div>
      <toolbar :initial-mode="mode" :initial-symmetry="symmetry" @clear-all-click="clearClick" @clear-values-click="clearValuesClick" @save-click="savePuzzleClick" @undo-click="undoClick" @redo-click="redoClick"></toolbar>
    </div>
    <div class="grid noselect" @keydown="handleKeyDown($event)" tabindex="1">
      <svg :height="crossword.rows*40+4" :width="crossword.cols*40+4">
        <g v-for="(row,r) in crossword.cells" :key="r" class="row">
          <cell-component :cell="cell" v-for="(cell,c) in crossword.cells[r]" :key="cell.id" :highlighted="isHighlighted(cell)" :selected="isSelected(cell)" @mouseout.native="handleMouseOut(cell, $event)" @mouseup.native="handleMouseUp(cell, $event)" @mouseover.native="handleMouseOver(cell, $event)" @mousedown.native="handleMouseDown(cell, $event)"></cell-component>
        </g>
      </svg>
      <table class="container" v-if="!!cwd" @mouseleave="handleMouseExit($event)">
        <div v-for="(row,r) in crossword.cells" :key="r" class="row">
          <cell-component :cell="cell" v-for="(cell,c) in crossword.cells[r]" :key="cell.id" :highlighted="isHighlighted(cell)" :selected="isSelected(cell)" @mouseout.native="handleMouseOut(cell, $event)" @mouseup.native="handleMouseUp(cell, $event)" @mouseover.native="handleMouseOver(cell, $event)" @mousedown.native="handleMouseDown(cell, $event)"></cell-component>
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
import utils from "./crossword-util";
import _ from "lodash";
import stack from "./undo-redo-stack";
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
    stack.save(this.$data as GridData);
  },
  methods: {
    clearClick() {
      utils(this.crossword).clearAll();
    },
    undoClick() {
      (this as any).undoing = true;
      let oldSate = stack.undo();
      if (!!oldSate) Object.assign(this.$data, oldSate);
    },
    redoClick() {
      (this as any).undoing = true;
      let oldSate = stack.redo();
      if (!!oldSate) Object.assign(this.$data, oldSate);
    },
    clearValuesClick() {
      utils(this.crossword).clearValues();
    },
    savePuzzleClick() {
      this.$store.dispatch("saveSession", this.crossword);
    },
    updateStack: _.debounce(
      function(this: any) {
        console.log("cwd updated");
        stack.save(this.$data);
      },
      500,
      { trailing: true }
    )
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
      return getHandler(this.$data as GridData)(this.mode);
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
      if (newCwd.id === this.crossword.id) return;
      Object.assign(this.$data, initData(newCwd));
      stack.reset();
    },
    crossword: {
      handler: function(newCwd, oldCwd) {
        if (!(this as any).undoing) this.updateStack();
        (this as any).undoing = false;
      },
      deep: true
    }
  }
});
const initData = (cwd: Crossword): GridData => {
  let highlighted: { [id: string]: boolean } = {};
  let crossword = JSON.parse(JSON.stringify(cwd)) as Crossword;
  crossword.cells[0].forEach(c => (highlighted[c.id] = true));
  let selected = cwd.cells[0][0];
  return {
    mode: Mode.Fill,
    symmetry: Symmetry.Radial,
    crossword: crossword,
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
