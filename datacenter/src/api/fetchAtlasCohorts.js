// src/api/sampleCohorts.js

const sampleCohorts = Array.from({ length: 42 }, (_, i) => ({
    id: i + 1,
    name: `Atlas 코호트 ${i + 1}`,
    description: `설명 ${i + 1}`,
    patientCount: Math.floor(Math.random() * 1000),
    author: `작성자 ${i + 1}`,
    createdDate: '2024-07-10',
    modifiedDate: '2024-07-10',
}));

export function fetchAtlasCohorts() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(sampleCohorts);
        }, 500); // 0.5초 딜레이로 API처럼 동작
    });
}
