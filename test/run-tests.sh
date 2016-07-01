if [ -z "$1" ] ; then
    $0 cu su db lg;
    exit $?;
fi
excode=0;
if [ "$1" == "help" ] ; then
    echo 'Use the following parameters to specify which tests to run. A combination of them is ok.'
    echo 'cu: Client-side Unit';
    echo 'su: Server-side Unit';
    echo 'db: Server-side DB Interface Unit-ish';
    echo 'lg: Server-side Login Integration';
else
    for testid in "$@"
    do
        case "$testid" in
            "cu") ttr="client-unit.js" ;;
            "su") ttr="server-unit.js" ;;
            "db") ttr="db.js" ;;
            "lg") ttr="login.js" ;;
        esac
    mocha "./test/$ttr"
    lexcode=$?;
    [ $excode -gt $lexcode ] && echo '' || excode=$lexcode;
    done
fi
exit $excode;
