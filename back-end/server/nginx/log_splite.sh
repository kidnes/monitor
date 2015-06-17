#!/bin/bash
#
#crontab每天0点执行本脚本
#0    0    *    *    *    /letv/nginx_log/log.sh


cfg_log_path=/letv/nginx_log/access.log

log_name=access.log

y=$(date -d "yesterday" +"%Y")
m=$(date -d "yesterday" +"%m")
d=$(date -d "yesterday" +"%d")

mod_path=/letv/tmp/$y/$m/$d/
mkdir -p $mod_path

mv $cfg_log_path $mod_path$log_name
kill -USR1 `cat /usr/local/nginx/logs/nginx.pid`