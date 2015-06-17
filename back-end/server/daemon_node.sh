#!/bin/sh 

while : 
do 
stillRunning=$(ps -ef |grep "app.js" |grep -v "grep") 
if [ "$stillRunning" ] ; then 
    echo "is running" 
else
    echo "app.js was starting!" 
    node --harmony ../app.js
fi 
sleep 10 
done 