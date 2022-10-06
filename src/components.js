let fs = require("fs");

route = process.argv[2];

const routeCheck = () => {
  if (fs.existsSync(route) == true) {
    console.log("La ruta es valida");
  } else {
    console.log("la ruta no existe");
  }
};
module.exports = { routeCheck };
