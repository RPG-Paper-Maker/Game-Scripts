# Game-Scripts

Game and scripts used for RPG Paper Maker

## How to install

This is using electron.js framework.

Use:

    npm install

Wait for the complete install with this command.

You also need to have a project to test. You can run this command to automaticaly copy the `project-without-name` project folder you have in `pathToYourDocuments/RPG Paper Maker Games`:

    npm run copyProject

You can change the project at anytime by reusing this command.

## How to run

Just use this command:

    npm run start

## How to contribute

You can help by contributing on the game engine. First, be sure to be familiar with **git**, how to **fork a project** and how to **submit a pull request**.

That means that you should:

-   Click on the fork button.
-   Clone your fork.
-   Add a remote to the original project in order to always have access to the `develop` branch:

```bash
git remote add rpm https://github.com/RPG-Paper-Maker/Game-Scripts.git
```

Before starting any correction, you should first pull **REBASE** (it's very important to not create awful merge commits and then use --rebase option when pulling) the `develop` branch progress in order to be sure that you have the most recent version of development:

```bash
git pull --rebase rpm develop
```

After that, you can create a branch for your correction (or stay on your develop branch):

```bash
git checkout -b <choose_a_branch_name>
```

Don't forget to pull rebase before submitting your PR!

## Structure

The RPM cores script files are ESM (ecmascript module system) based.
It's split into 9 modules:

-   Core
    > The core files who power the engine whole behaviours.
-   System
    > The data interface files. Its allow to interact with the raw json data of RPM.
-   Game
    > The game object related files. It empowers most of the game logics.
-   Scene
    > The module who hold all the scenes
-   Manager
    > The module who hold all the manager class.
-   Commons
    > The previously named RPM class, It was refactored and split into useful subclasses.
-   Graphics
    > The module who hold all the Graphics related class.
-   Windows
    > The module who hold all the windows related class.
-   Datas
    > The module who hold all the datas.

## Usages

The RPM corescript is Typescript based but has compiled javascript so can be still used
here's an example of plugin file.
Note : still in dev.

```ts
import { Management, Game } from 'rpm';
import PluginManager = Management.PluginManager;
// global in module are private to the file so it's fine to do this.
const parameters = PluginManager.fetch('MyAwesomePlugin');

export class MyCustomClass extends Game.Base {
	// ETC
	constructor() {
		super();
	}
}
```
