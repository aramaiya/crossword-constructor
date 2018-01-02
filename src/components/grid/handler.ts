import { GridData } from "./grid-handler";
import { FillGridHandler } from "./fill-grid-handler";
import { Store } from "vuex";
import { DrawGridHandler } from "./draw-grid-handler";
import { Mode } from "../../types/common";

export const getHandler = (store: Store<any>, data: GridData) => {
    let fgHandler = new FillGridHandler(store, data);
    let dgHandler = new DrawGridHandler(store, data);
    return (mode: Mode) => {
        switch (mode) {
            case (Mode.Fill):
                return fgHandler;
            case (Mode.Draw):
                return dgHandler;
        }
    }
}

