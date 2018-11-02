var express = require('express');
var router = express.Router();
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('login.db');

var userACC = function (username, pass1, pass2, email, key, info) {
    this.username = username;
    this.pass1 = pass1;
    this.pass2 = pass2;
    this.email = email;
    this.key = key;
    this.info = info;

    this.getUsername = function () {
        return this.username;
    };
    this.getPass1 = function () {
        return this.pass1;
    };
    this.getPass2 = function () {
        return this.pass2;
    };
    this.getEmail = function () {
        return this.email;
    };
    this.getKey = function () {
        return this.key;
    };
    this.getInfo = function () {
        return this.info;
    };
    this.toString = function () {
        return this.username + "\t" + this.pass1 + "\t" + this.pass2 + "\t" + this.key + "\t" + this.email + "\t" + this.info;
    };
};

router.get('/ExcuteACC', function (req, res, next) {
    var cmd = req.param('cmd');
    var username = req.param('username');
    var pass1 = req.param('pass1');
    var pass2 = req.param('pass2');

    if (cmd == 'register') {
        var sooo = "select * from account where username='" + username + "'";
        db.all(sooo, function (err, row) {
            if (err) {
                res.send('Has occurred an error');
            } else {
                if (row.length > 0) {
                    res.send('Account already exists !');
                } else {
                    var keyNew = (username + pass1 + pass2).substr(0, 9);
                    var sql = "INSERT INTO account " +
                        "(username,pass1, pass2,key,email,info) VALUES('" + username + "','" + pass1 + "','" + pass2 + "','" + keyNew + "','" + "none" + "','yes')";
                    db.run(sql, function (err) {
                        if (err) {
                            res.render("Has occurred an error");
                            return;
                        }

                        res.send("Created account " + username + " with key " + keyNew + ". We only provided. If you forget it, please contact us");
                    });
                }
            }
        });
    } else {
        var sql = "select * from account where username='" + username + "' and pass1='" + pass1 + "' and pass2='" + pass2 + "'";
        db.all(sql, function (err, row) {
            if (err) {
                res.send('Has occurred an error!');
            } else {
                if (row.length === 0) {
                    res.send('Username or pass1 or pass2 or key is correct !');
                    return;
                }
                row.forEach(function (t) {
                    var usa = new userACC(t.username, t.pass1, t.pass2, t.email, t.key, t.info);
                    if (cmd == 'lock') {
                        var sql = "update account set info='no' where username ='" + usa.getUsername() + "'";
                        db.run(sql, function (err, row) {
                            if (err) {
                                res.send("You can't unlock account");
                            } else {
                                res.send("You unlocked account");
                            }
                        });
                    }
                    if (cmd == 'unlock') {
                        var sql = "update account set info='yes' where username ='" + usa.getUsername() + "'";
                        db.run(sql, function (err, row) {
                            if (err) {
                                res.send("You can't unlock account !");
                            } else {
                                res.send("You unlocked account !");
                            }
                        });
                    }
                    if (cmd == 'info') {
                        res.json({"result": usa});
                    }
                    if (cmd == 'getkey') {
                        res.send(usa.getKey());
                    }
                });
            }
        });
    }
});

module.exports = router;
