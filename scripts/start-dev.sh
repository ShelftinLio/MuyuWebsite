#!/bin/bash

# 设置颜色
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
NC="\033[0m" # 重置颜色

echo -e "${BLUE}=== 木鱼书网站开发环境启动脚本 ===${NC}"

# 检查环境变量文件
check_env_file() {
  local env_example="$1/.env.example"
  local env_file="$1/.env"
  
  if [ ! -f "$env_file" ]; then
    echo -e "${YELLOW}警告: $env_file 不存在${NC}"
    echo -e "${YELLOW}正在从 $env_example 创建...${NC}"
    
    if [ -f "$env_example" ]; then
      cp "$env_example" "$env_file"
      echo -e "${GREEN}已创建 $env_file，请根据需要修改其中的配置${NC}"
    else
      echo -e "${YELLOW}错误: $env_example 不存在，无法创建 $env_file${NC}"
      return 1
    fi
  fi
  
  return 0
}

# 启动前端服务
start_frontend() {
  echo -e "${BLUE}正在启动前端服务...${NC}"
  cd frontend
  
  # 检查环境变量文件
  check_env_file . || return 1
  
  # 安装依赖
  if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}正在安装前端依赖...${NC}"
    npm install
  fi
  
  # 启动开发服务器
  npm run dev &
  FRONTEND_PID=$!
  echo -e "${GREEN}前端服务已启动，PID: $FRONTEND_PID${NC}"
  
  cd ..
  return 0
}

# 启动后端服务
start_backend() {
  echo -e "${BLUE}正在启动后端服务...${NC}"
  cd backend
  
  # 检查环境变量文件
  check_env_file . || return 1
  
  # 安装依赖
  if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}正在安装后端依赖...${NC}"
    npm install
  fi
  
  # 启动开发服务器
  npm run dev &
  BACKEND_PID=$!
  echo -e "${GREEN}后端服务已启动，PID: $BACKEND_PID${NC}"
  
  cd ..
  return 0
}

# 清理进程
cleanup() {
  echo -e "\n${YELLOW}正在关闭服务...${NC}"
  
  if [ ! -z "$FRONTEND_PID" ]; then
    echo -e "${YELLOW}关闭前端服务 (PID: $FRONTEND_PID)${NC}"
    kill $FRONTEND_PID 2>/dev/null
  fi
  
  if [ ! -z "$BACKEND_PID" ]; then
    echo -e "${YELLOW}关闭后端服务 (PID: $BACKEND_PID)${NC}"
    kill $BACKEND_PID 2>/dev/null
  fi
  
  echo -e "${GREEN}所有服务已关闭${NC}"
  exit 0
}

# 设置清理钩子
trap cleanup SIGINT SIGTERM

# 主函数
main() {
  # 启动后端
  start_backend || {
    echo -e "${YELLOW}后端启动失败${NC}"
    cleanup
    return 1
  }
  
  # 启动前端
  start_frontend || {
    echo -e "${YELLOW}前端启动失败${NC}"
    cleanup
    return 1
  }
  
  echo -e "\n${GREEN}所有服务已启动${NC}"
  echo -e "${BLUE}前端地址: http://localhost:3000${NC}"
  echo -e "${BLUE}后端地址: http://localhost:5001${NC}"
  echo -e "${YELLOW}按 Ctrl+C 停止所有服务${NC}"
  
  # 保持脚本运行
  wait
}

# 执行主函数
main