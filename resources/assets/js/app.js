window.App = require('auto-loader').load(__dirname + '/app');

require('../../../index');
import Router from '../../../src/Nodue/Router/Router';

window.Route = new Router();

require('../../../routes');

