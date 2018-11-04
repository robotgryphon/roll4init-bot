import { DateTime } from "luxon";

export class SimpleDataSerializer {
    public static serialize<T>(inst: T): any {
        let keys = Object.keys(inst);
        let returned = {};
        keys.forEach(key => {
            returned[key] = this.convertItem(inst, key);
        });

        return returned;
    }

    static convertItem<T>(inst: T, key: string): any {
        let type = typeof inst[key];
        let val: any = inst[key];

        if (val instanceof DateTime) return val.toISO();

        return inst[key];
    }
}
