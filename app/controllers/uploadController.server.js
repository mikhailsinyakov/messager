'use strict';

const multer = require('multer');

const imgFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg') {
        cb(null, true);
    }
    else cb(null, false);
};

const photoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const cwd = process.cwd();
        cb(null, `${cwd}/public/photos`);
    },
    filename: (req, file, cb) => {
        const username = req.user.username;
        cb(null, `${username}-avatar.jpg`);
    }
})

const uploadImg = multer({fileFilter: imgFilter, storage: photoStorage}).single('avatar');

module.exports = function () {

    this.uploadAvatar = (req, res) => {
        uploadImg(req, res, err => {
            if (err) return res.status(500).send({status: 'Server error', message: err});
            if (req.file) return res.status(200).send({status: 'Success'});
            const status = 'Unsupported media type';
            const message = 'Выберите файл с расширением jpg или jpeg';
            return res.status(415).send({status, message})
        });
    };

}