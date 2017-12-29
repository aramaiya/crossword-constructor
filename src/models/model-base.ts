import {EventService, Event} from "../infra/event-service"
export abstract class ModelBase {
    protected eventService: EventService;
    
    constructor() {
        this.eventService = new EventService();
    }
    protected fire<T>(event: Event<T>, payload: T) {
        this.eventService.fire(event, payload);
    }
    subscribe<T>(event: Event<T>, cb: (c: T)=>void, ctx: any){
        this.eventService.subscribe(event, cb, ctx);
    }
}
