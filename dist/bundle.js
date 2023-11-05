/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 3 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "@charset \"UTF-8\";\n:root {\n  --body-background-color: #C0A9BD;\n  --background-color: #F4F2F3;\n  --text-color: #64766A;\n  --highlight-color: #64766A;\n  --border-color: #C0A9BD;\n}\n\n* {\n  margin: 0;\n  padding: 0;\n  overflow-x: hidden;\n}\n\nbody {\n  background-color: #C0A9BD;\n  padding: 20px;\n  width: 100%;\n}\n\n.main-header,\n.main-elements,\n.buttons,\n.search-button,\n.search-container,\n.recipe,\n.modal__overlay,\n.modal__title,\n.modal__header,\n.modal_container_img_ingredients,\n.modal_ingredients_container,\n.modal_button_container,\n.popular-recipe,\n#recipe-container {\n  display: flex;\n}\n\n.main-header {\n  border-radius: 25px;\n  color: var(--text-color);\n  height: 20vh;\n  width: 93%;\n  background-color: var(--background-color);\n  background-size: 100%;\n  background-position: center 55%;\n  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);\n  justify-content: space-between;\n  margin-left: 25px;\n}\n\n.nav-left-container {\n  display: flex;\n  flex-direction: row-reverse;\n}\n\n.title {\n  overflow: hidden;\n  margin-top: 7vh;\n  margin-left: 1vw;\n  font-size: 50px;\n}\n\n.search {\n  width: 100%;\n  display: flex;\n}\n\n.navigation-section {\n  padding: 20px;\n  margin-top: 100px;\n  margin-left: 25px;\n  border-radius: 25px;\n  height: 388px;\n  min-width: 170px;\n  background-color: var(--background-color);\n  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);\n}\n\n.buttons {\n  margin-top: 16px;\n  min-width: 75px;\n  flex-direction: column;\n  align-items: center;\n}\n\nbutton {\n  --c: var(--body-background-color);\n  box-shadow: 0 0 0 0.1em inset var(--c);\n  --_g: linear-gradient(var(--c) 0 0) no-repeat;\n  background: var(--_g) calc(var(--_p, 0%) - 100%) 0%, var(--_g) calc(200% - var(--_p, 0%)) 0%, var(--_g) calc(var(--_p, 0%) - 100%) 100%, var(--_g) calc(200% - var(--_p, 0%)) 100%;\n  background-size: 50.5% calc(var(--_p, 0%) / 2 + 0.5%);\n  outline-offset: 0.1em;\n  transition: background-size 0.2s, background-position 0s 0.2s;\n  font-family: system-ui, sans-serif;\n  font-size: 1rem;\n  cursor: pointer;\n  padding: 0.1em 1.3em;\n  font-weight: bold;\n  border: none;\n  min-width: 170px;\n  height: 2.65em;\n  margin-bottom: 10px;\n  width: 5em;\n  color: var(--text-color);\n  transition-duration: 0.2s;\n}\n\nbutton:hover {\n  --_p: 100%;\n  transition: background-position 0.4s, background-size 0s;\n  color: var(--highlight-color);\n}\n\nbutton:active {\n  box-shadow: 0 0 9000000000q inset rgba(0, 0, 0, 0.6);\n  background-color: var(--c);\n  color: #fff;\n}\n\n.search-bar {\n  width: 250px;\n  height: 30px;\n  padding: 5px;\n  margin-bottom: 24px;\n  cursor: pointer;\n  padding-left: 20px;\n  border: 3px solid var(--text-color);\n  border-right: none;\n  border-radius: 5px 0 0 5px;\n  outline: none;\n  background-color: var(--background-color);\n  color: var(--text-color);\n}\n\n::placeholder {\n  color: var(--body-background-color);\n}\n\n.search-button {\n  width: 10px;\n  min-width: 10px;\n  height: 30px;\n  border: 1px solid var(--border-color);\n  background: var(--background-color);\n  text-align: center;\n  color: var(--text-color);\n  border-radius: 0 5px 5px 0;\n  cursor: pointer;\n  font-size: 20px;\n  justify-content: center;\n  align-items: center;\n  flex-direction: column;\n}\n\n.recipe-section {\n  margin: 20px;\n  min-width: 400px;\n}\n\n.search-container {\n  align-items: flex-end;\n  margin-right: 1.5vw;\n}\n\n.recipe {\n  overflow: hidden;\n  color: var(--text-color);\n  margin-left: 2vw;\n  margin-top: 2vh;\n  min-height: 260px;\n  width: 300px;\n  min-width: 150px;\n  background-color: var(--background-color);\n  border: var(--border-color) 2px solid;\n  border-radius: 20px;\n  justify-content: center;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n  cursor: pointer;\n  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);\n}\n\n.admin-section {\n  margin-top: 30px;\n  margin-bottom: 30px;\n  margin-right: 10vw;\n  text-align: center;\n  position: relative;\n  align-content: center;\n  flex-direction: column;\n  align-items: center;\n  width: 93%;\n  height: 100%;\n}\n\n#login-form button {\n  background-color: var(--background-color);\n  width: 5%;\n  margin: 10px 0px;\n  border: none;\n  cursor: pointer;\n}\n\n#login-form input {\n  margin-top: 20vh;\n  font-family: inherit;\n  width: 25%;\n  border: 0;\n  border-bottom: 2px solid var(--background-color);\n  outline: 0;\n  font-size: 1.3rem;\n  color: var(--highlight-color);\n  padding: 7px 0;\n  background: transparent;\n  transition: border-color 0.2s;\n}\n\n.login-error {\n  margin-top: 5vh;\n  color: red;\n}\n\n#admin-items-container {\n  flex-wrap: wrap;\n  width: 90%;\n}\n\n.admin {\n  overflow: hidden;\n  position: relative;\n  text-align: center;\n  margin-top: 30px;\n  padding: 0.4em 0.4em 0.4em 0.8em;\n  margin: 0.5em 0 0 -10em;\n  color: #444;\n  border-radius: 5px;\n  margin-left: 1vw;\n}\n\n.scroll-element {\n  width: inherit;\n  height: inherit;\n  position: absolute;\n  left: 0%;\n  top: 0%;\n  animation: primary 3s linear infinite;\n}\n\n@keyframes primary {\n  from {\n    top: 0%;\n  }\n  to {\n    bottom: -100%;\n  }\n}\n.admin-title {\n  justify-content: center;\n  color: var(--highlight-color);\n}\n\n.admin-list {\n  margin-left: 2vw;\n  flex-wrap: wrap;\n  border-radius: 3px;\n  color: var(--background-color);\n  text-decoration: none;\n  transition: all 0.3s ease-out;\n  flex-direction: row;\n  font-size: 25px;\n}\n\n.admin-list > li {\n  border-bottom: 2px solid var(--background-color);\n}\n\n.admin-subtitle {\n  justify-content: center;\n  margin-top: 2vh;\n  color: var(--highlight-color);\n}\n\n.recipe-img {\n  height: 200px;\n  width: auto;\n}\n\n.recipe:hover {\n  transform: scale(1.04);\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);\n}\n\n.modal {\n  display: none;\n}\n\n.modal.is-open {\n  display: block;\n}\n\n.modal {\n  font-family: arial, sans-serif;\n}\n\n.modal__overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.6);\n  justify-content: center;\n  align-items: center;\n}\n\n.modal__container {\n  background-color: #fff;\n  padding: 30px;\n  max-width: 80%;\n  max-height: 100vh;\n  min-width: 500px;\n  border-radius: 50px;\n  overflow-y: auto;\n  box-sizing: border-box;\n  background-color: rgb(247, 243, 233);\n  display: flex;\n}\n\n.modal__title {\n  margin: 0;\n  font-weight: 600;\n  font-size: 2rem;\n  line-height: 1.25;\n  color: black;\n  box-sizing: border-box;\n  text-align: center !important;\n  justify-content: center;\n}\n\n.modal__header {\n  justify-content: center;\n  align-items: center;\n}\n\n.modal_container_img_ingredients {\n  justify-content: center;\n  align-items: center;\n  padding-right: 10px;\n}\n\n.modal_img {\n  display: flex;\n  align-items: flex-start;\n}\n\n.modal_ingredients_container {\n  border-radius: 5px;\n  width: 35%;\n  flex-direction: column;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.modal_recipe_instructions {\n  text-align: center;\n  padding-top: 20px;\n  padding-bottom: 20px;\n}\n\n.modal__close {\n  background-color: #e6e6e6;\n  color: rgba(0, 0, 0, 0.8);\n  float: right;\n  margin-right: 10px;\n  border-radius: 0.25rem;\n  border-style: none;\n  border-width: 0;\n}\n\n.modal__header .modal__close:before {\n  content: \"✕\";\n}\n\n.modal__content {\n  margin-top: 2rem;\n  margin-bottom: 2rem;\n  line-height: 1.5;\n  color: rgba(0, 0, 0, 0.8);\n  border-radius: 2px;\n}\n\n.modal_cost {\n  padding-top: 20px;\n  padding-bottom: 20px;\n}\n\n.modal_button_container {\n  justify-content: space-around;\n  align-items: center;\n}\n\n.modal__btn {\n  margin-right: 20px;\n  font-size: 0.875rem;\n  background-color: white;\n  color: rgba(0, 0, 0, 0.8);\n  border-radius: 0.25rem;\n  border-style: none;\n  border-width: 0;\n  cursor: pointer;\n  text-transform: none;\n  overflow: visible;\n  line-height: 1.15;\n  margin: 0;\n  will-change: transform;\n  backface-visibility: hidden;\n  transform: translateZ(0);\n}\n\n.modal__btn:focus,\n.modal__btn:hover {\n  -webkit-transform: scale(1.05);\n  transform: scale(1.05);\n}\n\n.hidden {\n  display: none;\n}\n\n@keyframes mmfadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes mmfadeOut {\n  from {\n    opacity: 1;\n  }\n  to {\n    opacity: 0;\n  }\n}\n@keyframes mmslideIn {\n  from {\n    transform: translateY(15%);\n  }\n  to {\n    transform: translateY(0);\n  }\n}\n@keyframes mmslideOut {\n  from {\n    transform: translateY(0);\n  }\n  to {\n    transform: translateY(-10%);\n  }\n}\n.micromodal-slide {\n  display: none;\n}\n\n.micromodal-slide.is-open {\n  display: block;\n}\n\n.micromodal-slide[aria-hidden=false] .modal__overlay {\n  animation: mmfadeIn 0.3s cubic-bezier(0, 0, 0.2, 1);\n}\n\n.micromodal-slide[aria-hidden=false] .modal__container {\n  animation: mmslideIn 0.3s cubic-bezier(0, 0, 0.2, 1);\n}\n\n.micromodal-slide[aria-hidden=true] .modal__overlay {\n  animation: mmfadeOut 0.3s cubic-bezier(0, 0, 0.2, 1);\n}\n\n.micromodal-slide[aria-hidden=true] .modal__container {\n  animation: mmslideOut 0.3s cubic-bezier(0, 0, 0.2, 1);\n}\n\n.micromodal-slide .modal__container,\n.micromodal-slide .modal__overlay {\n  will-change: transform;\n}\n\n.popular-recipe {\n  color: var(--text-color);\n  margin-left: 2vw;\n  margin-top: 2vh;\n  height: 350px;\n  width: 300px;\n  min-width: 100px;\n  background-color: var(--background-color);\n  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);\n  border: var(--border-color) 4px solid;\n  border-radius: 20px;\n  justify-content: center;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n  cursor: pointer;\n}\n\n.popular-recipe > img {\n  height: 250px;\n  width: auto;\n}\n\n.small-recipe-text {\n  margin-top: 2vh;\n  height: 68px;\n  width: auto;\n  min-width: 100px;\n}\n\n#recipe-container {\n  flex-direction: row;\n  align-items: center;\n  flex-wrap: wrap;\n}\n\n#recipes-header {\n  margin: 0 0 30px 2vw;\n  color: var(--background-color);\n}\n\n#top-button {\n  display: none;\n  font-size: 18px;\n  position: fixed;\n  bottom: 20px;\n  right: 30px;\n  z-index: 99;\n  background-color: var(--text-color);\n  color: rgb(41, 7, 73);\n  padding: 15px;\n  border-radius: 10px;\n  height: fit-content;\n}\n\n#clear-button {\n  font-size: 18px;\n  position: fixed;\n  bottom: 20px;\n  right: 30px;\n  z-index: 99;\n  background-color: var(--background-color);\n  color: rgb(41, 7, 73);\n  padding: 15px;\n  border-radius: 10px;\n  height: fit-content;\n}", "",{"version":3,"sources":["webpack://./src/styles.css"],"names":[],"mappings":"AAAA,gBAAgB;AAAhB;EACE,gCAAA;EACA,2BAAA;EACA,qBAAA;EACA,0BAAA;EACA,uBAAA;AAEF;;AACA;EACE,SAAA;EACA,UAAA;EACA,kBAAA;AAEF;;AACA;EACE,yBAAA;EACA,aAAA;EACA,WAAA;AAEF;;AACA;;;;;;;;;;;;;;EAcE,aAAA;AAEF;;AAEA;EACE,mBAAA;EACA,wBAAA;EACA,YAAA;EACA,UAAA;EACA,yCAAA;EACA,qBAAA;EACA,+BAAA;EACA,yCAAA;EACA,8BAAA;EACA,iBAAA;AACF;;AAEA;EACE,aAAA;EACA,2BAAA;AACF;;AAGA;EACE,gBAAA;EACA,eAAA;EACA,gBAAA;EACA,eAAA;AAAF;;AAGA;EACE,WAAA;EACA,aAAA;AAAF;;AAGA;EACE,aAAA;EACA,iBAAA;EACA,iBAAA;EACA,mBAAA;EACA,aAAA;EACA,gBAAA;EACA,yCAAA;EACA,yCAAA;AAAF;;AAIA;EACE,gBAAA;EACA,eAAA;EACA,sBAAA;EACA,mBAAA;AADF;;AAIA;EACE,iCAAA;EACA,sCAAA;EACA,6CAAA;EACA,kLACA;EAIA,qDAAA;EACA,qBAAA;EACA,6DAAA;EACA,kCAAA;EACA,eAAA;EACA,eAAA;EACA,oBAAA;EACA,iBAAA;EACA,YAAA;EACA,gBAAA;EACA,cAAA;EACA,mBAAA;EACA,UAAA;EACA,wBAAA;EACA,yBAAA;AALF;;AAQA;EACE,UAAA;EACA,wDAAA;EACA,6BAAA;AALF;;AAQA;EACE,oDAAA;EACA,0BAAA;EACA,WAAA;AALF;;AAQA;EACE,YAAA;EACA,YAAA;EACA,YAAA;EACA,mBAAA;EACA,eAAA;EACA,kBAAA;EACA,mCAAA;EACA,kBAAA;EACA,0BAAA;EACA,aAAA;EACA,yCAAA;EACA,wBAAA;AALF;;AAQA;EACE,mCAAA;AALF;;AAQA;EACE,WAAA;EACA,eAAA;EACA,YAAA;EACA,qCAAA;EACA,mCAAA;EACA,kBAAA;EACA,wBAAA;EACA,0BAAA;EACA,eAAA;EACA,eAAA;EACA,uBAAA;EACA,mBAAA;EACA,sBAAA;AALF;;AAQA;EACE,YAAA;EACA,gBAAA;AALF;;AASA;EACE,qBAAA;EACA,mBAAA;AANF;;AASA;EACE,gBAAA;EACA,wBAAA;EACA,gBAAA;EACA,eAAA;EACA,iBAAA;EACA,YAAA;EACA,gBAAA;EACA,yCAAA;EACA,qCAAA;EACA,mBAAA;EACA,uBAAA;EACA,sBAAA;EACA,mBAAA;EACA,kBAAA;EACA,eAAA;EACA,yCAAA;AANF;;AASA;EACE,gBAAA;EACA,mBAAA;EACA,kBAAA;EACA,kBAAA;EACA,kBAAA;EACA,qBAAA;EACA,sBAAA;EACA,mBAAA;EACA,UAAA;EACA,YAAA;AANF;;AASA;EACE,yCAAA;EACA,SAAA;EACA,gBAAA;EACA,YAAA;EACA,eAAA;AANF;;AASA;EACE,gBAAA;EACA,oBAAA;EACA,UAAA;EACA,SAAA;EACA,gDAAA;EACA,UAAA;EACA,iBAAA;EACA,6BAAA;EACA,cAAA;EACA,uBAAA;EACA,6BAAA;AANF;;AASA;EACE,eAAA;EACA,UAAA;AANF;;AASA;EACE,eAAA;EACA,UAAA;AANF;;AASA;EACE,gBAAA;EACA,kBAAA;EACA,kBAAA;EACA,gBAAA;EACA,gCAAA;EACA,uBAAA;EACA,WAAA;EACA,kBAAA;EACA,gBAAA;AANF;;AASA;EACE,cAAA;EACA,eAAA;EACA,kBAAA;EACA,QAAA;EACA,OAAA;EACA,qCAAA;AANF;;AASA;EACE;IACE,OAAA;EANF;EASA;IACE,aAAA;EAPF;AACF;AAUA;EACE,uBAAA;EACA,6BAAA;AARF;;AAWA;EACE,gBAAA;EACA,eAAA;EACA,kBAAA;EACA,8BAAA;EACA,qBAAA;EACA,6BAAA;EACA,mBAAA;EACA,eAAA;AARF;;AAWA;EACE,gDAAA;AARF;;AAWA;EACE,uBAAA;EACA,eAAA;EACA,6BAAA;AARF;;AAWA;EACE,aAAA;EACA,WAAA;AARF;;AAWA;EACE,sBAAA;EACA,uCAAA;AARF;;AAWA;EACE,aAAA;AARF;;AAWA;EACE,cAAA;AARF;;AAWA;EACE,8BAAA;AARF;;AAWA;EACE,eAAA;EACA,MAAA;EACA,OAAA;EACA,QAAA;EACA,SAAA;EACA,8BAAA;EACA,uBAAA;EACA,mBAAA;AARF;;AAWA;EACE,sBAAA;EACA,aAAA;EACA,cAAA;EACA,iBAAA;EACA,gBAAA;EACA,mBAAA;EACA,gBAAA;EACA,sBAAA;EACA,oCAAA;EACA,aAAA;AARF;;AAWA;EACE,SAAA;EACA,gBAAA;EACA,eAAA;EACA,iBAAA;EACA,YAAA;EACA,sBAAA;EACA,6BAAA;EACA,uBAAA;AARF;;AAYA;EACE,uBAAA;EACA,mBAAA;AATF;;AAYA;EACE,uBAAA;EACA,mBAAA;EACA,mBAAA;AATF;;AAYA;EACE,aAAA;EACA,uBAAA;AATF;;AAYA;EACE,kBAAA;EACA,UAAA;EACA,sBAAA;EACA,8BAAA;EACA,mBAAA;AATF;;AAYA;EACE,kBAAA;EACA,iBAAA;EACA,oBAAA;AATF;;AAYA;EACE,yBAAA;EACA,yBAAA;EACA,YAAA;EACA,kBAAA;EACA,sBAAA;EACA,kBAAA;EACA,eAAA;AATF;;AAYA;EACE,YAAA;AATF;;AAYA;EACE,gBAAA;EACA,mBAAA;EACA,gBAAA;EACA,yBAAA;EACA,kBAAA;AATF;;AAYA;EACE,iBAAA;EACA,oBAAA;AATF;;AAYA;EACE,6BAAA;EACA,mBAAA;AATF;;AAYA;EACE,kBAAA;EACA,mBAAA;EACA,uBAAA;EACA,yBAAA;EACA,sBAAA;EACA,kBAAA;EACA,eAAA;EACA,eAAA;EACA,oBAAA;EACA,iBAAA;EACA,iBAAA;EACA,SAAA;EACA,sBAAA;EACA,2BAAA;EACA,wBAAA;AATF;;AAYA;;EAEE,8BAAA;EACA,sBAAA;AATF;;AAaA;EACE,aAAA;AAVF;;AAaA;EACE;IACE,UAAA;EAVF;EAaA;IACE,UAAA;EAXF;AACF;AAcA;EACE;IACE,UAAA;EAZF;EAeA;IACE,UAAA;EAbF;AACF;AAgBA;EACE;IACE,0BAAA;EAdF;EAiBA;IACE,wBAAA;EAfF;AACF;AAkBA;EACE;IACE,wBAAA;EAhBF;EAmBA;IACE,2BAAA;EAjBF;AACF;AAoBA;EACE,aAAA;AAlBF;;AAqBA;EACE,cAAA;AAlBF;;AAqBA;EACE,mDAAA;AAlBF;;AAqBA;EACE,oDAAA;AAlBF;;AAqBA;EACE,oDAAA;AAlBF;;AAqBA;EACE,qDAAA;AAlBF;;AAqBA;;EAEE,sBAAA;AAlBF;;AAqBA;EACE,wBAAA;EACA,gBAAA;EACA,eAAA;EACA,aAAA;EACA,YAAA;EACA,gBAAA;EACA,yCAAA;EACA,yCAAA;EACA,qCAAA;EACA,mBAAA;EACA,uBAAA;EACA,sBAAA;EACA,mBAAA;EACA,kBAAA;EACA,eAAA;AAlBF;;AAqBA;EACE,aAAA;EACA,WAAA;AAlBF;;AAqBA;EACE,eAAA;EACA,YAAA;EACA,WAAA;EACA,gBAAA;AAlBF;;AAqBA;EACE,mBAAA;EACA,mBAAA;EACA,eAAA;AAlBF;;AAqBA;EACE,oBAAA;EACA,8BAAA;AAlBF;;AAqBA;EACE,aAAA;EACA,eAAA;EACA,eAAA;EACA,YAAA;EACA,WAAA;EACA,WAAA;EACA,mCAAA;EACA,qBAAA;EACA,aAAA;EACA,mBAAA;EACA,mBAAA;AAlBF;;AAqBA;EACE,eAAA;EACA,eAAA;EACA,YAAA;EACA,WAAA;EACA,WAAA;EACA,yCAAA;EACA,qBAAA;EACA,aAAA;EACA,mBAAA;EACA,mBAAA;AAlBF","sourcesContent":[":root {\n  --body-background-color: #C0A9BD;\n  --background-color:  #F4F2F3;\n  --text-color: #64766A;\n  --highlight-color: #64766A;\n  --border-color:  #C0A9BD;\n}\n\n* {\n  margin: 0;\n  padding: 0;\n  overflow-x: hidden;\n}\n\nbody {\n  background-color:   #C0A9BD;\n  padding: 20px;\n  width: 100%;\n}\n\n.main-header,\n.main-elements,\n.buttons,\n.search-button,\n.search-container,\n.recipe,\n.modal__overlay,\n.modal__title,\n.modal__header,\n.modal_container_img_ingredients,\n.modal_ingredients_container,\n.modal_button_container,\n.popular-recipe,\n#recipe-container {\n  display: flex;\n}\n\n\n.main-header {\n  border-radius: 25px;\n  color: var(--text-color);\n  height: 20vh;\n  width: 93%;\n  background-color: var(--background-color);\n  background-size: 100%;\n  background-position: center 55%;\n  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);\n  justify-content: space-between;\n  margin-left: 25px;\n}\n\n.nav-left-container {\n  display: flex;\n  flex-direction: row-reverse;\n}\n\n\n.title {\n  overflow: hidden;\n  margin-top: 7vh;\n  margin-left: 1vw;\n  font-size: 50px;\n}\n\n.search {\n  width: 100%;\n  display: flex;\n}\n\n.navigation-section {\n  padding: 20px;\n  margin-top: 100px;\n  margin-left: 25px;\n  border-radius: 25px;\n  height: 388px;\n  min-width: 170px;\n  background-color: var(--background-color);\n  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);\n}\n\n\n.buttons {\n  margin-top: 16px;\n  min-width: 75px;\n  flex-direction: column;\n  align-items: center;\n}\n\nbutton {\n  --c: var(--body-background-color);\n  box-shadow: 0 0 0 .1em inset var(--c);\n  --_g: linear-gradient(var(--c) 0 0) no-repeat;\n  background:\n  var(--_g) calc(var(--_p, 0%) - 100%) 0%,\n  var(--_g) calc(200% - var(--_p, 0%)) 0%,\n  var(--_g) calc(var(--_p, 0%) - 100%) 100%,\n  var(--_g) calc(200% - var(--_p, 0%)) 100%;\n  background-size: 50.5% calc(var(--_p, 0%)/2 + .5%);\n  outline-offset: .1em;\n  transition: background-size .2s, background-position 0s .2s;\n  font-family: system-ui, sans-serif;\n  font-size: 1rem;\n  cursor: pointer;\n  padding: .1em 1.3em;\n  font-weight: bold;\n  border: none;\n  min-width: 170px;\n  height: 2.65em;\n  margin-bottom: 10px;\n  width: 5em;\n  color: var(--text-color);\n  transition-duration: .2s;\n}\n\nbutton:hover {\n  --_p: 100%;\n  transition: background-position .4s, background-size 0s;\n  color: var(--highlight-color);\n}\n\nbutton:active {\n  box-shadow: 0 0 9e9q inset #0009;\n  background-color: var(--c);\n  color: #fff;\n}\n\n.search-bar {\n  width: 250px;\n  height: 30px;\n  padding: 5px;\n  margin-bottom: 24px;\n  cursor: pointer;\n  padding-left: 20px;\n  border: 3px solid var(--text-color);\n  border-right: none;\n  border-radius: 5px 0 0 5px;\n  outline: none;\n  background-color: var(--background-color);\n  color: var(--text-color);\n}\n\n::placeholder {\n  color: var(--body-background-color);\n}\n\n.search-button {\n  width: 10px;\n  min-width: 10px;\n  height: 30px;\n  border: 1px solid var(--border-color);\n  background: var(--background-color);\n  text-align: center;\n  color: var(--text-color);\n  border-radius: 0 5px 5px 0;\n  cursor: pointer;\n  font-size: 20px;\n  justify-content: center;\n  align-items: center;\n  flex-direction: column;\n}\n\n.recipe-section {\n  margin: 20px;\n  min-width: 400px;\n}\n\n\n.search-container {\n  align-items: flex-end;\n  margin-right: 1.5vw;\n}\n\n.recipe {\n  overflow: hidden;\n  color: var(--text-color);\n  margin-left: 2vw;\n  margin-top: 2vh;\n  min-height: 260px;\n  width: 300px;\n  min-width: 150px;\n  background-color: var(--background-color);\n  border: var(--border-color) 2px solid;\n  border-radius: 20px;\n  justify-content: center;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n  cursor: pointer;\n  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2)\n}\n\n.admin-section {\n  margin-top: 30px;\n  margin-bottom: 30px;\n  margin-right: 10vw;\n  text-align: center;\n  position: relative;\n  align-content: center;\n  flex-direction: column;\n  align-items: center;\n  width: 93%;\n  height: 100%;\n}\n\n#login-form button {   \n  background-color: var(--background-color);   \n  width: 5%;    \n  margin: 10px 0px;   \n  border: none;   \n  cursor: pointer;   \n}   \n\n#login-form input {\n  margin-top: 20vh;\n  font-family: inherit;\n  width: 25%;\n  border: 0;\n  border-bottom: 2px solid var(--background-color);\n  outline: 0;\n  font-size: 1.3rem;\n  color: var(--highlight-color);\n  padding: 7px 0;\n  background: transparent;\n  transition: border-color 0.2s;\n}\n\n.login-error {\n  margin-top: 5vh;\n  color: red;\n}\n\n#admin-items-container {\n  flex-wrap: wrap;\n  width: 90%;\n}\n\n.admin {\n  overflow: hidden;\n  position: relative;\n  text-align: center;\n  margin-top: 30px;\n  padding: .4em .4em .4em .8em;\n  margin: .5em 0 0 -10em;\n  color: #444;\n  border-radius: 5px;\n  margin-left: 1vw;\n} \n\n.scroll-element {\n  width: inherit;\n  height: inherit;\n  position: absolute;\n  left: 0%;\n  top: 0%;\n  animation: primary 3s linear infinite;\n}\n\n@keyframes primary {\n  from {\n    top: 0%;\n  }\n  \n  to {\n    bottom: -100%;\n  }\n}\n\n.admin-title {\n  justify-content: center;\n  color: var(--highlight-color)\n}\n\n.admin-list {\n  margin-left: 2vw;\n  flex-wrap: wrap;\n  border-radius: 3px;\n  color: var(--background-color);\n  text-decoration: none;\n  transition: all .3s ease-out;\n  flex-direction: row;\n  font-size: 25px;\n}\n\n.admin-list > li {\n  border-bottom: 2px solid var(--background-color);\n}\n\n.admin-subtitle {\n  justify-content: center;\n  margin-top: 2vh;\n  color: var(--highlight-color)\n}\n\n.recipe-img {\n  height: 200px;\n  width: auto;\n}\n\n.recipe:hover {\n  transform: scale(1.04);\n  box-shadow: 0 0 10px rgb(0 0 0 / 0.5)\n}\n\n.modal {\n  display: none;\n}\n\n.modal.is-open {\n  display: block;\n}\n\n.modal {\n  font-family: arial, sans-serif;\n}\n\n.modal__overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.6);\n  justify-content: center;\n  align-items: center;\n}\n\n.modal__container {\n  background-color: #fff;\n  padding: 30px;\n  max-width: 80%;\n  max-height: 100vh;\n  min-width: 500px;\n  border-radius: 50px;\n  overflow-y: auto;\n  box-sizing: border-box;\n  background-color: rgb(247, 243, 233);\n  display: flex\n}\n\n.modal__title {\n  margin: 0;\n  font-weight: 600;\n  font-size: 2rem;\n  line-height: 1.25;\n  color: black;\n  box-sizing: border-box;\n  text-align: center !important;\n  justify-content: center;\n  \n}\n\n.modal__header {\n  justify-content: center;\n  align-items: center;\n}\n\n.modal_container_img_ingredients {\n  justify-content: center;\n  align-items: center;\n  padding-right: 10px;\n}\n\n.modal_img {\n  display: flex;\n  align-items: flex-start;\n}\n\n.modal_ingredients_container {\n  border-radius: 5px;\n  width: 35%;\n  flex-direction: column;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.modal_recipe_instructions {\n  text-align: center;\n  padding-top: 20px;\n  padding-bottom: 20px;\n}\n\n.modal__close {\n  background-color: #e6e6e6;\n  color: rgba(0, 0, 0, .8);\n  float: right;\n  margin-right: 10px;\n  border-radius: 0.25rem;\n  border-style: none;\n  border-width: 0;\n}\n\n.modal__header .modal__close:before {\n  content: \"\\2715\";\n}\n\n.modal__content {\n  margin-top: 2rem;\n  margin-bottom: 2rem;\n  line-height: 1.5;\n  color: rgba(0, 0, 0, .8);\n  border-radius: 2px;\n}\n\n.modal_cost {\n  padding-top: 20px;\n  padding-bottom: 20px;\n}\n\n.modal_button_container {\n  justify-content: space-around;\n  align-items: center;\n}\n\n.modal__btn {\n  margin-right: 20px;\n  font-size: .875rem;\n  background-color: white;\n  color: rgba(0, 0, 0, .8);\n  border-radius: .25rem;\n  border-style: none;\n  border-width: 0;\n  cursor: pointer;\n  text-transform: none;\n  overflow: visible;\n  line-height: 1.15;\n  margin: 0;\n  will-change: transform;\n  backface-visibility: hidden;\n  transform: translateZ(0);\n}\n\n.modal__btn:focus,\n.modal__btn:hover {\n  -webkit-transform: scale(1.05);\n  transform: scale(1.05);\n}\n\n\n.hidden {\n  display: none;\n}\n\n@keyframes mmfadeIn {\n  from {\n    opacity: 0;\n  }\n  \n  to {\n    opacity: 1;\n  }\n}\n\n@keyframes mmfadeOut {\n  from {\n    opacity: 1;\n  }\n  \n  to {\n    opacity: 0;\n  }\n}\n\n@keyframes mmslideIn {\n  from {\n    transform: translateY(15%);\n  }\n  \n  to {\n    transform: translateY(0);\n  }\n}\n\n@keyframes mmslideOut {\n  from {\n    transform: translateY(0);\n  }\n  \n  to {\n    transform: translateY(-10%);\n  }\n}\n\n.micromodal-slide {\n  display: none;\n}\n\n.micromodal-slide.is-open {\n  display: block;\n}\n\n.micromodal-slide[aria-hidden=\"false\"] .modal__overlay {\n  animation: mmfadeIn .3s cubic-bezier(0.0, 0.0, 0.2, 1);\n}\n\n.micromodal-slide[aria-hidden=\"false\"] .modal__container {\n  animation: mmslideIn .3s cubic-bezier(0, 0, .2, 1);\n}\n\n.micromodal-slide[aria-hidden=\"true\"] .modal__overlay {\n  animation: mmfadeOut .3s cubic-bezier(0.0, 0.0, 0.2, 1);\n}\n\n.micromodal-slide[aria-hidden=\"true\"] .modal__container {\n  animation: mmslideOut .3s cubic-bezier(0, 0, .2, 1);\n}\n\n.micromodal-slide .modal__container,\n.micromodal-slide .modal__overlay {\n  will-change: transform;\n}\n\n.popular-recipe {\n  color: var(--text-color);\n  margin-left: 2vw;\n  margin-top: 2vh;\n  height: 350px;\n  width: 300px;\n  min-width: 100px;\n  background-color: var(--background-color);\n  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);\n  border: var(--border-color) 4px solid;\n  border-radius: 20px;\n  justify-content: center;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n  cursor: pointer;\n}\n\n.popular-recipe>img {\n  height: 250px;\n  width: auto;\n}\n\n.small-recipe-text {\n  margin-top: 2vh;\n  height: 68px;\n  width: auto;\n  min-width: 100px;\n}\n\n#recipe-container {\n  flex-direction: row;\n  align-items: center;\n  flex-wrap: wrap;\n}\n\n#recipes-header {\n  margin: 0 0 30px 2vw;\n  color: var(--background-color);\n}\n\n#top-button {\n  display: none;\n  font-size: 18px;\n  position: fixed;\n  bottom: 20px;\n  right: 30px;\n  z-index: 99;\n  background-color: var(--text-color);\n  color: rgb(41, 7, 73);\n  padding: 15px;\n  border-radius: 10px;\n  height: fit-content;\n}\n\n#clear-button {\n  font-size: 18px;\n  position: fixed;\n  bottom: 20px;\n  right: 30px;\n  z-index: 99;\n  background-color: var(--background-color);\n  color: rgb(41, 7, 73);\n  padding: 15px;\n  border-radius: 10px;\n  height: fit-content;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 4 */
/***/ ((module) => {



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

module.exports = function cssWithMappingToString(item) {
  var _item = _slicedToArray(item, 4),
      content = _item[1],
      cssMapping = _item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    // eslint-disable-next-line no-undef
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),
/* 5 */
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/turing-logo.png");

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function e(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function t(e){return function(e){if(Array.isArray(e))return o(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return o(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return o(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function o(e,t){(null==t||t>e.length)&&(t=e.length);for(var o=0,n=new Array(t);o<t;o++)n[o]=e[o];return n}var n,i,a,r,s,l=(n=["a[href]","area[href]",'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',"select:not([disabled]):not([aria-hidden])","textarea:not([disabled]):not([aria-hidden])","button:not([disabled]):not([aria-hidden])","iframe","object","embed","[contenteditable]",'[tabindex]:not([tabindex^="-"])'],i=function(){function o(e){var n=e.targetModal,i=e.triggers,a=void 0===i?[]:i,r=e.onShow,s=void 0===r?function(){}:r,l=e.onClose,c=void 0===l?function(){}:l,d=e.openTrigger,u=void 0===d?"data-micromodal-trigger":d,f=e.closeTrigger,h=void 0===f?"data-micromodal-close":f,v=e.openClass,g=void 0===v?"is-open":v,m=e.disableScroll,b=void 0!==m&&m,y=e.disableFocus,p=void 0!==y&&y,w=e.awaitCloseAnimation,E=void 0!==w&&w,k=e.awaitOpenAnimation,M=void 0!==k&&k,A=e.debugMode,C=void 0!==A&&A;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,o),this.modal=document.getElementById(n),this.config={debugMode:C,disableScroll:b,openTrigger:u,closeTrigger:h,openClass:g,onShow:s,onClose:c,awaitCloseAnimation:E,awaitOpenAnimation:M,disableFocus:p},a.length>0&&this.registerTriggers.apply(this,t(a)),this.onClick=this.onClick.bind(this),this.onKeydown=this.onKeydown.bind(this)}var i,a,r;return i=o,(a=[{key:"registerTriggers",value:function(){for(var e=this,t=arguments.length,o=new Array(t),n=0;n<t;n++)o[n]=arguments[n];o.filter(Boolean).forEach((function(t){t.addEventListener("click",(function(t){return e.showModal(t)}))}))}},{key:"showModal",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;if(this.activeElement=document.activeElement,this.modal.setAttribute("aria-hidden","false"),this.modal.classList.add(this.config.openClass),this.scrollBehaviour("disable"),this.addEventListeners(),this.config.awaitOpenAnimation){var o=function t(){e.modal.removeEventListener("animationend",t,!1),e.setFocusToFirstNode()};this.modal.addEventListener("animationend",o,!1)}else this.setFocusToFirstNode();this.config.onShow(this.modal,this.activeElement,t)}},{key:"closeModal",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=this.modal;if(this.modal.setAttribute("aria-hidden","true"),this.removeEventListeners(),this.scrollBehaviour("enable"),this.activeElement&&this.activeElement.focus&&this.activeElement.focus(),this.config.onClose(this.modal,this.activeElement,e),this.config.awaitCloseAnimation){var o=this.config.openClass;this.modal.addEventListener("animationend",(function e(){t.classList.remove(o),t.removeEventListener("animationend",e,!1)}),!1)}else t.classList.remove(this.config.openClass)}},{key:"closeModalById",value:function(e){this.modal=document.getElementById(e),this.modal&&this.closeModal()}},{key:"scrollBehaviour",value:function(e){if(this.config.disableScroll){var t=document.querySelector("body");switch(e){case"enable":Object.assign(t.style,{overflow:""});break;case"disable":Object.assign(t.style,{overflow:"hidden"})}}}},{key:"addEventListeners",value:function(){this.modal.addEventListener("touchstart",this.onClick),this.modal.addEventListener("click",this.onClick),document.addEventListener("keydown",this.onKeydown)}},{key:"removeEventListeners",value:function(){this.modal.removeEventListener("touchstart",this.onClick),this.modal.removeEventListener("click",this.onClick),document.removeEventListener("keydown",this.onKeydown)}},{key:"onClick",value:function(e){(e.target.hasAttribute(this.config.closeTrigger)||e.target.parentNode.hasAttribute(this.config.closeTrigger))&&(e.preventDefault(),e.stopPropagation(),this.closeModal(e))}},{key:"onKeydown",value:function(e){27===e.keyCode&&this.closeModal(e),9===e.keyCode&&this.retainFocus(e)}},{key:"getFocusableNodes",value:function(){var e=this.modal.querySelectorAll(n);return Array.apply(void 0,t(e))}},{key:"setFocusToFirstNode",value:function(){var e=this;if(!this.config.disableFocus){var t=this.getFocusableNodes();if(0!==t.length){var o=t.filter((function(t){return!t.hasAttribute(e.config.closeTrigger)}));o.length>0&&o[0].focus(),0===o.length&&t[0].focus()}}}},{key:"retainFocus",value:function(e){var t=this.getFocusableNodes();if(0!==t.length)if(t=t.filter((function(e){return null!==e.offsetParent})),this.modal.contains(document.activeElement)){var o=t.indexOf(document.activeElement);e.shiftKey&&0===o&&(t[t.length-1].focus(),e.preventDefault()),!e.shiftKey&&t.length>0&&o===t.length-1&&(t[0].focus(),e.preventDefault())}else t[0].focus()}}])&&e(i.prototype,a),r&&e(i,r),o}(),a=null,r=function(e){if(!document.getElementById(e))return console.warn("MicroModal: ❗Seems like you have missed %c'".concat(e,"'"),"background-color: #f8f9fa;color: #50596c;font-weight: bold;","ID somewhere in your code. Refer example below to resolve it."),console.warn("%cExample:","background-color: #f8f9fa;color: #50596c;font-weight: bold;",'<div class="modal" id="'.concat(e,'"></div>')),!1},s=function(e,t){if(function(e){e.length<=0&&(console.warn("MicroModal: ❗Please specify at least one %c'micromodal-trigger'","background-color: #f8f9fa;color: #50596c;font-weight: bold;","data attribute."),console.warn("%cExample:","background-color: #f8f9fa;color: #50596c;font-weight: bold;",'<a href="#" data-micromodal-trigger="my-modal"></a>'))}(e),!t)return!0;for(var o in t)r(o);return!0},{init:function(e){var o=Object.assign({},{openTrigger:"data-micromodal-trigger"},e),n=t(document.querySelectorAll("[".concat(o.openTrigger,"]"))),r=function(e,t){var o=[];return e.forEach((function(e){var n=e.attributes[t].value;void 0===o[n]&&(o[n]=[]),o[n].push(e)})),o}(n,o.openTrigger);if(!0!==o.debugMode||!1!==s(n,r))for(var l in r){var c=r[l];o.targetModal=l,o.triggers=t(c),a=new i(o)}},show:function(e,t){var o=t||{};o.targetModal=e,!0===o.debugMode&&!1===r(e)||(a&&a.removeEventListeners(),(a=new i(o)).showModal())},close:function(e){e?a.closeModalById(e):a.closeModal()}});"undefined"!=typeof window&&(window.MicroModal=l);/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (l);


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Recipe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9);


class RecipeRepository {
  constructor(recipeData) {
    this.recipes = recipeData.map(recipe => new _Recipe__WEBPACK_IMPORTED_MODULE_0__["default"](recipe));
  }

  addRecipe(recipeToAdd) {
    if (!this.recipes.find(recipe => recipe.id === recipeToAdd.id)) {
      this.recipes.push(new _Recipe__WEBPACK_IMPORTED_MODULE_0__["default"](recipeToAdd));
    }
  }
  
  removeRecipe(recipeId) {
    this.recipes = this.recipes.filter(recipe => recipeId !== recipe.id);

  }
  
  filterByTag(tag) {
    if (Array.isArray(tag)) {
      this.filteredRecipes = [];
      this.recipes.forEach((recipe) => {
        tag.forEach((tag) => {
          if (recipe.tags.includes(tag) && !this.filteredRecipes.includes(recipe)) {
            this.filteredRecipes.push(recipe)
          }
        })
      })
    } else {
      this.filteredRecipes = this.recipes.filter((recipe) =>
        recipe.tags.includes(tag)
      );
    }
    if (this.filteredRecipes.length === 0) {
      this.filteredRecipes = null;
      return
    } else {
      return this.filteredRecipes;
    }

  }

  filterByName(name) {
    if (!name) {
      return;
    }
    this.filteredRecipes = this.recipes.filter(recipe => (recipe.name.toUpperCase().includes(name.toUpperCase())));
    if (this.filteredRecipes.length === 0) {
      this.filteredRecipes = null;
      return
    }
    return this.filteredRecipes
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RecipeRepository);

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Recipe {
  constructor(recipe) {
    this.id = recipe.id;
    this.image = recipe.image;
    this.ingredients = recipe.ingredients;
    this.instructions = recipe.instructions;
    this.name = recipe.name;
    this.tags = recipe.tags;
    this.ingredientsList = [];
    this.totalCost;
    this.clicks = 0;
  }

  getIngredientIds() {
    let ingredientIds = this.ingredients.map((ingredient) => ingredient.id);
    return ingredientIds;
  }

  determineRecipeIngredients(ingredientsData) {
    this.ingredientsList = ingredientsData.reduce((acc, ingredient) => {
      this.ingredients.forEach((item) => {
        if (item.id === ingredient.id) {
          let name = ingredient.name;
          let list = {
            ingredient: `${item.quantity.amount.toFixed(2)} ${
              item.quantity.unit
            } ${name}`,
          };
          acc.push(list);
        }
      });
      return acc;
    }, []);
    return this.ingredientsList;
  }

  calculateRecipeCost(ingredientsData) {
    var prices = [];

    ingredientsData.forEach((ingredient) => {
      this.ingredients.forEach((item) => {
        if (item.id === ingredient.id) {
          let cost =
            (item.quantity.amount * ingredient.estimatedCostInCents) / 100;
          prices.push(cost);
        }
      });
    });

    const totalPrice = prices.reduce((sum, cost) => {
      return (sum += cost);
    }, 0);
    return totalPrice.toFixed(2);
  }

  returnInstructions() {
    const retrieveInstr = this.instructions.reduce(
      (acc, currentInstructions) => {
        const instructions = `${currentInstructions.number}: ${currentInstructions.instruction}`;
        acc.push(instructions);
        return acc;
      },
      []
    );
    return retrieveInstr;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Recipe);




/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _RecipeRepository__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);


class User {
    constructor(user) {
        this.name = user.name
        this.id = user.id
        this.recipesToCook = user.recipesToCook
    }

    addToSavedRecipes(recipeToAdd) {
        this.recipesToCook.addRecipe(recipeToAdd)
    }
    
    changeIdToRecipe(recipes) {
        if(this.recipesToCook && this.recipesToCook.length) {
            let matchingRecipe = []
            this.recipesToCook.forEach(id => {
                recipes.recipes.forEach(element => {
                    if(element.id === id){
                        matchingRecipe.push(element)
                    }        
                })
            })
            return new _RecipeRepository__WEBPACK_IMPORTED_MODULE_0__["default"](matchingRecipe)
        } else {
            return new _RecipeRepository__WEBPACK_IMPORTED_MODULE_0__["default"]([])
        }
    } 

    removeFromSavedRecipes(recipeToRemove) {
      this.recipesToCook.removeRecipe(recipeToRemove.id) 
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (User);

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/egg.jpg");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _images_turing_logo_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var micromodal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _classes_RecipeRepository__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8);
/* harmony import */ var _classes_User_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
/* harmony import */ var _images_egg_jpg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(11);


 //imports micromodal
 //imports repo class
 //imports user class
micromodal__WEBPACK_IMPORTED_MODULE_2__["default"].init()
;

// -------------------------------DOM ELEMENTS-------------------------------
const recipeSection = document.querySelector('#recipe-section')
const adminSection = document.querySelector(".admin-section")
const savedRecipesButton = document.querySelector("#saved-recipes")
const returnToTopButton = document.querySelector("#top-button")
const allRecipesButton = document.querySelector("#recipe-button")
const breakfastButton = document.querySelector("#breakfast-filter")
const snacksAppButton = document.querySelector("#snack-appetizers-filter")
const mainDishButton = document.querySelector("#main-dish-filter")
const compDishButton = document.querySelector("#complimentary-dish-filter")
const searchBar = document.querySelector("#search-bar")
const adminButton = document.querySelector("#admin-center")
const recipeModal = document.querySelector('#modal')
const recipeSectionHeader = document.querySelector('#recipes-header')
const recipeContainer = document.querySelector('#recipe-container')
const searchForm = document.querySelector('#search-form')

//global vars
let currentRecipe
let loggedIn = false
let currentView = 'landing'
let filterTerm = ''
let user
let recipeRepository
let ingredientsData

//----------------------------------FETCH REQUESTS-----------------------------------
const baseUrl = "https://sam-whats-cookin-79d3e07ba262.herokuapp.com";

const usersDataFetch = fetch(`${baseUrl}/api/v1/users`).then((response) =>
  response.json()
);

const ingredientsDataFetch = fetch(`${baseUrl}/api/v1/ingredients`).then(
  (response) => response.json()
);

const recipesDataFetch = fetch(`${baseUrl}/api/v1/recipes`).then((response) =>
  response.json()
);
Promise.all([usersDataFetch, ingredientsDataFetch, recipesDataFetch])
    .then((data) => {
        let allCookingData = {
            users: data[0].users,
            ingredients: data[1].ingredients,
            recipes: data[2].recipes
        } 
        return allCookingData
    })
    .then(
        (allCookingData) => {
            recipeRepository = new _classes_RecipeRepository__WEBPACK_IMPORTED_MODULE_3__["default"](allCookingData.recipes) 
            user = new _classes_User_js__WEBPACK_IMPORTED_MODULE_4__["default"](allCookingData.users[10]) 
            user.recipesToCook = user.changeIdToRecipe(recipeRepository) 
            ingredientsData = allCookingData.ingredients 
            renderPage()
            if (localStorage.length < 1) {
                generateClickInfoObjects()
            }
        }
    )

// --------------------------------EVENT LISTENERS----------------------------------------
returnToTopButton.addEventListener('click', () => document.documentElement.scrollTop = 0)
allRecipesButton.addEventListener('click', () => {
    currentView = 'recipes'
    filterTerm = ''
    renderPage()
})

savedRecipesButton.addEventListener('click', () => {
    currentView = 'savedRecipes'
    filterTerm = ''
    renderPage()
})

breakfastButton.addEventListener('click', () => {
    currentView = 'recipes'
    filterTerm = ['breakfast', 'morning meal']
    renderPage()
})

snacksAppButton.addEventListener('click', () => {
    currentView = "recipes"
    filterTerm = ['dip', 'snack', 'appetizer']
    renderPage()
})

mainDishButton.addEventListener('click', () => {
    currentView = "recipes"
    filterTerm = ['main dish', 'dinner', 'lunch']
    renderPage()
})

compDishButton.addEventListener('click', () => {
    currentView = "recipes"
    filterTerm = ['antipasti', 'hor d\'oeuvre', 'starter', 'salad', 'side dish', 'appetizer', 'condiment', 'spread']
    renderPage()
})

searchForm.addEventListener('submit', (event) => {
    event.preventDefault()
    if (searchBar.value) {
        filterTerm = searchBar.value
    }
    if (currentView === 'admin' || currentView === 'landing') {
        currentView = 'recipes'
    }
    renderPage()
    searchBar.value = ''
})

adminButton.addEventListener('click', () => {
    currentView = 'admin'
    filterTerm = ''
    renderPage()
})

recipeSection.addEventListener('click', (event) => {
    assignCurrentRecipe(event)
    renderCurrentRecipe()
})

window.onscroll = () => {
    if (document.documentElement.scrollTop > 350) {
        returnToTopButton.style.display = "block"
    } else {
        returnToTopButton.style.display = "none"
    }
}

//-------------------------------------------FUNCTIONS--------------------------------------------
function assignCurrentRecipe(event) {
    let currentRecipeId
    if (event.target.dataset.allRecipes) {
        currentRecipeId = event.target.dataset.allRecipes
    } else {
        currentRecipeId = event.target.parentElement.dataset.allRecipes
    }
    if (!currentRecipeId) {
        return
    }
    currentRecipeId = parseInt(currentRecipeId)
    currentRecipe = recipeRepository.recipes.find(recipe => recipe.id === currentRecipeId)
    updateClickCount()
}

function saveRecipe(button) {
    if (button.innerText === '♥️') {
        user.addToSavedRecipes(currentRecipe)
        button.innerText = 'Saved'
        button.style.backgroundColor = "#fdc061";
        fetch(`${baseUrl}/api/v1/usersRecipes`, {
                method: 'POST',
                body: JSON.stringify({
                    userID: user.id,
                    recipeID: currentRecipe.id
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Issue with request: ', response.status)
                }
                return response.json()
            })
            .catch(error => alert('Error, unable to find the saved recipes API'))
    } else {
        fetch(`${baseUrl}/api/v1/usersRecipes`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userID: user.id,
                    recipeID: currentRecipe.id
                })
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Issue with request: ', response.status)
                }
                return response.json()
            })
            .catch(error => alert('Error, unable to locate the users recipes API'))
        user.removeFromSavedRecipes(currentRecipe)
        button.innerText = '♥️'
        button.style.backgroundColor = "#fdc061";
        renderPage()
    }
}

function displayAdmin() {
    adminSection.innerHTML = ''
    if (!loggedIn) {
        adminSection.innerHTML +=
            `<form id='login-form'>
                <label for="login-user">Username: </label>   
                <input id="login-user" type="text" placeholder="Enter Username" name="username" required>  
                <label for="login-password">Password: </label>   
                <input id="login-password" type="password" placeholder="Enter Password" name="password" required>  
                <button type="submit">Login</button>
            </form>`
        const loginForm = document.querySelector('#login-form')
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault()
            const username = document.querySelector('#login-user').value
            const password = document.querySelector('#login-password').value
            if (authenticateUser(username, password)) {
                loggedIn = true
                displayAdmin()
            } else {
                loggedIn = false
                adminSection.innerHTML += `<h1 class="login-error">Incorrect Username or Password</h1>`
                setTimeout(() => {
                    displayAdmin()
                }, "1500")
            }
        })
    } else {
        adminSection.innerHTML +=
            `<button id="clear-button">Clear Clicks</button>
            <div class="admin">
                <h2 class="admin-title">Hi Admin</h2>
                <h3 class="admin-subtitle"> Welcome to the Admin Center </h3>
            </div>
            <div class ='scroll-admin-section'>
                <ul class='admin-list'></ul>
            </div>`

        const adminList = document.querySelector('.admin-list')
        const clicks = localStorage.getItem('clicks')
        const click = JSON.parse(clicks)
        click.sort((a, b) => {
            return b.clicks - a.clicks
        })
        click.forEach(clickCount => {
            adminList.innerHTML += `<li>${clickCount.name} has ${clickCount.clicks} click(s)</li>`
        })
        const clearButton = document.querySelector('#clear-button')
        clearButton.addEventListener('click', generateClickInfoObjects)
    }
}

function getCurrentDisplayedRecipes(recipes, filterTerm) {
    if (Array.isArray(filterTerm)) {
        return recipes.filterByTag(filterTerm)
    } else if (filterTerm) {
        return (recipes.filterByName(filterTerm) || recipes.filterByTag(filterTerm))
    } else {
        return recipes.recipes
    }
}

function renderPage() {
    if (currentView === 'admin') {
        recipeSection.classList.add('hidden')
        adminSection.classList.remove('hidden')
        displayAdmin()
    } else if (currentView === 'recipes') {
        recipeSectionHeader.innerText = 'All Recipes'
        searchBar.placeholder = "search all recipes..."
        if (!filterTerm) {
            recipeSectionHeader.innerText = 'All Recipes'
        } else {
            recipeSectionHeader.innerText = ''
        }
        adminSection.classList.add('hidden')
        recipeSection.classList.remove('hidden')
        displayRecipes(getCurrentDisplayedRecipes(recipeRepository, filterTerm))
    } else if (currentView === 'savedRecipes') {
        searchBar.placeholder = 'search saved recipes...'
        recipeSectionHeader.innerText = 'Saved Recipes'
        adminSection.classList.add('hidden')
        recipeSection.classList.remove('hidden')
        displayRecipes(
            getCurrentDisplayedRecipes(user.recipesToCook, filterTerm)
        )
    } else if (currentView === 'landing') {
        var popularRecipes = genPopularRecipes()
        displayRecipes(popularRecipes)
    }
}

function genPopularRecipes() {
    const num1 = Math.floor(Math.random() * recipeRepository.recipes.length)
    const num2 = Math.floor(Math.random() * recipeRepository.recipes.length)
    const num3 = Math.floor(Math.random() * recipeRepository.recipes.length)

    let popularRecipes = [recipeRepository.recipes[num1], recipeRepository.recipes[num2], recipeRepository.recipes[num3]]

    if ((new Set(popularRecipes)).size !== popularRecipes.length) {
        genPopularRecipes()
    } else {
        return popularRecipes
    }
}

function authenticateUser(username, password) {
    if (username === "admin" && password === "password") {
        return true
    } else {
        return false
    }
}

function updateClickCount() {

    const recipeClicks = localStorage.getItem('clicks')
    const parsedClickInfo = JSON.parse(recipeClicks)
    parsedClickInfo.forEach(recipe => {
recipe.clicks += 1
        if (recipe.name === currentRecipe.name) {
            recipe.clicks += 1
        }
    })
    localStorage.setItem('clicks', JSON.stringify(parsedClickInfo))
}

function generateClickInfoObjects() {
    const recipeClicks = recipeRepository.recipes.map(recipe => {
        return {
            name: recipe.name,
            clicks: 0
        }
    })
    localStorage.setItem('clicks', JSON.stringify(recipeClicks))
    displayAdmin()
}

function displayRecipes(recipes) {
    if (!recipes) {
        recipeContainer.innerHTML = ''
        recipeSectionHeader.innerHTML = `<p>NO RESULTS</p>`
        return
    }
    if (currentView === 'landing') {
        recipeContainer.innerHTML = ''
        recipeSectionHeader.innerText = 'Popular Recipes'
        recipes.forEach(recipe => {
            recipeContainer.innerHTML +=
                `
            <section class='popular-recipe' data-all-recipes='${recipe.id}'>
            <h3 id='${recipe.id}' class='small-recipe-text'>${recipe.name}</h3>
            <img src="${recipe.image}" alt="${recipe.name}" class="recipe-img">
            </section>
            `
        })
    } else {
        recipeContainer.innerHTML = ''
        recipes.forEach(recipe => {
            recipeContainer.innerHTML +=
                `
            <section class='recipe' data-all-recipes='${recipe.id}'>
            <h3 id='${recipe.id}' class='small-recipe-text'>${recipe.name}</h3>
            <img src="${recipe.image}" alt="${recipe.name}" class="recipe-img">
            </section>
            `
        })
    }
}

function renderCurrentRecipe() {

    if (!currentRecipe) {
        return
    }
    let isSaved
    recipeModal.innerHTML = ''
    let ingredients = currentRecipe.determineRecipeIngredients(ingredientsData)

    const ingredientsHTML = ingredients.map(ingredient => {
        return '<li>' + ingredient.ingredient + '</li>'
    }).join('')

    if (user.recipesToCook && user.recipesToCook.recipes.filter(current => current.id === currentRecipe.id).length !== 0) {
        isSaved = "Saved"
    } else {
        isSaved = "♥️"
    }

    const instructionsHTML = currentRecipe
        .returnInstructions()
        .map((instruction) => {
            return "<li>" + instruction + "</li>"
        })
        .join("")
    recipeModal.innerHTML = `
    <header class="modal__header">
      <h2 class="modal__title" id="modal-1-title">
        ${currentRecipe.name}
      </h2>
    </header>
    <main class="modal__content" id="modal-1-content">
      <div class="modal_container_img_ingredients"> 
      <img class="modal_img" src="${currentRecipe.image}" alt='${currentRecipe.name}'>
      <div class="modal_ingredients_container">
        <h3 class="modal_ingredients">Ingredients</h3>
        <ul>
            ${ingredientsHTML}
         </ul>
      </div>
      </div>
        <h3 class="modal_recipe_instructions">Recipe Instructions</h3>
      <ol type="1">
        ${instructionsHTML}
      </ol>
      <h4 class="modal_cost">Recipe Cost:$${currentRecipe.calculateRecipeCost(
        ingredientsData
      )}</h4>
      <div class="modal_button_container">
      <button type="button" class="modal__btn">${isSaved}</button>
      <button class="modal__close" id="close" aria-label="Close modal" data-micromodal-close>CLOSE</button>
      </div>
    </main>
    `
    micromodal__WEBPACK_IMPORTED_MODULE_2__["default"].show('modal-1')
    const saveButton = document.querySelector('.modal__btn')
    const closeButton = document.querySelector('#close')
    if (
        user.recipesToCook.recipes.find(
            (current) => current.id === currentRecipe.id
        )
    ) {
        saveButton.style.backgroundColor = "red"
    }
    saveButton.addEventListener('click', () => saveRecipe(saveButton))
    closeButton.addEventListener('click', () => currentRecipe = '')
    recipeModal.scrollTo(0, 0)
}
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map