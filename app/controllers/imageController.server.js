'use strict';

const multer = require('multer');
const resizeImage = require('./resizeImage');
const fs = require('fs');

const fileFilter = (req, file, cb) => {
    if (/image\/\w+/.exec(file.mimetype)) {
        cb(null, true);
    }
    else cb(null, false);
};

module.exports = function () {

    this.getImage = (req, res) => {
        const cwd = process.cwd();
        const username = req.params.username;
        const name = req.params.name;
        const path = `${cwd}/public/photos/${username}-${name}.jpg`;
        res.sendFile(path);
    };

    this.uploadImage = (req, res) => {
        let username = req.params.username;
        if (username == 'current') username = req.user ? req.user.username : null;
        else return res.status(403).send({status: 'Forbidden'});
        const name = req.params.name;

        const cwd = process.cwd();
        let destination, filename, pathToImage;

        if (name == 'avatar') {
            destination = `${cwd}/public/photos`;
            filename = `${username}-avatar-lg.jpg`;
            pathToImage = `${cwd}/public/photos/${username}-avatar.jpg`;
        }
        const storage = this.defineStorage(destination, filename);
        
        const uploadImg = multer({fileFilter, storage}).single(name);

        uploadImg(req, res, err => {
            if (err) return res.status(500).send({status: 'Server error', message: err});
            if (req.file) {
                const inputFile = `${destination}/${filename}`;
                const outputFile = pathToImage;
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
            const message = 'Выберите изображение';
            return res.status(415).send({status, message});
        });
    };

    this.defineStorage = (destination, filename) => {
        return multer.diskStorage({
                destination: (req, file, cb) => cb(null, destination),
                filename: (req, file, cb) => cb(null, filename)
        });
    }

}