/* eslint-disable import/no-extraneous-dependencies */
const express = require('express')
const open = require('open')
const compression = require('compression')
const path = require('path')
const pkg = require('../package.json')

const app = express()

app.use(compression())
app.use(express.static('../dist'))

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

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
