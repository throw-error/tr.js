# Errend.js 

分为三个核心：

console.js
error.js
performance.js

可以配置回调接口做的事

分别是
onError
onConsole
onPerformance

编译 => 压缩 => 测试 => 输出
测试 => 测试脚本 => 输出
## 使用

```bash
npm i errend.js
```

```javascript
import Errend from 'errend.js'

Errend.config({
    user: '${md5-user-id}'
    ...${other options}
}).install()
```

## 命令

```bash
# 开发
npm run dev

# 打包
npm run build

# 跑一次在线测试服务
npm start

# 测试
npm run test

# 代码检查
npm run lint
```

## 目录结构

```
- config - webpack configs
- build - webpack script
- dev - webpack dev files
- test - webpack test scripts
- dist - webpack output scripts
- src - errend.js sources
```