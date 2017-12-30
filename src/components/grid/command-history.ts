export class Commander {
    private commandStack: Array<Command[]> = [];
    private commandMarker: number = -1;

    execute(...commands: Command[]) {
        if (this.commandMarker < this.commandStack.length - 1) {
            this.commandStack = this.commandStack.slice(0, this.commandMarker + 1);
        }
        this.commandStack.push(commands);
        this.commandMarker = this.commandStack.length - 1;
        this.commandStack[this.commandMarker].forEach(c=>c.execute());
    }
    undo(): void {
        if (this.commandMarker < 0) return;
        this.commandStack[this.commandMarker].forEach(c=>c.undo());
        this.commandMarker--;
    }
    redo(): void {
        if (this.commandMarker===this.commandStack.length - 1) return;
        this.commandMarker++;
        this.commandStack[this.commandMarker].forEach(c=>c.execute());
    }
}
export interface Command {
    execute(): void;
    undo(): void;
}