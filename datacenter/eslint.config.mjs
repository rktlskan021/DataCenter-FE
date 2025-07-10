import js from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parser: '@babel/eslint-parser',
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                requireConfigFile: false,
                babelOptions: {
                    presets: ['@babel/preset-react'],
                },
            },
        },
        plugins: {
            prettier: prettierPlugin,
            react: reactPlugin,
        },
        rules: {
            'react/react-in-jsx-scope': 'off',
            // 빈 함수 금지
            'no-empty-function': 'error',

            // 사용하지 않는 변수/함수 인자 금지 (단, _로 시작하는 건 허용)
            'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

            // 콜백은 arrow function 권장 (단순 권장이라 'warn')
            'prefer-arrow-callback': 'warn',

            // 변수, 함수는 camelCase 필수
            camelcase: ['error', { properties: 'always' }],
            // Prettier 규칙 (포매팅 에러로 표시)
            'prettier/prettier': 'error',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
];
