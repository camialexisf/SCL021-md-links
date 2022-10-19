#!/usr/bin/env node
const {
  routeCheck,
  absoluteLink,
  isFile,
  readDirectory,
  extCheck,
  //findUrl,
  extractLinks,
  uniqueUrl,
  usingLinkCheck,
  //validateLink,
  //brokenCount,
} = require("./index.js");
const colors = require("colors");
const fs = require("fs");
const markdownLinkExtractor = require("markdown-link-extractor");
const linkCheck = require("link-check");

const route = process.argv[2];
const options = process.argv[3];
const absoluteUserInput = absoluteLink(route);
const foundLinks = extractLinks(absoluteUserInput);

const mdLinks = (route, options) => {
  return new Promise((resolve, reject) => {
    const urlArray = [];
    const broken2 = [];
    if (absoluteUserInput) {
      //ES FILE?
      if (isFile(absoluteUserInput) === true) {
        //ES .MD?
        if (extCheck(absoluteUserInput) === false) {
          // NO ES MD
          reject(new Error("no es un archivo .md".red));
          return;
          //SI ES MD
        } else {
          //aca se retorna la cantidad de link unicos

          uniqueUrl(foundLinks);
          foundLinks.forEach((link) => usingLinkCheck(link));
        }
      } else {
        return console.log("hola " + readDirectory(absoluteUserInput));
      }
    }
  });
};

mdLinks()
  .then((resolve) => {
    console.log(resolve);
  })
  .catch((err) => console.log(err.message));
