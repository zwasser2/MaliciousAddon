var express = require('express');
var router = express.Router();
var mysql = require('mysql')

// The database is not used for anything outside of my example and is shut down.
var mysqlConnection = mysql.createConnection({
    host:/*REDACTED HOST NAME */,
    user: /* REDACTED USER NAME */,
    password: /* REDACTED DB PASSWORD */,
    database: /*REDACTED DB NAME*/
})

mysqlConnection.connect((err) => {
    if (!err) {
        console.log('DB CONNECTION SUCCEEDED')
    } else {
        console.log('DB CONNECTION FAILED: ' + JSON.stringify(err))
    }
})
/* GET users listing. */
router.get('/', function(req, res, next) {
    mysqlConnection.query('SELECT * FROM extension', (err, rows, fields) => {
        if (!err) {
            res.send(rows)
        } else {
            console.log(err)
        }
    })
});

router.post('/', (req, res) => {
    let emp = req.body
    mysqlConnection.query('INSERT INTO extension SET ?', emp, function (err, res, fields) {
        if(err)
            console.log('ERROR: ' + err)
    });
})
module.exports = router;
