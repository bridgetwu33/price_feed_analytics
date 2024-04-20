#!/bin/bash
source common.sh

# Set the base URL
BASE_URL="http://localhost:9000/api/price"

# Function to make curl requests
make_curl_request() {
    local ENDPOINT="$1"
    local DATA="$2"
    curl -X POST -H 'Content-Type: application/json' "$BASE_URL/$ENDPOINT" --data "$DATA"
    main
}


function prepare_process_data() {
  displayGreen "---------- running prepare process data Date Format  YYYYMMDD (20240305)------------"
  read -p "Enter From Date: " FROM_DATE
  read -p "Enter To Date: " TO_DATE
  read -p "Include From Date (true/false): " INCLUDE_FROM_DATE
  read -p "Enter To type("CHAINLINK_ETH_USD"):: " TYPE
  make_curl_request "prepareProcessData" "{\"from\": \"$FROM_DATE\", \"to\": \"$TO_DATE\", \"includeFromDate\": $INCLUDE_FROM_DATE, \"type\": \"$TYPE\"}"
  main
}


function main() {

    if [ -z "$NON_INTERACTIVE" ]; then
            flagmain=true
        echo ""
            echo -e $YELLOW'Please enter a choice: \n\n' \
             $GRAY'1) Prepare Process Data \n' \
             $RED'*) Enter any other key to Exit'
        echo ""
            printf $WHITE'choice (1-n): '$COLOR_END

            read choice
    fi

    case $choice in
        1)
            prepare_process_data;;
        *)
            echo "Exit" ;;
    esac
}
SHOW_MENU=1
if [[ $# -gt 0 ]]; then
    SHOW_MENU=0
fi

main $@