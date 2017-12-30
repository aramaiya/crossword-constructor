import {$cellModel, Cell, CellType, CellModel } from '../../models/cell-model';
import { CellView } from './cell-view';
import {Commander} from './command-history'
import { $eventService, EventService } from '../../infra/event-service';
export abstract class GridController {
    protected cellViews: CellView[][] = [[]];
    protected commander: Commander = new Commander();

    attachCellViews(cellViews: CellView[][]): void {
        this.cellViews = cellViews
        $cellModel.subscribe(CellModel.Events.CELL_UPDATED, this.cellUpdated, this);
        $eventService.subscribe(EventService.Events.UndoRequest, this.undo, this);
        $eventService.subscribe(EventService.Events.RedoRequest, this.redo, this);

        this.cellViews.forEach(cv=>cv.forEach(c=>c.removeAllClasses()));
        $cellModel.getCells().forEach(c=>this.cellUpdated(c));
    }
    handleMouseDown(cell: CellView, e: MouseEvent): void {};
    handleKeyDown(e: KeyboardEvent): void {};
    handleKeyUp(e: KeyboardEvent): void {}
    handleMouseOver(cell: CellView, e: MouseEvent): void {};
    handleMouseOut(cell: CellView, e: MouseEvent): void {};
    handleMouseUp(cell: CellView, e: MouseEvent): void {};

    private undo() {
        this.commander.undo();
    }
    private redo() {
        this.commander.redo();
    }
    protected clearBoard() {};
    protected cellUpdated(c: Cell) {
        if (!!this.cellViews && this.cellViews.length > 0 && this.cellViews[0].length > 0)
        console.log(c);
        let cv = this.cellViews[c.position[0]][c.position[1]];
        cv.value = c.value;
        if (c.type === CellType.Block) {
            cv.addClass("blocked");
        }
        else {
            cv.removeClass("blocked");
        }
    }
}