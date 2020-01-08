module.exports = {
    reporter: './Components/Reporters/DotReporter',
    bootstrap: 'bootstrap/autoload',
    vue: {
        require: () => {
            return require('vue');
        },
        referenceName: "vm"
    },
    locations: [
        "Nodue/tests/Feature"
    ],
    autoloadClasses: {
        NodueTestCase: 'Nodue/src/Testing/TestCase.js',
    },
    env: {
        'APP_ENV': 'testing',
    }
}
