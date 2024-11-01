import { defineStore } from "pinia";

/*global Nullable*/
interface AppState {
    durationRow: Recordable;
    utc: string;
    utcHour: number;
    utcMin: number;
    eventStack: (() => unknown)[];
    timer: Nullable<TimeoutHandle>;
    autoRefresh: boolean;
    version: string;
    isMobile: boolean;
    reloadTimer: Nullable<IntervalHandle>;
    allMenus: MenuOptions[];
    theme: string;
}

export const appStore = defineStore({
    id: "app"
})
