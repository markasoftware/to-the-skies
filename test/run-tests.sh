if [ -z "$1" ] ; then
    $0 cl su db lg nd;
    exit $?;
fi
excode=0;
if [ "$1" == "help" ] ; then
    echo 'Use the following parameters to specify which tests to run. A combination of them is ok.'
    echo 'cu: Client-side';
    echo 'su: Server-side Unit';
    echo 'db: Server-side DB Interface Unit-ish';
    echo 'lg: Server-side Login Integration';
    echo 'nd: Server-side Integration without DB interaction';
else
    for testid in "$@"
    do
        case "$testid" in
            "cl") ttr="client.js" ;;
            "su") ttr="server-unit.js" ;;
            "db") ttr="db.js" ;;
            "lg") ttr="login.js" ;;
            "nd") ttr="no-db-server-integration.js"
        esac
    mocha "./test/$ttr"
    lexcode=$?;
    [ $excode -gt $lexcode ] && echo '' || excode=$lexcode;
    done
fi
exit $excode;
