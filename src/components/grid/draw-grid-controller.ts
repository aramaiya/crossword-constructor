import { Cell, CellType, CellModel } from '../../models/cell-model';
import { CellView } from './cell-view';
import { Keycodes } from '../../constants/keycodes';
import { $eventService, EventService } from '../../infra/event-service';
import { $cellModel } from '../../models/cell-model'
import { GridController } from './grid-controller'
import { Commander, Command } from './command-history'
enum Direction {
    Horizontal,
    Vertical
}

enum Movement {
    Left,
    Right,
    Up,
    Down
}

export class DrawGridController extends GridController {

    private mousePressed: boolean;
    private newType: CellType;

    attachCellViews(cellViews: CellView[][]) {
        super.attachCellViews(cellViews);
    }

    handleMouseDown(cv: CellView, e: MouseEvent): void {
        this.mousePressed = true;
        let cell = $cellModel.getCell(cv.row, cv.col);
        if (cell.type === CellType.Value) this.newType = CellType.Block;
        else this.newType = CellType.Value;
        this.setType(cell);
    }

    handleMouseOver(cv: CellView, e: MouseEvent): void {
        if (!this.mousePressed) return;
        let cell = $cellModel.getCell(cv.row, cv.col);
        if (cell.type === CellType.Value) this.newType = CellType.Block;
        this.setType(cell);
    }

    handleMouseUp(cv: CellView, e: MouseEvent): void {
        this.mousePressed = false;
    }
    
    private setType(cell: Cell) {
        let cmd = this.setTypeCommandFactory.Create(cell, this.newType);
        this.commander.execute(cmd);
    }

    clearBoard(){}

    setTypeCommandFactory = {
        Create: (cell: Cell, type: CellType) => {
            let cmd = {} as Command;
            let oldValue: string;
            let oldType: CellType;
            let oldSelected: CellView;
            let oldDirection: Direction
            cmd.execute = () => {
                oldValue = cell.value;;
                oldType = cell.type;
                $cellModel.setType(cell, type);
            }
            cmd.undo = () => {
                $cellModel.setValue(cell, oldValue);
                $cellModel.setType(cell, oldType);
            }
            return cmd;
        }
    };
}