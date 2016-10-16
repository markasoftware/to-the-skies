if [ -z "$1" ] ; then
    $0 cu su lg ac am ap gs apm apmg;
    exit $?;
fi
excode=0;
if [ "$1" == "help" ] ; then
    echo 'Use the following parameters to specify which tests to run. A combination of them is ok.'
    echo 'cu: Client-side';
    echo 'su: Server-side Unit';
    echo 'lg: Server-side Login Integration';
    echo 'ac: Server-side Character API integration';
    echo 'am: Server-side Character movement integration';
    echo 'ap: Server-side Paths API integration';
    echo 'gs: Server-side general integration';
    echo 'apm: Server-side Path Modification API Basic Integration';
    echo 'apmg: Server-side Path Modification API Full Integration';
else
    for testid in "$@"
    do
        case "$testid" in
            "cu") ttr="client-unit/*.js" ;;
            "su") ttr="server-unit/*.js" ;;
            "lg") ttr="other/login.js" ;;
            "ac") ttr="api-integration/characters.js" ;;
            "am") ttr="api-integration/character-movement.js" ;;
            "ap") ttr="api-integration/paths.js" ;;
            "gs") ttr="other/general-server-integration.js" ;;
            "apm") ttr="api-integration/path-modification.js" ;;
            "apmg") ttr="api-integration/path-modification-get.js" ;;
        esac
    mocha "./test/$ttr"
    lexcode=$?;
    [ $excode -gt $lexcode ] && echo '' || excode=$lexcode;
    done
fi
exit $excode;
