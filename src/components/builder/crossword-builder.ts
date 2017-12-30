import { GridController } from "../grid/grid-controller";
import { FillGridController } from "../grid/fill-grid-controller";
import { DrawGridController } from "../grid/draw-grid-controller";

export class CrosswordBuilder {
    mode: Mode = Mode.Fill;
    controller: GridController;
    
    constructor() {
        this.setMode(Mode.Fill);
    }

    setMode(mode: Mode) {
        switch (mode){
            case Mode.Fill:
                this.controller = new FillGridController();
                break;
            case Mode.Draw:
                this.controller = new DrawGridController();
        }
    }
}

export enum Mode {
    Fill = "Fill",
    Draw = "Draw",
    Arrange = "Arrange",
    Generate = "Generate",
    Complete = "Complete",
    Solve = "Solve"
}

export const $crosswordBuilder = new CrosswordBuilder();