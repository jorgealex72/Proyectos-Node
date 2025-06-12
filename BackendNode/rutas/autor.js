const {Router} = require("express")
const express = require("express")
const ruta = express.Router();

const {crearAutor} = require ('../controllers/autor')

ruta
.route("/")
.post(crearAutor)

module.exports = ruta