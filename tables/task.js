// ----------------------------------------------------------------------------
// Copyright (c) 2015 Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

/*
** Sample Table Definition - this supports the Azure Mobile Apps
** TodoItem product with authentication and offline sync
*/
var azureMobileApps = require('azure-mobile-apps');
var uuid = require('node-uuid');

// Create a new table definition
var table = azureMobileApps.table();

table.access = 'authenticated';

// Table Definition 
table.name = 'task';
table.schema = 'dbo';
table.databaseTableName = 'task';
table.maxTop = 1000;
table.dynamicSchema = false;
table.columns = {
        id: 'string',
        userid: 'string',
        text: 'string',
    category: 'string',
        due: 'datetime',
        alert: 'number',
        complete: 'boolean'
};

// Configure specific code when the client does a request
// READ - only return records belonging to the authenticated user
table.read(function (context) {
    console.info("user name -", JSON.stringify(context.user.claims.upn));
    var userName = context.user.claims.upn;
    context.query.where({ userid: userName });
    return context.execute();
});

// CREATE - add or overwrite the userId based on the authenticated user
table.insert(function (context) {
    console.info("user name -", JSON.stringify(context.user.claims.upn));
    var userName = context.user.claims.upn;
    context.item.userid = userName;
    var uuid1 = uuid.v1();
    context.item.id = uuid1;
    context.execute().then(function (response) {
        console.info('insert.execute response = ', response);
        return response;
    });
});

// UPDATE - for this scenario, we don't need to do anything - this is
// the default version
table.update(function (context) {
    console.info("user name -", JSON.stringify(context.user.claims.upn));
    var userName = context.user.claims.upn;
    context.query.where({ userid: userName });
    context.item.userid = userName;
    return context.execute();
});

// DELETE - for this scenario, we don't need to do anything - this is
// the default version
table.delete(function (context) {
    console.info("user name -", JSON.stringify(context.user.claims.upn));
    var userName = context.user.claims.upn;
    context.query.where({ userid: userName });
    return context.execute();
});

// Finally, export the table to the Azure Mobile Apps SDK - it can be
// read using the azureMobileApps.tables.import(path) method

module.exports = table;