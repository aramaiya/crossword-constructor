import { Session, Crossword, Snap, Cell, CellType } from "../types/common";

class LocalStorage {
    getSessions() {
        let str = localStorage.getItem("sessions");
        let sessionList: Session[] = [];

        if (!!str) {
            sessionList = JSON.parse(str);
            //hack
            sessionList.forEach(s => s.modifiedDate = new Date(s.modifiedDate));
            sessionList.forEach(s => s.createdDate = new Date(s.createdDate));
            sessionList.sort((a, b) => a.modifiedDate.getTime() - b.modifiedDate.getTime())
        }
        return sessionList;
    }
    getCrosswords() {
        let str = localStorage.getItem("crosswords");
        let crosswordsList: Crossword[] = [];

        if (!!str) {
            crosswordsList = JSON.parse(str);
        }
        return crosswordsList;
    }

    getSnaps(sessionId?: number) {
        let str = localStorage.getItem("snaps");
        let snapsList: Snap[] = [];

        if (!!str) {
            snapsList = JSON.parse(str);
            if (!!sessionId) snapsList = snapsList.filter(s => s.sessionId === sessionId);
            snapsList.forEach(s => s.createdDate = new Date(s.createdDate));
            snapsList.sort((a, b) => (a.createdDate.getTime() - b.createdDate.getTime()));
        }
        return snapsList;
    }

    newSession(name: string, rows: number, cols: number): { session: Session, crossword: Crossword } {
        let sessionList = this.getSessions();
        let crosswordList = this.getCrosswords();
        let maxSessionId = sessionList.reduce((acc, cur) => Math.max(acc, cur.id), 0) + 1;
        let maxCrosswordId = crosswordList.reduce((acc, cur) => Math.max(acc, cur.id), 0) + 1;
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
        let cwd = { rows: rows, cols: cols, cells: cells, id: maxCrosswordId };
        let sesh: Session = {
            name: name,
            id: maxSessionId,
            crosswordId: cwd.id,
            createdDate: new Date(),
            modifiedDate: new Date()
        }

        sessionList.push(sesh);
        crosswordList.push(cwd);
        localStorage.setItem("sessions", JSON.stringify(sessionList));
        localStorage.setItem("crosswords", JSON.stringify(crosswordList));

        return { session: sesh, crossword: cwd };
    }

    updateSession(session: Session) {
        let sessionList = this.getSessions();
        let idx = sessionList.findIndex(s => s.id === session.id);
        if (idx >= 0) {
            sessionList.splice(idx, 1, session);
            localStorage.setItem("sessions", JSON.stringify(sessionList));
            return true;
        }
        return false;
    }

    saveCrossword(crossword: Crossword) {
        let crosswordList = this.getCrosswords();
        let idx = crosswordList.findIndex(c => c.id === crossword.id);
        if (idx >= 0) {
            crosswordList.splice(idx, 1, crossword);
            localStorage.setItem("crosswords", JSON.stringify(crosswordList));
            return true;
        }
        return false;
    }

    deleteSession(id: number) {
        let sessionList = this.getSessions();
        let idx = sessionList.findIndex(s => s.id === id);
        if (idx < 0) return false;
        let crosswordIds = [];

        let crosswordList = this.getCrosswords();
        crosswordIds.push(sessionList[idx].crosswordId);
        sessionList.splice(idx, 1);

        let snapsList = this.getSnaps(id);
        crosswordIds = crosswordIds.concat(snapsList.map(s => s.crosswordId));
        for (let cid of crosswordIds) {
            let idx = crosswordList.findIndex(c => c.id === cid);
            if (idx >= 0) crosswordList.splice(idx, 1);
        }
        snapsList = snapsList.filter(s => s.sessionId !== id);

        localStorage.setItem("sessions", JSON.stringify(sessionList));
        localStorage.setItem("snaps", JSON.stringify(snapsList));
        localStorage.setItem("crosswords", JSON.stringify(crosswordList));
        return true;

    }

    newSnap(sessionId: number, crossword: Crossword): { snap: Snap, crossword: Crossword } {
        let snapsList = this.getSnaps();
        let maxSnapId = snapsList.reduce((acc, cur) => Math.max(acc, cur.id), 0) + 1;
        let crosswordList = this.getCrosswords();
        let maxCrosswordId = crosswordList.reduce((acc, cur) => Math.max(acc, cur.id), 0) + 1;

        let cwd = JSON.parse(JSON.stringify(crossword)) as Crossword;
        cwd.id = maxCrosswordId;

        let snap: Snap = {
            id: maxSnapId,
            crosswordId: cwd.id,
            sessionId: sessionId,
            createdDate: new Date(),
        }
        snapsList.push(snap);
        crosswordList.push(cwd);
        localStorage.setItem("snaps", JSON.stringify(snapsList));
        localStorage.setItem("crosswords", JSON.stringify(crosswordList));

        return { snap: snap, crossword: cwd };
    }
    deleteSnap(snapId: number) {
        let snapList = this.getSnaps();
        let idx = snapList.findIndex(s => s.id === snapId);
        if (idx < 0) return false;
        let snap = snapList[idx];
        snapList.splice(idx, 1);
        let crosswordList = this.getCrosswords();
        idx = crosswordList.findIndex(c=>c.id === snap.crosswordId);
        
        crosswordList.splice(idx, 1);

        localStorage.setItem("snaps", JSON.stringify(snapList));
        localStorage.setItem("crosswords", JSON.stringify(crosswordList));
    }
}

export default new LocalStorage();