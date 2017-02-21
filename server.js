var express = require('express'),
    users = [],
    app = express(),
    contacts = [],
    nextId = contacts.length + 1,
    getContactById;
var today = new Date();
today.setHours(10, 0, 0, 0);
var fs = require("fs");

fs.readFile('./restaurants.json', 'utf-8', function(err, data) {
    if (err) throw err

    contacts = JSON.parse(data);
    nextId = contacts.length + 1;
    app.get('/api/restaurants', function(req, res) {
        res.send(contacts);
    });
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
fs.readFile('./users.json', 'utf-8', function(err, data) {
    if (err) throw err
    var data = JSON.parse(data);
    users = data.users;
});
getContactById = function getContactById(id) {
    id = parseInt(id);
    if (id !== -1) {
        for (i = 0; i < contacts.length; i++) {
            if (contacts[i].id === id) {
                return contacts[i];
            }
        }
    }
    return null;
};
//This routes all document requests to the public folder
app.use('/', express.static(__dirname + '/public'));
app.use(express.bodyParser());
app.use(express.methodOverride());
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

app.put('/api/restaurants', function(req, res) {
    var id = parseInt(req.body.hotelData.id);
    //contacts[id].isDisable = true;

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
console.log('Server running on 3000...');