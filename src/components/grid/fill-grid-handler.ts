import { Keycodes } from '../../constants/keycodes';
import { GridHandler, GridData } from './grid-handler'
import { Commander, Command } from './command-history'
import { Cell, Direction, CellType, Movement } from '../../types/common'
import { Store } from 'vuex';
import { EditorState } from '../../store/editor';
import Vue from 'vue';
export class FillGridHandler extends GridHandler {
    mouseDownHandler = (cell: Cell, e: MouseEvent) => {
        if (cell.id !== this.data.selected.id) {
            this.data.selected = cell;
            this.changeDirection(this.data.direction);
        } else {
            if (this.data.direction === Direction.Horizontal) this.changeDirection(Direction.Vertical);
            else this.changeDirection(Direction.Horizontal);
        }
    }


    keyDownHandler = (e: KeyboardEvent) => {
        let direction = this.data.direction;
        let selected = this.data.selected;
        e.preventDefault();
        switch (e.keyCode) {
            case Keycodes.DownArrow:
                if (direction === Direction.Vertical)
                    this.moveSelection(Movement.Down);
                else
                    this.changeDirection(Direction.Vertical);
                break;
            case Keycodes.UpArrow:
                if (direction === Direction.Vertical)
                    this.moveSelection(Movement.Up);
                else
                    this.changeDirection(Direction.Vertical);
                break;
            case Keycodes.LeftArrow:
                if (direction === Direction.Horizontal) {
                    this.moveSelection(Movement.Left);
                }
                else
                    this.changeDirection(Direction.Horizontal);
                break;
            case Keycodes.RightArrow:
                if (direction === Direction.Horizontal)
                    this.moveSelection(Movement.Right);
                else
                    this.changeDirection(Direction.Horizontal);
                break;
        }
        if (e.keyCode >= Keycodes.A && e.keyCode <= Keycodes.Z) {
            let val = String.fromCharCode(e.keyCode).toUpperCase();

            this.store.dispatch("changeValue", { row: selected.position.row, col: selected.position.col, value: val})
            if (direction === Direction.Horizontal) {
                this.moveSelection(Movement.Right);
            } else {
                this.moveSelection(Movement.Down);
            }
        } else if (e.keyCode === Keycodes.Space) {
            let type = CellType.Block;
            if (selected.type === CellType.Block) type = CellType.Value;

            this.store.dispatch("changeType", { row: selected.position.row, col: selected.position.col, type: type, symmetry: this.data.symmetry  });

            if (direction === Direction.Horizontal) {
                this.moveSelection(Movement.Right);
            } else {
                this.moveSelection(Movement.Down);
            }
        } else if (e.keyCode === Keycodes.Backspace) {
            if (selected.value === "" && selected.type === CellType.Value) {
                if (direction === Direction.Horizontal) {
                    this.moveSelection(Movement.Left);
                } else {
                    this.moveSelection(Movement.Up);
                }
            }
            selected = this.data.selected;
            this.store.dispatch("changeValue", { row: selected.position.row, col: selected.position.col, value: "" })
        }

    }
    private changeDirection = (direction: Direction) => {
        Vue.set(this.data, "highlighted", {});

        let cells: Cell[] = [];
        if (direction === Direction.Horizontal) {
            for (let c of this.data.crossword.cells[this.data.selected.position.row]) {
                cells.push(c);
            }
        }
        else {
            for (let row of this.data.crossword.cells) {
                let c = row[this.data.selected.position.col];
                cells.push(c);
            }
        }
        this.data.direction = direction;
        cells.forEach(c => Vue.set(this.data.highlighted, c.id.toString(), true));
    }

    private moveSelection = (movement: Movement) => {
        let row = this.data.selected.position.row;
        let col = this.data.selected.position.col;
        let cwd = this.data.crossword;
        switch (movement) {
            case Movement.Left:
                if (col === 0) {
                    if (row > 0) {
                        col = cwd.cols - 1;
                        row = row - 1;
                    }
                }
                else {
                    col = col - 1;
                }
                break;
            case Movement.Right:
                if (col === cwd.cols - 1) {
                    if (row < cwd.rows - 1) {
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
                        row = cwd.rows - 1;
                        col = col - 1
                    }
                } else {
                    row = row - 1;
                }
                break;
            case Movement.Down:
                if (row === cwd.rows - 1) {
                    if (col < cwd.cols - 1) {
                        row = 0;
                        col = col + 1;
                    }
                } else {
                    row = row + 1;
                }
        }
        let cell = cwd.cells[row][col];
        this.data.selected = cell;
        this.changeDirection(this.data.direction)
    }
}