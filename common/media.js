/*
 * Cloudinary is a Software-as-a-Service (SaaS) solution for managing all your web or mobile application’s media
 * 
 * Copyright(c) 2017 Fabbrika
 * Author: 2017-05-29 | Thiago Ito
 */

'use strict';

/*
 * Module dependencies.
 */
var cloudinary = require('cloudinary').v2;
var logger     = require('./../security/logger');

configCloudinary();

module.exports = {
    image: {
        upload: uploadImage,
        pHash: getPhash
    }
}

/**
 * Upload image to Cloudinary.
 * 
 */
function uploadImage(image, config) {
    
    configCloudinary();

    config = config || {};
    config.folder = config.folder || process.env.CLOUDINARY_FOLDER;
    config.phash = true;

    return cloudinary.uploader.upload(image, config);
}

/**
 * Upload image to Cloudinary and get pHash.
 * 
 */
function getPhash(image, callback) {
    
    configCloudinary();

    var config = {
        folder: process.env.CLOUDINARY_FOLDER + '/find'
    };

    uploadImage(image, config)
        .then(function(image) {
            deleteImage(image);

            callback(image.pHash);
        }, function(error) {
            error = new models.SwtError({message: error.message});

            logger.saveError(error, 'swtFramework.common.media.getPhash');
        });
}

function deleteImage(image) {

    cloudinary.api.delete_resources([image.public_id], function () {
        console.log('** IMAGE FIND REMOVED');
    });
}

function configCloudinary() {

    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_KEY, 
        api_secret: process.env.CLOUDINARY_SECRET
    });
}