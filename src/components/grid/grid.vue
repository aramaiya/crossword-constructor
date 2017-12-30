<template>
  <div class="grid" @keydown="handleKeyDown" tabindex="1">
    <table class="container">
      <div v-for="(row,r) in cells" :key="r" class="row">
        <div v-for="(cell,c) in cells[r]" :key="r+'_'+c" :class="'cell ' + cell.class" @mouseout="handleMouseOut(cell, $event)" @mouseup="handleMouseUp(cell, $event)" @mouseover="handleMouseOver(cell, $event)" @mousedown="handleMouseDown(cell,$event)">{{cell.value}}</div>
      </div>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { $builderModel, BuilderModel } from "../../models/builder-model";
import { GridController } from "./grid-controller";
import { FillGridController } from "./fill-grid-controller";
import { DrawGridController } from "./draw-grid-controller";
import { $crosswordBuilder } from "../builder/crossword-builder";
import { $eventService, EventService } from "../../infra/event-service";
import { CellView } from "./cell-view";
import { Mode } from "../builder/crossword-builder";
export default Vue.extend({
  name: "Grid",
  data() {
    let cells = [[]] as CellView[][];
    return {
      cells: cells,
      controller: $crosswordBuilder.controller
    };
  },
  created() {
    console.log(this.cells);
  },
  mounted() {
$builderModel.subscribe(
      BuilderModel.Events.NEW_PUZZLE_CREATED,
      this.initializeGrid,
      this
    );
    $eventService.subscribe(
      EventService.Events.ModeChangeRequest,
      this.updateController,
      this
    );

        this.initializeGrid.call(this);

    console.log(this.$el);
  },
  methods: {
    handleKeyDown(e: KeyboardEvent) {
      this.controller.handleKeyDown(e);
    },
    handleMouseDown(cell: CellView, e: MouseEvent) {
      this.controller.handleMouseDown(cell, e);
    },
    handleMouseOver(cell: CellView, e: MouseEvent) {
      this.controller.handleMouseOver(cell, e);
    },
    handleMouseOut(cell: CellView, e: MouseEvent) {
      this.controller.handleMouseOut(cell, e);
    },
    handleMouseUp(cell: CellView, e: MouseEvent) {
      this.controller.handleMouseUp(cell, e);
    },
    initializeGrid() {
      let cells: CellView[][] = [[]];
      for (let r = 0; r < $builderModel.rows; r++) {
        if (!cells[r]) cells[r] = [];
        for (let j = 0; j < $builderModel.cols; j++) {
          cells[r][j] = new CellView(r, j);
        }
      }
      this.cells = cells;
      this.controller.attachCellViews(cells);
      this.$el.focus();
    },
    updateController(mode: Mode) {
      console.log("updating controller", mode);
      switch (mode) {
        case Mode.Fill:
          this.controller = new FillGridController();
          break;
        case Mode.Draw:
          this.controller = new DrawGridController();
      }
      this.controller.attachCellViews(this.cells);
      this.$el.focus();
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
