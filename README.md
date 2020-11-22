# Game-Scripts

Game and scripts used for RPG Paper Maker

## How to install

This is using electron.js framework. Download it according to your environment:

https://www.electronjs.org/docs/tutorial/development-environment

Then use:

	npm install

Wait for the complete install and post-install with this command.

## How to run

First, complete the `Content` folder thanks to any recent project you want to test here (copy every file in `resources/app/Content` folder of any project you created with RPG Paper Maker, except the `Content/Datas/Scripts` folder).

When it's done, just run:

	npm start

## Structure
The RPM cores script files are ESM (ecmascript module system) based. 
It's split into 9 modules:
  * Core 
     > The core files who power the engine whole behaviours. 
  * System 
    > The data interface files. Its allow to interact with the raw json data of RPM.
  * Game 
    > The game object related files. It empowers most of the game logics.
  * Scene
    > The module who hold all the scenes
  * Manager
    > The module who hold all the manager class.
  * Commons
    > The previously named RPM class, It was refactored and split into useful subclasses.
  * Graphics
    > The module who hold all the Graphics related class.
  * Windows
    > The module who hold all the windows related class.
  * Datas
    > The module who hold all the datas.
 
 ## Usages
  The RPM corescript is Typescript based but has compiled javascript so can be still used
  here's an example of plugin file. 
   Note : still in dev.
  ```ts
   import {Management, Game} from "rpm";
   import PluginManager = Management.PluginManager; 
   // global in module are private to the file so it's fine to do this.
   const parameters = PluginManager.fetch("MyAwesomePlugin");
   
   export class MyCustomClass extends Game.Base {
     // ETC
     constructor(){ 
       super();
     }
   }
   ```	