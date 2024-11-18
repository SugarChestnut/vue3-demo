import { defineStore } from 'pinia';
import { store } from '@/store';
import { getCookie } from '@/utils/cookies';
import { login, logout } from '@/api/user';

interface UserState {
    username: string;
    token: string;
}

const userStore = defineStore({
    id: 'user',
    state: (): UserState => ({
        username: getCookie('username') || '',
        token: getCookie('token') || '',
    }),
    getters: {},
    actions: {
        doLogin() {
            login();
        },
        doLogout() {
            logout();
        }
    }
});

export function useUserStoreWithOut(): Recordable {
    return userStore(store);
}
