const express = require('express');
const cors = require('cors');
const {createServer: createViteServer} = require('vite');
const path = require("path");
const forceSsl = require('force-ssl-heroku');

const createServer = async () =>
{
	const app = express();

	app.use(cors());

	const vite = await createViteServer({
		server: { middlewareMode: 'ssr' }
	});

	app.use(vite.middlewares);
	
	app.use(forceSsl);

	app.use(express.static(path.join(__dirname, 'dist')));

	app.get('/', async (req, res) =>
	{
		res.sendFile(path.join(__dirname, 'dist', 'index.html'));
	});

	app.set('port', (process.env.PORT || 3000));

	app.listen(app.get('port'));
};

createServer();