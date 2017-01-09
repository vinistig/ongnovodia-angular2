function bootExpress(config) {
	// App setup
	const express          = require('express');
	const app              = express();
	const bodyParser       = require('body-parser');
	const optionMiddleware = apprequire('helpers/option-middleware.helper')

	// Nunjucks
	const nunjucks = require('nunjucks');
	nunjucks.configure('./app/views/', { autoescape: true, express: app });
	app.set('view engine', 'html');

	// Middleware
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json())
	app.use(optionMiddleware)

	// Frontend
	app.use(express.static('client/src'));

	// Routes
	const routes = require('../routes.js');
	app.use('/', routes);

	app.listen(config.port, () => { console.log('Express is up.'); });
}

module.exports = bootExpress;
