# 内网文件共享服务器
> 一个简单的http本地文件共享服务

## 快速开始
```shell script
#分享文件（默认为运行目录）
yarn share [path_you_want_to_share] [options] 
   # -r 显示子文件夹  
   # -a 显示隐藏文件  
   # -w 允许上传文件
   # -f 允许覆盖现有文件
   # -p 指定端口，默认8080

# 开发模式，参数同上，默认共享~/Public文件夹
yarn dev 

# 打包二进制文件
yarn pkg
```

## TODOs
- [ ] 前端重构为SPA，与后端走RESTful API
- [x] 拖拽上传
- [ ] 拖拽上传可能频繁触发
- [ ] 优化io流程（替换所有同步方法）
- [ ] Electron支持
- [ ] 添加CI/CD支持，更改version时自动打tag并发布release