import Vue, { PluginFunction } from "vue";

export interface WAction {
    message: string;
    func: (...args : any[]) => any;
}

export interface Worker {
    postMessage(message: string, args?: any[]): Promise<any>;
    postAll(...message:string[] | { message: string, args: any[] }[] | any[] ): Promise<any>;
    register(action: WAction | WAction[]);
    unregister(message: string[])

}

export declare class WWorker {

    constructor();

    create(actions?: WAction[]): Worker;
    run(func: (...args : any[]) => any, args: any[]): Promise<any>;

    static install: PluginFunction<never>;

}

