var express = require('express');

var app = express();
var azureMobileApps = require('azure-mobile-apps');
var searchTasks = require('./api/search');


// Azure Mobile Apps 
var mobileApp = azureMobileApps({
    // Explicitly enable the Azure Mobile Apps home page
    homePage: true,

    // Explicitly enable swagger support. UI support is enabled by
    // installing the swagger-ui npm module.
    swagger: true,

    // App will use MS_SqliteFilename or MS_TableConnectionString to choose the SQLite or SQL data provider
    data: {
        dynamicSchema: true
    }
});

// Import the files from the tables directory to configure the /tables endpoint
mobileApp.tables.import('./tables');

// Import the files from the api directory to configure the /api endpoint
mobileApp.api.import('./api');

mobileApp.tables.initialize()
    .then(function () {
        app.use(mobileApp);    // Register the Azure Mobile Apps middleware
        app.use('/api/search', searchTasks(mobileApp.configuration));
        app.listen(process.env.PORT || 3000);   // Listen for requests
    });

//// catch 404 and forward to error handler
//app.use(function (req, res, next) {
//    var err = new Error('Not Found');
//    err.status = 404;
//    next(err);
//});

// error handlers

