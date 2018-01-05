import Vuex, { GetterTree } from 'vuex'
import { MutationTree, ActionTree } from 'vuex'
import { Cell, CellType, Crossword, Movement, Direction, Symmetry, Session } from '../types/common'
import Vue from 'vue';

export interface AppState {
    unsavedSession: Session;
    unsavedCrossword: Crossword;
    activeSessionId: string;
    sessions: { [id: string]: Session };
    orderedSessions: string[];
    crosswords: { [id: string]: Crossword };
}

const mutations: MutationTree<AppState> = {
}

const getters: GetterTree<AppState, any> = {
    sessions: (state) => {
        let sessions: Session[] = [];
        for (let id in state.sessions) sessions.push(state.sessions[id]);
        return sessions;
    },
    orderedSessions: (state) => {
        return state.orderedSessions;
    },
    crosswords: (state) => {
        return state.crosswords;
    },
    activeSession: (state) => {
        let sesh: Session;
        if (!!state.activeSessionId) sesh= state.sessions[state.activeSessionId];
        if (!sesh) sesh = state.unsavedSession
        return sesh;
    },
    session: (state) => {
        return (id: string) => state.sessions[id];
    },
    crossword: (state) => {
        return (id: string) => state.crosswords[id];
    },
    snaps: (state, getters) => {
        if (!!getters.activeSession) return getters.activeSession.snaps;
        return [];
    }

}
function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

const actions: ActionTree<AppState, any> = {
    saveSession: (ctx, cwd: Crossword) => {
        let sesh: Session = ctx.getters.activeSession;

        
        if (!ctx.state.sessions[sesh.id]) {
            Vue.set(ctx.state.sessions, sesh.id, sesh);
            ctx.state.orderedSessions.push(sesh.id);
        }
        else {
            Vue.set(ctx.state.sessions, sesh.id, sesh);
        }
        Vue.set(ctx.state.crosswords, cwd.id, cwd);

        localStorage.setItem("sessions", JSON.stringify(ctx.state.orderedSessions.map(s=>ctx.getters.session(s))));
        localStorage.setItem("crosswords", JSON.stringify(ctx.state.crosswords));

        ctx.state.unsavedSession = null;
        ctx.state.unsavedCrossword = null;
    },
    updateName: (ctx, name: string) => {
        ctx.getters.activeSession.name = name;
    },
    loadSessions: (ctx) => {
        let str1 = localStorage.getItem("sessions");
        let str2 = localStorage.getItem("crosswords");
        let sessionList: Session[] = [];


        let crosswords = {};
        if (!!str1) sessionList = JSON.parse(str1);
        if (!!str2) crosswords = JSON.parse(str2);
        let sessions: { [id: string]: Session } = sessionList.reduce((p: { [id: string]: Session }, c) => {p[c.id] = c; return p}, {});
        Vue.set(ctx.state, 'sessions', sessions)
        Vue.set(ctx.state, 'crosswords', crosswords);
        Vue.set(ctx.state, 'orderedSessions', sessionList.map(s=>s.id));
    },
    loadPuzzle: (ctx) => {
        let pz = localStorage.getItem("puzzle");
        if (!!pz) ctx.dispatch("loadEditor", JSON.parse(pz));
        else {
            ctx.dispatch("createPuzzle", { rows: 15, cols: 15 });
        }
    },
    loadSavedSession: (ctx, id: string) => {
        let session: Session = ctx.getters.session(id);
        if (!session) return;
        let cwd = ctx.getters.crossword(session.crosswordId);
        ctx.state.activeSessionId = id;
        ctx.state.unsavedSession = null;
    },
    loadSnap: (ctx, id: string) => {
        let session: Session = ctx.getters.activeSession;
        if (!session) return;
        let cwd = ctx.getters.crossword(id);
        let activeCwd = ctx.getters.crossword(session.crosswordId);
        let clone = JSON.parse(JSON.stringify(cwd));
        clone.id = session.crosswordId;
        Vue.set(ctx.state.crosswords, clone.id, clone);
        //activeCwd.id = session.crosswordId;

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
        let cwd = { rows: rows, cols: cols, cells: cells, id: S4() };
        let sesh: Session = {
            name: "Untitled..",
            id: S4(),
            crosswordId: cwd.id,
            snaps: []
        }
        ctx.state.crosswords[cwd.id] = cwd;
        ctx.state.unsavedSession = sesh;
        ctx.state.unsavedCrossword = cwd;
        ctx.state.activeSessionId = sesh.id;
    },
    saveSnap(ctx, cwd: Crossword) {
        if (!!ctx.state.unsavedSession) return;
        cwd = JSON.parse(JSON.stringify(cwd))
        cwd.id = S4();
        Vue.set(ctx.state.crosswords, cwd.id, cwd);
        if (!ctx.getters.activeSession.snaps) Vue.set(ctx.getters.activeSession, 'snaps', [])
        ctx.getters.activeSession.snaps.push(cwd.id);
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
    activeSessionId: null,
    sessions: {},
    crosswords: {},
    unsavedCrossword: null,
    unsavedSession: null,
    orderedSessions: []
}

export const module = {
    state: defaultState,
    mutations: mutations,
    getters: getters,
    actions: actions
}
