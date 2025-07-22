import { create } from 'zustand';
import Cookies from 'js-cookie';

const useAuthStore = create((set) => ({
    id: Cookies.get('id') || null,
    name: Cookies.get('name') || null,
    token: Cookies.get('token') || null, // 쿠키에서 초기값 읽음
    isLoggedIn: !!Cookies.get('token'),
    isAdmin: Cookies.get('isAdmin') === 'true',

    login: (userInfo) => {
        Cookies.set('id', userInfo.id, { expires: 7 });
        Cookies.set('token', userInfo.token, { expires: 7 }); // 쿠키 저장 (7일 유효)
        Cookies.set('name', userInfo.name, { expires: 7 }); // 쿠키 저장 (7일 유효)
        Cookies.set('isAdmin', userInfo.isAdmin ? 'true' : 'false', { expires: 7 }); // 쿠키 저장 (7일 유효)
        set({
            id: userInfo.id,
            name: userInfo.name,
            token: userInfo.token,
            isLoggedIn: true,
            isAdmin: userInfo.isAdmin,
        });
    },

    logout: () => {
        Cookies.remove('id'); // 쿠키 삭제
        Cookies.remove('token'); // 쿠키 삭제
        Cookies.remove('name'); // 쿠키 삭제
        Cookies.remove('isAdmin'); // 쿠키 삭제
        set({ user: null, token: null, isLoggedIn: false, isAdmin: null });
    },
}));

export default useAuthStore;
