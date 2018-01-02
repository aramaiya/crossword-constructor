import Vuex, { GetterTree } from 'vuex'
import { MutationTree, ActionTree } from 'vuex'
import { Cell, CellType, Crossword, Movement, Direction, Symmetry } from '../types/common'
import Vue from 'vue';

export interface AppState {
    
}

const mutations: MutationTree<AppState> = {
}

const actions: ActionTree<AppState, any> = {
    savePuzzle: (ctx) => {
      let cwd = ctx.rootState.editorModule.editor.crossword;
      localStorage.setItem("puzzle", JSON.stringify(cwd));
      console.log("saved..");
    },
    loadPuzzle: (ctx) => {
      let pz = localStorage.getItem("puzzle");
      if (!!pz) ctx.dispatch("loadEditor", JSON.parse(pz));
      else
       {
        ctx.dispatch("createPuzzle", {rows: 15, cols: 15});
      }
    },
    createPuzzle: (ctx, { rows, cols }) => {
      let cells = [[]] as Cell[][];
  
      for (let r = 0; r < rows; r++) {
        if (!cells[r]) cells[r] = [];
        for (let c = 0; c < cols; c++) {
          let cell: Cell = {
            id: r * cols + c,
            position: { row: r, col: c },
            type: CellType.Value,
            value: '',
            circled: false
          };
          cells[r][c] = cell;
        }
      }
      
      let cwd = { rows: rows, cols: cols, cells: cells, id: "1" };
      ctx.dispatch("loadEditor", cwd);
    }
  }
  

type ChangeValueAction = {
    type: "changeValue",
    value: number
}

type ChangeTypeAction = {
    type: "changeType",
    value: boolean
}

type CrosswordAction = ChangeTypeAction | ChangeValueAction;

let defaultState: AppState = {
}

export const module = {
    state: defaultState,
    mutations: mutations,
    actions: actions
}
