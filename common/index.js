/*
 * Common functions for general use
 * 
 * Copyright(c) 2017 Fabbrika
 * Author: 2017-03-25 | Nicholas M. Dantas
 */

module.exports = {
    parseAuthHeader: parseAuthHeader,

};

/**
 * Parse the Authorization header to json
 * 
 * parseAuthHeader(authorization: string): Object 
 * {
 *     type: ('app' | basic' | 'bearer' | etc...),
 *     token: 'access_token'
 * }.
 */
function parseAuthHeader(authorization) {
    authorization = authorization || '';

    var authRegex = new RegExp(/(Basic|App)\s+/ig);
    var authType = authRegex.test(authorization) ? authRegex.exec(authorization)[0].toLowerCase() : '';
    var key = authorization.replace(authRegex, '').toLowerCase();

    return {
        type: authType,
        token: key
    };
}