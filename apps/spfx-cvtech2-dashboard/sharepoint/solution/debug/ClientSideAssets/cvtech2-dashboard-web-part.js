define("6d8292f3-bfeb-4d5d-8968-6d51a0811eca_0.1.0", ["react","react-dom","@microsoft/sp-webpart-base","@microsoft/sp-property-pane"], (__WEBPACK_EXTERNAL_MODULE__959__, __WEBPACK_EXTERNAL_MODULE__398__, __WEBPACK_EXTERNAL_MODULE__642__, __WEBPACK_EXTERNAL_MODULE__877__) => { return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 640:
/*!**********************************************************************!*\
  !*** ./lib/webparts/cvTech2Dashboard/components/CvTech2Dashboard.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CvTech2Dashboard)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var metricCards = [
    { icon: 'CHAT', value: '0', title: 'Opened jobs' },
    { icon: 'CASE', value: '0', title: 'Filled jobs' },
    { icon: 'IN', value: '0', title: 'Started missions' },
    { icon: 'OUT', value: '0', title: 'Ending missions', subtitle: 'In the next 3 months' },
    { icon: 'LIVE', value: '0', title: 'Active missions' },
    { icon: 'EUR', value: '-', title: 'Daily rate range' },
    { icon: 'DAYS', value: '0', title: 'Worked days' },
    { icon: 'INV', value: '0 EUR', title: 'Estimated invoice', accent: 'primary' }
];
var sidebarLinks = [
    'Dashboard',
    'My profile',
    'Jobs',
    'Simulations',
    'Missions',
    'Leaves',
    'Overtime'
];
function CvTech2Dashboard(_a) {
    var webPartProps = _a.webPartProps;
    var brandLabel = webPartProps.brandLabel, greetingName = webPartProps.greetingName, profileInitials = webPartProps.profileInitials, overviewLabel = webPartProps.overviewLabel, languagePrimary = webPartProps.languagePrimary, languageSecondary = webPartProps.languageSecondary, primaryColor = webPartProps.primaryColor, secondaryColor = webPartProps.secondaryColor, accentTextColor = webPartProps.accentTextColor, surfaceColor = webPartProps.surfaceColor;
    var styles = {
        shell: {
            display: 'grid',
            gridTemplateColumns: '320px minmax(0, 1fr)',
            minHeight: '980px',
            background: surfaceColor,
            color: accentTextColor,
            borderRadius: '28px',
            overflow: 'hidden',
            boxShadow: '0 30px 60px rgba(15,23,42,0.10)',
            fontFamily: '"Aptos", "Segoe UI", sans-serif'
        },
        sidebar: {
            background: "linear-gradient(180deg, ".concat(primaryColor, ", ").concat(secondaryColor, ")"),
            color: '#ffffff',
            padding: '36px 22px 28px 22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
        },
        brand: {
            fontSize: '42px',
            lineHeight: 1,
            fontWeight: 800,
            letterSpacing: '-0.04em',
            textTransform: 'lowercase'
        },
        navCard: {
            borderRadius: '18px',
            padding: '16px 18px',
            background: 'rgba(255,255,255,0.16)',
            fontSize: '22px',
            fontWeight: 700
        },
        navItem: {
            padding: '12px 16px',
            borderRadius: '14px',
            fontSize: '20px',
            fontWeight: 600
        },
        content: {
            padding: '36px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px'
        },
        headerRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '20px',
            flexWrap: 'wrap'
        },
        profileRow: {
            display: 'flex',
            alignItems: 'center',
            gap: '22px'
        },
        profileBadge: {
            width: '112px',
            height: '112px',
            borderRadius: '999px',
            background: primaryColor,
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            fontWeight: 800
        },
        heading: {
            fontSize: '76px',
            lineHeight: 1,
            margin: 0,
            fontWeight: 800,
            letterSpacing: '-0.04em'
        },
        subheading: {
            fontSize: '26px',
            lineHeight: 1.3,
            fontWeight: 700,
            color: primaryColor,
            margin: '18px 0 0 0'
        },
        notification: {
            width: '78px',
            height: '78px',
            borderRadius: '18px',
            background: '#ffffff',
            boxShadow: '0 18px 36px rgba(15,23,42,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: primaryColor,
            fontSize: '28px',
            fontWeight: 800
        },
        sectionTitle: {
            fontSize: '40px',
            lineHeight: 1.1,
            fontWeight: 800,
            color: primaryColor,
            margin: 0
        },
        cardsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '24px'
        },
        card: {
            background: '#ffffff',
            borderRadius: '20px',
            minHeight: '172px',
            padding: '28px',
            boxShadow: '0 14px 34px rgba(15,23,42,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '18px'
        },
        primaryCard: {
            background: "linear-gradient(135deg, ".concat(primaryColor, ", ").concat(secondaryColor, ")"),
            color: '#ffffff'
        },
        icon: {
            minWidth: '68px',
            height: '68px',
            borderRadius: '18px',
            background: 'rgba(39,194,198,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: secondaryColor,
            fontSize: '14px',
            fontWeight: 800
        },
        iconPrimary: {
            background: 'rgba(255,255,255,0.18)',
            color: '#ffffff'
        },
        cardValue: {
            fontSize: '58px',
            lineHeight: 1,
            fontWeight: 800,
            margin: 0
        },
        cardTitle: {
            fontSize: '22px',
            lineHeight: 1.2,
            fontWeight: 700,
            margin: '10px 0 0 0'
        },
        cardSubtitle: {
            fontSize: '14px',
            lineHeight: 1.5,
            margin: '8px 0 0 0',
            opacity: 0.8
        },
        languageBlock: {
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        },
        languagePrimary: {
            borderRadius: '14px',
            padding: '14px 18px',
            background: 'rgba(255,255,255,0.18)',
            fontSize: '18px',
            fontWeight: 700
        },
        languageSecondary: {
            padding: '6px 18px',
            fontSize: '18px',
            fontWeight: 600
        }
    };
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.shell },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("aside", { style: styles.sidebar },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.brand }, brandLabel),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.navCard }, sidebarLinks[0]),
            sidebarLinks.slice(1).map(function (label) { return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { key: label, style: styles.navItem }, label)); }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.languageBlock },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.languagePrimary }, languagePrimary),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.languageSecondary }, languageSecondary))),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("main", { style: styles.content },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.headerRow },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.profileRow },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.profileBadge }, profileInitials),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h1", { style: styles.heading },
                            "Hello ",
                            greetingName)),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.subheading }, overviewLabel)),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.notification }, "!")),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("section", null,
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.cardsGrid }, metricCards.slice(0, 4).map(function (card) {
                    var isPrimary = card.accent === 'primary';
                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { key: card.title, style: __assign(__assign({}, styles.card), (isPrimary ? styles.primaryCard : {})) },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { flex: 1 } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.cardValue }, card.value),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.cardTitle }, card.title),
                            card.subtitle ? react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.cardSubtitle }, card.subtitle) : null),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: __assign(__assign({}, styles.icon), (isPrimary ? styles.iconPrimary : {})) }, card.icon)));
                }))),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("section", null,
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("h2", { style: styles.sectionTitle }, "Monthly report")),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("section", null,
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.cardsGrid }, metricCards.slice(4).map(function (card) {
                    var isPrimary = card.accent === 'primary';
                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { key: card.title, style: __assign(__assign({}, styles.card), (isPrimary ? styles.primaryCard : {})) },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { flex: 1 } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.cardValue }, card.value),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.cardTitle }, card.title),
                            card.subtitle ? react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.cardSubtitle }, card.subtitle) : null),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: __assign(__assign({}, styles.icon), (isPrimary ? styles.iconPrimary : {})) }, card.icon)));
                }))))));
}


/***/ }),

/***/ 877:
/*!**********************************************!*\
  !*** external "@microsoft/sp-property-pane" ***!
  \**********************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__877__;

/***/ }),

/***/ 642:
/*!*********************************************!*\
  !*** external "@microsoft/sp-webpart-base" ***!
  \*********************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__642__;

/***/ }),

/***/ 959:
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__959__;

/***/ }),

/***/ 398:
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__398__;

/***/ })

/******/ 	});
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
/******/ 			// no module.id needed
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************************************************************!*\
  !*** ./lib/webparts/cvTech2Dashboard/CvTech2DashboardWebPart.js ***!
  \******************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ 398);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _microsoft_sp_webpart_base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @microsoft/sp-webpart-base */ 642);
/* harmony import */ var _microsoft_sp_webpart_base__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_webpart_base__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @microsoft/sp-property-pane */ 877);
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_CvTech2Dashboard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/CvTech2Dashboard */ 640);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};





var DEFAULT_PROPS = {
    brandLabel: 'cvtech2',
    greetingName: 'Mario',
    profileInitials: 'MC',
    overviewLabel: '3 months overview',
    languagePrimary: 'English',
    languageSecondary: 'Francais',
    primaryColor: '#27c2c6',
    secondaryColor: '#136d70',
    accentTextColor: '#16323a',
    surfaceColor: '#f3f7fb'
};
var CvTech2DashboardWebPart = /** @class */ (function (_super) {
    __extends(CvTech2DashboardWebPart, _super);
    function CvTech2DashboardWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CvTech2DashboardWebPart.prototype.onInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.properties.brandLabel = this.properties.brandLabel || DEFAULT_PROPS.brandLabel;
                        this.properties.greetingName = this.properties.greetingName || DEFAULT_PROPS.greetingName;
                        this.properties.profileInitials = this.properties.profileInitials || DEFAULT_PROPS.profileInitials;
                        this.properties.overviewLabel = this.properties.overviewLabel || DEFAULT_PROPS.overviewLabel;
                        this.properties.languagePrimary = this.properties.languagePrimary || DEFAULT_PROPS.languagePrimary;
                        this.properties.languageSecondary = this.properties.languageSecondary || DEFAULT_PROPS.languageSecondary;
                        this.properties.primaryColor = this.properties.primaryColor || DEFAULT_PROPS.primaryColor;
                        this.properties.secondaryColor = this.properties.secondaryColor || DEFAULT_PROPS.secondaryColor;
                        this.properties.accentTextColor = this.properties.accentTextColor || DEFAULT_PROPS.accentTextColor;
                        this.properties.surfaceColor = this.properties.surfaceColor || DEFAULT_PROPS.surfaceColor;
                        return [4 /*yield*/, _super.prototype.onInit.call(this)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CvTech2DashboardWebPart.prototype.render = function () {
        var element = react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_CvTech2Dashboard__WEBPACK_IMPORTED_MODULE_4__["default"], {
            webPartProps: this.properties
        });
        react_dom__WEBPACK_IMPORTED_MODULE_1__.render(element, this.domElement);
    };
    CvTech2DashboardWebPart.prototype.onDispose = function () {
        react_dom__WEBPACK_IMPORTED_MODULE_1__.unmountComponentAtNode(this.domElement);
    };
    CvTech2DashboardWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: { description: 'CVTech2 Dashboard configuration' },
                    groups: [
                        {
                            groupName: 'Content',
                            groupFields: [
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneTextField)('brandLabel', { label: 'Brand label' }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneTextField)('greetingName', { label: 'Greeting name' }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneTextField)('profileInitials', { label: 'Profile initials' }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneTextField)('overviewLabel', { label: 'Overview label' }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneTextField)('languagePrimary', { label: 'Primary language label' }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneTextField)('languageSecondary', { label: 'Secondary language label' })
                            ]
                        },
                        {
                            groupName: 'Theme',
                            groupFields: [
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneTextField)('primaryColor', { label: 'Primary color' }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneTextField)('secondaryColor', { label: 'Secondary color' }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneTextField)('accentTextColor', { label: 'Accent text color' }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneTextField)('surfaceColor', { label: 'Surface color' })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return CvTech2DashboardWebPart;
}(_microsoft_sp_webpart_base__WEBPACK_IMPORTED_MODULE_2__.BaseClientSideWebPart));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CvTech2DashboardWebPart);

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});;
//# sourceMappingURL=cvtech2-dashboard-web-part.js.map