define("a7cf3155-79e7-4c97-90a4-23b6a54a46ef_0.1.0", ["react","react-dom","@microsoft/sp-webpart-base","@microsoft/sp-property-pane"], (__WEBPACK_EXTERNAL_MODULE__959__, __WEBPACK_EXTERNAL_MODULE__398__, __WEBPACK_EXTERNAL_MODULE__642__, __WEBPACK_EXTERNAL_MODULE__877__) => { return /******/ (() => { // webpackBootstrap
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
var profiles = [
    {
        id: 'CSA-014',
        title: 'Cloud Security Architect',
        meta: 'Architect | Azure / GCP | Banking & compliance | Availability: 2 weeks',
        seniority: 'Architect',
        availability: 'Under 2 weeks',
        skills: ['Azure', 'IAM', 'Terraform', 'Landing Zone', 'GCP', 'Compliance'],
        summary: 'Strong alignment for cloud security transformation, IAM hardening, and regulated environments.'
    },
    {
        id: 'DEV-022',
        title: 'Platform Engineer',
        meta: 'Senior | Kubernetes / DevSecOps | FinOps aware | Availability: immediate',
        seniority: 'Senior',
        availability: 'Immediate',
        skills: ['Kubernetes', 'Azure', 'DevSecOps', 'Observability', 'CI/CD'],
        summary: 'Relevant for missions mixing platform engineering, cluster governance, and deployment automation.'
    },
    {
        id: 'ARC-037',
        title: 'Enterprise Cloud Architect',
        meta: 'Lead | Multi-cloud strategy | Enterprise migration | Availability: 1 month',
        seniority: 'Lead',
        availability: 'Under 1 month',
        skills: ['Azure', 'GCP', 'Migration', 'Networking', 'Security', 'Governance'],
        summary: 'Useful for architecture-heavy missions with a strong governance and transformation angle.'
    },
    {
        id: 'SAP-041',
        title: 'Data & AI Platform Consultant',
        meta: 'Senior | Data platform / Azure AI | Availability: immediate',
        seniority: 'Senior',
        availability: 'Immediate',
        skills: ['Azure AI', 'Data Platform', 'Python', 'MLOps', 'Databricks', 'Security'],
        summary: 'Good secondary fit when the mission blends cloud modernization, analytics, and secure platform setup.'
    }
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
function scoreProfile(profile, selectedSkills) {
    var matches = selectedSkills.filter(function (skill) {
        return profile.skills.some(function (profileSkill) { return profileSkill.toLowerCase() === skill.toLowerCase(); });
    }).length;
    return Math.min(99, 62 + matches * 9);
}
function CvTech2PartnerPortal(_a) {
    var webPartProps = _a.webPartProps;
    var brandLabel = webPartProps.brandLabel, portalTitle = webPartProps.portalTitle, primaryColor = webPartProps.primaryColor, secondaryColor = webPartProps.secondaryColor, accentTextColor = webPartProps.accentTextColor, surfaceColor = webPartProps.surfaceColor;
    var _b = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''), missionBrief = _b[0], setMissionBrief = _b[1];
    var _c = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''), skillInput = _c[0], setSkillInput = _c[1];
    var _d = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(['Azure', 'IAM', 'Terraform']), selectedSkills = _d[0], setSelectedSkills = _d[1];
    var _e = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''), seniority = _e[0], setSeniority = _e[1];
    var _f = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''), availability = _f[0], setAvailability = _f[1];
    var rankedProfiles = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
        return profiles
            .filter(function (profile) { return !seniority || profile.seniority === seniority; })
            .filter(function (profile) { return !availability || profile.availability === availability; })
            .map(function (profile) { return (__assign(__assign({}, profile), { score: scoreProfile(profile, selectedSkills) })); })
            .sort(function (left, right) { return right.score - left.score; });
    }, [availability, seniority, selectedSkills]);
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
    var extractSkillsFromBrief = function () {
        var lower = missionBrief.toLowerCase();
        var extracted = suggestedSkills.filter(function (skill) { return lower.includes(skill.toLowerCase()); });
        setSelectedSkills(function (current) { return Array.from(new Set(__spreadArray(__spreadArray([], current, true), extracted, true))); });
    };
    var styles = buildStyles(primaryColor, secondaryColor, accentTextColor, surfaceColor);
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.shell },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("aside", { style: styles.sidebar },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.brand }, brandLabel),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.brandCopy }, "Partner access for anonymized CV discovery and mission matching.")),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("nav", { style: styles.nav }, ['Overview', 'CV Library', 'Mission Match', 'Plans', 'Compliance'].map(function (label, index) { return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { key: label, style: index === 0 ? __assign(__assign({}, styles.navItem), styles.navItemActive) : styles.navItem }, label)); })),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.sidePanel },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, "Partner status"),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null, "Enterprise workspace ready. Identity reveal remains approval-based."))),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("main", { style: styles.content },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("section", { style: styles.hero },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: styles.eyebrow }, "SaaS partner cockpit"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h1", { style: styles.title }, portalTitle),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.lead }, "Search anonymized candidate profiles by skills or mission brief, shortlist the best matches, and request controlled identity reveal only when the fit is validated."),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.heroActions },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { type: "button", style: styles.primaryButton, onClick: extractSkillsFromBrief }, "Analyze mission"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { type: "button", style: styles.secondaryButton }, "Request partner access"))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.statsGrid },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(Metric, { value: "128", label: "anonymized profiles", styles: styles }),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(Metric, { value: "21", label: "new profiles this month", styles: styles }),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(Metric, { value: "94%", label: "curated match relevance", styles: styles }),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(Metric, { value: "< 2h", label: "reveal request triage", styles: styles }))),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("section", { style: styles.searchBand },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.searchHeader },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h2", { style: styles.sectionTitle }, "Find available CVs"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.muted }, "Work from explicit skills, a mission description, or both."))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.searchGrid },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.panel },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(FieldLabel, { label: "Mission / offer brief" }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("textarea", { style: styles.textarea, value: missionBrief, onChange: function (event) { return setMissionBrief(event.currentTarget.value); }, placeholder: "Looking for a Cloud Security Architect with Azure landing zone, IAM, Terraform, and compliance exposure." }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(FieldLabel, { label: "Add explicit skills" }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.inputRow },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("input", { style: styles.input, value: skillInput, onChange: function (event) { return setSkillInput(event.currentTarget.value); }, onKeyDown: function (event) {
                                    if (event.key === 'Enter') {
                                        event.preventDefault();
                                        addSkill();
                                    }
                                }, placeholder: "Azure, Kubernetes, IAM..." }),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { type: "button", style: styles.compactButton, onClick: addSkill }, "Add")),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(FieldLabel, { label: "Suggested skills" }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.chipRow }, suggestedSkills.map(function (skill) { return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { key: skill, type: "button", style: selectedSkills.includes(skill) ? __assign(__assign({}, styles.chip), styles.chipActive) : styles.chip, onClick: function () { return toggleSkill(skill); } }, skill)); }))),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.panel },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(FieldLabel, { label: "Selected search" }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.chipRow }, selectedSkills.map(function (skill) { return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { key: skill, style: __assign(__assign({}, styles.chip), styles.chipActive) }, skill)); })),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.twoColumn },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(FieldLabel, { label: "Seniority" }),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("select", { style: styles.input, value: seniority, onChange: function (event) { return setSeniority(event.currentTarget.value); } },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("option", { value: "" }, "Any"),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("option", null, "Senior"),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("option", null, "Lead"),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("option", null, "Architect"))),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(FieldLabel, { label: "Availability" }),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("select", { style: styles.input, value: availability, onChange: function (event) { return setAvailability(event.currentTarget.value); } },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("option", { value: "" }, "Any"),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("option", null, "Immediate"),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("option", null, "Under 2 weeks"),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("option", null, "Under 1 month")))),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.workflow },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(WorkflowStep, { number: "1", title: "Discovery", text: "Partners only search anonymized metadata.", styles: styles }),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(WorkflowStep, { number: "2", title: "Qualification", text: "Shortlist profiles by skills, availability, and fit score.", styles: styles }),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(WorkflowStep, { number: "3", title: "Controlled reveal", text: "Identity release requires approval and audit logging.", styles: styles }))))),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("section", { style: styles.resultsLayout },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.resultsPanel },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h2", { style: styles.sectionTitle }, "Matching candidate profiles"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.muted }, "Example result set; the next integration step is binding this to SharePoint metadata or a secure search index."),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.resultList }, rankedProfiles.map(function (profile) { return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("article", { key: profile.id, style: styles.cvCard },
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
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { type: "button", style: styles.secondaryButton }, "Save shortlist")))); }))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("aside", { style: styles.asideStack },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.resultsPanel },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h2", { style: styles.sectionTitle }, "SaaS plans"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.planList }, plans.map(function (plan) { return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("article", { key: plan.name, style: plan.featured ? __assign(__assign({}, styles.plan), styles.featuredPlan) : styles.plan },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", { style: styles.planTitle }, plan.name),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: styles.planCopy }, plan.detail),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: styles.price }, plan.price),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("ul", { style: styles.featureList }, plan.features.map(function (feature) { return react__WEBPACK_IMPORTED_MODULE_0__.createElement("li", { key: feature }, feature); })))); }))),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.resultsPanel },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h2", { style: styles.sectionTitle }, "Compliance"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(WorkflowStep, { number: "G", title: "GDPR-first", text: "Names, contacts, and raw CVs stay protected by default.", styles: styles }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(WorkflowStep, { number: "A", title: "Audit trail", text: "Searches, shortlists, and reveal requests can be logged.", styles: styles })))))));
}
function FieldLabel(_a) {
    var label = _a.label;
    return react__WEBPACK_IMPORTED_MODULE_0__.createElement("label", { style: { display: 'block', fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 } }, label);
}
function Metric(_a) {
    var value = _a.value, label = _a.label, styles = _a.styles;
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.metric },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, value),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null, label)));
}
function WorkflowStep(_a) {
    var number = _a.number, title = _a.title, text = _a.text, styles = _a.styles;
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: styles.workflowStep },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null, number),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, title),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, text))));
}
function buildStyles(primaryColor, secondaryColor, accentTextColor, surfaceColor) {
    return {
        shell: {
            display: 'grid',
            gridTemplateColumns: '280px minmax(0, 1fr)',
            minHeight: 920,
            color: accentTextColor,
            background: surfaceColor,
            fontFamily: 'Aptos, Segoe UI, sans-serif'
        },
        sidebar: {
            background: "linear-gradient(180deg, ".concat(primaryColor, ", ").concat(secondaryColor, ")"),
            color: '#fff',
            padding: '30px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 24
        },
        brand: { fontSize: 38, fontWeight: 800, textTransform: 'lowercase' },
        brandCopy: { margin: '8px 0 0', lineHeight: 1.45, color: 'rgba(255,255,255,0.82)' },
        nav: { display: 'grid', gap: 8 },
        navItem: { padding: '13px 14px', borderRadius: 8, fontWeight: 700 },
        navItemActive: { background: 'rgba(255,255,255,0.18)' },
        sidePanel: { marginTop: 'auto', padding: 16, borderRadius: 8, background: 'rgba(255,255,255,0.14)', display: 'grid', gap: 8 },
        content: { padding: 28, display: 'grid', gap: 22 },
        hero: { display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(320px,0.9fr)', gap: 20, padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 16px 34px rgba(15,23,42,0.07)' },
        eyebrow: { display: 'inline-block', color: secondaryColor, fontWeight: 800, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
        title: { margin: '14px 0 12px', fontSize: 48, lineHeight: 1.05, fontWeight: 800 },
        lead: { margin: 0, color: '#55727b', fontSize: 17, lineHeight: 1.55 },
        heroActions: { display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 },
        primaryButton: { border: 'none', background: "linear-gradient(135deg, ".concat(primaryColor, ", ").concat(secondaryColor, ")"), color: '#fff', padding: '12px 16px', borderRadius: 8, fontWeight: 800, cursor: 'pointer' },
        secondaryButton: { border: '1px solid rgba(16,36,46,0.14)', background: '#fff', color: accentTextColor, padding: '12px 16px', borderRadius: 8, fontWeight: 800, cursor: 'pointer' },
        compactButton: { border: 'none', background: secondaryColor, color: '#fff', padding: '12px 14px', borderRadius: 8, fontWeight: 800, cursor: 'pointer' },
        statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 10 },
        metric: { background: '#f5fbfc', border: '1px solid rgba(16,36,46,0.08)', borderRadius: 8, padding: 16, display: 'grid', gap: 8 },
        searchBand: { background: '#fff', borderRadius: 8, boxShadow: '0 16px 34px rgba(15,23,42,0.07)' },
        searchHeader: { padding: '24px 24px 0' },
        searchGrid: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 18, padding: 24 },
        sectionTitle: { margin: 0, fontSize: 28, lineHeight: 1.15, fontWeight: 800 },
        muted: { margin: '8px 0 0', color: '#55727b', lineHeight: 1.5 },
        panel: { background: '#f5fbfc', border: '1px solid rgba(16,36,46,0.08)', borderRadius: 8, padding: 18, display: 'grid', gap: 14 },
        textarea: { minHeight: 132, border: '1px solid rgba(16,36,46,0.14)', borderRadius: 8, padding: 12, font: 'inherit' },
        inputRow: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 10 },
        input: { border: '1px solid rgba(16,36,46,0.14)', borderRadius: 8, padding: 12, font: 'inherit', width: '100%' },
        chipRow: { display: 'flex', flexWrap: 'wrap', gap: 8 },
        chip: { border: '1px solid rgba(16,36,46,0.14)', background: '#fff', color: accentTextColor, borderRadius: 999, padding: '8px 11px', fontWeight: 700, cursor: 'pointer' },
        chipActive: { borderColor: 'transparent', background: secondaryColor, color: '#fff' },
        twoColumn: { display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12 },
        workflow: { display: 'grid', gap: 10 },
        workflowStep: { display: 'grid', gridTemplateColumns: '34px minmax(0,1fr)', gap: 10, alignItems: 'start', padding: 12, background: '#fff', borderRadius: 8, border: '1px solid rgba(16,36,46,0.08)' },
        resultsLayout: { display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) 360px', gap: 20 },
        resultsPanel: { background: '#fff', borderRadius: 8, padding: 22, boxShadow: '0 16px 34px rgba(15,23,42,0.07)' },
        resultList: { display: 'grid', gap: 14, marginTop: 18 },
        cvCard: { border: '1px solid rgba(16,36,46,0.08)', borderRadius: 8, padding: 18, background: '#fdfefe' },
        cvTop: { display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' },
        candidateId: { display: 'inline-block', background: 'rgba(39,194,198,0.12)', color: secondaryColor, borderRadius: 999, padding: '7px 10px', fontWeight: 800, fontSize: 12 },
        cardTitle: { margin: '10px 0 0', fontSize: 24, lineHeight: 1.15 },
        scoreBox: { minWidth: 96, textAlign: 'right', background: '#fff', border: '1px solid rgba(16,36,46,0.08)', borderRadius: 8, padding: 12 },
        profileSummary: { margin: '12px 0', color: '#55727b', lineHeight: 1.5 },
        skillPills: { display: 'flex', flexWrap: 'wrap', gap: 7 },
        skillPill: { background: '#fff', border: '1px solid rgba(16,36,46,0.08)', borderRadius: 999, padding: '6px 9px', fontSize: 12, fontWeight: 700 },
        cardActions: { display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 14 },
        asideStack: { display: 'grid', gap: 18, alignContent: 'start' },
        planList: { display: 'grid', gap: 12, marginTop: 16 },
        plan: { border: '1px solid rgba(16,36,46,0.08)', borderRadius: 8, padding: 16, background: '#fdfefe' },
        featuredPlan: { background: "linear-gradient(135deg, ".concat(primaryColor, ", ").concat(secondaryColor, ")"), color: '#fff', borderColor: 'transparent' },
        planTitle: { margin: 0, fontSize: 21 },
        planCopy: { margin: '8px 0', lineHeight: 1.45 },
        price: { display: 'block', fontSize: 30, margin: '10px 0' },
        featureList: { margin: 0, paddingLeft: 18, lineHeight: 1.7 }
    };
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
    brandLabel: 'cvtech2',
    portalTitle: 'Partner Portal',
    primaryColor: '#27c2c6',
    secondaryColor: '#136d70',
    accentTextColor: '#16323a',
    surfaceColor: '#eef4f8'
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
                        this.properties.portalTitle = this.properties.portalTitle || DEFAULT_PROPS.portalTitle;
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
    CvTech2PartnerPortalWebPart.prototype.render = function () {
        var element = react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_CvTech2PartnerPortal__WEBPACK_IMPORTED_MODULE_4__["default"], {
            webPartProps: this.properties
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
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneTextField)('brandLabel', { label: 'Brand label' }),
                                (0,_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__.PropertyPaneTextField)('portalTitle', { label: 'Portal title' })
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
    return CvTech2PartnerPortalWebPart;
}(_microsoft_sp_webpart_base__WEBPACK_IMPORTED_MODULE_2__.BaseClientSideWebPart));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CvTech2PartnerPortalWebPart);

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});;
//# sourceMappingURL=cvtech2-partner-portal-web-part.js.map