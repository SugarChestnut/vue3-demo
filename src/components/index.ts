import type { App } from 'vue';
import HelloWorld from './HelloWorld.vue';
import VueGridLayout from 'vue-grid-layout';

const components: Indexable = {
    HelloWorld,
    VueGridLayout,
};

const componentName: string[] = Object.keys(components);

export default {
    install: (vue: App): void => {
        vue.use(components['VueGridLayout']);
        componentName.forEach((i) => {
            vue.component(i, components[i]);
        });
    },
};
