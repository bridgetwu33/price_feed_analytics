#!/bin/bash

start() {

    echo "Run launcher script"
    cd /root/pricer-app/blockchain_pricer
    npm run stop-price-server
    npm run start-price-server
}

stop() {
    echo "Stop the running process"
    # Assuming you have the process ID stored somewhere, otherwise you need to adjust this command
    cd /root/pricer-app/blockchain_pricer
    npm run stop-price-server
}


case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    *)
        echo "Usage: $0 {start|stop}"
        exit 1
        ;;
esac

exit 0