#!/bin/bash


log_path=/letv/nginx_log/
log_back=/letv/nginx_log_backup/

log_name=access.log

today=$(date +%Y%m%d)
yesterday=$(date -d "yesterday" +"%Y%m%d")

target_path=$log_back$yesterday
mkdir -p $target_path

mv $log_path$log_name $target_path/$log_name
kill -USR1 `cat /usr/local/nginx/logs/nginx.pid`


#删除超过3天日志
all_list=`ls $log_back | xargs -n 1`
for del in $all_list
do
    let results=$today-$del
    if [ $results -gt 3 ]; then
    rm -rf $log_back$del
fi
done

