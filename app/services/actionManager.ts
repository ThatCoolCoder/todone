export type Action = {
    action: () => any,
    onComplete: (value: unknown) => void,
    name: string,
}

// Class to orchestrate async actions which must not execute simultaneously, using a queue.
// Runs actions in order of addition to the queue and supports queuing actions from inside other actions
// An action can be any function, when it finishes its main work (immediately before return for instance), it should call onFinished to allow the next action to run
// example usage:

//  await actionManager.queue(() => {
//      let data = loadFromSomewhere();
//      data = process(data);
//      actionManager.onFinished();
//      return data;
//  }, "load data")

export class ActionManager {
    constructor(logging = false) {
        this.logging = logging;
    }

    logging;
    current: Action | null = null;
    pending: Action[] = [];

    public queue(action: () => {}, name: string) {
        return new Promise((resolve, reject) => {
            this.pending.push({action, onComplete: resolve, name});

            if (this.pending.length == 1 && this.current == null) this.startQueue();
        })
    }

    startQueue() {
        // turns out these actually mean the same thing in our system
        this.onFinished();
    }

    public onFinished() {
        if (this.pending.length > 0) {
            let old = this.current;
            let current = this.pending.shift() as Action;
            this.current = current;
            if (old == null) this.log(`Starting: ${current.name}`)
            else  this.log(`Done: ${old.name}. Starting: ${current.name}`);

            let result = current.action()

            current.onComplete(result);
        }
        else {
            this.log(`Done: ${this.current?.name}. No actions left to do`);
            this.current = null;
        }
    }

    log(...args: any[]) {
        if (this.logging) console.log(...args);
    }
}