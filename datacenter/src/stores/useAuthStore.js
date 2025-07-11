import { create } from 'zustand';
import Cookies from 'js-cookie';

const useAuthStore = create((set) => ({
    user: null,
    name: Cookies.get('name') || null,
    token: Cookies.get('token') || null, // 쿠키에서 초기값 읽음
    isLoggedIn: !!Cookies.get('token'),
    isAdmin: !!Cookies.get('isAdmin'),

    login: (userInfo, token) => {
        Cookies.set('token', token, { expires: 7 }); // 쿠키 저장 (7일 유효)
        Cookies.set('name', userInfo.name, { expires: 7 }); // 쿠키 저장 (7일 유효)
        Cookies.set('isAdmin', userInfo.isAdmin, { expires: 7 }); // 쿠키 저장 (7일 유효)
        set({ name: userInfo.name, token, isLoggedIn: true, admin: userInfo.isAdmin });
    },

    logout: () => {
        Cookies.remove('token'); // 쿠키 삭제
        Cookies.remove('name'); // 쿠키 삭제
        set({ user: null, token: null, isLoggedIn: false });
    },
}));

export default useAuthStore;
