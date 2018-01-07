
export interface Session {
    id: number;
    name: string;
    crosswordId: number;
    createdDate: Date;
    modifiedDate: Date;
}

export interface Crossword {
    id: number;
    rows: number;
    cols: number;
    cells: Cell[][];
}

export interface Snap {
    id: number;
    crosswordId: number;
    createdDate: Date;
    sessionId: number;
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

