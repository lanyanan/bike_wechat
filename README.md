# bike_wechat

## 目录结构  
本项目基于 [vuejs](https://vuejs.org), 目录结构由 [vue-cli](https://github.com/vuejs/vue-cli) 生成

由于不同品牌的客户端有一些图片或颜色差别, 现在按不同的品牌把静态资源和发布目录放在 `./brand` 目录下, `./brand/<id>/dist/` 为某个品牌构建后的发布目录, 例如, `./brand/demo/dist` 为云巴测试用的公众号使用的发布目录

服务端渲染入口的时候, 会在页面上输出该品牌的相关配置, 参见 `./index.html`.  
开发时不依赖服务端输出的配置, 使用一些测试配置, 参见 `./src/main.js` 里面 `TEST_CONFIG`

## 开发

``` bash
# node >= v7.7.4

# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
```

## 构建 
```
BRAND=<id> npm run build
// 例如 
// BRAND=demo npm run build

```

## 添加新品牌

### 公众号  
* 在 `brand` 目录添加该品牌目录, 目录名为该品牌在服务端所配置的 `id`,  然后把相应的 `asset` 目录复制到该品牌目录  
* 运行 `BRAND=id npm run build` 构建该品牌的公众号 app  


### 微信公众号平台配置  
假设使用的域名为 `host`, 使用 http 协议访问, 则  

支付授权目录
`http://host/<id>/`

JS接口安全域名设置为
`host`

网页授权域名设置为
`host`

## 其他 
如果需要在本地与 Portal 服务端一起开发和调试, 需要在本地配置反向代理, 更多请看 [rd-docs](https://bitbucket.org/msgbus/rd-docs) `design/shared-bike-system/portal-deploy.md`