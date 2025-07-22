// src/api/sampleCohorts.js

const sampleCohorts = Array.from({ length: 42 }, (_, i) => ({
    id: i + 1,
    name: `Bento 코호트 ${i + 1}`,
    description: `설명 ${i + 1} 안녕하세요 이것은 코호트에 대한 설명입니다. 이것을 보시고 권한 요청하기 원하는 코호트를 선택하시면 됩니다. 설명 ${i + 1} 안녕하세요 이것은 코호트에 대한 설명입니다. 이것을 보시고 권한 요청하기 원하는 코호트를 선택하시면 됩니다.`,
    patientCount: Math.floor(Math.random() * 1000),
    author: `작성자 ${i + 1}`,
    createdDate: '2024-07-10',
    modifiedDate: '2024-07-10',
    origin: 'BENTO',
}));

export function fetchBentoCohorts() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(sampleCohorts);
        }, 500); // 0.5초 딜레이로 API처럼 동작
    });
}
