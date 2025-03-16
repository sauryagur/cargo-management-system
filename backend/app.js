let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors');

let placementRouter = require('./routes/placement');
let searchRouter = require('./routes/search');
let retrieveRouter = require('./routes/retrieve');
let placeRouter = require('./routes/place');
let wasteRouter = require('./routes/waste');
let simulateRouter = require('./routes/simulate');
let importRouter = require('./routes/import');
let logsRouter = require('./routes/logs');

let app = express();


// view engine setup

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/placement', cors(), placementRouter);
app.use('/api/search', cors(), searchRouter);
app.use('/api/retrieve', cors(), retrieveRouter);
app.use('/api/place', cors(), placeRouter);
app.use('/api/waste', cors(), wasteRouter);
app.use('/api/simulate', cors(), simulateRouter);
app.use('/api/import', cors(), importRouter);
app.use('/api/logs', cors(), logsRouter);

// catch 404 and forward to error handler
app.use(function (req, res) {
    res.sendStatus(404);
});

module.exports = app;
