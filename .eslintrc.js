module.exports =  {
    plugins: [
        "@typescript-eslint/eslint-plugin",
        "eslint-plugin-tsdoc"
    ],
    extends:  [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    parser:  '@typescript-eslint/parser',
    parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
        ecmaVersion: 2018,
        sourceType: "module"
    },
    rules: {
        "tsdoc/syntax": "warn",
        "@typescript-eslint/no-namespace": "warn",
        quotes: [2, "single", "avoid-escape"],
        semi: ["error", "always"]
    },
    env: {
        jest: true
    }
};
