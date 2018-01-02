import Vue from 'vue'
import Vuex from 'vuex'
import { MutationTree, ActionTree } from 'vuex'
import * as T from '../types/common'
import * as Editor from "./editor"
Vue.use(Vuex)

type ActionA = {
  type: 'A',
  value: T.Crossword
}

type Action = ActionA;

export interface RootState {
  editor: Editor.EditorState

}

const mutations: MutationTree<RootState> = {
  loadPuzzle: (state, cwd: T.Crossword) => Vue.set(state.editor, "crossword", cwd)
}

const actions: ActionTree<RootState, any> = {
  createPuzzle: (ctx, { rows, cols }) => {
    let cells = [[]] as T.Cell[][];

    for (let r = 0; r < rows; r++) {
      if (!cells[r]) cells[r] = [];
      for (let c = 0; c < cols; c++) {
        let cell: T.Cell = {
          id: r * cols + c,
          position: { row: r, col: c },
          type: T.CellType.Value,
          value: '',
          circled: false
        };
        cells[r][c] = cell;
      }
    }

    let cwd = { rows: rows, cols: cols, cells: cells, id: "1" };
    //ctx.commit("addPuzzle", cwd);
    ctx.dispatch("loadEditor", cwd);
  }
}

 
export default new Vuex.Store<RootState>({
  mutations: mutations,
  actions: actions,
  modules: {
    editor: Editor.module
  }
});