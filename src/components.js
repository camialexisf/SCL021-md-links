const fs = require("fs");
const path = require("path");

route = process.argv[2];

const routeCheck = () => {
  fs.existsSync(route);
};

const absoluteLink = (route) => {
  //si la ruta es absoluta, retornar
  if (path.isAbsolute(route) === false) {
    console.log("esto es ruta resuelta " + path.resolve(route));
    return path.resolve(route);
  } else {
    return console.log(route + " es absoluta");
  }
};

const fileType = () => {};
module.exports = {
  routeCheck,
  absoluteLink,
};
