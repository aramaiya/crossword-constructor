import { Cell, Direction, Crossword, Mode, Symmetry } from "../../types/common";
import { Store } from "vuex";


export interface GridData {
    symmetry: Symmetry,
    mode: Mode;
    crossword: Crossword;
    selected: Cell;
    highlighted: { [id: string]: boolean };
    direction: Direction;
}

export abstract class GridHandler {
    protected store: Store<any>;
    protected data: GridData;
    constructor(store: Store<any>, data: GridData) {
        this.store = store;
        this.data = data;
    }
    mouseDownHandler = (c: Cell, e: MouseEvent) => { };
    mouseOverHandler = (c: Cell, e: MouseEvent) => { };
    mouseOutHandler = (c: Cell, e: MouseEvent) => { };
    mouseUpHandler = (c: Cell, e: MouseEvent) => { };
    keyDownHandler = (e: KeyboardEvent) => { };

}

