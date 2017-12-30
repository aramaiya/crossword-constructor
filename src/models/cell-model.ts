import { ModelBase } from "./model-base"
import * as EventService from "../infra/event-service"
import { $builderModel, BuilderModel } from "./builder-model";

export class CellModel extends ModelBase {
    private meta: any = { rows: 0, cols: 0, cells: [] };

    private cells: Array<Cell> = [];
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

    setValue(cell: Cell, value: string) {
        if (cell.value !== value || cell.type === CellType.Block) {
            cell.value = value;
            if (cell.type === CellType.Block) cell.type = CellType.Value;
            this.fire(CellModel.Events.CELL_UPDATED, cell);
        }
    }

    setType(cell: Cell, type: CellType) {
        if (cell.type != type || cell.value !== '') {
            cell.type = type;
            if (type === CellType.Block) cell.value = '';
            this.fire(CellModel.Events.CELL_UPDATED, cell);
        }
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

export const $cellModel = new CellModel();