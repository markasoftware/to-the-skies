if [ -n $1 ] && [ $1 == "help" ] ; then
    echo "add parameters cu for client side unit, su for server side unit, si for server side integration, or a combination"
else
    for testid in "$@"
    do
        case "$testid" in
            "cu") ttr="client-unit.js" ;;
            "su") ttr="server-unit.js" ;;
            "si") ttr="server-integration" ;;
        esac
    mocha "./test/$ttr"
    done
fi
