
const path = require("path");
const express = require("express");
//const proxy = require("http-proxy-middleware");
const webpack = require("webpack");
const config = require("./webpack.dev");
const fs = require("file-system");

const app = express();
const port = 3000;
const compiler = webpack(config);

//if there is need to proxy and exclude some methods, use this below
//app.use('/api', proxy(['!**/api/advertisers/**'], { target: 'http://localhost:3001' })); //from http-proxy-middleware library

app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath
}));

app.use(require("webpack-hot-middleware")(compiler));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.get('/api/advertisers', (req, res) => {
    if (req.query.format === 'JSON') {
        fs.readFile(path.join(__dirname, 'mock/response.json'), 'utf8', function (err, data) {
            if (err) {
                res.status(500).send('Read file error: ' + err);
                return console.log(err);
            }
            res.set('Content-Type', 'application/json');
            res.send(data);
        });
    } else if (req.query.format === 'XML') {
        fs.readFile(path.join(__dirname, 'mock/response.xml'), 'utf8', function (err, data) {
            if (err) {
                res.status(500).send('Read file error: ' + err);
                return console.log(err);
            }
            res.set('Content-Type', 'application/xml');
            res.send(data);
        });
    } else {
        res.status(500).send("wrong format");
    }
});

app.listen(port, () => console.log(`App at http://localhost:${port}!`))