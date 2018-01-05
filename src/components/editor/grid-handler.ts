import { Cell, Direction, Crossword, Mode, Symmetry } from "../../types/common";

export interface GridData {
    symmetry: Symmetry,
    mode: Mode;
    crossword: Crossword;
    selected: Cell;
    highlighted: { [id: string]: boolean };
    direction: Direction;
}

export abstract class GridHandler {
    protected data: GridData;
    constructor(data: GridData) {
        this.data = data;
    }
    mouseDownHandler = (c: Cell, e: MouseEvent) => { };
    mouseOverHandler = (c: Cell, e: MouseEvent) => { };
    mouseOutHandler = (c: Cell, e: MouseEvent) => { };
    mouseUpHandler = (c: Cell, e: MouseEvent) => { };
    keyDownHandler = (e: KeyboardEvent) => { };
    mouseExitHandler = (e: MouseEvent) => { };
}

