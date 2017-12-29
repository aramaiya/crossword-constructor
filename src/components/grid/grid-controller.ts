import { CellView } from './cell-view';

export abstract class GridController {
    protected cellViews: CellView[][] = [[]];

    attachCellViews(cellViews: CellView[][]): void {
        this.cellViews = cellViews
    }
    handleMouseDown(cell: CellView, e: MouseEvent): void {};
    handleKeyDown(e: KeyboardEvent): void {};
    handleKeyUp(e: KeyboardEvent): void {}
}

