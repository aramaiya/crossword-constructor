export class Event<T> {
    name: string
    constructor(name: string) {
        this.name = name;
    }
}

export class EventService {
    private subs: {[event: string]: Function[]} = {};
    fire<T>(event: Event<T>, payload?: T) {
        let fns = this.subs[event.name] || [];
        for (let fn of fns) fn(payload);
    }
    subscribe<T>(event: Event<T>, cb: Function, ctx: any) {
        let fns = this.subs[event.name];

        if (!fns)  fns = [];
        
        fns.push(cb.bind(ctx))
        this.subs[event.name] = fns;
    }

    static Events = {
        UndoRequest: new Event<any>("undo-request"),
        RedoRequest: new Event<any>("redo-request"),
        ClearRequest: new Event<any>("clear-request"),
        ModeChangeRequest: new Event<any>("mode-change-request") 
    }
}

export const $eventService = new EventService();