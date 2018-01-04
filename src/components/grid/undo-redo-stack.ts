import { GridData } from "./grid-handler";

class UndoRedoStack {
    private stack: Array<string> = [];
    private currentStateIx: number = -1;

    reset() {
        this.stack = [];
        this.currentStateIx = -1;
    }

    save(data: GridData) {
        if (this.currentStateIx < this.stack.length - 1)
            this.stack=this.stack.slice(0, this.currentStateIx+1);
        this.stack.push(JSON.stringify(data));
        console.log("saved state to stack", this.stack)
        this.currentStateIx = this.stack.length - 1;
    }

    undo() {
        if (this.currentStateIx <= 0) return;
        this.currentStateIx--;
        let last = this.stack[this.currentStateIx];
        if (!!last) return JSON.parse(last);
        return null;
    }

    redo() {
        if (this.currentStateIx === this.stack.length - 1) return;
        this.currentStateIx++;
        let last = this.stack[this.currentStateIx];
        if (!!last) return JSON.parse(last);
        return null;
    }
}

export default new UndoRedoStack();