goog.provide('os.ui.text.TuiEditor');
goog.provide('os.ui.text.TuiEditorCtrl');
goog.provide('os.ui.text.tuiEditorDirective');

goog.require('goog.dom.safe');
goog.require('ol.xml');
goog.require('os.ui.Module');


/**
 * Toolbar buttons
 * @type {Array}
 */
os.ui.text.TuiEditor.TOOLBAR = [
  'heading',
  'bold',
  'italic',
  'strike',
  'divider',
  'hr',
  'quote',
  'ul',
  'ol',
  'task',
  'indent',
  'outdent',
  'divider',
  'table',
  'image',
  'link',
  'code'
];


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
  'ol'
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
  this.toolbar = this.scope_['basictoolbar'] ? os.ui.text.TuiEditor.BASICTOOLBAR : os.ui.text.TuiEditor.TOOLBAR;

  $scope['text'] = $scope['text'] || '';

  $timeout(function() {
    if (this.scope_['edit'] && !window['tui']) {
      // Load up the javascript for the editor
      var lib = os.ROOT + 'os-tui-editor.min.js';
      libraries.push(goog.html.TrustedResourceUrl.fromConstant(os.string.createConstant(lib)));
      goog.net.jsloader.safeLoad(trustedUrl).addCallbacks(this.processInternal, this.onScriptLoadError, this);
    } else {
      this.init();
    }
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
 * Since we couldnt load the js, just display the content
 */
os.ui.text.TuiEditorCtrl.prototype.onScriptLoadError = function() {
  os.alertManager.sendAlert('Failed to load editor');
  this.scope_['edit'] = false;
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
    'toolbarItems': this.toolbar,
    'events': {
      'change': this.onChange_.bind(this)
    },
    'codeBlockLanguages': ['markdown'],
    'usedefaultHTMLSanitizer': false,
    'useCommandShortcut': false,
    'usageStatistics': false,
    'exts': [
      'table'
    ]
  };

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


/**
 * @param {string} markdown
 * @return {string} - markdown parsed to html
 */
os.ui.text.TuiEditor.render = function(markdown) {
  return tui.Editor.markdownitHighlight.render(markdown);
};
