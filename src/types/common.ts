export interface Crossword {
    id: string;
    rows: number;
    cols: number;
    cells: Cell[][];
}

export interface Cell {
    id: number;
    position: {
        row: number,
        col: number
    };
    type: CellType;
    value: string;
    circled: boolean;
}

export var Cell: {
    new(value?: any): Cell;
}

export enum CellType {
    Value,
    Block,
}

export interface Session {
    id: string;
    name: string;
    crosswordId: string;
}

export enum Direction {
    Horizontal,
    Vertical
}

export enum Movement {
    Left,
    Right,
    Up,
    Down
}

export enum Mode {
    Fill = "Fill",
    Draw = "Draw",
    Arrange = "Arrange",
    Generate = "Generate",
    Complete = "Complete",
    Solve = "Solve"
}

export enum Symmetry {
    Radial = "Radial",
    Horizontal = "Horizontal",
    Vertical = "Vertical",
    None = "None"
}

