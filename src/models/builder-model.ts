import * as EventService from "../infra/event-service"
import {ModelBase} from "./model-base";

export class BuilderModel extends ModelBase{
    rows: number;
    cols: number;

    constructor() {
        super();
        
    }
    createNewPuzzle(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;
        this.eventService.fire(BuilderModel.Events.NEW_PUZZLE_CREATED);
    }

    static Events = {
        NEW_PUZZLE_CREATED: new EventService.Event<any>("new-puzzle-created")
    }


}

export const $builderModel = new BuilderModel();

