/*
 * Signature for token creation.
 * 
 * Copyright(c) 2017 Fabbrika
 * Author: 2017-03-19 | Nicholas M. Dantas
 */

'use strict';

/*
 * Module dependencies.
 */
var crypto = require('crypto-js');

module.exports = generateToken;

/**
 * Expose 'generateToken(message: string): string'.
 */
function generateToken(message) {
    var key = (new Date()).toLocaleDateString() +
              generateTimeStamp() +
              generateNonce();

    return crypto.SHA256(message + key).toString();
}

function generateTimeStamp() {
    return (new Date().getSeconds() - new Date(1970, 0, 1).getSeconds()).toString();
}

function generateNonce() {
    return (Math.random() * (9999999 - 123400) + 123400).toString();
}