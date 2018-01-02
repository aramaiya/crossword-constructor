import Vuex, { GetterTree } from 'vuex'
import { MutationTree, ActionTree } from 'vuex'
import { Cell, CellType, Crossword, Movement, Direction, Symmetry } from '../types/common'
import Vue from 'vue';

export interface EditorState {
    editor: {
        crossword: Crossword,
    },
}

const mutations: MutationTree<EditorState> = {
    SET_PUZZLE(state, cwd: Crossword) {
        Vue.set(state.editor, "crossword", cwd)
    },
    SET_VALUE: (state, { row, col, value }: { row: number, col: number, value: string }) => {
        let cell = state.editor.crossword.cells[row][col];
        cell.value = value;
        if (cell.type === CellType.Block) cell.type = CellType.Value;
    },
    SET_TYPE: (state, { row, col, type }: { row: number, col: number, type: CellType }) => {
        let cell = state.editor.crossword.cells[row][col];
        cell.type = type;
        if (cell.type === CellType.Block) cell.value = "";
    }
}
const getters: GetterTree<EditorState, any> = {
    editor(state) {
        return state.editor;
    }
}

const actions: ActionTree<EditorState, any> = {
    loadEditor: (ctx, cwd: Crossword) => {
        ctx.commit("SET_PUZZLE", cwd);
        setInterval(()=>{ctx.dispatch("savePuzzle")}, 5000);
    },
    changeValue: (ctx, { row, col, value }: { row: number, col: number, value: string }) => {
        ctx.commit("SET_VALUE", { row: row, col: col, value: value })
    },
    changeType: (ctx, { row, col, type, symmetry }: { row: number, col: number, type: CellType, symmetry: Symmetry }) => {
        ctx.commit("SET_TYPE", { row: row, col: col, type: type })
        let cwd = ctx.state.editor.crossword;
        switch (symmetry) {
            case Symmetry.Radial:
                ctx.commit("SET_TYPE", { row: cwd.rows - row - 1, col: cwd.cols - col - 1, type: type })
                break;
            case Symmetry.Horizontal:
                ctx.commit("SET_TYPE", { row: row, col: cwd.cols - col - 1, type: type });
                break;
            case Symmetry.Vertical:
                ctx.commit("SET_TYPE", { row: cwd.rows - row - 1, col: col, type: type })
                break;
            case Symmetry.None:
            default:
                return;
        }
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

let defaultState: EditorState = {
    editor: {
        crossword: null
    }
}

export const module = {
    state: defaultState,
    mutations: mutations,
    getters: getters,
    actions: actions
}
