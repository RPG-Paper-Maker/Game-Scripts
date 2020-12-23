import { Interpreter } from "../../System/Common/index.js";
import { Manager } from "../../System/index.js";

let pluginName = "Console";

console.log("plugin executed");
Interpreter.evaluate('console.log("interpreted" + Core.MapObject.SPEED_NORMAL)');
console.log(Manager.Plugins.getParameter(pluginName, "myparam").mylist.getValue()[2].getValue());
