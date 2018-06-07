'use strict';

const multer = require('multer');
const resizeImage = require('./resizeImage');
const fs = require('fs');

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
        cb(null, `${username}-avatar-lg.jpg`);
    }
})

const uploadImg = multer({fileFilter: imgFilter, storage: photoStorage}).single('avatar');

module.exports = function () {

    this.uploadAvatar = (req, res) => {
        uploadImg(req, res, err => {
            if (err) return res.status(500).send({status: 'Server error', message: err});
            if (req.file) {
                const cwd = process.cwd();
                const username = req.user.username;
                const inputFile = `${cwd}/public/photos/${username}-avatar-lg.jpg`;
                const outputFile = `${cwd}/public/photos/${username}-avatar.jpg`;
                return resizeImage(inputFile, outputFile, 350)
                        .then(() => {
                            return new Promise((resolve, reject) => {
                                fs.unlink(inputFile, (err) => {
                                    if (err) return reject(err);
                                    resolve();
                                });
                            });
                            
                        })
                        .then(() => res.status(200).send({status: 'Success'}))
                        .catch(err => res.status(500).send({status: 'Server error', message: err}));
            }
            const status = 'Unsupported media type';
            const message = 'Выберите файл с расширением jpg или jpeg';
            return res.status(415).send({status, message})
        });
    };

}