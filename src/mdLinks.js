#!/usr/bin/env node
const { routeCheck } = require("./components");

route = process.argv[2];

routeCheck(route);
