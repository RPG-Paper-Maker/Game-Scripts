# Game-Scripts

Original TS code used for RPG Paper Maker Core code.

## How to build the project

### Pre-requirements

-   [Node.js](https://nodejs.org/en)
-   IDE: we strongly recommend you to use [Visual Studio Code](https://code.visualstudio.com/), and also install the ESLint extensions. For prettier: you can enable the format on save by: opening VSCode, CTRL + SHIFT + P > "Preferences: Open User Settings: (JSON)", and add this in the `settings.json`:

```json
    "editor.formatOnSave": true,
    "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[typescriptreact]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[javascript]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[json]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "editor.codeActionsOnSave": {
        "source.organizeImports": "explicit"
    }
```

-   For Windows users only: we recommend to use [Git for Windows](https://gitforwindows.org/) and use GIT BASH functionnality to run all the next following commands (right click in desired folder and click on Git Bash). You can also use default Windows PowerShell.

### Build

Install node dependencies:

```bash
npm install
```

You also need to have a project to test. You can run this command to automaticaly copy the `project-without-name` project folder you have in `pathToYourDocuments/RPG Paper Maker Games`:

```bash
npm run copy-project
```

You can change the project at anytime by reusing this command.

## How to run

Just use this command:

```bash
npm start
```

## Game script build

`npm start` will compile ts code and create complete the build/scripts folder. You can copy this content to [https://github.com/RPG-Paper-Maker/Game-Scripts-Build](https://github.com/RPG-Paper-Maker/Game-Scripts-Build) and push to game scripts thanks to the command:

```bash
npm run push-build
```

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
-   Data
    > The module who hold all the datas.
