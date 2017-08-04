/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = parseTags;
/* harmony export (immutable) */ __webpack_exports__["a"] = getCurrentTabUrl;
function parseTags(_tags) {
  const tags = _tags.split(',');
  tags.push('fromChrome');
  return tags;
}

function getCurrentTabUrl(callback) {
  // https://developer.chrome.com/extensions/tabs#method-query
  const queryInfo = {
    active: true,
    currentWindow: true,
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    const tab = tabs[0];
    const url = tab.url;
    // console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ligo__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__misc__ = __webpack_require__(0);


const css = __webpack_require__(3);

document.addEventListener('DOMContentLoaded', () => {
  Object(__WEBPACK_IMPORTED_MODULE_1__misc__["a" /* getCurrentTabUrl */])((url) => {
    const ligo = new __WEBPACK_IMPORTED_MODULE_0__ligo__["a" /* default */](url);
    ligo.init();
  });
});


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__misc__ = __webpack_require__(0);


const LigoState = {
  TOKEN: 0,
  LINK: 1,
  RESPONSE: 2,
};

class Ligo {
  constructor(url) {
    this.url = url;
    this.token = localStorage.getItem('token.afk');
    this.bttSubmitLink = document.getElementById('submitLink');
    this.bttSubmitToken = document.getElementById('submitToken');
    this.bttResetToken = document.getElementById('reset-token');
    this.fldUrl = document.getElementById('url');
    this.fldTags = document.getElementById('tags');
    this.fldToken = document.getElementById('token');
    this.frmSubmitLink = document.getElementById('submitLinkForm');
    this.frmSubmitToken = document.getElementById('submitTokenForm');
    this.sectResponse = document.getElementById('response');
    this.pResTitle = document.getElementById('response-title');
    this.pResBody = document.getElementById('response-body');
  }

  init() {
    this.setValues();
    this.setEvents();

    if (this.token) {
      this.updateState(LigoState.LINK);
      this.bttSubmitLink.addEventListener('click', () => {
        this.submitLink();
      });
    } else {
      this.updateState(LigoState.TOKEN);
      this.bttSubmitToken.addEventListener('click', () => {
        this.submitToken();
      });
    }
  }

  changeView() {
    this.frmSubmitToken.className = 'hidden';
    this.frmSubmitLink.className = 'hidden';
    this.sectResponse.className = 'hidden';

    switch (this.state) {
      case LigoState.TOKEN:
        this.frmSubmitToken.className = '';
        break;
      case LigoState.LINK:
        this.frmSubmitLink.className = '';
        break;
      case LigoState.RESPONSE:
        this.sectResponse.className = '';
        break;
      default:
        break;
    }
  }

  updateResponse(res) {
    if (res.ok) {
      this.pResTitle.innerHTML = 'Success';
    } else {
      this.pResTitle.innerHTML = 'Failed';
    }
    console.log(res);
    this.pResBody.innerHTML = res.statusText;
  }

  updateState(state) {
    console.log('state: ' + state);
    this.state = state;
    this.changeView();
  }

  setValues() {
    this.fldUrl.value = this.url;
    this.state = LigoState.TOKEN;
  }

  setEvents() {
    this.bttResetToken.addEventListener('click', this.resetToken);
  }

  resetToken() {
    localStorage.removeItem('token.afk');
    this.reset();
  }

  reset() {
    location.reload(true);
  }

  submitToken() {
    this.token = this.fldToken.value;
    localStorage.setItem('token.afk', this.token);
    this.reset();
  }

  submitLink() {
    const tokenHeader = `Token ${this.token}`;
    const headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: tokenHeader,
    });

    const request = new Request('https://api.ellugar.co/ligoj/link/', {
      method: 'POST',
      redirect: 'follow',
      mode: 'cors',
      headers,
      body: JSON.stringify({
        link: this.fldUrl.value,
        tags: Object(__WEBPACK_IMPORTED_MODULE_0__misc__["b" /* parseTags */])(this.fldTags.value),
      }),
    });

    this.updateState(LigoState.RESPONSE);

    fetch(request).then((res) => {
      this.updateResponse(res);
    });
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Ligo;



/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(6)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/stylus-loader/index.js??ref--0-2!./style.styl", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/stylus-loader/index.js??ref--0-2!./style.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(undefined);
// imports


// module
exports.push([module.i, "html,\nbody,\ndiv,\nspan,\napplet,\nobject,\niframe,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\np,\nblockquote,\npre,\na,\nabbr,\nacronym,\naddress,\nbig,\ncite,\ncode,\ndel,\ndfn,\nem,\nimg,\nins,\nkbd,\nq,\ns,\nsamp,\nsmall,\nstrike,\nstrong,\nsub,\nsup,\ntt,\nvar,\ndl,\ndt,\ndd,\nol,\nul,\nli,\nfieldset,\nform,\nlabel,\nlegend,\ntable,\ncaption,\ntbody,\ntfoot,\nthead,\ntr,\nth,\ntd {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  outline: 0;\n  font-weight: inherit;\n  font-style: inherit;\n  font-family: inherit;\n  font-size: 100%;\n  vertical-align: baseline;\n}\nbody {\n  line-height: 1;\n  color: #000;\n  background: #fff;\n}\nol,\nul {\n  list-style: none;\n}\ntable {\n  border-collapse: separate;\n  border-spacing: 0;\n  vertical-align: middle;\n}\ncaption,\nth,\ntd {\n  text-align: left;\n  font-weight: normal;\n  vertical-align: middle;\n}\na img {\n  border: none;\n}\n* {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\nhtml,\nbody {\n  min-width: 250px;\n  margin: 0;\n  padding: 0;\n  color: #000;\n  background: #fff;\n  font-family: 'Source Sans Pro', sans-serif;\n  word-spacing: 0.2em;\n  letter-spacing: 0.0825em;\n}\nbody {\n  padding: 0 0 20px 0;\n/* .hideMobile */\n/*     @media screen and (max-width: $mobile-width) */\n/*         display none !important */\n}\nbody .wrapper {\n  height: auto;\n  display: block;\n  margin: auto;\n}\n.button {\n  border: 2px solid #000;\n  padding: 5px;\n  text-align: center;\n  cursor: pointer;\n  display: block;\n  -webkit-transition: background 0.2s ease;\n  -moz-transition: background 0.2s ease;\n  -o-transition: background 0.2s ease;\n  -ms-transition: background 0.2s ease;\n  transition: background 0.2s ease;\n}\n.button.white {\n  color: #000;\n  background: #fff;\n  border-color: #000;\n}\n.button.white:hover {\n  background-color: #000;\n  color: #fff;\n}\n.button.black {\n  color: #fff;\n  background: #000;\n  border-color: #fff;\n}\n.button.black:hover {\n  background-color: #fff;\n  color: #000;\n}\nheader,\nsection {\n  width: 100%;\n  height: auto;\n  display: block;\n  overflow: hidden;\n}\nh1 {\n  display: block;\n}\na {\n  text-decoration: none;\n}\na,\nspan {\n  margin: 0;\n  font-size: 0.5em;\n}\n.wrapper {\n  width: calc(100% - 20px);\n  display: block;\n  margin: auto;\n}\n.hidden {\n  display: none;\n}\nform {\n  width: 100%;\n  display: block;\n  font-family: $fontSans;\n}\nfieldset {\n  width: 49%;\n  items-algin: stretch;\n}\nfieldset.enviar {\n  width: 100%;\n  margin: 20px 0 0 0;\n  display: block;\n  text-align: right;\n}\ninput,\ntextarea {\n  width: 100%;\n  margin: 0;\n  color: #000;\n  background: transparent;\n  font-weight: 600;\n  font-size: 1em;\n  font-family: $fontSans;\n  text-transform: uppercase;\n  border-radius: 0;\n  border: none;\n  -webkit-box-shadow: none;\n  box-shadow: none;\n  outline: none;\n  border: 2px solid #000;\n  margin: 0 auto 10px auto;\n  padding: 5px;\n  -webkit-transition: border-color 0.2s ease;\n  -moz-transition: border-color 0.2s ease;\n  -o-transition: border-color 0.2s ease;\n  -ms-transition: border-color 0.2s ease;\n  transition: border-color 0.2s ease;\n}\ninput:first-child,\ntextarea:first-child {\n  margin: 0 auto 10px auto;\n}\ninput:last-child,\ntextarea:last-child {\n  margin: 0 auto 0 auto;\n}\ninput::placeholder,\ntextarea::placeholder {\n  color: #000;\n  text-transform: uppercase;\n  font-weight: 600;\n  font-size: 1em;\n}\ninput:focus,\ntextarea:focus,\ninput:invalid,\ntextarea:invalid {\n  border-radius: 0;\n  border: none;\n  -webkit-box-shadow: none;\n  box-shadow: none;\n  outline: none;\n  border: 2px solid #000;\n}\ninput:-moz-focusring,\ntextarea:-moz-focusring {\n  outline: none;\n}\ninput:invalid,\ntextarea:invalid {\n  color: #ec008c;\n  border-color: #ec008c;\n}\ninput[type=\"submit\"],\ntextarea[type=\"submit\"] {\n  color: #00aeef;\n  border: 2px solid #00aeef;\n  background-color: transparent;\n  margin: 0;\n  cursor: pointer;\n  -webkit-transition: background-color 0.2s ease;\n  -moz-transition: background-color 0.2s ease;\n  -o-transition: background-color 0.2s ease;\n  -ms-transition: background-color 0.2s ease;\n  transition: background-color 0.2s ease;\n  display: inline-block;\n}\ninput[type=\"submit\"]:hover,\ntextarea[type=\"submit\"]:hover {\n  background-color: #00aeef;\n  color: #000;\n}\ninput[type=\"radio\"],\ntextarea[type=\"radio\"] {\n  opacity: 0;\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)\";\n  filter: alpha(opacity=0);\n  position: absolute;\n  display: none;\n}\ninput[type=\"radio\"]:focus+label,\ntextarea[type=\"radio\"]:focus+label,\ninput[type=\"radio\"]:checked+label,\ntextarea[type=\"radio\"]:checked+label {\n  color: #00aeef;\n}\ninput[type=\"radio\"]:disabled+label,\ntextarea[type=\"radio\"]:disabled+label {\n  opacity: 0.8;\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=80)\";\n  filter: alpha(opacity=80);\n}\ninput[type=\"radio\"]+label,\ntextarea[type=\"radio\"]+label {\n  font-weight: 200;\n  cursor: pointer;\n  width: 100%;\n  display: block;\n  margin: 5px auto 5px auto;\n  -webkit-transition: color 0.2s ease;\n  -moz-transition: color 0.2s ease;\n  -o-transition: color 0.2s ease;\n  -ms-transition: color 0.2s ease;\n  transition: color 0.2s ease;\n}\ninput[type=\"radio\"]+label:first-of-type,\ntextarea[type=\"radio\"]+label:first-of-type {\n  margin: 20px auto 5px auto;\n}\ninput[type=\"radio\"]+label:last-of-type,\ntextarea[type=\"radio\"]+label:last-of-type {\n  margin: 5px auto 0 auto;\n}\ntextarea {\n  resize: none;\n  overflow: auto;\n  font-size: 1.25em;\n}\ntextarea::selection {\n  background-color: #000;\n}\n#header {\n  background: #000;\n  color: #fff;\n  font-size: 1.6em;\n  margin: 0 0 10px 0;\n  padding: 10px 0 10px 0;\n}\n#header .wrapper {\n  display: -webkit-box;\n  display: -moz-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: box;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -moz-box-orient: horizontal;\n  -o-box-orient: horizontal;\n  -webkit-box-lines: multiple;\n  -moz-box-lines: multiple;\n  -o-box-lines: multiple;\n  -webkit-flex-flow: row wrap;\n  -ms-flex-flow: row wrap;\n  flex-flow: row wrap;\n  -webkit-box-align: center;\n  -moz-box-align: center;\n  -o-box-align: center;\n  -ms-flex-align: center;\n  -webkit-align-items: center;\n  align-items: center;\n  -webkit-box-pack: justify;\n  -moz-box-pack: justify;\n  -o-box-pack: justify;\n  -ms-flex-pack: justify;\n  -webkit-justify-content: space-between;\n  justify-content: space-between;\n}\n#header .wrapper div {\n  width: 48%;\n}\n#header .wrapper div:first-child {\n  text-align: left;\n}\n#header .wrapper div:last-child {\n  text-align: right;\n}\n#response .wrapper {\n  border: 2px solid #000;\n  text-align: center;\n  padding: 5px;\n  font-weight: 700;\n  font-size: 1.2em;\n}\n#response .wrapper p {\n  display: block;\n}\n", ""]);

// exports


/***/ }),
/* 5 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(7);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 7 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })
/******/ ]);
//# sourceMappingURL=main.map