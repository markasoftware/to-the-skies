if [ -z "$1" ] ; then
    $0 cu su db lg nd ac am ap gs;
    exit $?;
fi
excode=0;
if [ "$1" == "help" ] ; then
    echo 'Use the following parameters to specify which tests to run. A combination of them is ok.'
    echo 'cu: Client-side';
    echo 'su: Server-side Unit';
    echo 'lg: Server-side Login Integration';
    echo 'nd: Server-side Integration without DB interaction';
    echo 'ac: Server-side Character API integration';
    echo 'am: Server-side Character movement integration';
    echo 'ap: Server-side Paths API integration';
    echo 'gs: Server-side general integration';
else
    for testid in "$@"
    do
        case "$testid" in
            "cu") ttr="*.cu.js" ;;
            "su") ttr="*.su.js" ;;
            "lg") ttr="login.js" ;;
            "nd") ttr="no-db-server-integration.js" ;;
            "ac") ttr="characters-api.js" ;;
            "am") ttr="character-movement.js" ;;
            "ap") ttr="paths.js" ;;
            "gs") ttr="general-server-integration.js"
        esac
    mocha "./test/$ttr"
    lexcode=$?;
    [ $excode -gt $lexcode ] && echo '' || excode=$lexcode;
    done
fi
exit $excode;
