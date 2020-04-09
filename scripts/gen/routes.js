const express = require('express');
const router = express.Router();

router.get('/gen/tables', function (req, res, next) {
    res.send('ok tables');
});
module.exports = router;
