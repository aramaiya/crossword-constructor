import { Crossword, CellType, Symmetry } from "../../types/common";

export default function (cwd: Crossword) {
    return {
        setType: function (row: number, col: number, type: CellType, symmetry: Symmetry) {
            let cell = cwd.cells[row][col];
            cell.type = type;
            if (cell.type === CellType.Block) cell.value = "";
            if (symmetry === Symmetry.None) return;

            switch (symmetry) {
                case Symmetry.Radial:
                    this.setType(cwd.rows - row - 1, cwd.cols - col - 1, type, Symmetry.None);
                    break;
                case Symmetry.Horizontal:
                    this.setType(row, cwd.cols - col - 1, type, Symmetry.None);
                    break;
                case Symmetry.Vertical:
                    this.setType(cwd.rows - row - 1, col, type, Symmetry.None);
                    break;
                default:
                    return;
            }
        },

        setValue: function (row: number, col: number, value: string) {
            let cell = cwd.cells[row][col];
            cell.value = value;
            if (cell.type === CellType.Block) cell.type = CellType.Value;
        },

        clearAll() {
            for (let row of cwd.cells) {
                for (let cell of row) 
                this.setValue(cell.position.row, cell.position.col, '');
            }
        },

        clearValues() {
            for (let row of cwd.cells) {
                for (let cell of row) 
                    if (cell.type === CellType.Value) this.setValue(cell.position.row, cell.position.col, '');
            }
        },
        
        
    }
}