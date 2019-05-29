goog.provide('os.column.ColumnMappingEvent');
goog.require('goog.events.Event');
goog.require('os.column.ColumnMappingEventType');



/**
 * Event representing changes to column mappings.
 * @param {os.column.ColumnMappingEventType} type
 * @param {?osx.column.ColumnModel} column
 * @extends {goog.events.Event}
 * @constructor
 */
os.column.ColumnMappingEvent = function(type, column) {
  os.column.ColumnMappingEvent.base(this, 'constructor', type);

  /**
   * @type {?osx.column.ColumnModel}
   * @private
   */
  this.column_ = column;
};
goog.inherits(os.column.ColumnMappingEvent, goog.events.Event);


/**
 * @return {?osx.column.ColumnModel}
 */
os.column.ColumnMappingEvent.prototype.getColumn = function() {
  return this.column_;
};
