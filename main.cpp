/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
