import { GridHandler, GridData } from './grid-handler'
import { Cell, CellType } from '../../types/common';
import util from './crossword-util';
export class DrawGridHandler extends GridHandler {
    private mousePressed: boolean;
    private newType: CellType;

    mouseDownHandler = (cell: Cell, e: MouseEvent) => {
        this.mousePressed = true;
        if (cell.type === CellType.Value) this.newType = CellType.Block;
        else this.newType = CellType.Value;
        util(this.data.crossword).setType(cell.position.row, cell.position.col, this.newType, this.data.symmetry);
    }

    mouseOverHandler = (cell: Cell, e: MouseEvent) => {
        if (!this.mousePressed) return;
        console.log(e);
        util(this.data.crossword).setType(cell.position.row, cell.position.col, this.newType, this.data.symmetry);
    }

    mouseUpHandler = (cell: Cell, e: MouseEvent) => {
        this.mousePressed = false;
    }

    mouseExitHandler = (e: MouseEvent) => {
        console.log("mouse exit")
        this.mousePressed = false;
    }
}
