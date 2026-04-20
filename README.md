# Micro App Plugin Template

这个模板用于开发微应用型插件。

适合这类场景：

- 插件本身是一套完整独立页面或独立系统
- 通过 `wujie` 方式挂入 `console`
- 希望复用宿主的 `Host SDK`
- 不需要输出 `routes / pages / widgets` 这类模块协议能力

如果你的目标只是做一个后台业务模块，请不要使用这个模板，应改用 `templates/plugin-module`。

## 你需要先理解的事

微应用型插件的核心边界不是模块协议，而是：

- `frontend.json`
- `Host SDK`
- `wujie` 挂载协议

也就是说，这类插件更像“独立前端应用”，只是运行时嵌入到了宿主里。

## 目录结构

- `frontend.json`
  微应用前端清单，宿主依赖它识别和加载插件

- `src/main.ts`
  微应用入口

- `src/app.vue`
  独立运行时的应用页面

- `src/host/`
  负责读取宿主注入的 props 和 sdk

- `src/mock/`
  本地 standalone 开发时的 mock 宿主能力

- `scripts/manifest-check.mjs`
  校验 `frontend.json`

- `scripts/manifest-print.mjs`
  打印标准化后的 manifest，便于联调复制

- `scripts/pack.mjs`
  打包发布包

## 一、开发流程

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动本地开发

```bash
pnpm dev
```

此时不会依赖真实宿主，而是使用模板内置的 mock host。

### 3. 先改这几个地方

开始写业务前，优先修改：

1. `package.json`
   确认包名、版本号

2. `frontend.json`
   确认：
   - `id`
   - `code`
   - `name`
   - `routeBase`
   - `entry.wujie.name`
   - `entry.wujie.url`

3. `src/mock/index.ts`
   把默认 manifest 和默认路径替换成你的插件值

4. `src/app.vue`
   把模板示例页面替换成真实业务页面

### 4. 开始写业务

微应用模板更适合这样组织代码：

1. 先定义业务路由和页面结构
2. 再封装业务 API
3. 最后接入宿主透传能力，比如：
   - `sdk.request`
   - `sdk.ui`
   - `sdk.router`
   - `sdk.tabs`

## 二、本地联调流程

联调目标是确认：

- 宿主能识别并挂载你的微应用
- 宿主上下文能透传进来
- `Host SDK` 能被微应用正常调用

建议流程：

### 1. 启动微应用

```bash
pnpm dev
```

### 2. 启动宿主

在主仓库启动 `console`。

### 3. 校验并打印清单

```bash
pnpm manifest:check
pnpm manifest:print
```

### 4. 把 `frontend.json` 注册到宿主

当前阶段仍然是手动联调，把你的清单登记到宿主 manifest 注册表。

### 5. 在宿主里打开路由

检查：

- 微应用是否能成功挂载
- 路由基础路径是否正确
- 宿主主题和运行时信息是否透传
- 宿主弹层、路由、标签能力是否可用

## 三、测试流程

模板当前没有默认内置测试框架，所以推荐最小测试链路如下：

### 1. 类型检查

```bash
pnpm check:types
```

### 2. 清单检查

```bash
pnpm manifest:check
```

它会校验：

- `frontend.json` 是否结构正确
- `kind` 是否为 `micro-app`
- `runtime` 是否为 `wujie`
- `version` 是否和 `package.json` 一致

### 3. 构建检查

```bash
pnpm build
```

### 4. 宿主联调检查

建议至少验证下面这些点：

- 宿主能正常挂载微应用
- 刷新后路由仍然正确
- `sdk.ui` 可用
- `sdk.router` 可用
- `sdk.tabs` 可用
- `sdk.request` 可用
- 宿主主题、token、运行时参数能正确读取

## 四、打包流程

发布前统一执行：

```bash
pnpm pack
```

这个命令会顺序执行：

1. `pnpm build`
2. `pnpm manifest:check`
3. 生成发布目录
4. 输出压缩包到 `release/`

产物示例：

```bash
release/your-micro-app-0.1.0.zip
```

压缩包中默认包含：

- `dist/`
- `frontend.json`
- `package.json`
- `README.md`
- `release.json`

## 五、交付给平台时需要提供什么

至少要保证下面这些内容是正确的：

- 打包产物 `.zip`
- `frontend.json`
- 正确的 `code`
- 正确的 `routeBase`
- 正确的 `entry.wujie.name`
- 正确的 `entry.wujie.url`

这些字段如果不一致，宿主很可能能识别到插件，但无法正确挂载。

## 六、常用命令

```bash
pnpm dev
pnpm check:types
pnpm build
pnpm preview
pnpm manifest:check
pnpm manifest:print
pnpm pack
```

## 七、开发约束

- 微应用和宿主的边界保持在 `Host SDK + frontend.json`
- 不直接依赖 `apps/console/src/*`
- 不在微应用内部重复实现宿主已有的弹层、标签、路由体系
- 优先复用宿主能力，而不是复制宿主 UI 逻辑

## 八、什么时候不该用这个模板

下面这些场景不要使用 `plugin-micro-app`：

- 只是一个普通后台菜单模块
- 需要输出 `pages / widgets`
- 希望直接按模块协议装配到宿主页面树中

这些情况请改用 `plugin-module` 模板。
