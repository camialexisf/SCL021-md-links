#!/usr/bin/env node
const { routeCheck, absoluteLink } = require("./components");

const route = process.argv[2];
const absoluteUserInput = absoluteLink(route);

const mdLinks = () => {
  return new Promise((resolve, reject) => {
    if (routeCheck(route) === false) {
      reject("la ruta no es valida :(");
    } else {
      absoluteUserInput;
    }
  });
};
mdLinks();
