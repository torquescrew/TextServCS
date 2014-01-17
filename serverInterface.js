/**
 * Created by tobysuggate on 10/01/14.
 */
"use strict";

var fio = require('./fileIO'),
    walk = require('./walkDirectory');

/*
 These are the functions that can be called from the client side
 */

/**
 * @param {string} name
 * @param {*} value
 * @returns {boolean}
 */
exports.writeSetting = fio.writeSetting;

/**
 * @param {string} name
 * @returns {*}
 */
exports.readSetting = fio.readSetting;

/**
 * @param {string} file
 * @returns {{file: (String), content: (string)}}
 */
exports.readFileSync = fio.readFileSync;

/**
 * @param {string} folder
 * @returns {string}
 */
exports.getListForFolder = walk.getListForFolder;


/**
 * @returns {string}
 */
exports.getHomeFolder = fio.getHomeFolder;
