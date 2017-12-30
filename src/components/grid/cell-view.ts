export class CellView {
    row: number;
    col: number;
    class: string;
    value: string;

    private classList: any = {};

    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
        this.value = "";
        this.class = "";
    }
    addClass(...names: string[]): void {
        for (let i in names) {
            this.classList[names[i]] = 1;
        }
        this.updateClass();
    }
    removeClass(...names: string[]): void {
        for (let name of names) {
            delete this.classList[name]
        }
        this.updateClass();
    }
    removeAllClasses() {
        this.classList = {};
        this.updateClass();
    }
    private updateClass() {
        let name = Object.keys(this.classList).join(" ");
        if (!name) name = ""
        this.class = name;
    }
}