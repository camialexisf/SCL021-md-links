const fs = require("fs");
const path = require("path");
const promise = require("promise");
const colors = require("colors");
const markdownLinkExtractor = require("markdown-link-extractor");
const linkCheck = require("link-check");
const { reject } = require("promise");

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
const readNewFile = (route) => {
  return new Promise((resolve, reject) => {
    fs.readFile(route, "utf-8", (err, file) => {
      if (err) {
        throw err;
      }
      if (!isFile(route)) {
        reject("No se puede leer el archivo".cyan + file);
      }
      resolve(file);
    });
  });
};

const readDirectory = (route) => {
  //aca quiero iterar el directorio
  return new Promise((resolve, reject) => {
    const mdFiles = [];
    fs.readdirSync(route, "utf-8", (err, files) => {
      if (err) {
        reject(err);
      }
      console.log("encontré estos archivos: ");
      files.forEach((file) => {
        if (extCheck(file) === true) {
          mdFiles.push(file);
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
  return [...unique].length;
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
  return new Promise((resolve, reject) => {
    //const objectLink = route.link;
    linkCheck(route, function (err, result) {
      if (err) {
        reject("No se pudieron comprobar los links: " + result.link);
        //console.error(err);
        return;
      }
      let statusResponse = "";
      if (result.status === "dead") {
        statusResponse = "FAIL";
      } else if (result.status === "alive") {
        statusResponse = "OK";
      }
      resolve({
        file: process.argv[2],
        href: result.link,
        statusCode: result.statusCode + " " + statusResponse,
        //status: statusResponse,
      });
    });
  });
};
("");
const optionStats = (linksArray) => {
  const total = linksArray.length;
  const unique = uniqueUrl(linksArray);
  return { total, unique };
};
const optionValidateStats = (linksArray, totalUnique) => {
  let broken = linksArray.filter((e) => e.status === "fail").length;
  return { ...totalUnique, broken: broken };
};
const thirdPosition = (options) => {
  let option;
  if (process.argv[3] === "--validates" && process.argv[4] === "--stats") {
    option = { validates: true, stats: true };
  } else if (process.argv[3] === "--stats") {
    option = { stats: true };
  } else if (process.argv[3] === "--validate") {
    option = { validates: true };
  } else {
    option = {};
  }
  return option;
};

module.exports = {
  routeCheck,
  absoluteLink,
  isFile,
  readDirectory,
  extCheck,
  readNewFile,
  extractLinks,
  usingLinkCheck,
  optionValidateStats,
  thirdPosition,
  optionStats,
};
