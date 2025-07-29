# NestJS博客系统API

这是一个基于NestJS和TypeORM构建的博客系统后端API，支持用户认证、文章管理、标签分类和文件上传等功能。系统采用模块化设计，具有良好的可扩展性和可维护性。

## 项目简介

- **技术栈**：NestJS、TypeORM、MySQL、JWT、腾讯云COS
- **主要功能**：用户认证、文章管理、标签分类、文件上传、数据统计
- **架构设计**：采用分层架构，包括控制器层、服务层、数据访问层
- **响应格式**：统一的JSON响应格式，包含code、status、message和data字段

## 项目结构

```
serve/
├── src/
│   ├── app.module.ts          # 应用根模块
│   ├── main.ts                # 应用入口文件
│   ├── users/                 # 用户模块
│   ├── articles/              # 文章模块
│   ├── tags/                  # 标签模块
│   ├── classifies/            # 分类模块
│   ├── classify/              # 分类实体模块
│   └── uploads/               # 文件上传模块
├── dist/                      # 编译输出目录
├── node_modules/              # 项目依赖
├── package.json               # 项目配置和依赖
├── tsconfig.json              # TypeScript配置
├── README.md                  # 项目说明文档
├── .env.example               # 环境变量示例
└── .gitignore                 # Git忽略文件
```

## 安装步骤

### 1. 克隆项目

```bash
git clone https://github.com/your-username/nestjs-blog-api.git
cd nestjs-blog-api
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制`.env.example`文件并重命名为`.env`，然后填写实际的环境变量值：

```bash
cp .env.example .env
# 编辑.env文件，设置数据库和腾讯云COS的配置
```

### 4. 初始化数据库

确保MySQL服务已启动，然后执行SQL脚本初始化数据库：

```bash
mysql -u root -p < myblog.sql
```

### 5. 运行项目

#### 开发模式

```bash
npm run start:dev
```

#### 生产模式

```bash
npm run build
npm run start:prod
```

## 使用示例

### 用户注册

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"123456"}'
```

### 用户登录

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"123456"}'
```

### 创建文章

```bash
curl -X POST http://localhost:3000/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"测试文章","content":"文章内容","tags":[1,2],"classifyId":1}'
```

## 部署指南

### Docker部署

```bash
docker-compose up -d
```

### 服务器部署

1. 安装Node.js和npm
2. 克隆项目并安装依赖
3. 配置环境变量
4. 构建项目
5. 使用PM2管理进程

```bash
npm install -g pm2
npm run build
pm run start:prod
```

## 贡献指南

欢迎贡献代码！请先阅读[CONTRIBUTING.md](CONTRIBUTING.md)了解贡献流程和代码规范。

## 单元测试

本项目使用Jest进行单元测试，已为核心服务添加了完整的测试用例。

### 运行测试

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test articles.service.spec.ts

# 运行测试并生成覆盖率报告
npm test -- --coverage
```

### 测试覆盖范围

目前已为以下服务添加了单元测试：
- 文章服务 (articles.service.ts)
- 标签服务 (tags.service.ts)
- 分类服务 (classifies.service.ts)

每个服务的测试覆盖了以下功能：
- 创建资源
- 查询资源列表
- 查询单个资源
- 更新资源
- 删除资源

### 测试目录结构

测试文件与源代码文件放在同一目录下，使用`.spec.ts`后缀命名：

```
src/
├── articles/
│   ├── articles.service.ts
│   └── articles.service.spec.ts
├── tags/
│   ├── tags.service.ts
│   └── tags.service.spec.ts
└── classifies/
    ├── classifies.service.ts
    └── classifies.service.spec.ts
```

### 测试编写指南

1. 使用Jest框架编写测试
2. 使用`@nestjs/testing`提供的测试工具
3. 模拟依赖项，特别是数据库操作
4. 测试所有可能的场景，包括成功和失败情况
5. 保持测试代码简洁明了

## 许可证

本项目采用MIT许可证。详情请见[LICENSE](LICENSE)文件。