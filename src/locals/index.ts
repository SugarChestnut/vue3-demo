import { createI18n } from 'vue-i18n';

import zh from './lang/zh';
import en from './lang/en';

const messages = {
    zh,
    en,
};

const saveLanguage = window.localStorage.getItem('language');
// navigator 是 web 开发中的一个内置对象。它包含了有关浏览器和用户操作系统的各种信息，并提供了一些与浏览器操作相关的方法
let language = navigator.language.split('-')[0];
if (!saveLanguage) {
    window.localStorage.setItem('language', language);
}
language = saveLanguage ? saveLanguage : language;
const i18n = createI18n({
    legacy: false,
    locale: language,
    messages,
});

export default i18n;
