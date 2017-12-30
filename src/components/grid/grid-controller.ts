import { CellView } from './cell-view';
import {Commander} from './command-history'
export abstract class GridController {
    protected cellViews: CellView[][] = [[]];
    protected commander: Commander = new Commander();

    attachCellViews(cellViews: CellView[][]): void {
        this.cellViews = cellViews
    }
    handleMouseDown(cell: CellView, e: MouseEvent): void {};
    handleKeyDown(e: KeyboardEvent): void {};
    handleKeyUp(e: KeyboardEvent): void {}

    protected undo() {
        this.commander.undo();
    }
    protected redo() {
        this.commander.redo();
    }
}