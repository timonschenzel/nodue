import test from 'ava';

global.app = require('../../../bootstrap/app');

app.basePath = __dirname + '/../../../';

app.bootstrap();

test(t => {
    t.deepEqual([1, 2], [1, 2]);
});