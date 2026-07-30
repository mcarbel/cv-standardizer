(()=>{ var __RUSHSTACK_CURRENT_SCRIPT__ = document.currentScript; define("a7cf3155-79e7-4c97-90a4-23b6a54a46ef_0.1.0", ["react","react-dom","@microsoft/sp-webpart-base","@microsoft/sp-property-pane","@microsoft/sp-http"], (__WEBPACK_EXTERNAL_MODULE__959__, __WEBPACK_EXTERNAL_MODULE__398__, __WEBPACK_EXTERNAL_MODULE__642__, __WEBPACK_EXTERNAL_MODULE__877__, __WEBPACK_EXTERNAL_MODULE__909__) => { return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 700:
/*!******************************************************************************!*\
  !*** ./lib/webparts/cvTech2PartnerPortal/components/CvTech2PartnerPortal.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CvTech2PartnerPortal)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_SharePointPartnerPortalService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/SharePointPartnerPortalService */ 143);
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
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};



var suggestedSkills = [
    'Azure',
    'GCP',
    'AWS',
    'Terraform',
    'IAM',
    'Kubernetes',
    'Cybersecurity',
    'Compliance',
    'DevSecOps',
    'Landing Zone'
];
var plans = [
    {
        name: 'Starter',
        price: 'EUR 490',
        detail: 'Low-volume partner sourcing.',
        features: ['50 searches / month', '3 reveal requests', 'Email support']
    },
    {
        name: 'Partner Pro',
        price: 'EUR 1,290',
        detail: 'Recurring mission pipelines.',
        features: ['Unlimited anonymized searches', '15 reveal requests', 'Saved mission briefs'],
        featured: true
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        detail: 'Governed access at scale.',
        features: ['SSO / Entra ID', 'Approval workflow', 'Audit retention']
    }
];
var navItems = [
    { id: 'overview', label: 'Overview', defaultOrder: 1 },
    { id: 'mission-match', label: 'Mission Match', defaultOrder: 2 },
    { id: 'cv-library', label: 'CV Library', defaultOrder: 3 },
    { id: 'plans', label: 'Plans', defaultOrder: 4 },
    { id: 'compliance', label: 'Compliance', defaultOrder: 5 },
    { id: 'administration', label: 'Administration', defaultOrder: 99 }
];
var skillSynonyms = [
    'Azure',
    'GCP',
    'AWS',
    'Terraform',
    'IAM',
    'Kubernetes',
    'Cybersecurity',
    'Compliance',
    'DevSecOps',
    'Landing Zone',
    'Cloud Security',
    'Zero Trust',
    'Network',
    'SOC',
    'SIEM',
    'M365',
    'SharePoint',
    'Power Platform',
    'Java',
    'React',
    'Node',
    'Python',
    'Data',
    'AI',
    'PMO',
    'Agile'
];
function scoreProfile(profile, selectedSkills) {
    var matches = selectedSkills.filter(function (skill) {
        return profile.skills.some(function (profileSkill) { return profileSkill.toLowerCase() === skill.toLowerCase(); });
    }).length;
    return Math.min(99, 62 + matches * 9);
}
function buildSearchSkills(selectedSkills, missionBrief) {
    return Array.from(new Set(__spreadArray(__spreadArray([], selectedSkills, true), inferSkillsFromText(missionBrief), true)))
        .filter(function (skill) { return skill !== 'General IT Consulting'; });
}
function getSkillIcon(skill) {
    var normalized = skill.toLowerCase();
    if (normalized.includes('java') || normalized.includes('terraform') || normalized.includes('kubernetes'))
        return 'code';
    if (normalized.includes('kafka') || normalized.includes('devsecops'))
        return 'share';
    if (normalized.includes('french') || normalized.includes('aws') || normalized.includes('azure') || normalized.includes('gcp'))
        return 'globe';
    if (normalized.includes('bank') || normalized.includes('compliance') || normalized.includes('iam'))
        return 'bank';
    if (normalized.includes('year') || normalized.includes('senior') || normalized.includes('lead') || normalized.includes('architect'))
        return 'clock';
    return 'sparkle';
}
function getSectionIcon(sectionId) {
    switch (sectionId) {
        case 'overview':
            return 'documentImage';
        case 'mission-match':
            return 'search';
        case 'cv-library':
            return 'document';
        case 'plans':
            return 'card';
        case 'compliance':
            return 'shield';
        case 'administration':
            return 'gear';
        default:
            return 'box';
    }
}
function extractPdfText(file) {
    return __awaiter(this, void 0, void 0, function () {
        var pdfjsLib, arrayBuffer, pdf, pageTexts, pageNumber, page, textContent, pageText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_pdfjs-dist_build_pdf_js"), __webpack_require__.e("_ec62-_ad24-_7566-_33cf-_79ff-_42a6")]).then(__webpack_require__.t.bind(__webpack_require__, /*! pdfjs-dist/build/pdf */ 205, 23))];
                case 1:
                    pdfjsLib = _a.sent();
                    return [4 /*yield*/, file.arrayBuffer()];
                case 2:
                    arrayBuffer = _a.sent();
                    return [4 /*yield*/, pdfjsLib.getDocument({ data: arrayBuffer, disableWorker: true }).promise];
                case 3:
                    pdf = _a.sent();
                    pageTexts = [];
                    pageNumber = 1;
                    _a.label = 4;
                case 4:
                    if (!(pageNumber <= pdf.numPages)) return [3 /*break*/, 8];
                    return [4 /*yield*/, pdf.getPage(pageNumber)];
                case 5:
                    page = _a.sent();
                    return [4 /*yield*/, page.getTextContent()];
                case 6:
                    textContent = _a.sent();
                    pageText = textContent.items
                        .map(function (item) { return item.str || ''; })
                        .join(' ')
                        .replace(/\s+/g, ' ')
                        .trim();
                    if (pageText)
                        pageTexts.push(pageText);
                    _a.label = 7;
                case 7:
                    pageNumber += 1;
                    return [3 /*break*/, 4];
                case 8: return [2 /*return*/, pageTexts.join('\n\n')];
            }
        });
    });
}
function extractDocxText(file) {
    return __awaiter(this, void 0, void 0, function () {
        var mammoth, arrayBuffer, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, __webpack_require__.e(/*! import() */ "vendors-node_modules_mammoth_mammoth_browser_js").then(__webpack_require__.t.bind(__webpack_require__, /*! mammoth/mammoth.browser */ 118, 23))];
                case 1:
                    mammoth = _a.sent();
                    return [4 /*yield*/, file.arrayBuffer()];
                case 2:
                    arrayBuffer = _a.sent();
                    return [4 /*yield*/, mammoth.extractRawText({ arrayBuffer: arrayBuffer })];
                case 3:
                    result = _a.sent();
                    return [2 /*return*/, result.value];
            }
        });
    });
}
function extractMissionBriefFromFile(file) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var extension;
        return __generator(this, function (_b) {
            extension = (_a = file.name.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            if (file.size > 10 * 1024 * 1024) {
                throw new Error('File is too large. Please upload a PDF, DOCX, or TXT file under 10MB.');
            }
            if (extension === 'txt')
                return [2 /*return*/, file.text()];
            if (extension === 'pdf')
                return [2 /*return*/, extractPdfText(file)];
            if (extension === 'docx')
                return [2 /*return*/, extractDocxText(file)];
            throw new Error('Unsupported file type. Please upload a PDF, DOCX, or TXT mission brief.');
        });
    });
}
function mapSharePointCv(item) {
    var _a;
    return {
        id: item.CandidateId || "CV-".concat(item.Id),
        title: item.ProfileTitle || item.Title || 'Anonymized candidate',
        meta: [
            item.Seniority || 'Unspecified seniority',
            item.Availability || 'Availability to confirm'
        ].join(' | '),
        seniority: item.Seniority || '',
        availability: item.Availability || '',
        skills: splitSkills(item.Skills || ''),
        summary: item.Summary || 'No summary available yet.',
        cvUrl: (_a = item.CvUrl) === null || _a === void 0 ? void 0 : _a.Url
    };
}
function splitSkills(value) {
    return value
        .split(/[,;\n]/)
        .map(function (skill) { return skill.trim(); })
        .filter(Boolean);
}
function getMonthKey(date) {
    var month = "".concat(date.getMonth() + 1).padStart(2, '0');
    return "".concat(date.getFullYear(), "-").concat(month);
}
function formatMissionDate(value) {
    if (!value)
        return 'Date unavailable';
    return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
}
function cleanProfileTitle(value) {
    var withoutExtension = value.replace(/\.(pdf|docx)$/i, '');
    return withoutExtension
        .replace(/[_-]+/g, ' ')
        .replace(/\b(cv|resume|anonymous|anonymized|standardise|standardized|v\d+(\.\d+)*)\b/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim() || 'Anonymized consultant';
}
function inferSkillsFromText(value) {
    var lower = value.toLowerCase();
    var skills = skillSynonyms.filter(function (skill) { return lower.includes(skill.toLowerCase()); });
    return Array.from(new Set(skills.length ? skills : ['General IT Consulting']));
}
function inferSeniority(value) {
    var lower = value.toLowerCase();
    if (/\b(architect|principal)\b/.test(lower))
        return 'Architect';
    if (/\b(lead|manager|head)\b/.test(lower))
        return 'Lead';
    if (/\b(senior|sr)\b/.test(lower))
        return 'Senior';
    if (/\b(junior|jr)\b/.test(lower))
        return 'Junior';
    return 'Senior';
}
function buildAbsoluteSharePointUrl(siteUrl, document) {
    var _a, _b;
    if ((_a = document.File) === null || _a === void 0 ? void 0 : _a.LinkingUrl)
        return document.File.LinkingUrl;
    var serverRelativeUrl = ((_b = document.File) === null || _b === void 0 ? void 0 : _b.ServerRelativeUrl) || '';
    if (!serverRelativeUrl)
        return siteUrl;
    return "".concat(new URL(siteUrl).origin).concat(serverRelativeUrl);
}
function mapDocumentToPartnerCv(siteUrl, document, partnerName) {
    var _a;
    var fileName = ((_a = document.File) === null || _a === void 0 ? void 0 : _a.Name) || document.Title || "CV document ".concat(document.Id);
    var profileTitle = cleanProfileTitle(document.Title || fileName);
    var skills = inferSkillsFromText("".concat(profileTitle, " ").concat(fileName));
    var cvUrl = buildAbsoluteSharePointUrl(siteUrl, document);
    return {
        title: profileTitle,
        partnerName: partnerName,
        candidateId: "DOC-".concat(document.Id),
        profileTitle: profileTitle,
        seniority: inferSeniority("".concat(profileTitle, " ").concat(fileName)),
        availability: 'Availability to confirm',
        skills: skills,
        summary: "Anonymized profile imported from SharePoint document \"".concat(fileName, "\". Initial metadata was inferred from the document name and library metadata."),
        cvUrl: cvUrl,
        cvUrlDescription: fileName
    };
}
function filterProfiles(sourceProfiles, selectedSkills, seniority, availability) {
    var normalizedSkills = selectedSkills.map(function (skill) { return skill.toLowerCase(); });
    return sourceProfiles
        .filter(function (profile) { return !seniority || profile.seniority === seniority; })
        .filter(function (profile) { return !availability || profile.availability === availability; })
        .filter(function (profile) {
        if (normalizedSkills.length === 0)
            return true;
        var searchableProfile = "".concat(profile.title, " ").concat(profile.meta, " ").concat(profile.summary, " ").concat(profile.skills.join(' ')).toLowerCase();
        return normalizedSkills.some(function (skill) { return searchableProfile.includes(skill); });
    })
        .map(function (profile) { return (__assign(__assign({}, profile), { score: scoreProfile(profile, selectedSkills) })); })
        .sort(function (left, right) { return (right.score || 0) - (left.score || 0); });
}
function CvTech2PartnerPortal(_a) {
    var _this = this;
    var webPartProps = _a.webPartProps, spHttpClient = _a.spHttpClient, siteUrl = _a.siteUrl, userDisplayName = _a.userDisplayName, userEmail = _a.userEmail;
    var portalTemplate = webPartProps.portalTemplate, brandLabel = webPartProps.brandLabel, portalTitle = webPartProps.portalTitle, primaryColor = webPartProps.primaryColor, secondaryColor = webPartProps.secondaryColor, accentTextColor = webPartProps.accentTextColor, surfaceColor = webPartProps.surfaceColor, webPartMaxWidth = webPartProps.webPartMaxWidth, sidebarWidth = webPartProps.sidebarWidth, minHeight = webPartProps.minHeight, contentPadding = webPartProps.contentPadding, sectionGap = webPartProps.sectionGap, cardPadding = webPartProps.cardPadding, borderRadius = webPartProps.borderRadius, metricMinWidth = webPartProps.metricMinWidth, metricMinHeight = webPartProps.metricMinHeight, titleFontSize = webPartProps.titleFontSize, bodyFontSize = webPartProps.bodyFontSize, partnerMonthlyQuota = webPartProps.partnerMonthlyQuota, overviewPosition = webPartProps.overviewPosition, missionMatchPosition = webPartProps.missionMatchPosition, cvLibraryPosition = webPartProps.cvLibraryPosition, plansPosition = webPartProps.plansPosition, compliancePosition = webPartProps.compliancePosition;
    var rootRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    var missionBriefInputRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    var serviceRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(new _services_SharePointPartnerPortalService__WEBPACK_IMPORTED_MODULE_1__.SharePointPartnerPortalService(spHttpClient, siteUrl));
    var _b = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(webPartMaxWidth), containerWidth = _b[0], setContainerWidth = _b[1];
    var _c = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''), missionBrief = _c[0], setMissionBrief = _c[1];
    var _d = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''), skillInput = _d[0], setSkillInput = _d[1];
    var _e = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(['Azure', 'IAM', 'Terraform']), selectedSkills = _e[0], setSelectedSkills = _e[1];
    var _f = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''), seniority = _f[0], setSeniority = _f[1];
    var _g = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''), availability = _g[0], setAvailability = _g[1];
    var _h = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('overview'), activeSection = _h[0], setActiveSection = _h[1];
    var _j = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]), availableProfiles = _j[0], setAvailableProfiles = _j[1];
    var _k = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true), isLoadingCvs = _k[0], setIsLoadingCvs = _k[1];
    var _l = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''), dataError = _l[0], setDataError = _l[1];
    var _m = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''), missionError = _m[0], setMissionError = _m[1];
    var _o = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]), partnerMissions = _o[0], setPartnerMissions = _o[1];
    var _p = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true), isLoadingMissions = _p[0], setIsLoadingMissions = _p[1];
    var _q = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false), isAdmin = _q[0], setIsAdmin = _q[1];
    var _r = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true), isCheckingAdmin = _r[0], setIsCheckingAdmin = _r[1];
    var _s = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''), adminError = _s[0], setAdminError = _s[1];
    var _t = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''), adminStatus = _t[0], setAdminStatus = _t[1];
    var _u = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false), isImportingDocuments = _u[0], setIsImportingDocuments = _u[1];
    var _v = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''), searchStatus = _v[0], setSearchStatus = _v[1];
    var _w = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(partnerMonthlyQuota), searchesRemaining = _w[0], setSearchesRemaining = _w[1];
    var _x = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false), showAllMissions = _x[0], setShowAllMissions = _x[1];
    var _y = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(), activeMissionMenuId = _y[0], setActiveMissionMenuId = _y[1];
    var _z = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(), editingMissionId = _z[0], setEditingMissionId = _z[1];
    var _0 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false), isSavingMission = _0[0], setIsSavingMission = _0[1];
    var _1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false), isImportingMissionBrief = _1[0], setIsImportingMissionBrief = _1[1];
    var _2 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(), cvPreview = _2[0], setCvPreview = _2[1];
    var _3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(), partnerAccount = _3[0], setPartnerAccount = _3[1];
    var _4 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''), partnerAccountError = _4[0], setPartnerAccountError = _4[1];
    var effectivePartnerName = (partnerAccount === null || partnerAccount === void 0 ? void 0 : partnerAccount.PartnerName) || webPartProps.partnerName;
    var effectivePartnerAccountId = partnerAccount === null || partnerAccount === void 0 ? void 0 : partnerAccount.Id;
    var effectiveMonthlyQuota = typeof (partnerAccount === null || partnerAccount === void 0 ? void 0 : partnerAccount.MonthlySearchQuota) === 'number' && partnerAccount.MonthlySearchQuota > 0
        ? partnerAccount.MonthlySearchQuota
        : partnerMonthlyQuota;
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        serviceRef.current = new _services_SharePointPartnerPortalService__WEBPACK_IMPORTED_MODULE_1__.SharePointPartnerPortalService(spHttpClient, siteUrl);
    }, [siteUrl, spHttpClient]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        var isMounted = true;
        function loadPartnerAccount() {
            return __awaiter(this, void 0, void 0, function () {
                var account, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setPartnerAccountError('');
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, serviceRef.current.getPartnerAccount(webPartProps.partnerAccountListTitle, userEmail)];
                        case 2:
                            account = _a.sent();
                            if (!isMounted)
                                return [2 /*return*/];
                            setPartnerAccount(account);
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            if (!isMounted)
                                return [2 /*return*/];
                            setPartnerAccount(undefined);
                            setPartnerAccountError(error_1 instanceof Error ? error_1.message : 'Unable to load PartnerAccounts. Using web part fallback settings.');
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        loadPartnerAccount().catch(function () { return undefined; });
        return function () {
            isMounted = false;
        };
    }, [userEmail, webPartProps.partnerAccountListTitle]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        setSearchesRemaining(effectiveMonthlyQuota);
    }, [effectiveMonthlyQuota]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        var measure = function () {
            var _a;
            var width = (_a = rootRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect().width;
            if (width)
                setContainerWidth(width);
        };
        measure();
        if (typeof ResizeObserver !== 'undefined' && rootRef.current) {
            var resizeObserver_1 = new ResizeObserver(measure);
            resizeObserver_1.observe(rootRef.current);
            return function () { return resizeObserver_1.disconnect(); };
        }
        window.addEventListener('resize', measure);
        return function () { return window.removeEventListener('resize', measure); };
    }, []);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        var isMounted = true;
        function loadCvs() {
            return __awaiter(this, void 0, void 0, function () {
                var items, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setIsLoadingCvs(true);
                            setDataError('');
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, serviceRef.current.getAvailableCvs(webPartProps.cvListTitle, webPartProps.cvRowLimit, effectivePartnerName)];
                        case 2:
                            items = _a.sent();
                            if (!isMounted)
                                return [2 /*return*/];
                            setAvailableProfiles(items.map(mapSharePointCv));
                            return [3 /*break*/, 5];
                        case 3:
                            error_2 = _a.sent();
                            if (!isMounted)
                                return [2 /*return*/];
                            setDataError(error_2 instanceof Error ? error_2.message : 'Unable to load CVs from SharePoint.');
                            setAvailableProfiles([]);
                            return [3 /*break*/, 5];
                        case 4:
                            if (isMounted)
                                setIsLoadingCvs(false);
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
        loadCvs().catch(function () { return undefined; });
        return function () {
            isMounted = false;
        };
    }, [effectivePartnerName, webPartProps.cvListTitle, webPartProps.cvRowLimit]);
    var loadPartnerMissions = function () { return __awaiter(_this, void 0, void 0, function () {
        var missions, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoadingMissions(true);
                    setMissionError('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, serviceRef.current.getPartnerMissions(webPartProps.missionListTitle, effectivePartnerName, 100)];
                case 2:
                    missions = _a.sent();
                    setPartnerMissions(missions);
                    return [3 /*break*/, 5];
                case 3:
                    error_3 = _a.sent();
                    setMissionError(error_3 instanceof Error ? error_3.message : 'Unable to load partner missions from SharePoint.');
                    setPartnerMissions([]);
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoadingMissions(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        loadPartnerMissions().catch(function () { return undefined; });
    }, [effectivePartnerName, webPartProps.missionListTitle]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        var isMounted = true;
        function checkAdminAccess() {
            return __awaiter(this, void 0, void 0, function () {
                var hasAccess, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setIsCheckingAdmin(true);
                            setAdminError('');
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, serviceRef.current.isPartnerPortalAdmin(webPartProps.adminListTitle, userEmail)];
                        case 2:
                            hasAccess = _a.sent();
                            if (!isMounted)
                                return [2 /*return*/];
                            setIsAdmin(hasAccess);
                            if (!hasAccess && activeSection === 'administration') {
                                setActiveSection('overview');
                            }
                            return [3 /*break*/, 5];
                        case 3:
                            error_4 = _a.sent();
                            if (!isMounted)
                                return [2 /*return*/];
                            setIsAdmin(false);
                            setAdminError(error_4 instanceof Error ? error_4.message : 'Unable to check Partner Portal admin access.');
                            return [3 /*break*/, 5];
                        case 4:
                            if (isMounted)
                                setIsCheckingAdmin(false);
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
        checkAdminAccess().catch(function () { return undefined; });
        return function () {
            isMounted = false;
        };
    }, [activeSection, userEmail, webPartProps.adminListTitle]);
    var searchSkills = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () { return buildSearchSkills(selectedSkills, missionBrief); }, [missionBrief, selectedSkills]);
    var searchCriteria = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
        return __spreadArray(__spreadArray([], searchSkills.map(function (skill) { return "Skill: ".concat(skill); }), true), [
            seniority ? "Seniority: ".concat(seniority) : 'Seniority: Any',
            availability ? "Availability: ".concat(availability) : 'Availability: Any',
            missionBrief.trim() ? 'Mission brief: included' : 'Mission brief: empty'
        ], false);
    }, [availability, missionBrief, searchSkills, seniority]);
    var visibleMissions = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () { return showAllMissions ? partnerMissions : partnerMissions.slice(0, 3); }, [partnerMissions, showAllMissions]);
    var rankedProfiles = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
        return filterProfiles(availableProfiles, searchSkills, seniority, availability);
    }, [availability, availableProfiles, searchSkills, seniority]);
    var toggleSkill = function (skill) {
        setSelectedSkills(function (current) {
            return current.includes(skill) ? current.filter(function (item) { return item !== skill; }) : __spreadArray(__spreadArray([], current, true), [skill], false);
        });
    };
    var addSkill = function () {
        var value = skillInput.trim();
        if (!value)
            return;
        setSelectedSkills(function (current) { return current.includes(value) ? current : __spreadArray(__spreadArray([], current, true), [value], false); });
        setSkillInput('');
    };
    var startNewMission = function () {
        setMissionBrief('');
        setSelectedSkills([]);
        setSkillInput('');
        setSeniority('');
        setAvailability('');
        setEditingMissionId(undefined);
        setActiveMissionMenuId(undefined);
        setSearchStatus('New mission ready. Add a brief or criteria to launch a search.');
    };
    var importMissionBriefFile = function (file) { return __awaiter(_this, void 0, void 0, function () {
        var extractedText, extractedSkills_1, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsImportingMissionBrief(true);
                    setSearchStatus("Importing mission brief from \"".concat(file.name, "\"..."));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, extractMissionBriefFromFile(file)];
                case 2:
                    extractedText = (_a.sent()).trim();
                    if (!extractedText) {
                        throw new Error("No readable text was found in \"".concat(file.name, "\"."));
                    }
                    extractedSkills_1 = inferSkillsFromText(extractedText).filter(function (skill) { return skill !== 'General IT Consulting'; });
                    setMissionBrief(extractedText);
                    setSelectedSkills(function (current) { return Array.from(new Set(__spreadArray(__spreadArray([], current, true), extractedSkills_1, true))); });
                    setEditingMissionId(undefined);
                    setActiveMissionMenuId(undefined);
                    setSearchStatus("Mission brief imported from \"".concat(file.name, "\". ").concat(extractedSkills_1.length, " skill(s) detected."));
                    navigateToSection('mission-match');
                    return [3 /*break*/, 5];
                case 3:
                    error_5 = _a.sent();
                    setSearchStatus(error_5 instanceof Error ? error_5.message : 'Unable to import mission brief file.');
                    return [3 /*break*/, 5];
                case 4:
                    setIsImportingMissionBrief(false);
                    if (missionBriefInputRef.current) {
                        missionBriefInputRef.current.value = '';
                    }
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleMissionBriefInputChange = function (event) {
        var _a;
        var file = (_a = event.currentTarget.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        importMissionBriefFile(file).catch(function (error) {
            setSearchStatus(error instanceof Error ? error.message : 'Unable to import mission brief file.');
        });
    };
    var handleMissionBriefDrop = function (event) {
        var _a;
        event.preventDefault();
        var file = (_a = event.dataTransfer.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        importMissionBriefFile(file).catch(function (error) {
            setSearchStatus(error instanceof Error ? error.message : 'Unable to import mission brief file.');
        });
    };
    var openCvPreview = function (profile) {
        if (!profile.cvUrl)
            return;
        setCvPreview({
            title: profile.title || "Candidate ".concat(profile.id),
            url: profile.cvUrl
        });
    };
    var extractSkillsFromBrief = function () {
        var lower = missionBrief.toLowerCase();
        var extracted = suggestedSkills.filter(function (skill) { return lower.includes(skill.toLowerCase()); });
        var nextSkills = Array.from(new Set(__spreadArray(__spreadArray([], selectedSkills, true), extracted, true)));
        setSelectedSkills(nextSkills);
        logSearch(nextSkills).catch(function (error) {
            setSearchStatus(error instanceof Error ? error.message : 'Search log failed.');
        });
        navigateToSection('mission-match');
    };
    var logSearch = function (skillsForSearch) {
        if (skillsForSearch === void 0) { skillsForSearch = searchSkills; }
        return __awaiter(_this, void 0, void 0, function () {
            var monthKey, usedSearches, results, remaining, missionTitle, matchedCandidateIds, matchedCvUrls, matchedProfileTitles, missionPayload;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        setIsSavingMission(true);
                        setSearchStatus(editingMissionId ? 'Updating mission and logging search...' : 'Logging search...');
                        monthKey = getMonthKey(new Date());
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, , 9, 10]);
                        return [4 /*yield*/, serviceRef.current.countMonthlySearches(webPartProps.auditListTitle, effectivePartnerName, userEmail, monthKey)];
                    case 2:
                        usedSearches = _b.sent();
                        results = filterProfiles(availableProfiles, skillsForSearch, seniority, availability);
                        remaining = Math.max(0, effectiveMonthlyQuota - usedSearches - 1);
                        missionTitle = ((_a = missionBrief.trim().split(/\n|[.!?]/)[0]) === null || _a === void 0 ? void 0 : _a.trim()) || "Skills search: ".concat(skillsForSearch.slice(0, 3).join(', '));
                        matchedCandidateIds = results.map(function (profile) { return profile.id; });
                        matchedCvUrls = results.map(function (profile) { return profile.cvUrl || ''; }).filter(Boolean);
                        matchedProfileTitles = results.map(function (profile) { return profile.title; });
                        missionPayload = {
                            title: missionTitle,
                            partnerAccountId: effectivePartnerAccountId,
                            partnerName: effectivePartnerName,
                            userEmail: userEmail,
                            missionBrief: missionBrief,
                            skills: skillsForSearch,
                            seniority: seniority,
                            availability: availability,
                            resultsCount: results.length,
                            matchedCandidateIds: matchedCandidateIds
                        };
                        return [4 /*yield*/, serviceRef.current.logSearch(webPartProps.auditListTitle, {
                                title: "".concat(effectivePartnerName, " search ").concat(new Date().toISOString()),
                                partnerAccountId: effectivePartnerAccountId,
                                partnerName: effectivePartnerName,
                                userEmail: userEmail,
                                query: missionBrief,
                                skills: skillsForSearch,
                                resultsCount: results.length,
                                quotaMaximum: effectiveMonthlyQuota,
                                searchesRemaining: remaining,
                                monthKey: monthKey,
                                matchedCandidateIds: matchedCandidateIds,
                                matchedCvUrls: matchedCvUrls,
                                matchedProfileTitles: matchedProfileTitles
                            })];
                    case 3:
                        _b.sent();
                        if (!editingMissionId) return [3 /*break*/, 5];
                        return [4 /*yield*/, serviceRef.current.updatePartnerMission(webPartProps.missionListTitle, editingMissionId, missionPayload)];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, serviceRef.current.savePartnerMission(webPartProps.missionListTitle, missionPayload)];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7:
                        setSearchesRemaining(remaining);
                        setEditingMissionId(undefined);
                        setActiveMissionMenuId(undefined);
                        setSearchStatus("".concat(editingMissionId ? 'Mission updated' : 'Search logged', ". ").concat(results.length, " CV(s) found. ").concat(remaining, " search(es) remaining this month."));
                        return [4 /*yield*/, loadPartnerMissions()];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        setIsSavingMission(false);
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    var reuseMission = function (mission) {
        setMissionBrief(mission.MissionBrief || '');
        setSelectedSkills(splitSkills(mission.MissionSkills || ''));
        setSeniority(mission.Seniority || '');
        setAvailability(mission.Availability || '');
        setEditingMissionId(undefined);
        setActiveMissionMenuId(undefined);
        setSearchStatus("Loaded mission \"".concat(mission.Title || "#".concat(mission.Id), "\". You can refine and search again."));
    };
    var editMission = function (mission) {
        setMissionBrief(mission.MissionBrief || '');
        setSelectedSkills(splitSkills(mission.MissionSkills || ''));
        setSeniority(mission.Seniority || '');
        setAvailability(mission.Availability || '');
        setEditingMissionId(mission.Id);
        setActiveMissionMenuId(undefined);
        setSearchStatus("Editing mission \"".concat(mission.Title || "#".concat(mission.Id), "\". Launch search to save changes."));
    };
    var deleteMission = function (mission) { return __awaiter(_this, void 0, void 0, function () {
        var label;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    label = mission.Title || "Mission #".concat(mission.Id);
                    if (!window.confirm("Delete \"".concat(label, "\" from partner mission history?")))
                        return [2 /*return*/];
                    setActiveMissionMenuId(undefined);
                    setSearchStatus("Deleting mission \"".concat(label, "\"..."));
                    return [4 /*yield*/, serviceRef.current.deletePartnerMission(webPartProps.missionListTitle, mission.Id)];
                case 1:
                    _a.sent();
                    if (editingMissionId === mission.Id) {
                        setEditingMissionId(undefined);
                    }
                    setSearchStatus("Mission \"".concat(label, "\" deleted."));
                    return [4 /*yield*/, loadPartnerMissions()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var importCvDocuments = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, documents, existingCvs, existingCandidateIds_1, existingUrls_1, candidates, _i, candidates_1, candidate, items, error_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setIsImportingDocuments(true);
                    setAdminStatus('Scanning SharePoint CV documents...');
                    setAdminError('');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 8, 9, 10]);
                    return [4 /*yield*/, Promise.all([
                            serviceRef.current.getCvDocuments(webPartProps.cvDocumentLibraryTitle, webPartProps.cvRowLimit),
                            serviceRef.current.getPartnerCvKeys(webPartProps.cvListTitle, webPartProps.cvRowLimit)
                        ])];
                case 2:
                    _a = _b.sent(), documents = _a[0], existingCvs = _a[1];
                    existingCandidateIds_1 = new Set(existingCvs.map(function (item) { return item.CandidateId; }).filter(Boolean));
                    existingUrls_1 = new Set(existingCvs.map(function (item) { var _a; return (_a = item.CvUrl) === null || _a === void 0 ? void 0 : _a.Url; }).filter(Boolean));
                    candidates = documents
                        .map(function (document) { return mapDocumentToPartnerCv(siteUrl, document, effectivePartnerName); })
                        .filter(function (candidate) { return !existingCandidateIds_1.has(candidate.candidateId) && !existingUrls_1.has(candidate.cvUrl); });
                    _i = 0, candidates_1 = candidates;
                    _b.label = 3;
                case 3:
                    if (!(_i < candidates_1.length)) return [3 /*break*/, 6];
                    candidate = candidates_1[_i];
                    return [4 /*yield*/, serviceRef.current.createPartnerCv(webPartProps.cvListTitle, candidate)];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    setAdminStatus("Import complete. ".concat(documents.length, " document(s) scanned, ").concat(candidates.length, " new PartnerCV item(s) created."));
                    return [4 /*yield*/, serviceRef.current.getAvailableCvs(webPartProps.cvListTitle, webPartProps.cvRowLimit, effectivePartnerName)];
                case 7:
                    items = _b.sent();
                    setAvailableProfiles(items.map(mapSharePointCv));
                    return [3 /*break*/, 10];
                case 8:
                    error_6 = _b.sent();
                    setAdminError(error_6 instanceof Error ? error_6.message : 'Unable to import CV documents.');
                    return [3 /*break*/, 10];
                case 9:
                    setIsImportingDocuments(false);
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); };
    var navigateToSection = function (sectionId) {
        setActiveSection(sectionId);
    };
    var layoutMode = containerWidth < 680 ? 'mobile' : containerWidth < 1060 ? 'tablet' : 'desktop';
    var sectionPositions = {
        overview: overviewPosition,
        'mission-match': missionMatchPosition,
        'cv-library': cvLibraryPosition,
        plans: plansPosition,
        compliance: compliancePosition,
        administration: 99
    };
    var visibleNavItems = navItems.filter(function (item) { return item.id !== 'administration' || isAdmin; });
    var orderedNavItems = __spreadArray([], visibleNavItems, true).sort(function (left, right) {
        return (sectionPositions[left.id] - sectionPositions[right.id]) || (left.defaultOrder - right.defaultOrder);
    });
    var styles = buildStyles({
        portalTemplate: portalTemplate,
        primaryColor: primaryColor,
        secondaryColor: secondaryColor,
        accentTextColor: accentTextColor,
        surfaceColor: surfaceColor,
        webPartMaxWidth: webPartMaxWidth,
        sidebarWidth: sidebarWidth,
        minHeight: minHeight,
        contentPadding: contentPadding,
        sectionGap: sectionGap,
        cardPadding: cardPadding,
        borderRadius: borderRadius,
        metricMinWidth: metricMinWidth,
        metricMinHeight: metricMinHeight,
        titleFontSize: titleFontSize,
        bodyFontSize: bodyFontSize,
        layoutMode: layoutMode
    });
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { ref: rootRef, style: styles.shell },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("aside", { style: styles.sidebar },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.brandBlock },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.logoMark },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(InlineIcon, { name: "brandMark", size: 34 })),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.brand }, activeSection === 'overview' ? 'SaaS Partner Cockpit' : brandLabel),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.brandCopy }, "Partner access for anonymized CV discovery and mission matching."))),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("nav", { style: styles.nav }, orderedNavItems.map(function (item) { return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { key: item.id, type: "button", style: activeSection === item.id ? __assign(__assign({}, styles.navItem), styles.navItemActive) : styles.navItem, onClick: function () { return navigateToSection(item.id); } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.navGlyph },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(InlineIcon, { name: getSectionIcon(item.id), size: 18 })),
                item.label)); })),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.headerActions },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.headerIcon },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(InlineIcon, { name: "bell", size: 20 })),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.avatarBadge }, "P"),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.chevron },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(InlineIcon, { name: "chevronDown", size: 18 }))),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: activeSection === 'overview' ? styles.sidePanelHidden : styles.sidePanel },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Partner status"),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null, effectivePartnerName),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                    searchesRemaining,
                    " / ",
                    effectiveMonthlyQuota,
                    " searches remaining this month."),
                partnerAccountError ? react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null, partnerAccountError) : null)),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("main", { style: styles.content },
            activeSection === 'overview' ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("section", { id: "overview", style: __assign(__assign({}, styles.overview), { order: sectionPositions.overview }) },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.overviewBackdrop },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.overviewHeroCopy },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.overviewKicker },
                            "Partner access for anonymized",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("br", null),
                            "CV discovery and mission matching"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h1", { style: styles.overviewHeadline },
                            "Smarter matches.",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("br", null),
                            "Stronger missions."),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.overviewLead },
                            "Discover anonymized talent, find the perfect fit,",
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("br", null),
                            "and reveal identity only when you're ready.")),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.overviewStatusCard },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.statusHeader },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.statusIcon },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(InlineIcon, { name: "user", size: 28 })),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.statusCopy },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Partner status"),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null, effectivePartnerName))),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.quotaRow },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.quotaRing }),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.quotaCopy },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null,
                                    searchesRemaining,
                                    " / ",
                                    effectiveMonthlyQuota),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null, "searches remaining this month."))))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.overviewCard },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.overviewCardTop },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.overviewCardCopy },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.eyebrow }, "SaaS partner cockpit"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h2", { style: styles.overviewTitle }, portalTitle),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.overviewBody }, "Search anonymized candidate profiles by skills or mission brief, shortlist the best matches, and request controlled identity reveal only when the fit is validated."),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.heroActions },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { type: "button", style: styles.primaryButton, onClick: extractSkillsFromBrief },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.buttonIcon },
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(InlineIcon, { name: "search", size: 18 })),
                                    "Analyze mission",
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.buttonArrow },
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(InlineIcon, { name: "arrowRight", size: 18 }))),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { type: "button", style: styles.secondaryButton, onClick: function () { return navigateToSection('plans'); } },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.buttonIcon },
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(InlineIcon, { name: "lock", size: 18 })),
                                    "Request partner access"))),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.matchIllustration },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.radarCircleOuter }),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.radarCircleInner }),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.radarCrossHorizontal }),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.radarCrossVertical }),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.matchCheck },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(InlineIcon, { name: "check", size: 28 })),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: __assign(__assign({}, styles.profileChip), styles.profileChipLeft) },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.chipAvatar },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(InlineIcon, { name: "user", size: 20 })),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.chipLines },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.chipLineLong }),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.chipLineShort }))),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: __assign(__assign({}, styles.profileChip), styles.profileChipRight) },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.chipAvatar },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(InlineIcon, { name: "user", size: 20 })),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.chipLines },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.chipLineLong }),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.chipLineShort }))))),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.overviewDivider }),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.overviewMetrics },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(Metric, { value: "".concat(availableProfiles.length), label: "Missions analyzed", detail: "This month", icon: "user", styles: styles }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(Metric, { value: isLoadingCvs ? '...' : "".concat(rankedProfiles.length), label: "Matches found", detail: "This month", icon: "document", styles: styles }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(Metric, { value: "94%", label: "Match success rate", detail: "Validated fit", icon: "trend", styles: styles }))))) : null,
            activeSection === 'mission-match' ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("section", { id: "mission-match", style: __assign(__assign({}, styles.missionFrame), { order: sectionPositions['mission-match'] }) },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.missionHero },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.missionHeroCopy },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.missionKicker },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(InlineIcon, { name: "sparkle" }),
                            " Mission intelligence"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h2", { style: styles.missionTitle }, "Mission Match"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.missionLead }, "Capture a mission brief, extract explicit skills, and turn every search into a reusable partner mission record.")),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.missionHeroActions },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { type: "button", style: styles.missionGhostButton, onClick: startNewMission },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(InlineIcon, { name: "plus" }),
                            "New mission"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { type: "button", style: isImportingMissionBrief ? __assign(__assign({}, styles.missionGhostButton), styles.disabledButton) : styles.missionGhostButton, onClick: function () { var _a; return (_a = missionBriefInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }, disabled: isImportingMissionBrief },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(InlineIcon, { name: "cloudUpload" }),
                            isImportingMissionBrief ? 'Importing...' : 'Import brief')),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.missionStats },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(MissionStat, { icon: "bookmark", value: "".concat(partnerMissions.length), label: "Saved missions", progress: 70, styles: styles }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(MissionStat, { icon: "user", value: "".concat(selectedSkills.length), label: "Active skills", progress: selectedSkills.length > 0 ? 28 : 12, styles: styles }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(MissionStat, { icon: "search", value: "".concat(searchesRemaining), label: "Searches left", progress: 58, styles: styles }))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.missionWorkbench },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.missionComposer },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.missionPanelHeader },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.missionPanelIcon },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(InlineIcon, { name: "document" })),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", { style: styles.missionPanelTitle }, "Mission Composer"),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.missionPanelKicker }, "Mission / offer brief")),
                            editingMissionId ? react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.editingBadge },
                                "Editing mission #",
                                editingMissionId) : null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { type: "button", style: styles.aiPill, onClick: extractSkillsFromBrief },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(InlineIcon, { name: "sparkle" }),
                                " AI-powered extraction")),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.missionTextareaWrap },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("textarea", { style: styles.missionTextarea, value: missionBrief, onChange: function (event) { return setMissionBrief(event.currentTarget.value); }, placeholder: "Paste mission brief or job description..." }),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.textareaHint },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(InlineIcon, { name: "lightbulb" })),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.grammarBadge }, "G")),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("input", { ref: missionBriefInputRef, type: "file", accept: ".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain", style: styles.hiddenInput, onChange: handleMissionBriefInputChange }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: isImportingMissionBrief ? __assign(__assign({}, styles.dropZone), styles.dropZoneBusy) : styles.dropZone, role: "button", tabIndex: 0, onClick: function () { var _a; return (_a = missionBriefInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }, onDragOver: function (event) { return event.preventDefault(); }, onDrop: handleMissionBriefDrop, onKeyDown: function (event) {
                                var _a;
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    (_a = missionBriefInputRef.current) === null || _a === void 0 ? void 0 : _a.click();
                                }
                            } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.dropIcon },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(InlineIcon, { name: "cloudUpload" })),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, isImportingMissionBrief ? 'Reading mission brief...' : 'Drag & drop a file here, or click to upload'),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null, "PDF, DOCX, or TXT - Max 10MB"))),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(FieldLabel, { label: "Sample extracted skills" }),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.extractedSkills }, (selectedSkills.length > 0 ? selectedSkills : ['Java', 'Kafka', 'French', 'Banking', '6+ years']).map(function (skill) { return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { key: skill, type: "button", style: styles.extractedSkill, onClick: function () { return toggleSkill(skill); } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(InlineIcon, { name: getSkillIcon(skill) }),
                                skill)); }))),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.missionActionRow },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { type: "button", style: styles.extractButton, onClick: extractSkillsFromBrief },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(InlineIcon, { name: "sparkle" }),
                                "Extract skills"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { type: "button", style: isSavingMission ? __assign(__assign({}, styles.launchButton), styles.disabledButton) : styles.launchButton, onClick: function () { return logSearch(); }, disabled: isSavingMission },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(InlineIcon, { name: "search" }),
                                isSavingMission ? 'Saving...' : editingMissionId ? 'Save mission changes' : 'Launch search')),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.missionFilters },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("input", { style: styles.missionSkillInput, value: skillInput, onChange: function (event) { return setSkillInput(event.currentTarget.value); }, onKeyDown: function (event) {
                                    if (event.key === 'Enter') {
                                        event.preventDefault();
                                        addSkill();
                                    }
                                }, placeholder: "Add a skill manually..." }),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { type: "button", style: styles.compactButton, onClick: addSkill }, "Add"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("select", { style: styles.missionSelect, value: seniority, onChange: function (event) { return setSeniority(event.currentTarget.value); } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("option", { value: "" }, "Any seniority"),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("option", null, "Senior"),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("option", null, "Lead"),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("option", null, "Architect")),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("select", { style: styles.missionSelect, value: availability, onChange: function (event) { return setAvailability(event.currentTarget.value); } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("option", { value: "" }, "Any availability"),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("option", null, "Immediate"),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("option", null, "Under 2 weeks"),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("option", null, "Under 1 month"))),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.criteriaList, "aria-label": "Active search criteria" }, searchCriteria.map(function (criteria) { return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { key: criteria, style: styles.criteriaPill }, criteria)); })),
                        searchStatus ? react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.statusText }, searchStatus) : null,
                        dataError ? react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.errorText }, dataError) : null),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.missionHistoryPanel },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.missionPanelHeader },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.missionPanelIcon },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(InlineIcon, { name: "history" })),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", { style: styles.missionPanelTitle }, "Partner Mission History"),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.missionPanelKicker }, "Recent searches & reused criteria")),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { type: "button", style: styles.viewAllButton, onClick: function () { return setShowAllMissions(function (current) { return !current; }); }, disabled: partnerMissions.length <= 3 }, showAllMissions ? 'Show latest' : "View all (".concat(partnerMissions.length, ")"))),
                        isLoadingMissions ? react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.muted }, "Loading partner missions...") : null,
                        missionError ? react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.errorText }, missionError) : null,
                        !isLoadingMissions && !missionError && partnerMissions.length === 0 ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.muted },
                            "No mission saved yet for ",
                            effectivePartnerName,
                            ".")) : null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.missionHistoryList }, visibleMissions.map(function (mission, index) { return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("article", { key: mission.Id, style: index === 0 ? __assign(__assign({}, styles.historyCard), styles.historyCardFeatured) : styles.historyCard },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.historyIcon },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(InlineIcon, { name: index === 0 ? 'search' : index === 1 ? 'database' : 'briefcase' })),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.historyContent },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.historyTop },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: styles.historyTitle }, mission.Title || (index === 0 ? 'Skills search' : "Mission #".concat(mission.Id))),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.historyMeta },
                                            formatMissionDate(mission.Created),
                                            " - ",
                                            mission.UserEmail || 'Partner user')),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.historyMenuWrap },
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { type: "button", style: styles.historyMenuButton, onClick: function () { return setActiveMissionMenuId(activeMissionMenuId === mission.Id ? undefined : mission.Id); }, "aria-label": "Open actions for ".concat(mission.Title || "mission ".concat(mission.Id)) },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(InlineIcon, { name: "moreVertical" })),
                                        activeMissionMenuId === mission.Id ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.historyMenuPanel },
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { type: "button", style: styles.historyMenuAction, onClick: function () { return editMission(mission); } }, "Edit mission"),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { type: "button", style: styles.historyMenuAction, onClick: function () { return reuseMission(mission); } }, "Reuse criteria"),
                                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { type: "button", style: __assign(__assign({}, styles.historyMenuAction), styles.historyMenuDanger), onClick: function () {
                                                    deleteMission(mission).catch(function (error) {
                                                        setSearchStatus(error instanceof Error ? error.message : 'Unable to delete mission.');
                                                    });
                                                } }, "Delete mission"))) : null)),
                                index === 0 ? react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.profileSummary }, mission.MissionBrief || 'No mission brief captured.') : null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.historyBottom },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.historyCriteria },
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Criteria:"),
                                        " ",
                                        mission.Seniority || 'Any seniority',
                                        " - ",
                                        mission.Availability || 'Any availability',
                                        mission.MissionSkills ? " - ".concat(mission.MissionSkills) : ''),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.resultBadge },
                                        mission.ResultsCount || 0,
                                        " CVs")),
                                index === 0 ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { type: "button", style: styles.reuseButton, onClick: function () { return reuseMission(mission); } },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(InlineIcon, { name: "refresh" }),
                                    "Reuse criteria")) : null))); })))))) : null,
            activeSection === 'cv-library' ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("section", { id: "cv-library", style: __assign(__assign({}, styles.pageFrame), { order: sectionPositions['cv-library'] }) },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.pageHero },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.pageKicker }, "Curated anonymized talent"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h2", { style: styles.pageTitle }, "CV Library"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.pageLead },
                            "Results are loaded from \"",
                            webPartProps.cvListTitle,
                            "\" and each search is logged in \"",
                            webPartProps.auditListTitle,
                            "\".")),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.pageStats },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(PageStat, { value: "".concat(availableProfiles.length), label: "available CVs", styles: styles }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(PageStat, { value: isLoadingCvs ? '...' : "".concat(rankedProfiles.length), label: "matched profiles", styles: styles }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(PageStat, { value: "94%", label: "curated relevance", styles: styles }))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.pageBody },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.resultList },
                        isLoadingCvs ? react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.muted }, "Loading SharePoint CVs...") : null,
                        !isLoadingCvs && rankedProfiles.length === 0 ? react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.muted }, "No available CV matched the current search.") : null,
                        !isLoadingCvs && rankedProfiles.map(function (profile) { return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("article", { key: profile.id, style: styles.cvCard },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.cvTop },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.candidateId },
                                        "Candidate ",
                                        profile.id),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", { style: styles.cardTitle }, profile.title),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.muted }, profile.meta)),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.scoreBox },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null,
                                        profile.score,
                                        "%"),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null, "fit"))),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.profileSummary }, profile.summary),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.skillPills }, profile.skills.map(function (skill) { return react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { key: skill, style: styles.skillPill }, skill); })),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.cardActions },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { type: "button", style: styles.primaryButton }, "Request identity reveal"),
                                profile.cvUrl ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { type: "button", style: styles.secondaryButton, onClick: function () { return openCvPreview(profile); } }, "Open CV")) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { type: "button", style: styles.secondaryButton }, "Save shortlist"))))); }))))) : null,
            activeSection === 'plans' ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("section", { id: "plans", style: __assign(__assign({}, styles.pageFrame), { order: sectionPositions.plans }) },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.pageHero },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.pageKicker }, "Partner access tiers"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h2", { style: styles.pageTitle }, "Plans"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.pageLead }, "Package search quotas, controlled identity reveal, and governed audit retention into clear partner-ready tiers.")),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.pageStats },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(PageStat, { value: "3", label: "subscription tiers", styles: styles }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(PageStat, { value: "".concat(effectiveMonthlyQuota), label: "monthly quota", styles: styles }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(PageStat, { value: "SSO", label: "enterprise ready", styles: styles }))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.pageBody },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.planList }, plans.map(function (plan) { return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("article", { key: plan.name, style: plan.featured ? __assign(__assign({}, styles.plan), styles.featuredPlan) : styles.plan },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", { style: styles.planTitle }, plan.name),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.planCopy }, plan.detail),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: styles.price }, plan.price),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("ul", { style: styles.featureList }, plan.features.map(function (feature) { return react__WEBPACK_IMPORTED_MODULE_0__.createElement("li", { key: feature }, feature); })))); }))))) : null,
            activeSection === 'compliance' ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("section", { id: "compliance", style: __assign(__assign({}, styles.pageFrame), { order: sectionPositions.compliance }) },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.pageHero },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.pageKicker }, "Trust by design"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h2", { style: styles.pageTitle }, "Compliance"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.pageLead }, "Keep partners productive while preserving anonymization, auditability, and controlled reveal governance.")),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.pageStats },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(PageStat, { value: "GDPR", label: "privacy first", styles: styles }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(PageStat, { value: "Audit", label: "traceable actions", styles: styles }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(PageStat, { value: "Reveal", label: "approval gated", styles: styles }))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.pageBody },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.complianceGrid },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(WorkflowStep, { number: "G", title: "GDPR-first", text: "Names, contacts, and raw CVs stay protected by default.", styles: styles }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(WorkflowStep, { number: "A", title: "Audit trail", text: "Searches, shortlists, and reveal requests can be logged.", styles: styles }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(WorkflowStep, { number: "R", title: "Reveal control", text: "Identity release remains an explicit, reviewable workflow event.", styles: styles }))))) : null,
            activeSection === 'administration' && isAdmin ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("section", { id: "administration", style: __assign(__assign({}, styles.pageFrame), { order: sectionPositions.administration }) },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.pageHero },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.pageKicker }, "Governed operations"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h2", { style: styles.pageTitle }, "Administration"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.pageLead },
                            "Admin tools are visible only for active users declared in \"",
                            webPartProps.adminListTitle,
                            "\".")),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.pageStats },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(PageStat, { value: isCheckingAdmin ? '...' : isAdmin ? 'OK' : 'No', label: "admin access", styles: styles }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(PageStat, { value: webPartProps.cvListTitle, label: "target list", styles: styles }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(PageStat, { value: webPartProps.cvDocumentLibraryTitle, label: "source library", styles: styles }))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.pageBody },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.adminGrid },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.panel },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(FieldLabel, { label: "SharePoint CV import" }),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.muted },
                                "Scan PDF/DOCX files from \"",
                                webPartProps.cvDocumentLibraryTitle,
                                "\" and create missing anonymized entries in \"",
                                webPartProps.cvListTitle,
                                "\"."),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.workflow },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(WorkflowStep, { number: "1", title: "Scan documents", text: "Read PDF/DOCX metadata from the configured SharePoint library.", styles: styles }),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(WorkflowStep, { number: "2", title: "Infer metadata", text: "Build profile title, candidate alias, seniority, availability and skills from file metadata.", styles: styles }),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(WorkflowStep, { number: "3", title: "Fill PartnerCVs", text: "Create only missing CV records and skip existing candidate/document URLs.", styles: styles })),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { type: "button", style: styles.primaryButton, onClick: importCvDocuments, disabled: isImportingDocuments }, isImportingDocuments ? 'Importing...' : 'Parse SharePoint documents into PartnerCVs'),
                            adminStatus ? react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.statusText }, adminStatus) : null,
                            adminError ? react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.errorText }, adminError) : null),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.panel },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(FieldLabel, { label: "Current configuration" }),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.configList },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                                    "Admin list: ",
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, webPartProps.adminListTitle)),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                                    "Partner account list: ",
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, webPartProps.partnerAccountListTitle)),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                                    "Resolved partner: ",
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, effectivePartnerName)),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                                    "Partner account ID: ",
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, effectivePartnerAccountId || 'fallback properties')),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                                    "Document library: ",
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, webPartProps.cvDocumentLibraryTitle)),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                                    "Target CV list: ",
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, webPartProps.cvListTitle)),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                                    "Current user: ",
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, userEmail)),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                                    "Admin check: ",
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, isCheckingAdmin ? 'checking...' : isAdmin ? 'allowed' : 'denied')))))))) : null),
        cvPreview ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.previewOverlay, role: "dialog", "aria-modal": "true", "aria-label": "CV preview for ".concat(cvPreview.title), onClick: function () { return setCvPreview(undefined); } },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.previewDialog, onClick: function (event) { return event.stopPropagation(); } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.previewHeader },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.pageKicker }, "Secure preview"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", { style: styles.previewTitle }, cvPreview.title)),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.previewActions },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", { href: cvPreview.url, target: "_blank", rel: "noreferrer", style: styles.secondaryButton }, "Open in new tab"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { type: "button", style: styles.previewCloseButton, onClick: function () { return setCvPreview(undefined); }, "aria-label": "Close CV preview" }, "Close"))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("iframe", { src: cvPreview.url, title: "CV preview - ".concat(cvPreview.title), style: styles.previewFrame }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.previewHelp }, "If the preview remains blank, use \"Open in new tab\". Some SharePoint or Office document links can block embedded rendering.")))) : null));
}
function InlineIcon(_a) {
    var name = _a.name, _b = _a.size, size = _b === void 0 ? 20 : _b;
    var commonProps = {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
        focusable: false
    };
    switch (name) {
        case 'bank':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M3 10h18" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M5 10l7-5 7 5" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M6 10v8" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M10 10v8" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M14 10v8" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M18 10v8" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M4 18h16" }));
        case 'arrowRight':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M5 12h14" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "m13 6 6 6-6 6" }));
        case 'bell':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M18 9a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M10 21a2 2 0 0 0 4 0" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M19 4l1-1" }));
        case 'briefcase':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M10 6h4a2 2 0 0 1 2 2v2H8V8a2 2 0 0 1 2-2Z" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M4 10h16v9H4z" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M4 14h16" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M10 14v2h4v-2" }));
        case 'bookmark':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M7 4h10v16l-5-3-5 3Z" }));
        case 'brandMark':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps, { viewBox: "0 0 36 44", strokeWidth: 0, fill: "currentColor" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M20 1 34 9 17 27 9 22 23 8 18 5 5 18 1 15Z" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M16 17 30 25 13 43 5 38 19 24 14 21Z" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M23 30 35 23 35 30 24 37Z" }));
        case 'box':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "m12 3 8 4.5v9L12 21l-8-4.5v-9Z" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M12 12 4 7.5" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "m12 12 8-4.5" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M12 12v9" }));
        case 'card':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("rect", { x: "4", y: "6", width: "16", height: "12", rx: "2" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M4 10h16" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M7 15h4" }));
        case 'check':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "m6 12 4 4 8-8" }));
        case 'chevronDown':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "m7 10 5 5 5-5" }));
        case 'clock':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", { cx: "12", cy: "12", r: "8" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M12 8v5l3 2" }));
        case 'cloudUpload':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M7 18H6a4 4 0 0 1-.5-8A6 6 0 0 1 17 8.5 4.5 4.5 0 0 1 18 18h-1" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M12 18V10" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M9 13l3-3 3 3" }));
        case 'code':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M8 9 4 12l4 3" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "m16 9 4 3-4 3" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "m14 5-4 14" }));
        case 'database':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("ellipse", { cx: "12", cy: "6", rx: "7", ry: "3" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" }));
        case 'document':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M7 3h7l4 4v14H7z" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M14 3v5h5" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M9 13h6" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M9 17h5" }));
        case 'documentImage':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M7 3h7l4 4v14H7z" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M14 3v5h5" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M9 17l2.2-2.2 1.8 1.8 2.2-3 2.8 3.4" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M9 11h2" }));
        case 'gear':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", { cx: "12", cy: "12", r: "3" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 3.4-.2-.1a1.7 1.7 0 0 0-2 .1 1.7 1.7 0 0 0-.8 1.7v.2H10v-.2a1.7 1.7 0 0 0-.8-1.7 1.7 1.7 0 0 0-2-.1l-.2.1-2-3.4.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.4-1.1H3.8v-3.8H4a1.7 1.7 0 0 0 1.4-1.1 1.7 1.7 0 0 0-.3-1.9L5 7l2-3.4.2.1a1.7 1.7 0 0 0 2-.1A1.7 1.7 0 0 0 10 1.9v-.2h4v.2a1.7 1.7 0 0 0 .8 1.7 1.7 1.7 0 0 0 2 .1l.2-.1L19 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.4 1.1h.2v3.8H20a1.7 1.7 0 0 0-1.4 1.1Z" }));
        case 'globe':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", { cx: "12", cy: "12", r: "8" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M4 12h16" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M12 4a12 12 0 0 1 0 16" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M12 4a12 12 0 0 0 0 16" }));
        case 'history':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M4 12a8 8 0 1 0 2.3-5.7L4 8.5" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M4 4v4.5h4.5" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M12 8v5l3 2" }));
        case 'lightbulb':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M9 18h6" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M10 22h4" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M8 14a6 6 0 1 1 8 0c-.9.7-1.3 1.5-1.4 2.5H9.4C9.3 15.5 8.9 14.7 8 14Z" }));
        case 'lock':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("rect", { x: "6", y: "10", width: "12", height: "10", rx: "2" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M9 10V7a3 3 0 0 1 6 0v3" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M12 14v2" }));
        case 'moreVertical':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", { cx: "12", cy: "5", r: "1", fill: "currentColor", stroke: "none" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", { cx: "12", cy: "12", r: "1", fill: "currentColor", stroke: "none" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", { cx: "12", cy: "19", r: "1", fill: "currentColor", stroke: "none" }));
        case 'plus':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M12 5v14" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M5 12h14" }));
        case 'refresh':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M20 12a8 8 0 0 1-13.7 5.7" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M4 12A8 8 0 0 1 17.7 6.3" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M17 3v4h4" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M7 21v-4H3" }));
        case 'shield':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M12 3 19 6v5c0 5-3 8-7 10-4-2-7-5-7-10V6Z" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "m9 12 2 2 4-4" }));
        case 'search':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", { cx: "11", cy: "11", r: "6" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "m16 16 4 4" }));
        case 'share':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", { cx: "6", cy: "12", r: "2" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", { cx: "18", cy: "6", r: "2" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", { cx: "18", cy: "18", r: "2" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "m8 11 8-4" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "m8 13 8 4" }));
        case 'signal':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M4 18h3v-5H4z" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M10.5 18h3V9h-3z" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M17 18h3V5h-3z" }));
        case 'sparkle':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7Z" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8Z" }));
        case 'trend':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M4 17 10 11l4 4 6-8" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M15 7h5v5" }));
        case 'user':
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", { cx: "12", cy: "8", r: "3.2" }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: "M5 20a7 7 0 0 1 14 0" }));
        default:
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", __assign({}, commonProps),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", { cx: "12", cy: "12", r: "8" }));
    }
}
function FieldLabel(_a) {
    var label = _a.label;
    return react__WEBPACK_IMPORTED_MODULE_0__.createElement("label", { style: { display: 'block', fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 } }, label);
}
function PageStat(_a) {
    var value = _a.value, label = _a.label, styles = _a.styles;
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.pageStat },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, value),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null, label)));
}
function MissionStat(_a) {
    var icon = _a.icon, value = _a.value, label = _a.label, progress = _a.progress, styles = _a.styles;
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.missionStat },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.missionStatIcon },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(InlineIcon, { name: icon })),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, value),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null, label),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("i", { style: __assign(__assign({}, styles.missionStatProgress), { width: "".concat(progress, "%") }) })));
}
function Metric(_a) {
    var value = _a.value, label = _a.label, detail = _a.detail, icon = _a.icon, styles = _a.styles;
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.metric },
        icon ? react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.metricIcon },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(InlineIcon, { name: icon, size: 32 })) : null,
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.metricCopy },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, value),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null, label),
            detail ? react__WEBPACK_IMPORTED_MODULE_0__.createElement("small", null, detail) : null)));
}
function WorkflowStep(_a) {
    var number = _a.number, title = _a.title, text = _a.text, styles = _a.styles;
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.workflowStep },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null, number),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, title),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, text))));
}
function buildTemplateTokens(portalTemplate, primaryColor, secondaryColor, accentTextColor, surfaceColor) {
    var defaultHeroColumns = function (metricMinWidth, sectionGap) {
        return "minmax(0,1.3fr) minmax(".concat(metricMinWidth * 2 + sectionGap, "px,0.9fr)");
    };
    switch (portalTemplate) {
        case 'ios-liquid-glass':
            return {
                navigation: 'top',
                shellBackground: 'radial-gradient(circle at 10% 0%, rgba(255,255,255,0.95), rgba(232,248,255,0.72) 28%, transparent 45%), radial-gradient(circle at 92% 12%, rgba(76,234,255,0.62), transparent 34%), linear-gradient(145deg, #eaf7ff 0%, #f8fbff 48%, #d9f9f7 100%)',
                sidebarBackground: 'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.28))',
                sidebarTextColor: '#092f3c',
                sidebarMutedColor: 'rgba(9,47,60,0.68)',
                sidebarRadius: 34,
                sidebarShadow: '0 24px 80px rgba(10,82,110,0.16)',
                navTextColor: '#153f4d',
                navActiveBackground: 'linear-gradient(145deg, rgba(255,255,255,0.72), rgba(101,235,255,0.28))',
                navActiveTextColor: '#006b76',
                sidePanelBackground: 'linear-gradient(145deg, rgba(255,255,255,0.58), rgba(255,255,255,0.22))',
                cardBackground: 'linear-gradient(145deg, rgba(255,255,255,0.68), rgba(255,255,255,0.28))',
                panelBackground: 'linear-gradient(145deg, rgba(255,255,255,0.56), rgba(245,254,255,0.24))',
                cardBorder: '1px solid rgba(255,255,255,0.58)',
                cardShadow: '0 28px 80px rgba(8,82,112,0.15), inset 0 1px 0 rgba(255,255,255,0.7)',
                mutedTextColor: 'rgba(21,63,77,0.72)',
                fontFamily: 'SF Pro Display, SF Pro Text, Avenir Next, Aptos, Segoe UI, sans-serif',
                heroColumns: function (_metricMinWidth, _sectionGap) { return 'minmax(0,1fr) minmax(280px,0.72fr)'; },
                cardRadius: function (borderRadius) { return Math.max(28, borderRadius); }
            };
        case 'executive-partner':
            return {
                navigation: 'top',
                shellBackground: '#f7f9fb',
                sidebarBackground: '#ffffff',
                sidebarTextColor: accentTextColor,
                sidebarMutedColor: '#607078',
                sidebarRadius: 0,
                sidebarShadow: '0 10px 28px rgba(15,23,42,0.06)',
                navTextColor: accentTextColor,
                navActiveBackground: 'rgba(19,109,112,0.1)',
                navActiveTextColor: secondaryColor,
                sidePanelBackground: '#eef6f7',
                cardBackground: '#ffffff',
                panelBackground: '#f8fbfc',
                cardBorder: '1px solid rgba(16,36,46,0.1)',
                cardShadow: '0 18px 42px rgba(15,23,42,0.08)',
                mutedTextColor: '#5a6f77',
                fontFamily: 'Georgia, Aptos, Segoe UI, sans-serif',
                heroColumns: defaultHeroColumns,
                cardRadius: function (borderRadius) { return Math.max(6, borderRadius); }
            };
        case 'marketplace-talent':
            return {
                navigation: 'side',
                shellBackground: '#f3faf9',
                sidebarBackground: "linear-gradient(160deg, ".concat(secondaryColor, ", #0d3439)"),
                sidebarTextColor: '#ffffff',
                sidebarMutedColor: 'rgba(255,255,255,0.76)',
                sidebarRadius: 28,
                sidebarShadow: '0 22px 50px rgba(13,52,57,0.22)',
                navTextColor: '#ffffff',
                navActiveBackground: 'rgba(255,255,255,0.2)',
                navActiveTextColor: '#ffffff',
                sidePanelBackground: 'rgba(255,255,255,0.14)',
                cardBackground: '#ffffff',
                panelBackground: '#f0fbfb',
                cardBorder: '1px solid rgba(39,194,198,0.18)',
                cardShadow: '0 14px 30px rgba(15,23,42,0.07)',
                mutedTextColor: '#55727b',
                fontFamily: 'Aptos, Segoe UI, sans-serif',
                heroColumns: function (_metricMinWidth, _sectionGap) { return 'minmax(0,0.9fr) minmax(0,1.1fr)'; },
                cardRadius: function (borderRadius) { return Math.max(18, borderRadius); }
            };
        case 'mission-match-studio':
            return {
                navigation: 'top',
                shellBackground: "radial-gradient(circle at top left, rgba(39,194,198,0.2), transparent 34%), linear-gradient(135deg, #10242e, ".concat(secondaryColor, ")"),
                sidebarBackground: 'rgba(255,255,255,0.08)',
                sidebarTextColor: '#ffffff',
                sidebarMutedColor: 'rgba(255,255,255,0.72)',
                sidebarRadius: 26,
                sidebarShadow: 'none',
                navTextColor: '#ffffff',
                navActiveBackground: primaryColor,
                navActiveTextColor: '#ffffff',
                sidePanelBackground: 'rgba(255,255,255,0.12)',
                cardBackground: 'rgba(255,255,255,0.96)',
                panelBackground: 'rgba(255,255,255,0.88)',
                cardBorder: '1px solid rgba(255,255,255,0.34)',
                cardShadow: '0 24px 64px rgba(0,0,0,0.22)',
                mutedTextColor: '#5e7278',
                fontFamily: 'Aptos Display, Aptos, Segoe UI, sans-serif',
                heroColumns: function (_metricMinWidth, _sectionGap) { return 'minmax(0,1fr) minmax(280px,0.72fr)'; },
                cardRadius: function (borderRadius) { return Math.max(22, borderRadius); }
            };
        case 'cockpit-saas':
        default:
            return {
                navigation: 'top',
                shellBackground: surfaceColor,
                sidebarBackground: '#ffffff',
                sidebarTextColor: accentTextColor,
                sidebarMutedColor: '#5f7680',
                sidebarRadius: 0,
                sidebarShadow: '0 1px 0 rgba(16,36,46,0.08)',
                navTextColor: accentTextColor,
                navActiveBackground: 'rgba(39,194,198,0.12)',
                navActiveTextColor: secondaryColor,
                sidePanelBackground: '#eef9fa',
                cardBackground: '#ffffff',
                panelBackground: '#f5fbfc',
                cardBorder: '1px solid rgba(16,36,46,0.08)',
                cardShadow: '0 16px 34px rgba(15,23,42,0.07)',
                mutedTextColor: '#55727b',
                fontFamily: 'Aptos, Segoe UI, sans-serif',
                heroColumns: defaultHeroColumns,
                cardRadius: function (borderRadius) { return borderRadius; }
            };
    }
}
function buildStyles(options) {
    var primaryColor = options.primaryColor, secondaryColor = options.secondaryColor, accentTextColor = options.accentTextColor, surfaceColor = options.surfaceColor, webPartMaxWidth = options.webPartMaxWidth, sidebarWidth = options.sidebarWidth, minHeight = options.minHeight, contentPadding = options.contentPadding, sectionGap = options.sectionGap, cardPadding = options.cardPadding, borderRadius = options.borderRadius, metricMinWidth = options.metricMinWidth, metricMinHeight = options.metricMinHeight, titleFontSize = options.titleFontSize, bodyFontSize = options.bodyFontSize, portalTemplate = options.portalTemplate, layoutMode = options.layoutMode;
    var isDesktop = layoutMode === 'desktop';
    var isMobile = layoutMode === 'mobile';
    var compactPadding = isMobile ? Math.max(12, Math.round(contentPadding * 0.55)) : contentPadding;
    var compactCardPadding = isMobile ? Math.max(12, Math.round(cardPadding * 0.72)) : cardPadding;
    var effectiveTitleSize = isMobile ? Math.max(30, Math.round(titleFontSize * 0.7)) : layoutMode === 'tablet' ? Math.max(34, Math.round(titleFontSize * 0.82)) : titleFontSize;
    var effectiveBodySize = isMobile ? Math.max(14, bodyFontSize - 2) : bodyFontSize;
    var template = buildTemplateTokens(portalTemplate, primaryColor, secondaryColor, accentTextColor, surfaceColor);
    var usesTopNavigation = template.navigation === 'top';
    var isCockpitSaas = portalTemplate === 'cockpit-saas';
    var isLiquidGlass = portalTemplate === 'ios-liquid-glass';
    var headerPadding = isMobile ? "".concat(compactPadding, "px") : "".concat(Math.max(18, compactPadding - 4), "px ").concat(Math.max(28, compactPadding + 18), "px");
    var glassBlur = 'blur(26px) saturate(1.35)';
    return {
        shell: {
            display: 'grid',
            gridTemplateColumns: isDesktop && !usesTopNavigation ? "".concat(sidebarWidth, "px minmax(0, 1fr)") : 'minmax(0, 1fr)',
            width: '100%',
            maxWidth: webPartMaxWidth,
            minWidth: 0,
            minHeight: isMobile ? 'auto' : minHeight,
            margin: '0 auto',
            boxSizing: 'border-box',
            overflow: 'hidden',
            color: accentTextColor,
            background: template.shellBackground,
            fontFamily: template.fontFamily,
            fontSize: effectiveBodySize,
            borderRadius: isLiquidGlass ? (isMobile ? 28 : 38) : isCockpitSaas ? (isMobile ? 0 : 18) : undefined,
            border: isLiquidGlass ? '1px solid rgba(255,255,255,0.72)' : isCockpitSaas ? '1px solid rgba(16,36,46,0.08)' : undefined,
            boxShadow: isLiquidGlass ? '0 34px 110px rgba(5,54,78,0.18)' : isCockpitSaas ? '0 18px 64px rgba(15,23,42,0.08)' : undefined
        },
        sidebar: {
            background: template.sidebarBackground,
            color: template.sidebarTextColor,
            padding: isLiquidGlass ? (isMobile ? '14px' : '16px 22px') : isCockpitSaas ? headerPadding : isDesktop ? "".concat(compactPadding + 2, "px ").concat(Math.max(16, compactPadding - 8), "px") : "".concat(compactPadding, "px"),
            display: 'flex',
            flexDirection: isDesktop && !usesTopNavigation ? 'column' : 'row',
            flexWrap: isCockpitSaas && !isMobile ? 'nowrap' : 'wrap',
            gap: isLiquidGlass ? (isMobile ? 10 : 14) : isCockpitSaas ? (isMobile ? 12 : 20) : isMobile ? 14 : sectionGap,
            alignItems: isDesktop && !usesTopNavigation ? 'stretch' : 'center',
            borderRadius: template.sidebarRadius,
            boxShadow: template.sidebarShadow,
            justifyContent: isCockpitSaas || isLiquidGlass ? 'space-between' : undefined,
            border: isLiquidGlass ? '1px solid rgba(255,255,255,0.58)' : undefined,
            backdropFilter: isLiquidGlass ? glassBlur : undefined,
            WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined,
            margin: isLiquidGlass ? (isMobile ? 10 : 16) : undefined
        },
        brandBlock: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: isMobile ? 10 : 14,
            minWidth: 0,
            flex: isCockpitSaas || isLiquidGlass ? '0 0 auto' : undefined
        },
        logoMark: {
            width: isLiquidGlass ? (isMobile ? 38 : 46) : isMobile ? 34 : 42,
            height: isLiquidGlass ? (isMobile ? 38 : 46) : isMobile ? 34 : 42,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '0 0 auto',
            color: primaryColor,
            fontWeight: 900,
            fontSize: isMobile ? 18 : 22,
            borderRadius: isLiquidGlass ? 16 : undefined,
            background: isLiquidGlass ? 'linear-gradient(145deg, rgba(255,255,255,0.72), rgba(255,255,255,0.18))' : undefined,
            boxShadow: isLiquidGlass ? 'inset 0 1px 0 rgba(255,255,255,0.82), 0 10px 26px rgba(13,121,150,0.14)' : undefined
        },
        brand: {
            fontSize: isLiquidGlass ? (isMobile ? 18 : 20) : isCockpitSaas ? (isMobile ? 17 : 18) : isMobile ? 30 : 38,
            fontWeight: 800,
            textTransform: isCockpitSaas || isLiquidGlass ? 'none' : 'lowercase',
            whiteSpace: isCockpitSaas || isLiquidGlass ? 'nowrap' : undefined
        },
        brandCopy: { display: isCockpitSaas || isLiquidGlass ? 'none' : undefined, margin: '8px 0 0', lineHeight: 1.45, color: template.sidebarMutedColor, maxWidth: isDesktop && !usesTopNavigation ? 'none' : 460 },
        nav: {
            display: 'flex',
            flexDirection: isDesktop && !usesTopNavigation ? 'column' : 'row',
            flexWrap: isLiquidGlass ? 'nowrap' : 'wrap',
            gap: isLiquidGlass ? 6 : isCockpitSaas ? 10 : 8,
            flex: isLiquidGlass ? '1 1 auto' : isCockpitSaas ? '1 1 0' : isDesktop && !usesTopNavigation ? '0 0 auto' : '1 1 420px',
            justifyContent: isCockpitSaas || isLiquidGlass ? 'center' : undefined,
            alignItems: 'center',
            overflowX: isLiquidGlass ? 'auto' : undefined,
            WebkitOverflowScrolling: isLiquidGlass ? 'touch' : undefined,
            padding: isLiquidGlass ? '3px' : undefined,
            borderRadius: isLiquidGlass ? 999 : undefined,
            background: isLiquidGlass ? 'rgba(255,255,255,0.2)' : undefined
        },
        navItem: {
            padding: isLiquidGlass ? (isMobile ? '10px 13px' : '11px 16px') : isCockpitSaas ? (isMobile ? '10px 12px' : '13px 18px') : isMobile ? '10px 12px' : '13px 14px',
            border: 'none',
            borderRadius: isLiquidGlass ? 999 : isCockpitSaas ? 11 : borderRadius,
            background: 'transparent',
            color: template.navTextColor,
            cursor: 'pointer',
            font: 'inherit',
            fontWeight: 700,
            textAlign: 'left',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            whiteSpace: 'nowrap',
            boxShadow: isLiquidGlass ? 'inset 0 1px 0 rgba(255,255,255,0.36)' : undefined
        },
        navItemActive: { background: template.navActiveBackground, color: template.navActiveTextColor, boxShadow: isLiquidGlass ? '0 10px 28px rgba(0,125,150,0.14), inset 0 1px 0 rgba(255,255,255,0.8)' : undefined },
        navGlyph: {
            width: 22,
            height: 22,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 6,
            border: '1px solid currentColor',
            fontSize: 10,
            fontWeight: 900,
            lineHeight: 1
        },
        headerActions: {
            display: isCockpitSaas || isLiquidGlass ? 'inline-flex' : 'none',
            alignItems: 'center',
            gap: 13,
            flex: '0 0 auto',
            color: isLiquidGlass ? '#143947' : accentTextColor
        },
        headerIcon: {
            width: 28,
            height: 28,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 999,
            border: isLiquidGlass ? '1px solid rgba(255,255,255,0.58)' : '1px solid rgba(16,36,46,0.12)',
            background: isLiquidGlass ? 'rgba(255,255,255,0.42)' : undefined,
            color: secondaryColor,
            fontWeight: 900
        },
        avatarBadge: {
            width: 36,
            height: 36,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 999,
            background: "linear-gradient(145deg, ".concat(primaryColor, ", ").concat(secondaryColor, ")"),
            color: '#ffffff',
            fontWeight: 800
        },
        chevron: { fontSize: 14, color: '#49646e', fontWeight: 800 },
        sidePanel: { marginTop: isDesktop && !usesTopNavigation ? 'auto' : 0, padding: compactCardPadding, borderRadius: isLiquidGlass ? 24 : borderRadius, background: template.sidePanelBackground, display: 'grid', gap: 8, flex: isDesktop && !usesTopNavigation ? '0 0 auto' : '1 1 280px', border: isLiquidGlass ? template.cardBorder : undefined, backdropFilter: isLiquidGlass ? glassBlur : undefined, WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined },
        sidePanelHidden: { display: 'none' },
        content: { padding: isLiquidGlass ? (isMobile ? '0 10px 14px' : '0 16px 18px') : isCockpitSaas ? 0 : compactPadding, display: 'grid', gap: sectionGap, minWidth: 0 },
        overview: {
            position: 'relative',
            display: 'grid',
            minWidth: 0,
            overflow: 'hidden',
            background: isLiquidGlass ? 'transparent' : '#eef7fb',
            scrollMarginTop: sectionGap,
            borderRadius: isLiquidGlass ? template.cardRadius(borderRadius) : undefined
        },
        overviewBackdrop: {
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: isDesktop ? 'minmax(0,1fr) minmax(330px,0.78fr)' : 'minmax(0,1fr)',
            gap: isMobile ? 26 : 42,
            alignItems: 'center',
            padding: isLiquidGlass ? (isMobile ? '54px 24px 92px' : '70px 72px 118px') : isMobile ? '44px 24px 86px' : '58px 72px 112px',
            minHeight: isMobile ? 420 : 390,
            background: isLiquidGlass
                ? "radial-gradient(circle at 82% 18%, rgba(255,255,255,0.72), transparent 22%), radial-gradient(circle at 78% 54%, rgba(87,239,231,0.5), transparent 34%), linear-gradient(135deg, rgba(4,56,74,0.92), rgba(0,130,146,0.72) 54%, rgba(155,249,255,0.62))"
                : "radial-gradient(circle at 88% 42%, rgba(72,255,238,0.78), transparent 28%), radial-gradient(circle at 54% 88%, rgba(39,194,198,0.35), transparent 30%), linear-gradient(118deg, #063641 0%, #006d77 48%, ".concat(primaryColor, " 100%)"),
            color: '#ffffff',
            overflow: 'hidden',
            borderRadius: isLiquidGlass ? template.cardRadius(borderRadius) : undefined,
            border: isLiquidGlass ? '1px solid rgba(255,255,255,0.42)' : undefined
        },
        overviewHeroCopy: { position: 'relative', zIndex: 1, maxWidth: 650 },
        overviewKicker: {
            display: 'inline-block',
            color: '#5df7f0',
            fontSize: isMobile ? 12 : 15,
            lineHeight: 1.5,
            letterSpacing: 3.2,
            textTransform: 'uppercase',
            fontWeight: 800
        },
        overviewHeadline: {
            margin: isMobile ? '24px 0 18px' : '28px 0 20px',
            fontSize: isMobile ? 44 : 58,
            lineHeight: 1.08,
            fontWeight: 900,
            letterSpacing: -1.5,
            textShadow: '0 8px 22px rgba(0,0,0,0.28)'
        },
        overviewLead: {
            margin: 0,
            fontSize: isMobile ? 18 : 20,
            lineHeight: 1.52,
            color: 'rgba(255,255,255,0.9)'
        },
        overviewStatusCard: {
            position: 'relative',
            zIndex: 1,
            justifySelf: isDesktop ? 'end' : 'stretch',
            width: isDesktop ? 480 : 'auto',
            maxWidth: '100%',
            padding: isMobile ? 26 : 34,
            borderRadius: isLiquidGlass ? 30 : 16,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.24), rgba(255,255,255,0.08))',
            border: isLiquidGlass ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.36)',
            boxShadow: isLiquidGlass ? '0 24px 70px rgba(0,62,73,0.18), inset 0 1px 0 rgba(255,255,255,0.56)' : '0 24px 56px rgba(0,62,73,0.24)',
            backdropFilter: isLiquidGlass ? glassBlur : 'blur(12px)',
            WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined,
            display: 'grid',
            gap: 26
        },
        statusHeader: { display: 'grid', gridTemplateColumns: '58px minmax(0,1fr)', gap: 18, alignItems: 'center' },
        statusCopy: { display: 'grid', gap: 24, minWidth: 0 },
        statusIcon: {
            width: 58,
            height: 58,
            borderRadius: 999,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: "linear-gradient(145deg, ".concat(primaryColor, ", #57efe7)"),
            fontWeight: 900,
            color: '#ffffff',
            boxShadow: '0 12px 26px rgba(0,0,0,0.18)'
        },
        quotaRow: {
            display: 'grid',
            gridTemplateColumns: '68px minmax(0,1fr)',
            gap: 18,
            alignItems: 'center',
            paddingTop: 22,
            borderTop: '1px solid rgba(255,255,255,0.18)'
        },
        quotaCopy: { display: 'grid', gap: 6, minWidth: 0 },
        quotaRing: {
            width: 56,
            height: 56,
            borderRadius: 999,
            border: '10px solid rgba(255,255,255,0.35)',
            borderLeftColor: '#61fff0',
            borderBottomColor: '#61fff0',
            display: 'inline-block'
        },
        overviewCard: {
            position: 'relative',
            zIndex: 2,
            margin: isLiquidGlass ? (isMobile ? '-56px 14px 20px' : '-66px 34px 28px') : isMobile ? '-56px 18px 24px' : '-66px 50px 34px',
            padding: isMobile ? 24 : 40,
            borderRadius: isLiquidGlass ? 34 : 14,
            background: isLiquidGlass ? template.cardBackground : '#ffffff',
            boxShadow: isLiquidGlass ? template.cardShadow : '0 26px 70px rgba(15,23,42,0.14)',
            border: isLiquidGlass ? template.cardBorder : undefined,
            backdropFilter: isLiquidGlass ? glassBlur : undefined,
            WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined,
            minWidth: 0
        },
        overviewCardTop: {
            display: 'grid',
            gridTemplateColumns: isDesktop ? 'minmax(0,0.82fr) minmax(320px,0.72fr)' : 'minmax(0,1fr)',
            gap: isMobile ? 28 : 38,
            alignItems: 'center'
        },
        overviewCardCopy: { minWidth: 0, maxWidth: 650 },
        overviewTitle: {
            margin: '12px 0 18px',
            fontSize: isMobile ? 46 : 68,
            lineHeight: 0.98,
            fontWeight: 900,
            letterSpacing: -2.4,
            color: '#062838',
            textShadow: '0 8px 18px rgba(4,38,52,0.12)'
        },
        overviewBody: {
            margin: 0,
            color: '#39556b',
            lineHeight: 1.48,
            fontSize: isMobile ? 17 : 18,
            maxWidth: 560
        },
        buttonIcon: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 22,
            height: 22,
            borderRadius: 999,
            border: '1px solid currentColor',
            fontSize: 12,
            lineHeight: 1,
            fontWeight: 900
        },
        buttonArrow: { marginLeft: 8, fontWeight: 900 },
        matchIllustration: {
            position: 'relative',
            minHeight: isMobile ? 230 : 300,
            display: isMobile ? 'none' : 'block'
        },
        radarCircleOuter: {
            position: 'absolute',
            top: 10,
            left: '50%',
            width: 260,
            height: 260,
            marginLeft: -130,
            borderRadius: 999,
            border: '1px solid rgba(39,194,198,0.22)',
            background: 'radial-gradient(circle, rgba(39,194,198,0.16), rgba(39,194,198,0.03) 58%, transparent 60%)'
        },
        radarCircleInner: {
            position: 'absolute',
            top: 62,
            left: '50%',
            width: 156,
            height: 156,
            marginLeft: -78,
            borderRadius: 999,
            border: '1px dashed rgba(39,194,198,0.35)'
        },
        radarCrossHorizontal: {
            position: 'absolute',
            top: 140,
            left: '50%',
            width: 270,
            height: 1,
            marginLeft: -135,
            background: 'rgba(39,194,198,0.16)'
        },
        radarCrossVertical: {
            position: 'absolute',
            top: 10,
            left: '50%',
            width: 1,
            height: 260,
            background: 'rgba(39,194,198,0.16)'
        },
        matchCheck: {
            position: 'absolute',
            top: 112,
            left: '50%',
            width: 54,
            height: 54,
            marginLeft: -27,
            borderRadius: 999,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: "linear-gradient(145deg, ".concat(primaryColor, ", ").concat(secondaryColor, ")"),
            color: '#ffffff',
            fontWeight: 900,
            boxShadow: '0 18px 30px rgba(0,116,124,0.24)'
        },
        profileChip: {
            position: 'absolute',
            width: 190,
            minHeight: 54,
            display: 'grid',
            gridTemplateColumns: '36px minmax(0,1fr)',
            gap: 12,
            alignItems: 'center',
            padding: 12,
            borderRadius: 8,
            background: '#ffffff',
            border: '1px solid rgba(16,36,46,0.09)',
            boxShadow: '0 16px 38px rgba(15,23,42,0.12)'
        },
        profileChipLeft: { left: 0, top: 128 },
        profileChipRight: { right: 0, top: 58 },
        chipAvatar: {
            width: 34,
            height: 34,
            borderRadius: 999,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: "linear-gradient(145deg, ".concat(primaryColor, ", ").concat(secondaryColor, ")"),
            color: '#ffffff',
            fontWeight: 900
        },
        chipLines: { display: 'grid', gap: 8 },
        chipLineLong: { display: 'block', height: 7, borderRadius: 999, background: 'rgba(16,36,46,0.14)' },
        chipLineShort: { display: 'block', width: '72%', height: 7, borderRadius: 999, background: 'rgba(16,36,46,0.1)' },
        overviewDivider: { height: 1, background: 'rgba(16,36,46,0.12)', margin: isMobile ? '24px 0' : '30px 0 24px' },
        overviewMetrics: {
            display: 'grid',
            gridTemplateColumns: isDesktop ? 'repeat(3,minmax(0,1fr))' : 'minmax(0,1fr)',
            gap: 24
        },
        hero: { display: 'grid', gridTemplateColumns: isDesktop ? template.heroColumns(metricMinWidth, sectionGap) : 'minmax(0,1fr)', gap: sectionGap, padding: compactCardPadding, background: template.cardBackground, borderRadius: template.cardRadius(borderRadius), boxShadow: template.cardShadow, border: template.cardBorder, scrollMarginTop: sectionGap, minWidth: 0, backdropFilter: isLiquidGlass ? glassBlur : undefined, WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined },
        eyebrow: { display: 'inline-block', color: secondaryColor, fontWeight: 800, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
        title: { margin: '14px 0 12px', fontSize: effectiveTitleSize, lineHeight: 1.05, fontWeight: 800, overflowWrap: 'anywhere' },
        lead: { margin: 0, color: '#55727b', fontSize: effectiveBodySize, lineHeight: 1.55 },
        heroActions: { display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 },
        primaryButton: { border: isLiquidGlass ? '1px solid rgba(255,255,255,0.42)' : 'none', background: "linear-gradient(135deg, ".concat(primaryColor, ", ").concat(secondaryColor, ")"), color: '#fff', padding: '12px 18px', borderRadius: isLiquidGlass ? 999 : borderRadius, fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: isLiquidGlass ? '0 16px 34px rgba(0,113,133,0.22), inset 0 1px 0 rgba(255,255,255,0.34)' : undefined },
        secondaryButton: { border: isLiquidGlass ? '1px solid rgba(255,255,255,0.58)' : '1px solid rgba(16,36,46,0.14)', background: isLiquidGlass ? 'rgba(255,255,255,0.45)' : '#fff', color: accentTextColor, padding: '12px 18px', borderRadius: isLiquidGlass ? 999 : borderRadius, fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, backdropFilter: isLiquidGlass ? glassBlur : undefined, WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined },
        compactButton: { border: 'none', background: secondaryColor, color: '#fff', padding: '12px 14px', borderRadius: isLiquidGlass ? 999 : borderRadius, fontWeight: 800, cursor: 'pointer' },
        statsGrid: { display: 'grid', gridTemplateColumns: "repeat(auto-fit,minmax(".concat(metricMinWidth, "px,1fr))"), gap: 10, minWidth: 0 },
        metric: {
            background: isLiquidGlass ? 'linear-gradient(145deg, rgba(255,255,255,0.62), rgba(255,255,255,0.22))' : '#f8fdff',
            border: isLiquidGlass ? template.cardBorder : '1px solid rgba(39,194,198,0.18)',
            borderRadius: isLiquidGlass ? 26 : borderRadius,
            padding: compactCardPadding,
            minHeight: metricMinHeight,
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            minWidth: 0,
            overflowWrap: 'anywhere',
            boxShadow: isLiquidGlass ? '0 18px 44px rgba(8,82,112,0.1), inset 0 1px 0 rgba(255,255,255,0.62)' : '0 14px 30px rgba(15,23,42,0.04)',
            backdropFilter: isLiquidGlass ? glassBlur : undefined,
            WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined
        },
        metricIcon: {
            width: 76,
            height: 76,
            borderRadius: 999,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '0 0 auto',
            background: "linear-gradient(145deg, ".concat(primaryColor, ", ").concat(secondaryColor, ")"),
            color: '#ffffff',
            fontWeight: 900,
            fontSize: 24,
            boxShadow: '0 14px 26px rgba(0,116,124,0.18)'
        },
        metricCopy: { display: 'grid', gap: 4, minWidth: 0 },
        missionFrame: {
            position: 'relative',
            display: 'grid',
            minWidth: 0,
            overflow: 'hidden',
            background: isLiquidGlass ? 'transparent' : '#eef7fb',
            borderRadius: isLiquidGlass ? template.cardRadius(borderRadius) : isCockpitSaas ? 0 : template.cardRadius(borderRadius),
            scrollMarginTop: sectionGap
        },
        missionHero: {
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: isDesktop ? 'minmax(0,0.86fr) minmax(520px,1fr)' : 'minmax(0,1fr)',
            gridTemplateRows: isDesktop ? 'auto 1fr' : undefined,
            gap: isMobile ? 22 : 26,
            alignItems: 'center',
            padding: isLiquidGlass ? (isMobile ? '50px 24px 94px' : '76px 70px 128px') : isMobile ? '42px 24px 88px' : '70px 70px 124px',
            minHeight: isMobile ? 520 : 390,
            color: '#ffffff',
            background: isLiquidGlass
                ? "radial-gradient(circle at 86% 16%, rgba(255,255,255,0.68), transparent 20%), radial-gradient(circle at 76% 60%, rgba(99,255,235,0.58), transparent 34%), linear-gradient(118deg, rgba(6,44,67,0.96), rgba(0,106,132,0.78) 48%, rgba(92,244,234,0.7))"
                : "radial-gradient(circle at 92% 18%, rgba(99,255,235,0.78), transparent 30%), radial-gradient(circle at 70% 100%, rgba(39,194,198,0.38), transparent 34%), linear-gradient(116deg, #073545 0%, #006b7b 48%, ".concat(primaryColor, " 100%)"),
            overflow: 'hidden',
            borderRadius: isLiquidGlass ? template.cardRadius(borderRadius) : undefined,
            border: isLiquidGlass ? '1px solid rgba(255,255,255,0.42)' : undefined
        },
        missionHeroCopy: { position: 'relative', zIndex: 1, alignSelf: 'center' },
        missionKicker: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            color: '#63fff4',
            fontSize: isMobile ? 12 : 15,
            lineHeight: 1.4,
            letterSpacing: 4,
            textTransform: 'uppercase',
            fontWeight: 900
        },
        missionTitle: {
            margin: isMobile ? '20px 0 14px' : '24px 0 18px',
            fontSize: isMobile ? 52 : 72,
            lineHeight: 0.96,
            fontWeight: 900,
            letterSpacing: -2.4,
            textShadow: '0 10px 24px rgba(0,0,0,0.28)'
        },
        missionLead: {
            margin: 0,
            maxWidth: 680,
            fontSize: isMobile ? 18 : 21,
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.94)'
        },
        missionHeroActions: {
            position: 'relative',
            zIndex: 1,
            alignSelf: 'start',
            justifySelf: isDesktop ? 'end' : 'start',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16
        },
        missionGhostButton: {
            minWidth: 170,
            minHeight: 50,
            borderRadius: isLiquidGlass ? 999 : 10,
            border: '1px solid rgba(255,255,255,0.56)',
            background: isLiquidGlass ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.08)',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            fontWeight: 900,
            fontSize: 16,
            boxShadow: isLiquidGlass ? '0 18px 48px rgba(0,70,82,0.16), inset 0 1px 0 rgba(255,255,255,0.42)' : '0 18px 38px rgba(0,70,82,0.18)',
            backdropFilter: isLiquidGlass ? glassBlur : 'blur(10px)',
            WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined
        },
        missionStats: {
            position: 'relative',
            zIndex: 1,
            gridColumn: isDesktop ? '2' : undefined,
            display: 'grid',
            gridTemplateColumns: isMobile ? 'minmax(0,1fr)' : 'repeat(3,minmax(0,1fr))',
            gap: isMobile ? 14 : 20
        },
        missionStat: {
            minHeight: isMobile ? 150 : 180,
            padding: isMobile ? 20 : 24,
            borderRadius: isLiquidGlass ? 28 : 16,
            border: isLiquidGlass ? '1px solid rgba(255,255,255,0.52)' : '1px solid rgba(255,255,255,0.34)',
            background: isLiquidGlass ? 'linear-gradient(145deg, rgba(255,255,255,0.34), rgba(255,255,255,0.12))' : 'linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.07))',
            boxShadow: isLiquidGlass ? '0 24px 58px rgba(0,68,78,0.16), inset 0 1px 0 rgba(255,255,255,0.5)' : '0 20px 46px rgba(0,68,78,0.2)',
            display: 'grid',
            alignContent: 'space-between',
            gap: 10,
            backdropFilter: isLiquidGlass ? glassBlur : 'blur(12px)',
            WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined,
            minWidth: 0
        },
        missionStatIcon: {
            width: 52,
            height: 52,
            borderRadius: 12,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.16)',
            color: '#ffffff',
            fontWeight: 900,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)'
        },
        missionStatProgress: {
            display: 'block',
            height: 4,
            borderRadius: 999,
            background: '#69fff1',
            boxShadow: '80px 0 0 rgba(255,255,255,0.14)'
        },
        missionWorkbench: {
            position: 'relative',
            zIndex: 2,
            margin: isLiquidGlass ? (isMobile ? '-52px 12px 22px' : '-62px 34px 30px') : isMobile ? '-52px 16px 24px' : '-62px 54px 34px',
            padding: isMobile ? 16 : 18,
            borderRadius: isLiquidGlass ? 34 : 18,
            background: isLiquidGlass ? 'linear-gradient(145deg, rgba(255,255,255,0.58), rgba(255,255,255,0.22))' : '#ffffff',
            display: 'grid',
            gridTemplateColumns: isDesktop ? 'minmax(0,0.92fr) minmax(0,1fr)' : 'minmax(0,1fr)',
            gap: isMobile ? 18 : 22,
            boxShadow: isLiquidGlass ? '0 32px 92px rgba(7,75,104,0.18), inset 0 1px 0 rgba(255,255,255,0.62)' : '0 28px 76px rgba(15,23,42,0.16)',
            border: isLiquidGlass ? template.cardBorder : undefined,
            backdropFilter: isLiquidGlass ? glassBlur : undefined,
            WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined,
            minWidth: 0
        },
        missionComposer: {
            borderRadius: isLiquidGlass ? 28 : 16,
            padding: isMobile ? 18 : 22,
            background: isLiquidGlass ? 'linear-gradient(145deg, rgba(255,255,255,0.56), rgba(255,255,255,0.22))' : '#ffffff',
            border: isLiquidGlass ? template.cardBorder : '1px solid rgba(16,36,46,0.08)',
            boxShadow: isLiquidGlass ? '0 20px 54px rgba(8,82,112,0.11), inset 0 1px 0 rgba(255,255,255,0.58)' : '0 16px 42px rgba(15,23,42,0.06)',
            display: 'grid',
            gap: 16,
            backdropFilter: isLiquidGlass ? glassBlur : undefined,
            WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined,
            minWidth: 0
        },
        missionHistoryPanel: {
            borderRadius: isLiquidGlass ? 28 : 16,
            padding: isMobile ? 18 : 22,
            background: isLiquidGlass ? 'linear-gradient(145deg, rgba(255,255,255,0.56), rgba(255,255,255,0.22))' : '#ffffff',
            border: isLiquidGlass ? template.cardBorder : '1px solid rgba(16,36,46,0.08)',
            boxShadow: isLiquidGlass ? '0 20px 54px rgba(8,82,112,0.11), inset 0 1px 0 rgba(255,255,255,0.58)' : '0 16px 42px rgba(15,23,42,0.06)',
            display: 'grid',
            gap: 14,
            alignContent: 'start',
            backdropFilter: isLiquidGlass ? glassBlur : undefined,
            WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined,
            minWidth: 0
        },
        missionPanelHeader: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '44px minmax(0,1fr)' : '44px minmax(0,1fr) auto',
            gap: 14,
            alignItems: 'center',
            minWidth: 0
        },
        missionPanelIcon: {
            width: 44,
            height: 44,
            borderRadius: 10,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: "linear-gradient(145deg, ".concat(primaryColor, ", ").concat(secondaryColor, ")"),
            color: '#ffffff',
            fontWeight: 900,
            boxShadow: '0 12px 24px rgba(0,116,124,0.2)'
        },
        missionPanelTitle: { margin: 0, color: '#10242e', fontSize: isMobile ? 20 : 22, lineHeight: 1.15, fontWeight: 900 },
        missionPanelKicker: { display: 'block', marginTop: 4, color: '#4b6170', fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 900 },
        aiPill: {
            border: '1px solid rgba(39,194,198,0.28)',
            background: isLiquidGlass ? 'rgba(255,255,255,0.48)' : '#ffffff',
            color: secondaryColor,
            borderRadius: 999,
            padding: '10px 18px',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            backdropFilter: isLiquidGlass ? glassBlur : undefined,
            WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined
        },
        missionTextareaWrap: { position: 'relative', minWidth: 0 },
        missionTextarea: {
            width: '100%',
            minHeight: isMobile ? 160 : 176,
            resize: 'vertical',
            borderRadius: isLiquidGlass ? 22 : 10,
            border: isLiquidGlass ? '1px solid rgba(255,255,255,0.58)' : '1px solid rgba(16,36,46,0.14)',
            background: isLiquidGlass ? 'rgba(255,255,255,0.46)' : '#ffffff',
            padding: isMobile ? '18px' : '26px 22px',
            font: 'inherit',
            fontSize: isMobile ? 16 : 17,
            color: accentTextColor,
            boxSizing: 'border-box',
            boxShadow: isLiquidGlass ? 'inset 0 1px 0 rgba(255,255,255,0.64), 0 12px 30px rgba(8,82,112,0.08)' : 'inset 0 1px 0 rgba(16,36,46,0.03)',
            backdropFilter: isLiquidGlass ? glassBlur : undefined,
            WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined
        },
        textareaHint: {
            position: 'absolute',
            right: 54,
            bottom: 22,
            width: 22,
            height: 22,
            borderRadius: 999,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#57707a',
            border: '1px solid rgba(16,36,46,0.2)',
            fontWeight: 900
        },
        grammarBadge: {
            position: 'absolute',
            right: 24,
            bottom: 18,
            width: 34,
            height: 34,
            borderRadius: isLiquidGlass ? 20 : 10,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0b8b77',
            border: '3px solid rgba(11,139,119,0.28)',
            fontWeight: 900,
            background: isLiquidGlass ? 'rgba(255,255,255,0.56)' : '#ffffff',
            backdropFilter: isLiquidGlass ? glassBlur : undefined,
            WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined
        },
        dropZone: {
            display: 'grid',
            gridTemplateColumns: '54px minmax(0,1fr)',
            gap: 14,
            alignItems: 'center',
            padding: isMobile ? 18 : 22,
            borderRadius: isLiquidGlass ? 24 : 10,
            border: isLiquidGlass ? '1px dashed rgba(255,255,255,0.74)' : '1px dashed rgba(39,194,198,0.56)',
            background: isLiquidGlass ? 'linear-gradient(145deg, rgba(255,255,255,0.42), rgba(236,253,255,0.18))' : 'linear-gradient(135deg, rgba(39,194,198,0.06), rgba(255,255,255,0.9))',
            color: accentTextColor,
            cursor: 'pointer',
            boxShadow: isLiquidGlass ? 'inset 0 1px 0 rgba(255,255,255,0.58)' : undefined,
            backdropFilter: isLiquidGlass ? glassBlur : undefined,
            WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined
        },
        dropZoneBusy: { opacity: 0.64, cursor: 'wait' },
        hiddenInput: { display: 'none' },
        dropIcon: {
            width: 44,
            height: 44,
            borderRadius: 999,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: primaryColor,
            border: '3px solid rgba(39,194,198,0.36)',
            fontWeight: 900
        },
        extractedSkills: { display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12 },
        extractedSkill: {
            border: isLiquidGlass ? '1px solid rgba(255,255,255,0.58)' : 'none',
            borderRadius: isLiquidGlass ? 999 : 9,
            background: isLiquidGlass ? 'rgba(255,255,255,0.46)' : '#eaf8fb',
            color: secondaryColor,
            padding: '10px 16px',
            cursor: 'pointer',
            display: 'inline-flex',
            gap: 9,
            alignItems: 'center',
            fontWeight: 900,
            backdropFilter: isLiquidGlass ? glassBlur : undefined,
            WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined
        },
        missionActionRow: { display: 'grid', gridTemplateColumns: isMobile ? 'minmax(0,1fr)' : 'minmax(0,0.84fr) minmax(0,1fr)', gap: 14 },
        extractButton: {
            minHeight: 54,
            borderRadius: isLiquidGlass ? 999 : 10,
            border: isLiquidGlass ? '1px solid rgba(255,255,255,0.58)' : '1px solid rgba(16,36,46,0.14)',
            background: isLiquidGlass ? 'rgba(255,255,255,0.48)' : '#ffffff',
            color: '#39556b',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            fontSize: 17,
            fontWeight: 900,
            backdropFilter: isLiquidGlass ? glassBlur : undefined,
            WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined
        },
        launchButton: {
            minHeight: 54,
            borderRadius: isLiquidGlass ? 999 : 10,
            border: isLiquidGlass ? '1px solid rgba(255,255,255,0.42)' : 'none',
            background: "linear-gradient(135deg, ".concat(primaryColor, ", ").concat(secondaryColor, ")"),
            color: '#ffffff',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            fontSize: 17,
            fontWeight: 900,
            boxShadow: isLiquidGlass ? '0 18px 44px rgba(0,116,124,0.2), inset 0 1px 0 rgba(255,255,255,0.34)' : '0 16px 28px rgba(0,116,124,0.18)'
        },
        missionFilters: { display: 'grid', gridTemplateColumns: isDesktop ? 'minmax(0,1fr) auto minmax(150px,0.5fr) minmax(160px,0.5fr)' : 'minmax(0,1fr)', gap: 10 },
        missionSkillInput: { border: isLiquidGlass ? '1px solid rgba(255,255,255,0.58)' : '1px solid rgba(16,36,46,0.14)', borderRadius: isLiquidGlass ? 18 : 10, padding: 12, font: 'inherit', width: '100%', minWidth: 0, boxSizing: 'border-box', background: isLiquidGlass ? 'rgba(255,255,255,0.48)' : undefined, backdropFilter: isLiquidGlass ? glassBlur : undefined, WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined },
        missionSelect: { border: isLiquidGlass ? '1px solid rgba(255,255,255,0.58)' : '1px solid rgba(16,36,46,0.14)', borderRadius: isLiquidGlass ? 18 : 10, padding: 12, font: 'inherit', width: '100%', minWidth: 0, boxSizing: 'border-box', background: isLiquidGlass ? 'rgba(255,255,255,0.52)' : '#ffffff', backdropFilter: isLiquidGlass ? glassBlur : undefined, WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined },
        criteriaList: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 },
        criteriaPill: {
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: 999,
            padding: '8px 11px',
            background: 'rgba(39,194,198,0.12)',
            color: secondaryColor,
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: '0.03em'
        },
        editingBadge: {
            marginLeft: 'auto',
            borderRadius: 999,
            padding: '8px 12px',
            background: 'rgba(39,194,198,0.12)',
            color: secondaryColor,
            fontSize: 12,
            fontWeight: 900,
            whiteSpace: 'nowrap'
        },
        disabledButton: { opacity: 0.58, cursor: 'not-allowed', boxShadow: 'none' },
        viewAllButton: { border: 'none', background: 'transparent', color: secondaryColor, cursor: 'pointer', fontWeight: 900 },
        missionHistoryList: { display: 'grid', gap: 14 },
        historyCard: {
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: '58px minmax(0,1fr)',
            gap: 16,
            padding: isMobile ? 16 : 20,
            borderRadius: isLiquidGlass ? 24 : 12,
            border: isLiquidGlass ? template.cardBorder : '1px solid rgba(16,36,46,0.08)',
            background: isLiquidGlass ? 'linear-gradient(145deg, rgba(255,255,255,0.6), rgba(255,255,255,0.26))' : '#ffffff',
            boxShadow: isLiquidGlass ? '0 18px 44px rgba(8,82,112,0.1), inset 0 1px 0 rgba(255,255,255,0.58)' : '0 12px 30px rgba(15,23,42,0.08)',
            backdropFilter: isLiquidGlass ? glassBlur : undefined,
            WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined,
            minWidth: 0
        },
        historyCardFeatured: {
            border: isLiquidGlass ? '1px solid rgba(255,255,255,0.72)' : '1px solid rgba(39,194,198,0.56)',
            background: isLiquidGlass ? 'linear-gradient(145deg, rgba(224,255,255,0.72), rgba(255,255,255,0.3))' : 'linear-gradient(135deg, rgba(39,194,198,0.1), #ffffff 68%)'
        },
        historyIcon: {
            width: 58,
            height: 58,
            borderRadius: 999,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isLiquidGlass ? 'linear-gradient(145deg, rgba(255,255,255,0.72), rgba(101,235,255,0.28))' : '#dff8fa',
            color: secondaryColor,
            fontWeight: 900,
            fontSize: 18
        },
        historyContent: { display: 'grid', gap: 10, minWidth: 0 },
        historyTop: { display: 'flex', justifyContent: 'space-between', gap: 12, minWidth: 0 },
        historyTitle: { margin: 0, color: accentTextColor, fontSize: isMobile ? 17 : 18, lineHeight: 1.2, fontWeight: 900 },
        historyMeta: { margin: '6px 0 0', color: '#506775', fontSize: 13 },
        historyMenuWrap: { position: 'relative', flex: '0 0 auto' },
        historyMenuButton: {
            border: 'none',
            borderRadius: 999,
            background: 'rgba(16,36,46,0.06)',
            color: '#4b6170',
            cursor: 'pointer',
            fontWeight: 900,
            letterSpacing: 2,
            width: 34,
            height: 34,
            lineHeight: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        historyMenuPanel: {
            position: 'absolute',
            right: 0,
            top: 40,
            zIndex: 20,
            width: 178,
            display: 'grid',
            gap: 4,
            padding: 8,
            borderRadius: 12,
            border: '1px solid rgba(16,36,46,0.12)',
            background: isLiquidGlass ? 'rgba(255,255,255,0.72)' : '#ffffff',
            boxShadow: '0 18px 34px rgba(15,23,42,0.16)',
            backdropFilter: isLiquidGlass ? glassBlur : undefined,
            WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined
        },
        historyMenuAction: {
            border: 'none',
            borderRadius: 9,
            background: 'transparent',
            color: accentTextColor,
            padding: '10px 12px',
            textAlign: 'left',
            cursor: 'pointer',
            fontWeight: 800
        },
        historyMenuDanger: { color: '#b42318' },
        historyBottom: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },
        historyCriteria: { margin: 0, color: '#415867', lineHeight: 1.45, fontSize: 14 },
        reuseButton: {
            justifySelf: 'end',
            border: 'none',
            borderRadius: 9,
            background: "linear-gradient(135deg, ".concat(primaryColor, ", ").concat(secondaryColor, ")"),
            color: '#ffffff',
            padding: '12px 18px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            fontWeight: 900
        },
        pageFrame: {
            position: 'relative',
            display: 'grid',
            minWidth: 0,
            overflow: 'hidden',
            background: isLiquidGlass ? 'transparent' : '#eef7fb',
            borderRadius: isLiquidGlass ? template.cardRadius(borderRadius) : isCockpitSaas ? 0 : template.cardRadius(borderRadius),
            scrollMarginTop: sectionGap
        },
        pageHero: {
            display: 'grid',
            gridTemplateColumns: isDesktop ? 'minmax(0,0.95fr) minmax(360px,0.72fr)' : 'minmax(0,1fr)',
            gap: isMobile ? 22 : 34,
            alignItems: 'center',
            padding: isLiquidGlass ? (isMobile ? '42px 22px 72px' : '56px 60px 92px') : isMobile ? '34px 22px 70px' : '46px 60px 86px',
            background: isLiquidGlass
                ? "radial-gradient(circle at 88% 20%, rgba(255,255,255,0.68), transparent 22%), radial-gradient(circle at 78% 48%, rgba(72,255,238,0.52), transparent 30%), linear-gradient(118deg, rgba(7,53,65,0.94), rgba(11,105,112,0.78) 54%, rgba(39,194,198,0.68))"
                : "radial-gradient(circle at 86% 36%, rgba(72,255,238,0.62), transparent 28%), linear-gradient(118deg, #073541 0%, #0b6970 54%, ".concat(primaryColor, " 100%)"),
            color: '#ffffff',
            borderRadius: isLiquidGlass ? template.cardRadius(borderRadius) : undefined,
            border: isLiquidGlass ? '1px solid rgba(255,255,255,0.42)' : undefined
        },
        pageKicker: {
            display: 'inline-block',
            color: '#67fbf1',
            fontSize: isMobile ? 11 : 13,
            lineHeight: 1.5,
            letterSpacing: 2.6,
            textTransform: 'uppercase',
            fontWeight: 900
        },
        pageTitle: {
            margin: isMobile ? '14px 0 12px' : '18px 0 14px',
            fontSize: isMobile ? 40 : 56,
            lineHeight: 1,
            fontWeight: 900,
            letterSpacing: -1.7,
            textShadow: '0 8px 22px rgba(0,0,0,0.26)'
        },
        pageLead: {
            margin: 0,
            maxWidth: 720,
            fontSize: isMobile ? 16 : 19,
            lineHeight: 1.55,
            color: 'rgba(255,255,255,0.9)'
        },
        pageStats: {
            display: 'grid',
            gridTemplateColumns: isMobile ? 'minmax(0,1fr)' : 'repeat(3,minmax(0,1fr))',
            gap: 12,
            alignSelf: 'stretch'
        },
        pageStat: {
            minHeight: isMobile ? 92 : 122,
            padding: isMobile ? 16 : 20,
            borderRadius: isLiquidGlass ? 26 : 14,
            background: isLiquidGlass ? 'linear-gradient(145deg, rgba(255,255,255,0.34), rgba(255,255,255,0.12))' : 'linear-gradient(135deg, rgba(255,255,255,0.24), rgba(255,255,255,0.08))',
            border: isLiquidGlass ? '1px solid rgba(255,255,255,0.52)' : '1px solid rgba(255,255,255,0.34)',
            boxShadow: isLiquidGlass ? '0 20px 48px rgba(0,62,73,0.14), inset 0 1px 0 rgba(255,255,255,0.5)' : '0 18px 42px rgba(0,62,73,0.18)',
            display: 'grid',
            alignContent: 'space-between',
            gap: 16,
            minWidth: 0,
            overflowWrap: 'anywhere',
            backdropFilter: isLiquidGlass ? glassBlur : 'blur(10px)',
            WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined
        },
        pageBody: {
            position: 'relative',
            zIndex: 1,
            margin: isLiquidGlass ? (isMobile ? '-44px 12px 22px' : '-52px 34px 30px') : isMobile ? '-44px 16px 24px' : '-52px 42px 34px',
            padding: isMobile ? 18 : 28,
            borderRadius: isLiquidGlass ? 32 : 16,
            background: isLiquidGlass ? template.cardBackground : '#ffffff',
            boxShadow: isLiquidGlass ? template.cardShadow : '0 26px 70px rgba(15,23,42,0.13)',
            border: isLiquidGlass ? template.cardBorder : undefined,
            backdropFilter: isLiquidGlass ? glassBlur : undefined,
            WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined,
            minWidth: 0
        },
        complianceGrid: {
            display: 'grid',
            gridTemplateColumns: isDesktop ? 'repeat(3,minmax(0,1fr))' : 'minmax(0,1fr)',
            gap: 14
        },
        searchBand: { background: isLiquidGlass ? template.cardBackground : '#fff', borderRadius: isLiquidGlass ? template.cardRadius(borderRadius) : borderRadius, boxShadow: isLiquidGlass ? template.cardShadow : '0 16px 34px rgba(15,23,42,0.07)', border: isLiquidGlass ? template.cardBorder : undefined, backdropFilter: isLiquidGlass ? glassBlur : undefined, WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined, scrollMarginTop: sectionGap, minWidth: 0 },
        searchHeader: { padding: "".concat(compactCardPadding, "px ").concat(compactCardPadding, "px 0") },
        searchGrid: { display: 'grid', gridTemplateColumns: isDesktop ? 'minmax(0,1fr) minmax(0,1fr)' : 'minmax(0,1fr)', gap: sectionGap, padding: compactCardPadding, minWidth: 0 },
        sectionTitle: { margin: 0, fontSize: isMobile ? 24 : 28, lineHeight: 1.15, fontWeight: 800 },
        muted: { margin: '8px 0 0', color: template.mutedTextColor, lineHeight: 1.5 },
        statusText: { margin: '0', color: secondaryColor, fontWeight: 700, lineHeight: 1.45 },
        errorText: { margin: '0', color: '#b42318', fontWeight: 700, lineHeight: 1.45 },
        panel: { background: template.panelBackground, border: template.cardBorder, borderRadius: template.cardRadius(borderRadius), padding: compactCardPadding, display: 'grid', gap: 14, minWidth: 0, boxShadow: isLiquidGlass ? '0 18px 44px rgba(8,82,112,0.1), inset 0 1px 0 rgba(255,255,255,0.58)' : '0 14px 30px rgba(15,23,42,0.04)', backdropFilter: isLiquidGlass ? glassBlur : undefined, WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined },
        textarea: { minHeight: isMobile ? 112 : 132, border: '1px solid rgba(16,36,46,0.14)', borderRadius: borderRadius, padding: 12, font: 'inherit', boxSizing: 'border-box', width: '100%', minWidth: 0 },
        inputRow: { display: 'grid', gridTemplateColumns: isMobile ? 'minmax(0,1fr)' : 'minmax(0,1fr) auto', gap: 10, minWidth: 0 },
        input: { border: '1px solid rgba(16,36,46,0.14)', borderRadius: borderRadius, padding: 12, font: 'inherit', width: '100%', minWidth: 0, boxSizing: 'border-box' },
        chipRow: { display: 'flex', flexWrap: 'wrap', gap: 8 },
        chip: { border: '1px solid rgba(16,36,46,0.14)', background: '#fff', color: accentTextColor, borderRadius: 999, padding: '8px 11px', fontWeight: 700, cursor: 'pointer' },
        chipActive: { borderColor: 'transparent', background: secondaryColor, color: '#fff' },
        twoColumn: { display: 'grid', gridTemplateColumns: isMobile ? 'minmax(0,1fr)' : 'repeat(2,minmax(0,1fr))', gap: 12 },
        workflow: { display: 'grid', gap: 10 },
        workflowStep: { display: 'grid', gridTemplateColumns: '42px minmax(0,1fr)', gap: 12, alignItems: 'start', padding: 16, background: isLiquidGlass ? 'linear-gradient(145deg, rgba(255,255,255,0.58), rgba(255,255,255,0.22))' : '#fff', borderRadius: isLiquidGlass ? 24 : borderRadius, border: isLiquidGlass ? template.cardBorder : '1px solid rgba(39,194,198,0.16)', boxShadow: isLiquidGlass ? '0 18px 44px rgba(8,82,112,0.1), inset 0 1px 0 rgba(255,255,255,0.58)' : '0 12px 28px rgba(15,23,42,0.04)', backdropFilter: isLiquidGlass ? glassBlur : undefined, WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined, minWidth: 0 },
        adminGrid: { display: 'grid', gridTemplateColumns: isDesktop ? 'minmax(0,1.2fr) minmax(280px,0.8fr)' : 'minmax(0,1fr)', gap: sectionGap, marginTop: 18, minWidth: 0 },
        configList: { display: 'grid', gap: 10, lineHeight: 1.45, overflowWrap: 'anywhere' },
        missionList: { display: 'grid', gap: 12 },
        missionCard: { background: isLiquidGlass ? template.cardBackground : '#fff', border: template.cardBorder, borderRadius: template.cardRadius(borderRadius), padding: compactCardPadding, display: 'grid', gap: 10, minWidth: 0, boxShadow: isLiquidGlass ? template.cardShadow : '0 12px 28px rgba(15,23,42,0.04)', backdropFilter: isLiquidGlass ? glassBlur : undefined, WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined },
        missionHeader: { display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: 10, alignItems: isMobile ? 'stretch' : 'flex-start', minWidth: 0 },
        resultBadge: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 72, padding: '8px 10px', borderRadius: 999, background: "linear-gradient(135deg, ".concat(primaryColor, ", ").concat(secondaryColor, ")"), color: '#fff', fontWeight: 800 },
        resultsLayout: { display: 'grid', gridTemplateColumns: isDesktop ? 'minmax(0,1.4fr) minmax(280px,360px)' : 'minmax(0,1fr)', gap: sectionGap, scrollMarginTop: sectionGap, minWidth: 0 },
        resultsPanel: { background: template.cardBackground, borderRadius: template.cardRadius(borderRadius), padding: compactCardPadding, boxShadow: template.cardShadow, border: template.cardBorder, backdropFilter: isLiquidGlass ? glassBlur : undefined, WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined, scrollMarginTop: sectionGap, minWidth: 0 },
        resultList: { display: 'grid', gap: 14, marginTop: 18 },
        cvCard: { border: isLiquidGlass ? template.cardBorder : '1px solid rgba(39,194,198,0.16)', borderRadius: isLiquidGlass ? 26 : borderRadius, padding: compactCardPadding, background: isLiquidGlass ? 'linear-gradient(145deg, rgba(255,255,255,0.58), rgba(255,255,255,0.22))' : '#fdfefe', minWidth: 0, boxShadow: isLiquidGlass ? '0 18px 44px rgba(8,82,112,0.1), inset 0 1px 0 rgba(255,255,255,0.58)' : '0 16px 34px rgba(15,23,42,0.05)', backdropFilter: isLiquidGlass ? glassBlur : undefined, WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined },
        cvTop: { display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: 16, alignItems: isMobile ? 'stretch' : 'flex-start', minWidth: 0 },
        candidateId: { display: 'inline-block', background: 'rgba(39,194,198,0.12)', color: secondaryColor, borderRadius: 999, padding: '7px 10px', fontWeight: 800, fontSize: 12 },
        cardTitle: { margin: '10px 0 0', fontSize: isMobile ? 21 : 24, lineHeight: 1.15, overflowWrap: 'anywhere' },
        scoreBox: { minWidth: 96, textAlign: isMobile ? 'left' : 'right', background: '#fff', border: '1px solid rgba(16,36,46,0.08)', borderRadius: borderRadius, padding: 12 },
        profileSummary: { margin: '12px 0', color: '#55727b', lineHeight: 1.5 },
        skillPills: { display: 'flex', flexWrap: 'wrap', gap: 7 },
        skillPill: { background: '#fff', border: '1px solid rgba(16,36,46,0.08)', borderRadius: 999, padding: '6px 9px', fontSize: 12, fontWeight: 700 },
        cardActions: { display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 14 },
        asideStack: { display: 'grid', gap: 18, alignContent: 'start' },
        planList: { display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(3,minmax(0,1fr))' : 'minmax(0,1fr)', gap: 16 },
        plan: { border: isLiquidGlass ? template.cardBorder : '1px solid rgba(39,194,198,0.16)', borderRadius: isLiquidGlass ? 26 : borderRadius, padding: compactCardPadding, background: isLiquidGlass ? 'linear-gradient(145deg, rgba(255,255,255,0.58), rgba(255,255,255,0.22))' : '#fdfefe', boxShadow: isLiquidGlass ? '0 18px 44px rgba(8,82,112,0.1), inset 0 1px 0 rgba(255,255,255,0.58)' : '0 16px 34px rgba(15,23,42,0.05)', backdropFilter: isLiquidGlass ? glassBlur : undefined, WebkitBackdropFilter: isLiquidGlass ? glassBlur : undefined },
        featuredPlan: { background: "linear-gradient(135deg, ".concat(primaryColor, ", ").concat(secondaryColor, ")"), color: '#fff', borderColor: 'transparent' },
        planTitle: { margin: 0, fontSize: 21 },
        planCopy: { margin: '8px 0', lineHeight: 1.45 },
        price: { display: 'block', fontSize: 30, margin: '10px 0' },
        featureList: { margin: 0, paddingLeft: 18, lineHeight: 1.7 },
        previewOverlay: {
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            padding: isMobile ? 12 : 28,
            background: 'rgba(7,22,31,0.62)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        previewDialog: {
            width: isMobile ? '100%' : 'min(1120px, 92vw)',
            height: isMobile ? '92vh' : '88vh',
            borderRadius: isMobile ? 16 : 22,
            background: '#ffffff',
            boxShadow: '0 34px 90px rgba(0,0,0,0.34)',
            display: 'grid',
            gridTemplateRows: 'auto minmax(0,1fr) auto',
            overflow: 'hidden',
            minWidth: 0
        },
        previewHeader: {
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'center',
            justifyContent: 'space-between',
            gap: 14,
            padding: isMobile ? 16 : 22,
            borderBottom: '1px solid rgba(16,36,46,0.1)',
            background: 'linear-gradient(135deg, rgba(39,194,198,0.08), rgba(255,255,255,0.96))'
        },
        previewTitle: {
            margin: '4px 0 0',
            color: accentTextColor,
            fontSize: isMobile ? 20 : 26,
            lineHeight: 1.12,
            fontWeight: 900,
            overflowWrap: 'anywhere'
        },
        previewActions: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            justifyContent: isMobile ? 'stretch' : 'flex-end'
        },
        previewCloseButton: {
            border: 'none',
            borderRadius: borderRadius,
            background: "linear-gradient(135deg, ".concat(primaryColor, ", ").concat(secondaryColor, ")"),
            color: '#ffffff',
            padding: '12px 18px',
            fontWeight: 900,
            cursor: 'pointer'
        },
        previewFrame: {
            width: '100%',
            height: '100%',
            border: 'none',
            background: '#f8fbfc'
        },
        previewHelp: {
            margin: 0,
            padding: isMobile ? '10px 16px' : '12px 22px',
            color: '#55727b',
            fontSize: 13,
            lineHeight: 1.4,
            borderTop: '1px solid rgba(16,36,46,0.08)'
        }
    };
}


/***/ }),

/***/ 143:
/*!**************************************************************************************!*\
  !*** ./lib/webparts/cvTech2PartnerPortal/services/SharePointPartnerPortalService.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SharePointPartnerPortalService: () => (/* binding */ SharePointPartnerPortalService)
/* harmony export */ });
/* harmony import */ var _microsoft_sp_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/sp-http */ 909);
/* harmony import */ var _microsoft_sp_http__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_http__WEBPACK_IMPORTED_MODULE_0__);
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

var SharePointPartnerPortalService = /** @class */ (function () {
    function SharePointPartnerPortalService(spHttpClient, siteUrl) {
        this.spHttpClient = spHttpClient;
        this.siteUrl = siteUrl;
    }
    SharePointPartnerPortalService.prototype.getAvailableCvs = function (listTitle, rowLimit, partnerName) {
        return __awaiter(this, void 0, void 0, function () {
            var normalizedPartnerName, items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        normalizedPartnerName = (partnerName || '').trim().toLowerCase();
                        return [4 /*yield*/, this.getAvailableCvsWithOptionalPartnerField(listTitle, rowLimit)];
                    case 1:
                        items = _a.sent();
                        return [2 /*return*/, items.filter(function (item) {
                                if (item.IsAvailable === false)
                                    return false;
                                var itemPartnerName = (item.PartnerName || '').trim().toLowerCase();
                                return !normalizedPartnerName || !itemPartnerName || itemPartnerName === normalizedPartnerName;
                            })];
                }
            });
        });
    };
    SharePointPartnerPortalService.prototype.getAvailableCvsWithOptionalPartnerField = function (listTitle, rowLimit) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, response, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = "".concat(this.siteUrl, "/_api/web/lists/getbytitle('").concat(this.escapeODataString(listTitle), "')/items")
                            + "?$top=".concat(rowLimit)
                            + '&$select=Id,Title,PartnerName,CandidateId,ProfileTitle,Seniority,Availability,Skills,Summary,IsAvailable,CvUrl';
                        return [4 /*yield*/, this.spHttpClient.get(endpoint, _microsoft_sp_http__WEBPACK_IMPORTED_MODULE_0__.SPHttpClient.configurations.v1)];
                    case 1:
                        response = _a.sent();
                        if (!response.ok && response.status === 400) {
                            return [2 /*return*/, this.getAvailableCvsWithoutPartnerField(listTitle, rowLimit)];
                        }
                        return [4 /*yield*/, this.ensureSuccess(response, "Unable to load CV list \"".concat(listTitle, "\""))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        payload = _a.sent();
                        return [2 /*return*/, payload.value || []];
                }
            });
        });
    };
    SharePointPartnerPortalService.prototype.getAvailableCvsWithoutPartnerField = function (listTitle, rowLimit) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, response, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = "".concat(this.siteUrl, "/_api/web/lists/getbytitle('").concat(this.escapeODataString(listTitle), "')/items")
                            + "?$top=".concat(rowLimit)
                            + '&$select=Id,Title,CandidateId,ProfileTitle,Seniority,Availability,Skills,Summary,IsAvailable,CvUrl';
                        return [4 /*yield*/, this.spHttpClient.get(endpoint, _microsoft_sp_http__WEBPACK_IMPORTED_MODULE_0__.SPHttpClient.configurations.v1)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, this.ensureSuccess(response, "Unable to load CV list \"".concat(listTitle, "\""))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        payload = _a.sent();
                        return [2 /*return*/, payload.value || []];
                }
            });
        });
    };
    SharePointPartnerPortalService.prototype.getPartnerAccount = function (accountListTitle, userEmail) {
        return __awaiter(this, void 0, void 0, function () {
            var normalizedEmail, filter, endpoint, response, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        normalizedEmail = this.normalizeEmail(userEmail);
                        if (!normalizedEmail)
                            return [2 /*return*/, undefined];
                        filter = "UserEmail eq '".concat(this.escapeODataString(normalizedEmail), "'");
                        endpoint = "".concat(this.siteUrl, "/_api/web/lists/getbytitle('").concat(this.escapeODataString(accountListTitle), "')/items")
                            + '?$top=10'
                            + '&$select=Id,Title,PartnerName,PartnerKey,UserEmail,MonthlySearchQuota,IsActive'
                            + "&$filter=".concat(encodeURIComponent(filter));
                        return [4 /*yield*/, this.spHttpClient.get(endpoint, _microsoft_sp_http__WEBPACK_IMPORTED_MODULE_0__.SPHttpClient.configurations.v1)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, this.ensureSuccess(response, "Unable to load partner account list \"".concat(accountListTitle, "\""))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        payload = _a.sent();
                        return [2 /*return*/, (payload.value || []).find(function (item) { return item.IsActive !== false; })];
                }
            });
        });
    };
    SharePointPartnerPortalService.prototype.getPartnerCvKeys = function (listTitle, rowLimit) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, response, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = "".concat(this.siteUrl, "/_api/web/lists/getbytitle('").concat(this.escapeODataString(listTitle), "')/items")
                            + "?$top=".concat(rowLimit)
                            + '&$select=Id,CandidateId,CvUrl';
                        return [4 /*yield*/, this.spHttpClient.get(endpoint, _microsoft_sp_http__WEBPACK_IMPORTED_MODULE_0__.SPHttpClient.configurations.v1)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, this.ensureSuccess(response, "Unable to load CV keys from \"".concat(listTitle, "\""))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        payload = _a.sent();
                        return [2 /*return*/, payload.value || []];
                }
            });
        });
    };
    SharePointPartnerPortalService.prototype.createPartnerCv = function (listTitle, input) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, body, response, legacyBody, legacyResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = "".concat(this.siteUrl, "/_api/web/lists/getbytitle('").concat(this.escapeODataString(listTitle), "')/items");
                        body = {
                            Title: input.title,
                            PartnerName: input.partnerName || '',
                            CandidateId: input.candidateId,
                            ProfileTitle: input.profileTitle,
                            Seniority: input.seniority,
                            Availability: input.availability,
                            Skills: input.skills.join(', '),
                            Summary: input.summary,
                            IsAvailable: true,
                            CvUrl: {
                                Url: input.cvUrl,
                                Description: input.cvUrlDescription
                            }
                        };
                        return [4 /*yield*/, this.spHttpClient.post(endpoint, _microsoft_sp_http__WEBPACK_IMPORTED_MODULE_0__.SPHttpClient.configurations.v1, {
                                headers: {
                                    Accept: 'application/json;odata=nometadata',
                                    'Content-Type': 'application/json;odata=nometadata'
                                },
                                body: JSON.stringify(body)
                            })];
                    case 1:
                        response = _a.sent();
                        if (!(!response.ok && response.status === 400)) return [3 /*break*/, 4];
                        legacyBody = __assign({}, body);
                        delete legacyBody.PartnerName;
                        return [4 /*yield*/, this.spHttpClient.post(endpoint, _microsoft_sp_http__WEBPACK_IMPORTED_MODULE_0__.SPHttpClient.configurations.v1, {
                                headers: {
                                    Accept: 'application/json;odata=nometadata',
                                    'Content-Type': 'application/json;odata=nometadata'
                                },
                                body: JSON.stringify(legacyBody)
                            })];
                    case 2:
                        legacyResponse = _a.sent();
                        return [4 /*yield*/, this.ensureSuccess(legacyResponse, "Unable to create PartnerCV item in \"".concat(listTitle, "\""))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                    case 4: return [4 /*yield*/, this.ensureSuccess(response, "Unable to create PartnerCV item in \"".concat(listTitle, "\""))];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SharePointPartnerPortalService.prototype.getCvDocuments = function (documentLibraryTitle, rowLimit) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, response, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = "".concat(this.siteUrl, "/_api/web/lists/getbytitle('").concat(this.escapeODataString(documentLibraryTitle), "')/items")
                            + "?$top=".concat(rowLimit)
                            + '&$select=Id,Title,Modified,File/Name,File/ServerRelativeUrl,File/LinkingUrl'
                            + '&$expand=File'
                            + '&$orderby=Modified desc';
                        return [4 /*yield*/, this.spHttpClient.get(endpoint, _microsoft_sp_http__WEBPACK_IMPORTED_MODULE_0__.SPHttpClient.configurations.v1)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, this.ensureSuccess(response, "Unable to load CV documents from \"".concat(documentLibraryTitle, "\""))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        payload = _a.sent();
                        return [2 /*return*/, (payload.value || []).filter(function (item) {
                                var _a;
                                var fileName = ((_a = item.File) === null || _a === void 0 ? void 0 : _a.Name) || '';
                                return /\.(pdf|docx)$/i.test(fileName);
                            })];
                }
            });
        });
    };
    SharePointPartnerPortalService.prototype.isPartnerPortalAdmin = function (adminListTitle, userEmail) {
        return __awaiter(this, void 0, void 0, function () {
            var normalizedEmail, filter, endpoint, response, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        normalizedEmail = this.normalizeEmail(userEmail);
                        if (!normalizedEmail)
                            return [2 /*return*/, false];
                        filter = "UserEmail eq '".concat(this.escapeODataString(normalizedEmail), "'");
                        endpoint = "".concat(this.siteUrl, "/_api/web/lists/getbytitle('").concat(this.escapeODataString(adminListTitle), "')/items")
                            + "?$top=5&$select=Id,UserEmail,IsActive&$filter=".concat(encodeURIComponent(filter));
                        return [4 /*yield*/, this.spHttpClient.get(endpoint, _microsoft_sp_http__WEBPACK_IMPORTED_MODULE_0__.SPHttpClient.configurations.v1)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, this.ensureSuccess(response, "Unable to load Partner Portal admin list \"".concat(adminListTitle, "\""))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        payload = _a.sent();
                        return [2 /*return*/, (payload.value || []).some(function (item) { return item.IsActive !== false; })];
                }
            });
        });
    };
    SharePointPartnerPortalService.prototype.countMonthlySearches = function (auditListTitle, partnerName, userEmail, monthKey) {
        return __awaiter(this, void 0, void 0, function () {
            var filter, endpoint, response, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filter = [
                            "PartnerName eq '".concat(this.escapeODataString(partnerName), "'"),
                            "UserEmail eq '".concat(this.escapeODataString(userEmail), "'"),
                            "MonthKey eq '".concat(this.escapeODataString(monthKey), "'")
                        ].join(' and ');
                        endpoint = "".concat(this.siteUrl, "/_api/web/lists/getbytitle('").concat(this.escapeODataString(auditListTitle), "')/items")
                            + "?$top=5000&$select=Id&$filter=".concat(encodeURIComponent(filter));
                        return [4 /*yield*/, this.spHttpClient.get(endpoint, _microsoft_sp_http__WEBPACK_IMPORTED_MODULE_0__.SPHttpClient.configurations.v1)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, this.ensureSuccess(response, "Unable to load search audit list \"".concat(auditListTitle, "\""))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        payload = _a.sent();
                        return [2 /*return*/, (payload.value || []).length];
                }
            });
        });
    };
    SharePointPartnerPortalService.prototype.logSearch = function (auditListTitle, input) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, body, response, legacyBody, legacyResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = "".concat(this.siteUrl, "/_api/web/lists/getbytitle('").concat(this.escapeODataString(auditListTitle), "')/items");
                        body = {
                            Title: input.title,
                            PartnerAccountId: input.partnerAccountId,
                            PartnerName: input.partnerName,
                            UserEmail: input.userEmail,
                            SearchQuery: input.query,
                            SearchSkills: input.skills.join(', '),
                            ResultsCount: input.resultsCount,
                            PartnerQuotaMaximum: input.quotaMaximum,
                            SearchesRemaining: input.searchesRemaining,
                            MonthKey: input.monthKey,
                            MatchedCandidateIds: (input.matchedCandidateIds || []).join(', '),
                            MatchedCvUrls: (input.matchedCvUrls || []).join('\n'),
                            MatchedProfileTitles: (input.matchedProfileTitles || []).join('\n')
                        };
                        return [4 /*yield*/, this.spHttpClient.post(endpoint, _microsoft_sp_http__WEBPACK_IMPORTED_MODULE_0__.SPHttpClient.configurations.v1, {
                                headers: {
                                    Accept: 'application/json;odata=nometadata',
                                    'Content-Type': 'application/json;odata=nometadata'
                                },
                                body: JSON.stringify(body)
                            })];
                    case 1:
                        response = _a.sent();
                        if (!(!response.ok && response.status === 400)) return [3 /*break*/, 4];
                        legacyBody = __assign({}, body);
                        delete legacyBody.PartnerAccountId;
                        delete legacyBody.MatchedCandidateIds;
                        delete legacyBody.MatchedCvUrls;
                        delete legacyBody.MatchedProfileTitles;
                        return [4 /*yield*/, this.spHttpClient.post(endpoint, _microsoft_sp_http__WEBPACK_IMPORTED_MODULE_0__.SPHttpClient.configurations.v1, {
                                headers: {
                                    Accept: 'application/json;odata=nometadata',
                                    'Content-Type': 'application/json;odata=nometadata'
                                },
                                body: JSON.stringify(legacyBody)
                            })];
                    case 2:
                        legacyResponse = _a.sent();
                        return [4 /*yield*/, this.ensureSuccess(legacyResponse, "Unable to write search audit item in \"".concat(auditListTitle, "\""))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                    case 4: return [4 /*yield*/, this.ensureSuccess(response, "Unable to write search audit item in \"".concat(auditListTitle, "\""))];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SharePointPartnerPortalService.prototype.getPartnerMissions = function (missionListTitle, partnerName, rowLimit) {
        return __awaiter(this, void 0, void 0, function () {
            var filter, endpoint, response, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filter = "PartnerName eq '".concat(this.escapeODataString(partnerName), "'");
                        endpoint = "".concat(this.siteUrl, "/_api/web/lists/getbytitle('").concat(this.escapeODataString(missionListTitle), "')/items")
                            + "?$top=".concat(rowLimit)
                            + '&$select=Id,Title,Created,PartnerAccountId,PartnerName,UserEmail,MissionBrief,MissionSkills,Seniority,Availability,ResultsCount,MatchedCandidateIds'
                            + '&$orderby=Created desc'
                            + "&$filter=".concat(encodeURIComponent(filter));
                        return [4 /*yield*/, this.spHttpClient.get(endpoint, _microsoft_sp_http__WEBPACK_IMPORTED_MODULE_0__.SPHttpClient.configurations.v1)];
                    case 1:
                        response = _a.sent();
                        if (!response.ok && response.status === 400) {
                            return [2 /*return*/, this.getPartnerMissionsWithoutAccountFields(missionListTitle, partnerName, rowLimit)];
                        }
                        return [4 /*yield*/, this.ensureSuccess(response, "Unable to load partner mission list \"".concat(missionListTitle, "\""))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        payload = _a.sent();
                        return [2 /*return*/, payload.value || []];
                }
            });
        });
    };
    SharePointPartnerPortalService.prototype.getPartnerMissionsWithoutAccountFields = function (missionListTitle, partnerName, rowLimit) {
        return __awaiter(this, void 0, void 0, function () {
            var filter, endpoint, response, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filter = "PartnerName eq '".concat(this.escapeODataString(partnerName), "'");
                        endpoint = "".concat(this.siteUrl, "/_api/web/lists/getbytitle('").concat(this.escapeODataString(missionListTitle), "')/items")
                            + "?$top=".concat(rowLimit)
                            + '&$select=Id,Title,Created,PartnerName,UserEmail,MissionBrief,MissionSkills,Seniority,Availability,ResultsCount'
                            + '&$orderby=Created desc'
                            + "&$filter=".concat(encodeURIComponent(filter));
                        return [4 /*yield*/, this.spHttpClient.get(endpoint, _microsoft_sp_http__WEBPACK_IMPORTED_MODULE_0__.SPHttpClient.configurations.v1)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, this.ensureSuccess(response, "Unable to load partner mission list \"".concat(missionListTitle, "\""))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        payload = _a.sent();
                        return [2 /*return*/, payload.value || []];
                }
            });
        });
    };
    SharePointPartnerPortalService.prototype.savePartnerMission = function (missionListTitle, input) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, body, response, legacyResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = "".concat(this.siteUrl, "/_api/web/lists/getbytitle('").concat(this.escapeODataString(missionListTitle), "')/items");
                        body = this.buildPartnerMissionBody(input);
                        return [4 /*yield*/, this.spHttpClient.post(endpoint, _microsoft_sp_http__WEBPACK_IMPORTED_MODULE_0__.SPHttpClient.configurations.v1, {
                                headers: {
                                    Accept: 'application/json;odata=nometadata',
                                    'Content-Type': 'application/json;odata=nometadata'
                                },
                                body: JSON.stringify(body)
                            })];
                    case 1:
                        response = _a.sent();
                        if (!(!response.ok && response.status === 400)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.spHttpClient.post(endpoint, _microsoft_sp_http__WEBPACK_IMPORTED_MODULE_0__.SPHttpClient.configurations.v1, {
                                headers: {
                                    Accept: 'application/json;odata=nometadata',
                                    'Content-Type': 'application/json;odata=nometadata'
                                },
                                body: JSON.stringify(this.buildLegacyPartnerMissionBody(input))
                            })];
                    case 2:
                        legacyResponse = _a.sent();
                        return [4 /*yield*/, this.ensureSuccess(legacyResponse, "Unable to write partner mission item in \"".concat(missionListTitle, "\""))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                    case 4: return [4 /*yield*/, this.ensureSuccess(response, "Unable to write partner mission item in \"".concat(missionListTitle, "\""))];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SharePointPartnerPortalService.prototype.updatePartnerMission = function (missionListTitle, itemId, input) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, body, response, legacyResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = "".concat(this.siteUrl, "/_api/web/lists/getbytitle('").concat(this.escapeODataString(missionListTitle), "')/items(").concat(itemId, ")");
                        body = this.buildPartnerMissionBody(input);
                        return [4 /*yield*/, this.spHttpClient.post(endpoint, _microsoft_sp_http__WEBPACK_IMPORTED_MODULE_0__.SPHttpClient.configurations.v1, {
                                headers: {
                                    Accept: 'application/json;odata=nometadata',
                                    'Content-Type': 'application/json;odata=nometadata',
                                    'IF-MATCH': '*',
                                    'X-HTTP-Method': 'MERGE'
                                },
                                body: JSON.stringify(body)
                            })];
                    case 1:
                        response = _a.sent();
                        if (!(!response.ok && response.status === 400)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.spHttpClient.post(endpoint, _microsoft_sp_http__WEBPACK_IMPORTED_MODULE_0__.SPHttpClient.configurations.v1, {
                                headers: {
                                    Accept: 'application/json;odata=nometadata',
                                    'Content-Type': 'application/json;odata=nometadata',
                                    'IF-MATCH': '*',
                                    'X-HTTP-Method': 'MERGE'
                                },
                                body: JSON.stringify(this.buildLegacyPartnerMissionBody(input))
                            })];
                    case 2:
                        legacyResponse = _a.sent();
                        return [4 /*yield*/, this.ensureSuccess(legacyResponse, "Unable to update partner mission item ".concat(itemId, " in \"").concat(missionListTitle, "\""))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                    case 4: return [4 /*yield*/, this.ensureSuccess(response, "Unable to update partner mission item ".concat(itemId, " in \"").concat(missionListTitle, "\""))];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SharePointPartnerPortalService.prototype.deletePartnerMission = function (missionListTitle, itemId) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = "".concat(this.siteUrl, "/_api/web/lists/getbytitle('").concat(this.escapeODataString(missionListTitle), "')/items(").concat(itemId, ")");
                        return [4 /*yield*/, this.spHttpClient.post(endpoint, _microsoft_sp_http__WEBPACK_IMPORTED_MODULE_0__.SPHttpClient.configurations.v1, {
                                headers: {
                                    Accept: 'application/json;odata=nometadata',
                                    'IF-MATCH': '*',
                                    'X-HTTP-Method': 'DELETE'
                                }
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, this.ensureSuccess(response, "Unable to delete partner mission item ".concat(itemId, " from \"").concat(missionListTitle, "\""))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SharePointPartnerPortalService.prototype.ensureSuccess = function (response, message) {
        return __awaiter(this, void 0, void 0, function () {
            var details;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (response.ok)
                            return [2 /*return*/];
                        return [4 /*yield*/, response.text()];
                    case 1:
                        details = _a.sent();
                        throw new Error("".concat(message, ". HTTP ").concat(response.status, ": ").concat(details));
                }
            });
        });
    };
    SharePointPartnerPortalService.prototype.buildPartnerMissionBody = function (input) {
        return {
            Title: input.title,
            PartnerAccountId: input.partnerAccountId,
            PartnerName: input.partnerName,
            UserEmail: input.userEmail,
            MissionBrief: input.missionBrief,
            MissionSkills: input.skills.join(', '),
            Seniority: input.seniority,
            Availability: input.availability,
            ResultsCount: input.resultsCount,
            MatchedCandidateIds: (input.matchedCandidateIds || []).join(', ')
        };
    };
    SharePointPartnerPortalService.prototype.buildLegacyPartnerMissionBody = function (input) {
        return {
            Title: input.title,
            PartnerName: input.partnerName,
            UserEmail: input.userEmail,
            MissionBrief: input.missionBrief,
            MissionSkills: input.skills.join(', '),
            Seniority: input.seniority,
            Availability: input.availability,
            ResultsCount: input.resultsCount
        };
    };
    SharePointPartnerPortalService.prototype.escapeODataString = function (value) {
        return value.replace(/'/g, "''");
    };
    SharePointPartnerPortalService.prototype.normalizeEmail = function (value) {
        return (value.split('|').pop() || value).trim().toLowerCase();
    };
    return SharePointPartnerPortalService;
}());



/***/ }),

/***/ 909:
/*!*************************************!*\
  !*** external "@microsoft/sp-http" ***!
  \*************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__909__;

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
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
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
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
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
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "chunk." + chunkId + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "a7cf3155-79e7-4c97-90a4-23b6a54a46ef_0.1.0:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 				if (script.src.indexOf(window.location.origin + '/') !== 0) {
/******/ 					script.crossOrigin = "anonymous";
/******/ 				}
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
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
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var _publicPath = __RUSHSTACK_CURRENT_SCRIPT__ ? __RUSHSTACK_CURRENT_SCRIPT__.src : '';
/******/ 		__webpack_require__.p = _publicPath.slice(0, _publicPath.lastIndexOf('/') + 1);
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"cvtech2-partner-portal-web-part": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackJsonp_a7cf3155-79e7-4c97-90a4-23b6a54a46ef_0.1.0"] = self["webpackJsonp_a7cf3155-79e7-4c97-90a4-23b6a54a46ef_0.1.0"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**************************************************************************!*\
  !*** ./lib/webparts/cvTech2PartnerPortal/CvTech2PartnerPortalWebPart.js ***!
  \**************************************************************************/
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
/* harmony import */ var _components_CvTech2PartnerPortal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/CvTech2PartnerPortal */ 700);
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
    portalTemplate: 'cockpit-saas',
    brandLabel: 'cvtech2',
    portalTitle: 'Partner Portal',
    primaryColor: '#27c2c6',
    secondaryColor: '#136d70',
    accentTextColor: '#16323a',
    surfaceColor: '#eef4f8',
    webPartMaxWidth: 1440,
    sidebarWidth: 280,
    minHeight: 760,
    contentPadding: 28,
    sectionGap: 22,
    cardPadding: 22,
    borderRadius: 10,
    metricMinWidth: 180,
    metricMinHeight: 132,
    titleFontSize: 48,
    bodyFontSize: 17,
    dataSiteUrl: 'https://braineesysms365.sharepoint.com/sites/CVTech2',
    cvListTitle: 'PartnerCVs',
    auditListTitle: 'PartnerSearchLogs',
    partnerAccountListTitle: 'PartnerAccounts',
    missionListTitle: 'PartnerMissions',
    adminListTitle: 'PartnerPortalAdmins',
    cvDocumentLibraryTitle: 'Documents',
    partnerName: 'Default Partner',
    partnerMonthlyQuota: 100,
    cvRowLimit: 500,
    overviewPosition: 1,
    missionMatchPosition: 2,
    cvLibraryPosition: 3,
    plansPosition: 4,
    compliancePosition: 5
};
var CvTech2PartnerPortalWebPart = /** @class */ (function (_super) {
    __extends(CvTech2PartnerPortalWebPart, _super);
    function CvTech2PartnerPortalWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CvTech2PartnerPortalWebPart.prototype.onInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.properties.brandLabel = this.properties.brandLabel || DEFAULT_PROPS.brandLabel;
                        this.properties.portalTemplate = this.properties.portalTemplate || DEFAULT_PROPS.portalTemplate;
                        this.properties.portalTitle = this.properties.portalTitle || DEFAULT_PROPS.portalTitle;
                        this.properties.primaryColor = this.properties.primaryColor || DEFAULT_PROPS.primaryColor;
                        this.properties.secondaryColor = this.properties.secondaryColor || DEFAULT_PROPS.secondaryColor;
                        this.properties.accentTextColor = this.properties.accentTextColor || DEFAULT_PROPS.accentTextColor;
                        this.properties.surfaceColor = this.properties.surfaceColor || DEFAULT_PROPS.surfaceColor;
                        this.properties.webPartMaxWidth = this.properties.webPartMaxWidth || DEFAULT_PROPS.webPartMaxWidth;
                        this.properties.sidebarWidth = this.properties.sidebarWidth || DEFAULT_PROPS.sidebarWidth;
                        this.properties.minHeight = this.properties.minHeight || DEFAULT_PROPS.minHeight;
                        this.properties.contentPadding = this.properties.contentPadding || DEFAULT_PROPS.contentPadding;
                        this.properties.sectionGap = this.properties.sectionGap || DEFAULT_PROPS.sectionGap;
                        this.properties.cardPadding = this.properties.cardPadding || DEFAULT_PROPS.cardPadding;
                        this.properties.borderRadius = this.properties.borderRadius || DEFAULT_PROPS.borderRadius;
                        this.properties.metricMinWidth = this.properties.metricMinWidth || DEFAULT_PROPS.metricMinWidth;
                        this.properties.metricMinHeight = this.properties.metricMinHeight || DEFAULT_PROPS.metricMinHeight;
                        this.properties.titleFontSize = this.properties.titleFontSize || DEFAULT_PROPS.titleFontSize;
                        this.properties.bodyFontSize = this.properties.bodyFontSize || DEFAULT_PROPS.bodyFontSize;
                        this.properties.dataSiteUrl = this.properties.dataSiteUrl || DEFAULT_PROPS.dataSiteUrl;
                        this.properties.cvListTitle = this.properties.cvListTitle || DEFAULT_PROPS.cvListTitle;
                        this.properties.auditListTitle = this.properties.auditListTitle || DEFAULT_PROPS.auditListTitle;
                        this.properties.partnerAccountListTitle = this.properties.partnerAccountListTitle || DEFAULT_PROPS.partnerAccountListTitle;
                        this.properties.missionListTitle = this.properties.missionListTitle || DEFAULT_PROPS.missionListTitle;
                        this.properties.adminListTitle = this.properties.adminListTitle || DEFAULT_PROPS.adminListTitle;
                        this.properties.cvDocumentLibraryTitle = this.properties.cvDocumentLibraryTitle || DEFAULT_PROPS.cvDocumentLibraryTitle;
                        this.properties.partnerName = this.properties.partnerName || DEFAULT_PROPS.partnerName;
                        this.properties.partnerMonthlyQuota = this.properties.partnerMonthlyQuota || DEFAULT_PROPS.partnerMonthlyQuota;
                        this.properties.cvRowLimit = this.properties.cvRowLimit || DEFAULT_PROPS.cvRowLimit;
                        this.properties.overviewPosition = this.properties.overviewPosition || DEFAULT_PROPS.overviewPosition;
                        this.properties.missionMatchPosition = this.properties.missionMatchPosition || DEFAULT_PROPS.missionMatchPosition;
                        this.properties.cvLibraryPosition = this.properties.cvLibraryPosition || DEFAULT_PROPS.cvLibraryPosition;
                        this.properties.plansPosition = this.properties.plansPosition || DEFAULT_PROPS.plansPosition;
                        this.properties.compliancePosition = this.properties.compliancePosition || DEFAULT_PROPS.compliancePosition;
                        return [4 /*yield*/, _super.prototype.onInit.call(this)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CvTech2PartnerPortalWebPart.prototype.render = function () {
        var loginName = this.context.pageContext.user.loginName || '';
        var normalizedUserEmail = this.context.pageContext.user.email || loginName.split('|').pop() || loginName;
        var element = react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_CvTech2PartnerPortal__WEBPACK_IMPORTED_MODULE_4__["default"], {
            webPartProps: this.properties,
            spHttpClient: this.context.spHttpClient,
            siteUrl: this.properties.dataSiteUrl || this.context.pageContext.web.absoluteUrl,
            userDisplayName: this.context.pageContext.user.displayName,
            userEmail: normalizedUserEmail
        });
        react_dom__WEBPACK_IMPORTED_MODULE_1__.render(element, this.domElement);
    };
    CvTech2PartnerPortalWebPart.prototype.onDispose = function () {
        react_dom__WEBPACK_IMPORTED_MODULE_1__.unmountComponentAtNode(this.domElement);
    };
    CvTech2PartnerPortalWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: { description: 'CVTech2 Partner Portal configuration' },
                    groups: [
                        {
                            groupName: 'Content',
                            groupFields: [
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneDropdown)('portalTemplate', {
                                    label: 'Portal template',
                                    options: [
                                        { key: 'cockpit-saas', text: 'Cockpit SaaS' },
                                        { key: 'executive-partner', text: 'Executive Partner' },
                                        { key: 'marketplace-talent', text: 'Marketplace Talent' },
                                        { key: 'mission-match-studio', text: 'Mission Match Studio' },
                                        { key: 'ios-liquid-glass', text: 'iOS 26 Liquid Glass' }
                                    ]
                                }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneTextField)('brandLabel', { label: 'Brand label' }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneTextField)('portalTitle', { label: 'Portal title' })
                            ]
                        },
                        {
                            groupName: 'SharePoint data',
                            groupFields: [
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneTextField)('dataSiteUrl', { label: 'Data site URL' }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneTextField)('cvListTitle', { label: 'CV list title' }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneTextField)('auditListTitle', { label: 'Search audit list title' }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneTextField)('partnerAccountListTitle', { label: 'Partner account list title' }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneTextField)('missionListTitle', { label: 'Partner mission list title' }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneTextField)('adminListTitle', { label: 'Portal admin list title' }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneTextField)('cvDocumentLibraryTitle', { label: 'CV document library title' }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneTextField)('partnerName', { label: 'Partner name' }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneSlider)('partnerMonthlyQuota', { label: 'Monthly search quota', min: 1, max: 1000, step: 1 }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneSlider)('cvRowLimit', { label: 'Maximum CV rows to load', min: 20, max: 5000, step: 20 })
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
                        },
                        {
                            groupName: 'Section order',
                            groupFields: [
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneSlider)('overviewPosition', { label: 'Overview position', min: 1, max: 10, step: 1 }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneSlider)('missionMatchPosition', { label: 'Mission Match position', min: 1, max: 10, step: 1 }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneSlider)('cvLibraryPosition', { label: 'CV Library position', min: 1, max: 10, step: 1 }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneSlider)('plansPosition', { label: 'Plans position', min: 1, max: 10, step: 1 }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneSlider)('compliancePosition', { label: 'Compliance position', min: 1, max: 10, step: 1 })
                            ]
                        },
                        {
                            groupName: 'Responsive layout',
                            groupFields: [
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneSlider)('webPartMaxWidth', { label: 'Web part max width (px)', min: 720, max: 1920, step: 20 }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneSlider)('sidebarWidth', { label: 'Sidebar width (px)', min: 180, max: 420, step: 10 }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneSlider)('minHeight', { label: 'Minimum height (px)', min: 420, max: 1200, step: 20 }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneSlider)('contentPadding', { label: 'Content padding (px)', min: 8, max: 56, step: 2 }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneSlider)('sectionGap', { label: 'Section gap (px)', min: 8, max: 48, step: 2 }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneSlider)('cardPadding', { label: 'Card padding (px)', min: 10, max: 40, step: 2 }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneSlider)('borderRadius', { label: 'Border radius (px)', min: 0, max: 32, step: 1 }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneSlider)('metricMinWidth', { label: 'Metric card min width (px)', min: 120, max: 320, step: 10 }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneSlider)('metricMinHeight', { label: 'Metric card min height (px)', min: 80, max: 220, step: 10 }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneSlider)('titleFontSize', { label: 'Title font size (px)', min: 28, max: 72, step: 2 }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneSlider)('bodyFontSize', { label: 'Body font size (px)', min: 13, max: 22, step: 1 })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return CvTech2PartnerPortalWebPart;
}(_microsoft_sp_webpart_base__WEBPACK_IMPORTED_MODULE_2__.BaseClientSideWebPart));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CvTech2PartnerPortalWebPart);

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});})();;
//# sourceMappingURL=cvtech2-partner-portal-web-part.js.map