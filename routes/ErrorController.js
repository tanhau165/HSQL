var express = require('express');
var router = express.Router();
router.get('/ExcuteError', function (req, res, next) {
    var error = req.param('message');
    res.render('ExcuteError', {re: error});
});

module.exports = router;