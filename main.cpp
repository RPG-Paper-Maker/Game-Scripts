/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QDir>
#include <QQmlContext>
#include <QDebug>
#include <iostream>

int main(int argc, char *argv[])
{
    QGuiApplication app(argc, argv);

    #ifdef Q_OS_WIN
        QCoreApplication::setAttribute(Qt::AA_UseOpenGLES);
    #endif

    // The application can now be used even if called from another directory
    QDir bin(qApp->applicationDirPath());
    #ifdef Q_OS_MAC
        bin.cdUp();
        bin.cdUp();
        bin.cdUp();
    #endif
    QDir::setCurrent(bin.absolutePath());

    // Create QML engine
    QQmlApplicationEngine engine;

    // Loading main.qml
    engine.load(QUrl(QStringLiteral("Content/Datas/Scripts/System/desktop/main.qml")));
    return app.exec();
}
