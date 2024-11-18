import type { App } from 'vue';
import HelloWorld from './HelloWorld.vue';
import VueGridLayout from 'vue-grid-layout';

const components: Indexable = {
    HelloWorld,
    VueGridLayout,
};

const componentName: string[] = Object.keys(components);

export default {
    install: (app: App): void => {
        componentName.forEach((i) => {
            app.component(i, components[i]);
        });
    },
};
