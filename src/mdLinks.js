#!/usr/bin/env node
const {
  routeCheck,
  absoluteLink,
  isFile,
  readDirectory,
  extCheck,
  findUrl,
} = require("./index.js");

const route = process.argv[2];
const absoluteUserInput = absoluteLink(route);

const mdLinks = () => {
  return new Promise((resolve, reject) => {
    const urlArray = [];
    if (absoluteUserInput) {
      //aca se comprobará si es directory es true
      if (isFile(absoluteUserInput) === true) {
        //chequear si es extension .md
        if (extCheck(absoluteUserInput) === false) {
          reject(new Error("no es un archivo .md"));
          return;
        } else {
          //es archivo .md por lo tanto se recorre el archivo para buscar los links
          findUrl(absoluteUserInput).then((url) => {
            url.forEach((link) => {
              urlArray.push(link);
            });
          });
          resolve(console.log(urlArray));
        }
      } else {
        return console.log("hola " + readDirectory(absoluteUserInput));
      }
    }
  });
};

mdLinks()
  .then(() => {
    console.log("funciona?");
  })
  .catch((err) => console.log(err.message));
