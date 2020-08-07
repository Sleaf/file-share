# 内网文件共享服务器
> 一个简单的http本地文件共享服务

## 使用说明
>⚠️ 此程序仅作为局域网内轻量共享访问使用，多关注运行日志，请勿长期运行。

### 使用[release版本](https://github.com/Sleaf/file-share/releases)（推荐）
> 目前使用pkg打包运行，之后可能新增带gui的electron程序。
> 提供了`xz`压缩文件方便下载，MacOS与Linux用户下载后可使用`xz`指令解压使用，Windows用户可使用 [7zip](https://www.7-zip.org/) 等解压软件解压使用。

默认分享运行程序的文件夹，如果需要输入参数，可将程序拖入控制台取得路径，在后面添加运行参数，参数同[直接使用代码](#直接使用项目代码)。
Linux和MacOS环境可能需要执行`chmod +x file-share-xxx`添加运行权限

### 直接使用项目代码
```shell script
#分享文件（默认为运行目录）
yarn start-server [path_you_want_to_share] [options] 
   # -r 显示子文件夹  
   # -a 显示隐藏文件  
   # -w 允许上传文件
   # -f 允许覆盖现有文件
   # -p 指定端口，默认8080
```

## 开发说明
```shell script
# 开发模式，参数同share，默认共享~/Public文件夹
yarn dev-server 

# 打包二进制文件
yarn build-pkg
```

## TODOs
- [x] 添加CI/CD支持，更改version时自动打tag并发布release
- [x] 拖拽上传
- [x] 优化io流程
- [ ] Electron支持
- [x] 前端重构为SPA，与后端走RESTful API
- [ ] 优化上传样式（改为多次并行传输，并表现为table中置灰进度）
- [ ] 使用ws代替状态轮询
