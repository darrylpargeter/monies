const express = require('express');
const logger = require('morgan');
const { join } = require('path');
const routes = require('./routes');

const app = express();

app.set('port', 8080);
app.set('view engine', 'pug');

app.use(express.static(join(__dirname, 'public')));

app.locals.settings['x-powered-by'] = false;
app.use(logger('dev'));

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/api/', routes);

app.listen(app.get('port'), err => {
  if (err) console.error(err);
  console.log(`Server running at ${app.get('port')}`);
});
