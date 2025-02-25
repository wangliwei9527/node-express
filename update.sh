#!/bin/bash
PROJECT_DIR="/install/node-express"
ENTRY_FILE="app.js"
GIT_BRANCH="main"
LOG_FILE="/install/node-express/forever.log"

cd "$PROJECT_DIR" || { echo "目录错误"; exit 1; }

# 静默停止服务（如果正在运行）
/install/node/node14/bin/forever stop "$ENTRY_FILE" >/dev/null 2>&1 || true

# 拉取代码（带错误回滚）
if git pull origin "$GIT_BRANCH"; then
    echo "代码更新成功"
else
    echo "代码拉取失败，使用本地最新版本"
fi

# 无论成功与否都重启
/install/node/node14/bin/forever start -l "$LOG_FILE" -a "$ENTRY_FILE"