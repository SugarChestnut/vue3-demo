const autofocusDirective = {
    install(app) {
        app.directive('autofocus', {
            mounted(el) {
                el.focus();
            },
        });
    },
};
export default autofocusDirective;
