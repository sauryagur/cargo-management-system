let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let placementRouter = require('./routes/placement');
let searchRouter = require('./routes/search');
let retrieveRouter = require('./routes/retrieve');
let placeRouter = require('./routes/place');
let wasteRouter = require('./routes/waste');
let simulateRouter = require('./routes/simulate');
let importRouter = require('./routes/import');

let app = express();

// view engine setup

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/placement', placementRouter);
app.use('/api/search', searchRouter);
app.use('/api/retrieve', retrieveRouter);
app.use('/api/place', placeRouter);
app.use('/api/waste', wasteRouter);
app.use('/api/simulate', simulateRouter);
app.use('/api/import', importRouter);

// catch 404 and forward to error handler
app.use(function (req, res) {
    res.sendStatus(404);
});

module.exports = app;
