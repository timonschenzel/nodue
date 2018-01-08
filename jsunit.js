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
        "Nodue/tests"
    ],
}
