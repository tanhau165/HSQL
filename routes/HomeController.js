var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var dbLogin = new sqlite3.Database('login.db');
/* GET users listing. */
router.get('/', function (req, res, next) {
    var ss = req.session.acc;
    if (ss) {
        var userdb = new sqlite3.Database('database\\' + ss.username + '.db');
        userdb.all("SELECT name FROM sqlite_master WHERE type = 'table'", function (err, row) {
            if (err) {
                res.redirect("/Error/ExcuteError?message=" + "Has occurred an error");
                return;
            }
            var a = [];
            row.forEach(function (t) {
                a.push(t.name);
            });
            res.render('Index', {re: a,notifi:null, sess: req.session.acc});

        });
        return;
    }
    res.render('Index', {re: "",notifi:null, sess: req.session.acc});
});

router.get('/Index', function (req, res, next) {
    var ss = req.session.acc;
    if (ss) {
        var userdb = new sqlite3.Database('database\\' + ss.username + '.db');
        userdb.all("SELECT name FROM sqlite_master WHERE type = 'table'", function (err, row) {
            if (err) {
                res.redirect("/Error/ExcuteError?message=" + "Has occurred an error");
                return;
            }
            var a = [];
            row.forEach(function (t) {
                a.push(t.name);
            });
            res.render('Index', {re: a,notifi:null, sess: req.session.acc});

        });
        return;
    }
    res.render('Index', {re: "", sess: req.session.acc});
});
router.get('/Logout', function (req, res) {
    req.session.acc = null;
    res.render('Index',{re: null,notifi:null, sess: null});
});

router.get('/Lock', function (req, res) {
    var ss = req.session.acc;
    var sql = "update account set info='no' where username ='"+ss.username+"'";
    // console.log(ss);
    dbLogin.run(sql,function (err,row) {
        if(err){
            // console.log(err);
            req.session.acc = null;
            res.render('Index',{re: null,notifi:"You can't lock account", sess: null});
        }else{
            req.session.acc = null;
            res.render('Index',{re: null,notifi:"You locked account", sess: null});
        }
    });
});

router.get('/UnLock', function (req, res) {
    var ss = req.session.acc;
    var sql = "update account set info='yes' where username ='"+ss.username+"'";
    // console.log(ss);
    dbLogin.run(sql,function (err,row) {
        if(err){
            req.session.acc = null;
            res.render('Index',{re: null,notifi:"You can't unlock account", sess: null});
        }else{
            req.session.acc = null;
            res.render('Index',{re: null,notifi:"You unlocked account", sess: null});
        }
    });
});

module.exports = router;