var express = require('express');
var router = express.Router();
var body = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('login.db');
/* GET users listing. */

var connection = function (sql, db, key, username) {
    this.sql = sql;
    this.key = key;
    this.username = username;
    this.db = db;
    this.addTable = function () {
        this.db.run(sql, function (err) {
            if (err) {
                return "Has occurred an error";
            }
        });
        return "Success";
    };

    this.addRow = function () {
        this.db.run(sql, function (err) {
            if (err) {
                return "Has occurred an error";
            }
        });
        return 'Success';
    };

    this.find = function () {
        return this.a;
    };

    this.delete = function () {
        this.db.run(sql, function (err) {
            if (err) {
                return "Has occurred an error";
            }
        });
        return 'Success';
    };

    this.update = function () {
        this.db.run(sql, function (err) {
            if (err) {
                return "Has occurred an error";
            }
        });
        return 'Success';
    };
};

// day la khu vuc cho thuc thi bang key
router.get('/ExcuteQuery', function (req, res, next) {
    var sql = req.param('st');
    var key = req.param('key');
    var exc = "select * from account where key='" + key + "'";
    db.all(exc, function (err, row) {
        if (row.length == 0) {
            res.send("Key does not exist !");
            return;
        }
        if (err) {
            res.send("Key does not exist !");
        } else {
            row.forEach(function (t) {
                var us = t;
                if (us.info === 'yes') {
                    var dbUser = new sqlite3.Database('database\\' + us.username + '.db');
                    if (sql.split(' ')[0].toUpperCase().trim() === 'SELECT') {
                        dbUser.all(sql, function (err, row) {
                            if (err) {
                                res.send("Excute fail ! Check my query");
                                return;
                            }
                            var xxx = [];
                            row.forEach(function (t2) {
                                xxx.push(t2);
                            });
                            res.json({"result": xxx});
                        });
                    } else {
                        dbUser.run(sql, function (err, row) {
                            if (err) {
                                res.send("Excute fail ! Check my query");
                                return;
                            }
                            res.send("Success");
                        });
                    }
                } else {
                    res.send("Account clocked ! You can't excute query. Please unclock !");
                }
            });
        }
    });
    // res.send(sql + "|" + key);
});
// day la khu vuc thuc thi cau lenh bang key


router.post('/CreateTB', function (req, res, next) {
    var sql = req.body.excute;
    var ss = req.session.acc;
    var db = new sqlite3.Database('database\\' + ss.username + '.db');
    var conn = new connection(sql, db, ss.key, ss.username);
    conn.addTable();
    res.redirect('/DB/Return');
});

router.post('/ExcuteTable', function (req, res, next) {
    var sql = req.body.statement;
    var ss = req.session.acc;
    var action = sql.trim().split(' ')[0];
    var db = new sqlite3.Database('database\\' + ss.username + '.db');
    var conn = new connection(sql, db);

    if (action.toUpperCase() === 'INSERT') {
        var create = conn.addRow();
        if (create != 'Success') {
            res.redirect("/Error/ExcuteError?message=" + create);
            return;
        }
        res.redirect('/DB/Return');
        return;
    }

    if (action.toUpperCase() === 'DELETE') {
        var del = conn.delete();
        if (del != 'Success') {
            res.redirect("/Error/ExcuteError?message=" + del);
            return;
        }
        res.redirect('/DB/Return');
        return;
    }
    if (action.toUpperCase() === 'UPDATE') {
        var upd = conn.update();
        if (upd != 'Success') {
            res.redirect("/Error/ExcuteError?message=" + upd);
            return;
        }
        res.redirect('/DB/Return');
        return;
    }
    res.redirect("/Error/ExcuteError?message=" + sql);
});

router.get('/Return', function (req, res) {
    var ss = req.session.acc;
    var inforTable = req.session.inforTable;
    console.log(inforTable);
    var db = new sqlite3.Database('database\\' + ss.username + '.db');
    if (typeof inforTable !== 'undefined') {
        var sql = "select * from " + inforTable.name;
        // var conn = new connection(sql, db);
        db.all(sql, function (err, row) {
            if (err) {
                res.redirect("/Error/ExcuteError?message=" + "Has occurred an error");
                return;
            }
            var a = [];
            row.forEach(function (t) {
                a.push(t);
            });

            res.render('Excute', {all: "", sess: ss, re: a, inforTable: inforTable});
        });
    } else {
        res.render('Excute', {all: null, sess: ss, re: null, inforTable: null});
    }
});


router.get('/Manage', function (req, res, next) {
    var ss = req.session.acc;
    var db = new sqlite3.Database('database\\' + ss.username + '.db');
    var table = req.param('tb');
    // console.log(table);
    // req.session.tb = table;
    // var conn = new connection(sql, ss.key, ss.username, db);
    // var x = conn.loadData();
    db.all("PRAGMA table_info(" + table + ")", function (err, row) {
        if (err) {
            res.redirect("/Error/ExcuteError?message=" + "Has occurred an error");
            return;
        }
        var a = [];
        row.forEach(function (t) {
            a.push({columname: t.name, type: t.type, pk: t.pk});
        });
        var inforTable = {name: table, listCol: a};
        var sql = "select * from " + inforTable.name;
        db.all(sql, function (err, row) {
            if (err) {
                res.redirect("/Error/ExcuteError?message=" + "Has occurred an error");
                return;
            }
            var a = [];
            row.forEach(function (t) {
                a.push(t);
            });
            req.session.inforTable = inforTable;
            res.render('Excute', {all: "", sess: ss, re: a, inforTable: inforTable});
        });
    });
});

module.exports = router;