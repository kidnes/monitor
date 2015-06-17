#!/bin/sh 

while : 
do 
stillRunning=$(ps -ef |grep "app.js" |grep -v "grep") 
if [ "$stillRunning" ] ; then 
    echo "is running" 
else 
    node --harmony app.js
    echo "app.js was started!" 
fi 
sleep 10 
done 