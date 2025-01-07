require("dotenv").config();
const Plugins = require("./src/plugins");
const { Color } = require("./src/color");
const { MONGODB } = require("./src/mongo");
const Function = new (require("./src/functions"))();
const Levelling = require("./src/levelling");
module.exports = class Component {
  Plugins = Plugins;
  Color = Color;
  MongoDB = MONGODB;
  Function = Function;
  levelling = Levelling;
};