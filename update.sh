#!/bin/bash

# 项目路径配置
PROJECT_DIR="/install/node-express"
NODE_BIN="/install/node/node14/bin"

# 停止服务
$NODE_BIN/forever stop $PROJECT_DIR/app.js

# 拉取代码
cd $PROJECT_DIR || exit 1
git pull origin main || echo "代码拉取失败，使用本地版本"

# 重启服务
$NODE_BIN/forever start -l $PROJECT_DIR/forever.log -a $PROJECT_DIR/app.js