goog.provide('os.ui.text.fitText');
goog.provide('os.ui.text.fitTextDirective');
goog.provide('os.ui.text.FitTextCtrl');
goog.require('os.ui.Module');


/**
 * Set font size to fit width and height
 * @return {angular.Directive}
 */
os.ui.text.fitTextDirective = function() {
  return {
    restrict: 'A',
    controller: os.ui.text.FitTextCtrl
  };
};


/**
 * Add the directive to the os.ui module
 */
os.ui.Module.directive('fitText', [os.ui.text.fitTextDirective]);



/**
 * @param {!angular.Scope} $scope
 * @param {!angular.JQLite} $element
 * @constructor
 * @ngInject
 */
os.ui.text.FitTextCtrl = function($scope, $element) {
  /**
   * @type {?angular.Scope}
   * @private
   */
  this.scope_ = $scope;

  /**
   * @type {?angular.JQLite}
   * @private
   */
  this.element_ = $element;

  /**
   * @type {number}
   * @private
   */
  this.naturalFontSize_ = Number($element.css('font-size').replace('px', ''));

  /**
   * @type {?function()}
   * @private
   */
  this.resizeFn_ = this.onResize_.bind(this);

  this.element_.addClass('c-fit-text');
  this.element_.resize(this.resizeFn_);

  $scope.$on('$destroy', this.onDestroy_.bind(this));
};


/**
 * Clean up listeners/references.
 *
 * @private
 */
os.ui.text.FitTextCtrl.prototype.onDestroy_ = function() {
  this.element_.removeResize(this.resizeFn_);
  this.resizeFn_ = null;
  this.element_ = null;
  this.scope_ = null;
};


/**
 * Whenever the element gets resized, adjust all the font
 * @private
 */
os.ui.text.FitTextCtrl.prototype.onResize_ = function() {
  var fontSize = this.naturalFontSize_;
  while (fontSize > 1 &&
      (this.element_[0].scrollHeight > this.element_.innerHeight() ||
      this.element_[0].scrollWidth > this.element_.innerWidth())) {
    fontSize -= 1;
    this.element_.css('font-size', fontSize + 'px');
  }
};
