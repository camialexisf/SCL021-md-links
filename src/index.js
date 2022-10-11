const fs = require("fs");
const path = require("path");
const promise = require("promise");

route = process.argv[2];

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
        return;
      } else if (data) {
        data.match(urlRegex).forEach((link) => {
          urlArray.push(link);
        });
        return urlArray;
      }
    });
  });
};

module.exports = {
  routeCheck,
  absoluteLink,
  isFile,
  readDirectory,
  extCheck,
  findUrl,
};
