/*
 * Constants for general use. All constants must be in "Application" namespace.
 * 
 * Copyright(c) 2017 Fabbrika
 * Author: 2017-03-19 | Nicholas M. Dantas
 */

'use strict';

module.exports = {
    add: addNew
}

const LOG_LEVEL = {
    Debug: 0,
    Information: 1,
    Warning: 2,
    Exception: 3, 
    Fatal: 4
};

global.Application = global.Application || {};
global.Application.LOG_LEVEL = LOG_LEVEL;

/**
 * Expose 'addNew(key: string, data: object): void'.
 */
function addNew(key, data) {
    // Apenas inclui os novos dados as constantes caso nao existe a chave "key" no namespace
    if (global.Application[key] == undefined) {

        global.Application[key] = data;
    } else {

        throw new Error('Key already present in Constants');
    }
}