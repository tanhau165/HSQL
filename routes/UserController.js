var express = require('express');
var router = express.Router();
var body = require('body-parser');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('login.db');
var nodemailer = require('nodemailer');
var re = function () {

};
re.prototype.result = function (s) {
    return s;
};
var users = function (username, pass1, pass2, email, key, info) {
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

/* GET users listing. */
router.post('/Login', function (req, res, next) {
    var username = req.body.username;
    var pass1 = req.body.password1;
    var pass2 = req.body.password2;
    var sql = "select * from account where username='" + username + "' and pass1='" + pass1 + "' and pass2='" + pass2 + "'";
    db.all(sql, function (err, row) {
        if (err) {
            res.send('Has occurred an error');
            return;
        }
        if (row.length == 0) {
            res.render('Index', {re: 'Username or password is correct !', notifi: "", sess: req.session.acc});
        } else {
            req.session.acc = new users(row[0].username, row[0].pass1, row[0].pass2, row[0].key, row[0].email, row[0].info);
            var userdb = new sqlite3.Database('database\\' + username + '.db');
            userdb.all("SELECT name FROM sqlite_master WHERE type = 'table'", function (err, row) {
                var a = [];
                row.forEach(function (t) {
                    a.push(t.name);
                });
                res.render('Index', {re: a, notifi: "", sess: req.session.acc});
            });
        }
    });
});

var options = function (from, to, subject, text) {
    this.from = from;
    this.to = to;
    this.subject = subject;
    this.text = text;
    return {
        form: this.from,
        to: this.to,
        subject: this.subject,
        text: this.text
    }

    // from: 'youremail@gmail.com',
    // to: 'myfriend@yahoo.com',
    // subject: 'Sending Email using Node.js',
    // text: 'That was easy!'
};

//
// var transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//         user: 'nguyentanhau165997@gmail.com',
//         pass: 'Abcdabcd1'
//     },
//     secure: false,
//     // port: process.env.PORT || 25,
//     tls: {
//         rejectUnauthorized: false
//     }
// });


router.post('/Register', function (req, res, next) {
    var username = req.body.user;
    var pass1 = req.body.pass1;
    var pass2 = req.body.pass2;
    var email = req.body.email;
    var sql = "select * from account where username='" + username + "'";
    db.all(sql, function (err, row) {
        if (err) {
            res.render('Index', {re: "Has occurred an error", notifi: null, sess: null});
            return;
        }
        if (row.length > 0) {
            res.render('Index', {re: 'Account already exists', notifi: null, sess: null});
        } else {
            var key = (username + pass1 + pass2).substr(0, 9);
            var info = 'yes';
            // var languages = [username, pass1, pass2, key, email, info];
            // var placeholders = languages.map(function (language) {
            //     return '(?)';
            // }).join(',');
            var sql = "INSERT INTO account " +
                "(username,pass1, pass2,key,email,info) VALUES('" + username + "','" + pass1 + "','" + pass2 + "','" + key + "','" + email + "','" + info + "')";
            db.run(sql, function (err) {
                if (err) {
                    res.render('Index', {re: "Has occurred an error", notifi: null, sess: req.session.acc});
                    return;
                }
                // var db = new sqlite3.Database('database\\' + username + '.db');
                req.session.acc = new users(username, pass1, pass2, key, email, info);
                var userdb = new sqlite3.Database('database\\' + username + '.db');
                userdb.all("SELECT name FROM sqlite_master WHERE type = 'table'", function (err, row) {
                    var a = [];
                    var mailOptions = new options('Nguyen tan hau', email, 'Key of JSQL', key);
                    // console.log(mailOptions);
                    // console.log(transporter);
                    // transporter.sendMail(mailOptions, function (error, info) {
                    //     if (error) {
                    //         res.render('Index', {re: "Has occurred an error when send key to you",notifi:null, sess: req.session.acc});
                    //     } else {
                    //         res.render('Index', {re: a,notifi:"Check your mail, we sent key to you", sess: req.session.acc});
                    //     }
                    // });
                    res.render('Index', {
                        re: a,
                        notifi: "This is your key: " + key + ". We only provided. If you forget it, please contact us",
                        sess: req.session.acc
                    });
                });
            });
        }
    });
});


module.exports = router;
