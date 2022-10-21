#!/usr/bin/env node
const {
  routeCheck,
  absoluteLink,
  isFile,
  readDirectory,
  extCheck,
  readNewFile,
  extractLinks,
  optionStats,
  usingLinkCheck,
  optionValidateStats,
  thirdPosition,
} = require("./index.js");
const colors = require("colors");
/*const fs = require("fs");
const markdownLinkExtractor = require("markdown-link-extractor");
const linkCheck = require("link-check");
const { resolve } = require("path");
const { reject } = require("promise"); */

const route = process.argv[2];
const options = process.argv[3];
const absoluteUserInput = absoluteLink(route);
const foundLinks = extractLinks(absoluteUserInput);

const mdLinks = (route, options) => {
  return new Promise((resolve, reject) => {
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
          readNewFile(absoluteUserInput)
            .then((file) => {
              foundLinks.forEach((link) => usingLinkCheck(link));
            })
            .then((res) => {
              if (options.validates !== true && options.stats !== true) {
                return res;
              } else if (options.validates === true && options.stats === true) {
                return Promise.all(foundLinks.map((e) => usingLinkCheck(e)));
              } else if (options.stats === true) {
                return optionStats(foundLinks);
              } else {
                return Promise.all(foundLinks.map((e) => usingLinkCheck(e)));
              }
            })
            .then((res) => {
              if (options.validates !== true && options.stats !== true) {
                resolve(
                  foundLinks.map((e) => `${route}   ${e}\n`.cyan).join("")
                );
              } else if (options.validates === true && options.stats === true) {
                console.log(
                  optionValidateStats(foundLinks, optionStats(foundLinks))
                );
              } else if (options.stats === true) {
                //ACA TAMBIEN DEBERIA DEVOLVER HREF Y RUTA
                resolve(`Total: ${res.total}\nUnique: ${res.unique}`);
              } else {
                resolve(
                  res
                    .map((e) => `${route} ${e} ${e.statusCode} ${e.status}\n`)
                    .join("")
                );
              }
            })
            .catch((error) => {
              console.log(error);
              reject("Existe un problema en la ejecucion");
            });
        }
      }
    }
  });
};

mdLinks(route, thirdPosition(process))
  .then((resolve) => {
    console.log(resolve);
  })
  .catch((err) => console.log(err.message));
