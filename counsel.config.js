module.exports = {
    reporter: './reporters/DotReporter',
    bootstrap: 'bootstrap/autoload',
    vue: {
        require: () => {
            return require('vue');
        },
        referenceName: "Vue"
    },
    files: [
        "Nodue/tests/Feature"
    ],
    autoloadClasses: {
        NodueTestCase: 'Nodue/src/Testing/TestCase.js',
    },
    env: {
        'APP_ENV': 'testing',
    }
}
