// Vue 响应式拖放网格布局组件
declare module 'vue-grid-layout' {
    import Vue from 'vue';

    export class GridLayout extends Vue {}

    export class GridItem extends Vue {}

    export interface GridItemData {
        x: number;
        y: number;
        w: number;
        h: number;
        i: string;
    }
}
