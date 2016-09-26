var azure = require('azure-storage');
var uuid = require('node-uuid');
var entityGen = azure.TableUtilities.entityGenerator
var tableService = azure.createTableService();
var userName = "nzaheer";

tableService.createTableIfNotExists("notes", function(error, result, response) {
  if (!error) {
    console.info(result);
  }
  else{
    console.warn(error);      
  }
});

var api = {
    
    post: function (req, res, next) {
        var date = { currentTime: Date.now() };
        var uuid1 = uuid.v1();
        var bodyJson = req.body;

        var entity = {
            PartitionKey: entityGen.String(userName),
            RowKey: entityGen.String(uuid1),
            dateWritten: entityGen.DateTime(new Date()),
            userId: entityGen.String(userName),
            noteData: entityGen.String(req.body.notes)
        };
        console.info("Creating Entity");
        tableService.insertEntity("notes", entity, function(error, result, response) {
        if (error) {
            console.warn(error);
            res.status(500).type('application/json').send(error);
        }
        else{
            console.info(result);
            console.info(result);
            res.status(200).type('application/json').send(result);
        }
        });
    },

    get: function (req, res, next) {
        console.info(JSON.stringify(req.azureMobile.user));
        req.azureMobile.user.getIdentity().then(function (userInfo) {
            console.info(JSON.stringify(userInfo.aad.claims.emailaddress));
          });
        
        var query = new azure.TableQuery()
            .top(100)
            .where("PartitionKey eq ?", userName);

        console.info("Getting Entities");
        tableService.queryEntities('notes', query, null, function(error, result, response) {
        if (error) {
            console.warn(error);
            res.status(500).type('application/json').send(error);
        }
        else{
            console.info(result);
            console.info(response);
            res.status(200).type('application/json').send(result);
        }
        });
    },

    delete: function (req, res, next) {
        var entity = {
            PartitionKey: entityGen.String(userName),
            RowKey: entityGen.String(req.body.key)
        };

        console.info("Deleting Entities");
        tableService.deleteEntity('notes', entity, function(error, response) {
        if (error) {
            console.warn(error);
            res.status(500).type('application/json').send(error);
        }
        else{
            console.info(response);
            res.status(200).type('application/json').send(result);
        }
        });
    }
};

module.exports = api;