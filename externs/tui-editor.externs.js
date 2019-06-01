/**
 * @fileoverview Externs for Toast UI Editor
 *
 * @externs
 */
var tui = {};



/**
 * @constructor
 * @param {Object} options
 */
tui.Editor = function(options) {};


/**
 * @return {string}
 */
tui.Editor.prototype.getHtml = function() {};



/**
 * @return {string}
 */
tui.Editor.prototype.getMarkdown = function() {};


/**
 * @param {string} markdown
 */
tui.Editor.prototype.setMarkdown = function(markdown) {};


/**
 * @type {Object}
 */
tui.Editor.markdownitHighlight = {};


/**
 * @param {string} markdown
 * @return {string}
 */
tui.Editor.markdownitHighlight.render = function(markdown) {};
