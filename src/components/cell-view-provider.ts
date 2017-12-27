import { $cellModel, Cell, CellType, SetTypeCommand, SetValueCommand } from '../models/cell-model';
import { CellView } from './cell-view';
import { Key } from './key';
import {$eventService, EventService} from '../infra/event-service';

export interface ModeBehavior {
    attach(data: any): void;
    handleMouseDown(cell: CellView, e: MouseEvent): void;
    handleKeyDown(e: KeyboardEvent): void;
    handleKeyUp(e: KeyboardEvent): void
}

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

export class FillModeBehavior implements ModeBehavior {
    private direction: Direction;
    private selectedCell: CellView;
    private highlightedCells: CellView[] = [];
    private cellStore: Array<Array<CellView>>;
    
    constructor() {
        $eventService.subscribe(EventService.Events.UndoRequest, this.undo, this);
        $eventService.subscribe(EventService.Events.ClearRequest, this.clearBoard, this);
        $cellModel.subscribe(this.cellUpdated, this);
    }
    attach(data: any) {
        this.cellStore = data.cells;
        this.selectCell(this.cellStore[0][0]);
        this.setDirection(Direction.Horizontal);
    }
    handleMouseDown(cell: CellView, e: MouseEvent): void {
        if (this.selectedCell === cell) {
            if (this.direction === Direction.Vertical) {
                this.setDirection(Direction.Horizontal)
            } else {
                this.setDirection(Direction.Vertical);
            }
        }
        else {
            this.selectCell(cell);
        }
    }
    handleKeyDown(e: KeyboardEvent): void {
        switch (e.keyCode) {
            case Key.DownArrow:
                if (this.direction === Direction.Vertical)
                    this.moveSelection(Movement.Down);
                else
                    this.setDirection(Direction.Vertical);
                break;
            case Key.UpArrow:
                if (this.direction === Direction.Vertical)
                    this.moveSelection(Movement.Up);
                else
                    this.setDirection(Direction.Vertical);
                break;
            case Key.LeftArrow:
                if (this.direction === Direction.Horizontal) {
                    this.moveSelection(Movement.Left);
                }
                else
                    this.setDirection(Direction.Horizontal);
                break;
            case Key.RightArrow:
                if (this.direction === Direction.Horizontal)
                    this.moveSelection(Movement.Right);
                else
                    this.setDirection(Direction.Horizontal);
                break;
        }

        if (e.keyCode >= Key.A && e.keyCode <= Key.Z) {
            let cell = $cellModel.getCell(this.selectedCell.row, this.selectedCell.col);
            let val = String.fromCharCode(e.keyCode).toUpperCase();
            let cmd = new SetValueCommand(cell, val);
            $cellModel.commit(cmd);
            if (this.direction === Direction.Horizontal) {
                this.moveSelection(Movement.Right);
            } else {
                this.moveSelection(Movement.Down);
            }
        } else if (e.keyCode === Key.Space) {
            let cell = $cellModel.getCell(this.selectedCell.row, this.selectedCell.col);
            let dual = $cellModel.getCell($cellModel.rows - this.selectedCell.row - 1, $cellModel.cols - this.selectedCell.col - 1);
            let type: CellType = CellType.Block;
            if (cell.type === CellType.Block) type = CellType.Value;

            let cmd1 = new SetTypeCommand(cell, type);
            let cmd2 = new SetTypeCommand(dual, type);
            $cellModel.commit(cmd1, cmd2);

            if (this.direction === Direction.Horizontal) {
                this.moveSelection(Movement.Right);
            } else {
                this.moveSelection(Movement.Down);
            }
        } else if (e.keyCode === Key.Backspace) {
            let cell = $cellModel.getCell(this.selectedCell.row, this.selectedCell.col);
            if (cell.value === "" && cell.type === CellType.Value) {
                if (this.direction === Direction.Horizontal) {
                    this.moveSelection(Movement.Left);
                } else {
                    this.moveSelection(Movement.Up);
                }
            }
            cell = $cellModel.getCell(this.selectedCell.row, this.selectedCell.col);
            let cmd = new SetValueCommand(cell, '');
            $cellModel.commit(cmd);
        }
        else if (e.keyCode === Key.One) {
            this.undo();
        } else if (e.keyCode === Key.Two) {
            this.clearBoard();
        }
    }
    handleKeyUp(e: KeyboardEvent): void {
        throw new Error("Method not implemented.");
    }
    private moveSelection(movement: Movement) {
        let row = this.selectedCell.row;
        let col = this.selectedCell.col;
        switch (movement) {
            case Movement.Left:
                if (col === 0) {
                    if (row > 0) {
                        col = $cellModel.cols - 1;
                        row = row - 1;
                    }
                }
                else {
                    col = col - 1;
                }
                break;
            case Movement.Right:
                if (col === $cellModel.cols - 1) {
                    if (row < $cellModel.rows - 1) {
                        col = 0;
                        row = row + 1;
                    }
                } else {
                    col = col + 1;
                }
                break;
            case Movement.Up:
                if (row === 0) {
                    if (col > 0) {
                        row = $cellModel.rows - 1;
                        col = col - 1
                    }
                } else {
                    row = row - 1;
                }
                break;
            case Movement.Down:
                if (row === $cellModel.rows - 1) {
                    if (col < $cellModel.cols - 1) {
                        row = 0;
                        col = col + 1;
                    }
                } else {
                    row = row + 1;
                }
        }
        this.selectCell(this.cellStore[row][col]);
    }
    private selectCell(cell: CellView) {
        if (!cell) return;
        if (!!this.selectedCell) this.selectedCell.removeClass("selected");
        this.selectedCell = cell;
        this.selectedCell.addClass("selected");
        this.setDirection(this.direction);
    }
    private setDirection(direction: Direction) {
        this.highlightedCells.forEach(c => c.removeClass("highlighted"));


        if (direction === Direction.Horizontal) {
            for (let cell of this.cellStore[this.selectedCell.row]) {
                cell.addClass("highlighted");
                this.highlightedCells.push(cell);
            }
        }
        else {
            for (let row of this.cellStore) {
                let cell = row[this.selectedCell.col];
                cell.addClass("highlighted");
                this.highlightedCells.push(cell);
            }
        }
        this.direction = direction;
    }

    clearBoard() {
        let cmds = [];
        let cells = $cellModel.getCells();
        for (let cell of cells) {
            cmds.push(new SetValueCommand(cell, ''));
        }
        $cellModel.commit(...cmds);
    }

    undo() {
        $cellModel.undo();        
    }

    private cellUpdated(c: Cell) {
        console.log(c);
        let cv = this.cellStore[c.position[0]][c.position[1]];
        cv.value = c.value;
        if (c.type === CellType.Block) {
            cv.addClass("blocked");
        }
        else {
            cv.removeClass("blocked");
        }
    }
}