const fs = require("fs");
const path = require("path");
const promise = require("promise");
const colors = require("colors");
const markdownLinkExtractor = require("markdown-link-extractor");
const linkCheck = require("link-check");

const route = process.argv[2];

const routeCheck = () => {
  fs.existsSync(route);
};

const absoluteLink = (route) => {
  //si la ruta es absoluta, retornar
  if (path.isAbsolute(route) === false) {
    path.resolve(route);
    return path.resolve(route);
  } else {
    return route;
  }
};

const isFile = (path) => {
  if (fs.statSync(path).isFile() === true) {
    return true;
  } else {
    return false;
  }
};

const readDirectory = (route) => {
  //aca quiero iterar el directorio
  return new promise((resolve, reject) => {
    const mdFiles = [];
    fs.readdirSync(route, "utf-8", (err, files) => {
      if (err) {
        reject(err);
      }
      console.log("encontré estos archivos: ");
      files.forEach((file) => {
        if (extCheck(route) === true) {
          console.log(file);
          mdFiles.push(route);
        }
      });
      console.log("analisis");
      resolve(mdFiles);
    });
  });
};

const extCheck = (route) => {
  //Aca quiero chequear la extension del archivo
  //si la extension es .md retorna true
  if (path.extname(route) === ".md") {
    return true;
  } else {
    //si la extension no es .md retorna false
    return false;
  }
};
const uniqueUrl = (linksArray) => {
  let unique = new Set(linksArray);
  console.log("links Unicos: ".cyan, [...unique].length);
};
//aca estoy usando la libreria para extraer links
const extractLinks = (route) => {
  const linksArray = [];
  const markdown = fs.readFileSync(route, { encoding: "utf-8" });
  const { links } = markdownLinkExtractor(markdown);
  links.forEach((link) => linksArray.push(link));
  return linksArray;
};
//funcion que checkea el estado de los links
const usingLinkCheck = (route) => {
  linkCheck(route, function (err, result) {
    const resultLink = result.link;
    //const broken = [];
    if (err) {
      console.error(err);
      return;
    }
    if (result.status === "dead") {
      console.log(`${resultLink} `.cyan + " fail ".bgRed + "");
    } else if (result.status === "alive") {
      console.log(`${resultLink} `.cyan + " ok ".bgGreen + "");
    }
  });
};

module.exports = {
  routeCheck,
  absoluteLink,
  isFile,
  readDirectory,
  extCheck,
  //findUrl,
  uniqueUrl,
  extractLinks,
  usingLinkCheck,
  //validateLink,
  //brokenCount,
};

//---------------------------------------------------------
/* 
const findUrl = (mdFiles) => {
  return new promise((resolve, reject) => {
    const urlArray = [];
    const urlRegex =
      /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;
    fs.readFile(mdFiles, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      } else if (data.match(urlRegex) === null) {
        reject("No se encuentran links en el documento");
      } else if (data) {
        data.match(urlRegex).forEach((link) => {
          urlArray.push(link);
          //console.log(link);
        });
        resolve(urlArray);
      }
    });
  });
};
//ESTE SE USA ASI EN FUNCION MD --->
    
     findUrl(absoluteUserInput).then((url) => {
            url.forEach((link) => {
              urlArray.push(link);
              //console.log(link);
            });
            resolve(urlArray);
          }); */
