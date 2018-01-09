import Vuex, { GetterTree } from 'vuex'
import { MutationTree, ActionTree } from 'vuex'
import { Cell, CellType, Crossword, Movement, Direction, Symmetry, Session, Snap } from '../types/common'
import Vue from 'vue';
import LS from '../persistence/local-storage'
export interface AppState {
    activeSessionId: number;
    sessions: { [id: number]: Session };
    orderedSessions: number[];
    crosswords: { [id: number]: Crossword };
    snaps: { [id: number]: Snap };
    orderedSnaps: number[];
}

const mutations: MutationTree<AppState> = {
    SAVE_SESSION: (ctx, session: Session) => {

    }
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
        if (!!state.activeSessionId) sesh = state.sessions[state.activeSessionId];
        return sesh;
    },
    session: (state) => {
        return (id: number) => {
            return state.sessions[id];
        }
    },
    crossword: (state) => {
        return (id: number) => state.crosswords[id];
    },
    orderedSnaps: (state, getters) => {
        return (id: number) => {
            return state.orderedSnaps.map(s => state.snaps[s]).filter(s => s.sessionId === id);
        }
    }

}

const actions: ActionTree<AppState, any> = {
    saveSession: (ctx, cwd: Crossword) => {
        LS.saveCrossword(cwd);
        //ctx.dispatch("loadSessions");
    },
    loadSessions: (ctx) => {
        let sessionList = LS.getSessions();
        let crosswordsList = LS.getCrosswords();
        let snapsList = LS.getSnaps();
        let snaps: { [id: number]: Snap } = snapsList.reduce((p: { [id: number]: Snap }, c) => { p[c.id] = c; return p }, {});
        let sessions: { [id: number]: Session } = sessionList.reduce((p: { [id: number]: Session }, c) => { p[c.id] = c; return p }, {});
        let cwds: { [id: number]: Crossword } = crosswordsList.reduce((p: { [id: number]: Crossword }, c) => { p[c.id] = c; return p }, {});
        Vue.set(ctx.state, 'sessions', sessions)
        Vue.set(ctx.state, 'crosswords', cwds);
        Vue.set(ctx.state, 'orderedSessions', sessionList.map(s => s.id));
        Vue.set(ctx.state, 'orderedSnaps', snapsList.map(s => s.id));
        Vue.set(ctx.state, 'snaps', snaps);
    },
    loadSavedSession: (ctx, id: number) => {
        let session: Session = ctx.getters.session(id);
        if (!session) return;
        let cwd = ctx.getters.crossword(session.crosswordId);
        ctx.state.activeSessionId = id;
    },
    loadSnap: (ctx, id: string) => {
        let session: Session = ctx.getters.activeSession;
        if (!session) return;
        let cwd = ctx.getters.crossword(id);
        let activeCwd = ctx.getters.crossword(session.crosswordId);
        let clone = JSON.parse(JSON.stringify(cwd));
        clone.id = session.crosswordId;
        Vue.set(ctx.state.crosswords, clone.id, clone);
    },
    createSession: (ctx, { name, rows, cols }) => {
        return new Promise((rs, rj) => {
            let resp = LS.newSession(name, rows, cols);

            ctx.dispatch("loadSessions");
            rs(resp.session.id)
        });
    },
    saveSnap(ctx, cwd: Crossword) {
        let resp = LS.newSnap(ctx.state.activeSessionId, cwd);
        ctx.state.orderedSnaps.push(resp.snap.id);
        Vue.set(ctx.state.snaps, resp.snap.id.toString(), resp.snap);
        Vue.set(ctx.state.crosswords, resp.crossword.id.toString(), resp.crossword);
    },
    deleteSnap(ctx, id: number) {
        let snap = ctx.state.snaps[id];
        let cwd = ctx.state.crosswords[snap.crosswordId];
        LS.deleteSnap(id);
        
        let idx = ctx.state.orderedSnaps.findIndex(s=>s===id);
        ctx.state.orderedSnaps.splice(idx,1);
        Vue.delete(ctx.state.snaps, snap.id.toString())
        Vue.delete(ctx.state.crosswords, cwd.id.toString())
    },
    deleteSession(ctx, id: number) {
        LS.deleteSession(id);
        ctx.dispatch("loadSessions");
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
    orderedSessions: [],
    orderedSnaps: [],
    snaps: {}
}

export const module = {
    state: defaultState,
    mutations: mutations,
    getters: getters,
    actions: actions
}
