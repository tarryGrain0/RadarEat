#!/bin/bash

mkdir backend
mkdir frontend
mkdir nginx
mkdir nginx/ssl
touch docker-compose.yml
touch backend/Dockerfile
touch frontend/Dockerfile
touch nginx/nginx.conf

# 証明証の作成
mkcert -key-file nginx/ssl/key.pem -cert-file nginx/ssl/cert.pem localhost

# Create a backend directory and initialize a Node.js project
npx create-next-app@latest ./frontent --ts

# APIサーバーのセットアップ
cd backend
bundle init
echo "gem 'rails'" >> Gemfile
bundle install
bundle exec rails new . --api --force --skip-bundle
bundle install