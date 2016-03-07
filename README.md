# 懒投资变现监控脚本

## 这是什么
监控懒投资的变现计划页面，筛选出较高收益、较短时间的项目。并发送邮件给指定的电子邮箱。

## 环境配置
- 确保有nodejs环境 (https://nodejs.org/en/)
- 通过git获取最新的代码
- npm install 安装相关依赖包

## 如何使用
- 进入源码目录。 运行 `node index.js -h`可以获取命令帮助
- 完整的命令如： `node index.js -d 50 -p 9 -m myemail@mail.com ` 表示选取最多50天，收益在9以上的项目，发送到myemail@mail.com
- 建议放在crontab下执行。
- 如果电子邮件打开到达提醒短信，则风味更佳。
- crontab注意使用全路径
