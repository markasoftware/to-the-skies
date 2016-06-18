if [ -z "$1" ] ; then
    $0 cu su si db;
    exit $?;
fi
excode=0;
if [ "$1" == "help" ] ; then
    echo "add parameters cu for client side unit, su for server side unit, si for server side integration, db for database tests, or a combination of those"
else
    for testid in "$@"
    do
        case "$testid" in
            "cu") ttr="client-unit.js" ;;
            "su") ttr="server-unit.js" ;;
            "si") ttr="server-integration" ;;
            "db") ttr="db" ;;
        esac
    mocha "./test/$ttr"
    lexcode=$?;
    [ $excode -gt $lexcode ] &&  echo '' || excode=$lexcode;
    done
fi
exit $excode;
