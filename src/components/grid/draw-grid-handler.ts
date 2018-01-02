import { GridHandler, GridData } from './grid-handler'
import { Store } from 'vuex';
import { Cell, CellType } from '../../types/common';

export class DrawGridHandler extends GridHandler {
    private mousePressed: boolean;
    private newType: CellType;

    mouseDownHandler = (cell: Cell, e: MouseEvent) => {
        this.mousePressed = true;
        if (cell.type === CellType.Value) this.newType = CellType.Block;
        else this.newType = CellType.Value;
        this.store.dispatch("changeType", { row: cell.position.row, col: cell.position.col, type: this.newType, symmetry: this.data.symmetry });
    }


    mouseOverHandler = (cell: Cell, e: MouseEvent) => {
        if (!this.mousePressed) return;
        this.store.dispatch("changeType", { row: cell.position.row, col: cell.position.col, type: this.newType, symmetry: this.data.symmetry });
    }


    mouseUpHandler = (cell: Cell, e: MouseEvent) => {
        this.mousePressed = false;
    }

    mouseExitHandler = (e: MouseEvent) => {
        console.log("mouse exit")
        this.mousePressed = false;
    }
}
