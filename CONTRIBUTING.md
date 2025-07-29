# 贡献指南

欢迎参与本项目的开发和维护！以下是贡献代码的流程和规范，请在提交代码前仔细阅读。

## 提交Issue

1. 如果你发现了bug或者有新功能建议，请先搜索已有的Issue，确保没有重复。
2. 如果没有找到相关Issue，请创建一个新的Issue，提供详细的描述：
   - 对于bug：描述问题现象、复现步骤、期望结果和实际结果
   - 对于新功能：描述功能需求、使用场景和实现思路
3. 为Issue添加合适的标签，如`bug`、`feature`、`enhancement`等。

## 提交PR

1. **Fork仓库**：点击仓库页面右上角的`Fork`按钮，将项目Fork到自己的GitHub账户。

2. **克隆代码**：将Fork后的仓库克隆到本地：
   ```bash
   git clone https://github.com/your-username/nestjs-blog-api.git
   cd nestjs-blog-api
   ```

3. **创建分支**：从`main`分支创建一个新的分支，分支名称应能反映修改内容：
   ```bash
   git checkout -b feature/add-new-function
   # 或
   git checkout -b fix/bug-description
   ```

4. **修改代码**：根据Issue描述进行代码修改，确保遵循项目的代码规范。

5. **提交代码**：提交修改到本地仓库，提交信息应清晰描述修改内容：
   ```bash
   git add .
   git commit -m "feat: 添加新功能"
   # 或
   git commit -m "fix: 修复xxx问题"
   ```

6. **同步上游代码**：在提交PR前，确保你的分支与上游仓库的`main`分支保持同步：
   ```bash
   git remote add upstream https://github.com/original-owner/nestjs-blog-api.git
   git fetch upstream
   git rebase upstream/main
   ```

7. **推送代码**：将修改推送到你Fork的仓库：
   ```bash
   git push origin feature/add-new-function
   ```

8. **创建PR**：在GitHub页面上，点击`New pull request`按钮，选择你的分支和上游仓库的`main`分支，提供PR描述，然后提交。

## 代码规范

1. **代码风格**：遵循项目的代码风格，使用`npm run lint`检查代码风格问题。

2. **命名规范**：
   - 变量名：使用小驼峰命名法（camelCase）
   - 函数名：使用小驼峰命名法（camelCase）
   - 类名：使用大驼峰命名法（PascalCase）
   - 文件名：使用小驼峰命名法（camelCase）或短横线命名法（kebab-case）

3. **注释规范**：
   - 为公共API添加JSDoc注释
   - 为复杂逻辑添加行内注释
   - 注释应清晰明了，说明代码的用途和实现思路

4. **测试规范**：
   - 为新功能添加单元测试和集成测试
   - 确保所有测试通过后再提交PR
   - 测试文件应放在与被测试文件相同的目录下，文件名以`.spec.ts`结尾

## 开发流程

1. **本地开发**：使用`npm run start:dev`启动开发服务器，实时查看代码修改效果。

2. **代码检查**：使用`npm run lint`检查代码风格，使用`npm run test`运行测试。

3. **构建项目**：使用`npm run build`构建项目，确保构建成功。

4. **提交代码**：遵循上述PR流程提交代码。

## 注意事项

1. 请确保你的代码修改不会破坏现有功能。
2. 请确保你的代码符合项目的代码规范。
3. 请确保你的PR描述清晰明了，说明修改内容和解决的问题。
4. 请耐心等待代码审核，根据审核意见进行修改。

感谢你的贡献！