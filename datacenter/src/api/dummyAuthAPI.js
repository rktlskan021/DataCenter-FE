// src/api/dummyAuthAPI.js
export async function loginAPI(id, password) {
    // 더미 유저 데이터
    const dummyUsers = [
        { id: 'user', password: 'user1234', role: 'user', name: '이재영', token: 'abc-abc-abc' },
        { id: 'admin', password: 'admin1234', role: 'admin', name: '관리자', token: 'cba-cba-cba' },
    ];

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundUser = dummyUsers.find((u) => u.id === id && u.password === password);
            if (foundUser) {
                resolve({ success: true, user: foundUser });
            } else {
                reject({ success: false, message: '잘못된 로그인 정보' });
            }
        }, 500); // 0.5초 delay (실제 API 흉내)
    });
}
