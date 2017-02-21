var express = require('express'),
    users = [],
    app = express(),
    contacts = [];
var today = new Date();
today.setHours(10, 0, 0, 0);
var fs = require("fs");
/**
   read the json file and store the restaurants data into an array 
*/
fs.readFile('./restaurants.json', 'utf-8', function(err, data) {
    if (err) throw err

    contacts = JSON.parse(data);

    /**
    this method will send the restaurants data to application
    */
    app.get('/api/restaurants', function(req, res) {
        res.send(contacts);
    });

    /**
    this method will reset all the restaurants in past week send the updated data to application
    */
    app.get('/api/resetAllRestaurants', function(req, res) {

        var userLength = [];
        for (var i = 0; i < contacts.length; i++) {
            if (contacts[i].selectedDate != undefined) {
                var getUserDate = new Date(contacts[i].selectedDate);
                getUserDate.setHours(10, 0, 0, 0);
                if (today.getTime() > getUserDate.getTime()) {
                    contacts[i].users.length = [];
                    delete contacts[i].selectedDate;
                    contacts[i].isDisable = false;
                    delete contacts[i].todaySelected;
                }
            }

        }
        fs.writeFile('./restaurants.json', JSON.stringify(contacts), 'utf-8', function(err) {
            if (err) throw err
        });
        res.send(contacts);

    });
    /**
    this method will keep the previously visited restaurants in current week send the updated data to application
    */
    app.get('/api/resetRestaurants', function(req, res) {

        var userLength = [];
        for (var i = 0; i < contacts.length; i++) {
            if (contacts[i].selectedDate != undefined) {
                var getUserDate = new Date(contacts[i].selectedDate);
                getUserDate.setHours(10, 0, 0, 0);
                if (today.getTime() === getUserDate.getTime()) {
                    userLength.push(contacts[i].users.length);
                }
            }

        }
        var ind = Math.max.apply(Math, userLength);
        var firstOne = 0;
        for (var j = 0; j < contacts.length; j++) {
            if (contacts[j].selectedDate != undefined) {
                var getUserDate1 = new Date(contacts[j].selectedDate);
                getUserDate1.setHours(10, 0, 0, 0);
                if (today.getTime() === getUserDate1.getTime()) {
                    if (firstOne == 0) {
                        if (ind != contacts[j].users.length) {
                            delete contacts[j].selectedDate;
                            contacts[j].users.length = 0;
                        } else {
                            firstOne++;
                        }
                    } else {
                        delete contacts[j].selectedDate;
                        contacts[j].users.length = 0;
                    }
                }
            }

        }

        if (ind > -1) {
            contacts[ind].isDisable = true;
        }
        fs.writeFile('./restaurants.json', JSON.stringify(contacts), 'utf-8', function(err) {
            if (err) throw err
        });
        res.send(contacts);
    });
});
/**
   read the json file and store the users data into an array 
*/
fs.readFile('./users.json', 'utf-8', function(err, data) {
    if (err) throw err

    var data = JSON.parse(data);
    users = data.users;

});

//This routes all document requests to the public folder
app.use('/', express.static(__dirname + '/public'));
app.use(express.bodyParser());
app.use(express.methodOverride());
/**
   this method will validate the user details and send response back.
*/
app.post('/api/login', function(req, res) {
    var name = req.body.name;
    for (var i = 0; i < users.length; i++) {
        if (users[i].name == name) {
            res.send(users[i]);
            return;
        }
    }
    res.send({
        "errorMessage": "invalid user name"
    });

});
/**
   this method will trigger when user caste their restaurant 
*/
app.put('/api/restaurants', function(req, res) {
    var id = parseInt(req.body.hotelData.id);
    for (var i = 0; i < contacts.length; i++) {
        var getUserDate = new Date(contacts[i].selectedDate);
        getUserDate.setHours(10, 0, 0, 0);
        if (today.getTime() == getUserDate.getTime()) {
            if (contacts[i].users.indexOf(req.body.user.id) > -1) {
                contacts[i].users.splice(contacts[i].users.indexOf(req.body.user.id));
            }
            if (contacts[i].users.length == 0) {
                delete contacts[i].selectedDate;
            }
        }
    }
    contacts[id].selectedDate = req.body.today;
    contacts[id].users.push(req.body.user.id);
    fs.writeFile('./restaurants.json', JSON.stringify(contacts), 'utf-8', function(err) {
        if (err) throw err
    });
    res.send(contacts);
});
/**
   this method will trigger when process facilitator change the permission of a visited restaurants 
*/
app.put('/api/restaurants/showDisable', function(req, res) {
    for (var i = 0; i < contacts.length; i++) {
        contacts[i].disableVisited = req.body.showPreviousSelected;
    }
    fs.writeFile('./restaurants.json', JSON.stringify(contacts), 'utf-8', function(err) {
        if (err) throw err
    });
    res.send(contacts);
});
app.listen(3000);
console.log('Server running now..');