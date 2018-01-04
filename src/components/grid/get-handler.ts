import { GridData } from "./grid-handler";
import { FillGridHandler } from "./fill-grid-handler";
import { DrawGridHandler } from "./draw-grid-handler";
import { Mode } from "../../types/common";

export default (data: GridData) => {
    let fgHandler = new FillGridHandler(data);
    let dgHandler = new DrawGridHandler(data);
    return (mode: Mode) => {
        switch (mode) {
            case (Mode.Fill):
                return fgHandler;
            case (Mode.Draw):
                return dgHandler;
        }
    }
}

