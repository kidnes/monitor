# 数据库字段及说明：

## 1、codeMapList 
类型：list
说明：存储code码映射表，程序中每5分钟检测数据库更新一次
示例：
> lpush codeMapList '310'
> lrange codeMapList 0 -1

## 2、code:301:1434507600
类型：hashs
说明：存储5分钟内数据，code码和时间组成的哈希表，值仅为上报次数
示例：
> GET code:301:1434507600
> INCR code:301:1434507600
> KEYS code:301:1434507600

## 3、user
类型：list
字段：user
说明：维护用户登录列表，列表中用户有权限查看系统

# 服务器运维

## crontab任务
// 每天凌晨执行日志分割和删除操作
0    0    *    *    *   /letv/monitor/back-end/server/nginx/log_splite_del.sh

## 启动后台程序
nohup forever -c "node --harmony" app.js > /dev/null
forever restart app.js


# code码分配表
code值从100至999，分配如下：
100至299为主站使用；
300至499为M站使用；
500至599为播放器使用；
900至999为特殊上报；