const express = require("express");
const serverless = require("serverless-http");
const app = require("../../dist/app").default;

process.env.STORAGE_ROOT = process.env.STORAGE_ROOT || "/tmp/cv-standardizer";

const mountedApp = express();
mountedApp.use("/.netlify/functions/api", app);

exports.handler = serverless(mountedApp);
