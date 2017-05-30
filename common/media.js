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
function uploadImage(image, callback, config) {
    
    configCloudinary();

    config = config || {};
    config.folder = config.folder || process.env.CLOUDINARY_FOLDER;
    config.phash = true;

    cloudinary.uploader.upload(image, callback, config);
}

/**
 * Upload image to Cloudinary and get pHash.
 * 
 */
function getPhash(image, callback) {
    
    uploadImage(image, function(error, result) {
        
        if (!error){
            deleteImage(result);
        }

        callback(error, result);
    });
}

function deleteImage(image) {

    cloudinary.api.delete_resources([image.public_id], function () {
        console.log('** IMAGE FIND REMOVED');
    });
}

function configCloudinary() {

    cloudinary.config({ 
        cloud_name: process.env.APPLICATION_NAME, 
        api_key: process.env.APPLICATION_KEY, 
        api_secret: process.env.APPLICATION_SECRET
    });
}