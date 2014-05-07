cd C:\java\svn\git\PlayTheInternet
echo ^<log^> > C:\java\svn\git\PlayTheInternet\kladecytChangeLog\files\log.xml
git log master -g --pretty=format:"<logentry><msg>%%B</msg></logentry>" >> C:\java\svn\git\PlayTheInternet\kladecytChangeLog\files\log.xml
echo ^</log^> >> C:\java\svn\git\PlayTheInternet\kladecytChangeLog\files\log.xml
