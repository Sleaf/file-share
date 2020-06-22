# 内网文件共享服务器
> 暂未支持高并发情况
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

