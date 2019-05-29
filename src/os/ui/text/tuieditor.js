goog.provide('os.ui.text.TuiEditor');
goog.provide('os.ui.text.TuiEditorCtrl');
goog.provide('os.ui.text.tuiEditorDirective');

goog.require('goog.dom.safe');
goog.require('ol.xml');
goog.require('os.ui.Module');


// /**
//  * Toolbar buttons
//  * @type {Array}
//  */
// os.ui.text.TuiEditor.TOOLBAR = [];

/**
 * Toolbar buttons
 * @type {Array}
 */
os.ui.text.TuiEditor.BASICTOOLBAR = [
  'heading',
  'bold',
  'italic',
  'strike',
  'divider',
  'quote',
  'ul',
  'ol',
  'code'
];


/**
 * The count by directive
 * @return {angular.Directive}
 */
os.ui.text.tuiEditorDirective = function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      'text': '=',
      'edit': '=',
      'maxlength': '=',
      'isRequired': '=',
      'basictoolbar': '=?',
      'toolbar': '=?'
    },
    templateUrl: os.ROOT + 'views/text/tuieditor.html',
    controller: os.ui.text.TuiEditorCtrl,
    controllerAs: 'ctrl'
  };
};


/**
 * Add the directive to the tools module
 */
os.ui.Module.directive('tuieditor', [os.ui.text.tuiEditorDirective]);



/**
 * Controller class for the source switcher
 * @param {!angular.Scope} $scope
 * @param {!angular.JQLite} $element
 * @param {!angular.$timeout} $timeout
 * @constructor
 * @ngInject
 */
os.ui.text.TuiEditorCtrl = function($scope, $element, $timeout) {
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
   * @type {string}
   */
  this.scope_['id'] = goog.string.getRandomString();

  /**
   * the tuieditor object
   * @type {Object}
   * @protected
   */
  this['tuiEditor'] = null;

  /**
   * the tuieditor toolbar definition
   * @type {?Array <string | Object>}
   * @protected
   */
  this.toolbar = null;
  // this.toolbar = os.ui.text.TuiEditor.TOOLBAR;

  // Leaving for backward compatibility
  if (this.scope_['basictoolbar']) {
    this.toolbar = os.ui.text.TuiEditor.BASICTOOLBAR;
  }

  $scope['text'] = $scope['text'] || '';

  $timeout(function() {
    this.init();
  }.bind(this));

  $scope.$on('$destroy', this.onDestroy.bind(this));
};



/**
 * Cleanup
 */
os.ui.text.TuiEditorCtrl.prototype.onDestroy = function() {
  this['tuiEditor'] = null;
  this.element_ = null;
  this.scope_ = null;
};


/**
 * @return {string}
 * @export
 */
os.ui.text.TuiEditorCtrl.prototype.getWordCount = function() {
  var len = this.scope_['text'] ? this.scope_['text'].length : 0;
  var value = len;
  if (this.scope_['maxlength']) {
    value += ' / ' + this.scope_['maxlength'];
  }

  return value;
};


/**
 * @return {Object}
 */
os.ui.text.TuiEditorCtrl.prototype.getOptions = function() {
  var options = {
    'el': this.element_.find('.js-tui-editor__editor')[0],
    'initialValue': this.scope_['text'],
    'initialEditType': os.settings.get('tuiedit.mode', 'wysiwyg'),
    'events': {
      'change': this.onChange_.bind(this)
    },
    'useCommandShortcut': false,
    'usageStatistics': false
    // 'hooks': {
    //   'addImageBlobHook': function(file, callback) {
    //     function callback_for_image_upload(image_url){
    //       let img_url = get_full_image_url(image_url);
    //       callback(img_url, 'image');
    //     }
    //     self.upload_file_with_callback(file, callback_for_image_upload);
    //   }
    // }
    // 'previewRender': this.cleanHtml  (previewBeforeHook?)
  };
  if (this.toolbar) {
    options['toolbarItems'] = this.toolbar;
  }

  return options;
};


/**
 * Initialize tuieditor
 */
os.ui.text.TuiEditorCtrl.prototype.init = function() {
  this['tuiEditor'] = new tui.Editor(this.getOptions());

  // Watch to see if something changes the text and update the value
  this.scope_.$watch('text', function(val) {
    if (val != this['tuiEditor'].getMarkdown()) {
      this['tuiEditor'].setMarkdown(val);
      os.ui.apply(this.scope_);
    }
  }.bind(this));
};



/**
 * @private
 */
os.ui.text.TuiEditorCtrl.prototype.onChange_ = function() {
  if (this.scope_ && this.scope_['tuieditorform']) {
    this.scope_['tuieditorform'].$setDirty();
  }
  this.scope_['text'] = this['tuiEditor'].getMarkdown();

  // Scope doesnt get applied automatically, so do it ourself
  os.ui.apply(this.scope_);
};
