'use strict';

const multer = require('multer');

const imgFilter = (req, file, cb) => {
    if (/image\/\w+/.exec(file.mimetype)) {
        cb(null, true);
    }
    else cb(null, false);
}

const uploadImg = multer({fileFilter: imgFilter}).single('avatar');

module.exports = function () {

    this.uploadAvatar = (req, res) => {
        console.log(req.body)
        uploadImg(req, res, err => {
            if (err) return res.status(500).send({status: 'Server error', message: err});
            console.log(req.file);
            res.status(200).send({status: 'Success'});
        });
    };

}