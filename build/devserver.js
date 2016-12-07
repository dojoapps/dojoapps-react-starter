/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config');
const DashboardPlugin = require('webpack-dashboard/plugin');
const open = require('open');
const pkg = require('../package.json')

const app = express();
const compiler = webpack(config);

compiler.apply(new DashboardPlugin());

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  quiet: true,
  publicPath: config.output.publicPath,
}));

app.use(require('webpack-hot-middleware')(compiler, {
  log: () => {},
}));

app.use('*', (req, res, next) => {
  const filename = path.join(compiler.outputPath, 'index.html');
  compiler.outputFileSystem.readFile(filename, (err, result) => {
    if (err) {
      return next(err);
    }
    res.set('content-type', 'text/html');
    res.send(result);
    res.end();
    return null
  });
});

const port = pkg.config.port

if (!port) {
  throw new Error('Defina uma porta no package.json')
}

app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Listening at http://localhost:${port}`);
  open(`http://localhost:${port}`);
});
