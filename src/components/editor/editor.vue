<template>
  <div class="editor" @keydown="handleKeyDown($event)" tabindex="1">
    <toolbar :initial-mode="mode" :initial-symmetry="symmetry" @clear-all-click="clearAllClick" @clear-values-click="clearValuesClick" @save-click="savePuzzleClick" @save-snap-click="saveSnapClick" @undo-click="undoClick" @redo-click="redoClick"></toolbar>
    <grid :cells="this.crossword.cells" :selected="this.selectedCell" :highlighted="this.highlightedCells" @cell-mouse-down="handleMouseDown" @cell-mouse-over="handleMouseOver" @cell-mouse-up="handleMouseUp" @grid-mouse-exit="handleMouseExit"></grid>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import bus from "../../bus";
import { GridData, GridHandler } from "./grid-handler";
import getHandler from "./get-handler";
import { Cell, Direction, Mode, Crossword, Symmetry } from "../../types/common";
import utils from "./crossword-util";
import _ from "lodash";
import stack from "./undo-redo-stack";
import Toolbar from "../toolbar.vue";
import Grid from "../grid/grid.vue";
export default Vue.extend({
  name: "Editor",
  props: ["cwd"],
  data() {
    return initData(this.cwd);
  },
  components: { Grid, Toolbar },
  mounted() {
    bus.$on("mode-change", (m: Mode) => (this.mode = m));
    bus.$on("symmetry-change", (m: Symmetry) => (this.symmetry = m));
    stack.save(this.$data as GridData);
  },
  methods: {
    clearAllClick() {
      utils(this.crossword).clearAll();
    },
    clearValuesClick() {
      utils(this.crossword).clearValues();
    },
    updateStack: _.debounce(
      function(this: any) {
        console.log("cwd updated");
        stack.save(this.$data);
      },
      500,
      { trailing: true }
    ),
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
    savePuzzleClick() {
      this.$store.dispatch("saveSession", this.crossword);
    },
    saveSnapClick() {
      this.$store.dispatch("saveSnap", this.crossword);
    }
  },
  computed: {
    selectedCell(): Cell {
      if (this.mode === Mode.Fill) return this.selected;
      return null;
    },
    highlightedCells(): {} {
      if (this.mode === Mode.Fill) return this.highlighted;
      return {};
    },
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
    }
  },
  watch: {
    cwd: function(newCwd: Crossword) {
      //  if (newCwd.id === this.crossword.id) return;
      if (newCwd.id !== this.crossword.id) stack.reset();

      Object.assign(this.$data, initData(newCwd));
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

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}
.editor:focus {
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
