import { ModelBase } from "./model-base"
import * as EventService from "../infra/event-service"
import { $builderModel, BuilderModel } from "./builder-model";

    export class CellModel extends ModelBase {
        private meta: any = { rows: 0, cols: 0, cells: [] };

        private cells: Array<Cell> = [];
        private commandStack: MultiCommand[] = [];
        rows: number;
        cols: number;

        constructor() {
            super();
            $builderModel.subscribe(BuilderModel.Events.NEW_PUZZLE_CREATED, this.initialize, this)
        }
        initialize() {
            this.cells = [];
            this.rows = $builderModel.rows;
            this.cols = $builderModel.cols;
            let area = this.rows * this.cols;
            for (let i = 0; i < area; i++) {
                let r = Math.floor(i / this.cols);
                let c = i % this.cols;
                let cell: Cell = {
                    position: [r, c],
                    type: CellType.Value,
                    value: '',
                    circled: false
                };
                this.cells.push(cell);
            }
        }

        load(json: string) {
            let meta = JSON.parse(json);
            this.rows = meta.rows;
            this.cols = meta.cols;
            this.cells = meta.cells;
        }

        commit(...commands: Command<any>[]) {
            let multi = new MultiCommand(commands);
            let payload = multi.execute()
            this.commandStack.push(multi);
            payload.forEach(p => this.fire(CellModel.Events.CELL_UPDATED, p));
        }

        undo() {
            let command = this.commandStack.pop() as MultiCommand;
            let payload = command.undo()
            payload.forEach(p => this.fire(CellModel.Events.CELL_UPDATED, p));
        }

        getCell(row: number, col: number) {
            return this.cells[row * this.cols + col];

        }

        getCells() {
            return this.cells;
        }

        toString() {
            let meta = {
                rows: this.rows,
                cols: this.cols,
                cells: this.cells
            }
            return JSON.stringify(meta)
        }

        static Events = {
            CELL_UPDATED: new EventService.Event<Cell>("cell-updated")
        }
    }

    export class MultiCommand implements Command<any> {
        private commands: Command<any>[];
        constructor(commands: Command<any>[]) {
            this.commands = commands;
        }
        execute() {
            let payload = [];
            for (let cmd of this.commands) {
                payload.push(cmd.execute());
            }
            return payload;
        }

        undo() {
            let payload = [];
            while (this.commands.length > 0) {
                let cmd = this.commands.pop() as Command<any>;
                payload.push(cmd.undo());
            }
            return payload;
        }

    }

    export class SetValueCommand implements Command<Cell> {
        cell: Cell;
        value: string;

        private oldValue: string;
        private oldType: CellType;
        constructor(cell: Cell, value: string) {
            this.cell = cell;
            this.value = value;
        }
        execute() {
            this.oldValue = this.cell.value;
            this.oldType = this.cell.type;

            this.cell.value = this.value;
            if (this.cell.type === CellType.Block) this.cell.type = CellType.Value;

            return this.cell;
        }

        undo() {
            this.cell.value = this.oldValue;
            this.cell.type = this.oldType;
            return this.cell;
        }
    }

    export class SetTypeCommand implements Command<Cell> {
        cell: Cell;
        type: CellType;

        private oldValue: string;
        private oldType: CellType;
        constructor(cell: Cell, type: CellType) {
            this.cell = cell;
            this.type = type;
        }
        execute() {
            this.oldType = this.cell.type;
            this.oldValue = this.cell.value;

            this.cell.type = this.type;
            if (this.type === CellType.Block) this.cell.value = '';

            return this.cell;
        }

        undo() {
            this.cell.value = this.oldValue;
            this.cell.type = this.oldType;
            return this.cell;
        }
    }

    export interface Cell {
        position: [number, number];
        type: CellType;
        value: string;
        circled: boolean;
    }

    export enum CellType {
        Value,
        Block,
    }

    interface Command<T> {
        execute(): T;
        undo(): T;
    }

    export const $cellModel = new CellModel();