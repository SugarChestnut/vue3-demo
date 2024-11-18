const cookie = {
    prefix: 'demo', //cookie前缀
    expire: 7 * 24 * 60 * 60, //7天的有效时间
    auto_start: true, //是否开启cookie
};

const setCookie = function (key: string, value: CookieValue, expires = 0, prefix?: string): void {
    if (!cookie.auto_start) return;
    if (typeof value === 'object') {
        value = JSON.stringify(value);
    }
    expires = expires ? expires : cookie.expire;
    prefix = prefix ?? cookie.prefix + '_';
    const expDate = new Date();
    expDate.setTime(expDate.getTime() + expires * 1000);
    document.cookie = prefix + key + '=' + encodeURIComponent(value) + ';path=/;expires=' + expDate.toUTCString();
};

/**
 * @description 批量添加cookie
 * @param values - 键值对象
 * @param expires - 过期时间(时)
 * @param prefix - 前缀
 */
const setAllCookie = function (values: { [propName: string]: CookieValue }, expires?: number, prefix?: string) {
    for (const [key, value] of Object.entries(values)) {
        setCookie(key, value, expires, prefix);
    }
};

/**
 * @description 获取cookie
 */
const getCookie = function (key: string, type = 'string'): any {
    const arr = document.cookie.split('; ') || [];
    for (const value of arr) {
        const _arr = value.split('=');
        if (_arr[0] === cookie.prefix + '_' + key) {
            if (type === 'object') {
                return JSON.parse(decodeURIComponent(_arr[1]));
            }
            return decodeURIComponent(_arr[1]);
        }
    }
};

/**
 * @description 删除cookie
 */
const delCookie = function (key: string) {
    setCookie(key, '', -1, '');
};

/**
 * @description 清空所有 cookie
 */
const clearAllCookie = function () {
    /**
     * [^ =;]+  匹配空格、=、; 外的字符至少一个
     * ?=   正向肯定预查，匹配 = 前面的字符串，结合上面，就能获取等号左边的键
     * /g   表示全局查找，而不是找到一个就停止
     * || []    没有匹配到的时候，match 返回 null，这时候返回 []
     */
    const keys = document.cookie.match(/[^ =;]+(?==)/g) || [];
    keys.forEach((key) => {
        if (key.includes(`${cookie.prefix}_`)) {
            setCookie(key, '', -1, '');
        }
    });
};

export { setCookie, setAllCookie, getCookie, delCookie, clearAllCookie };
