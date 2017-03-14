# jurisdiction

> permission management system

## 待解决的问题

>1.在子路里切换父路由会叠加url

>2.遮罩层处于弹出框的上方

>3.server端（express）获取post数据，并打印

## 已解决的问题

>1.动态修改table样式

>  由于style标签上添加了scope属性，动态生成的class后的标签并没有scope属性，所以无法渲染css
```
.content .el-row[data-v-5ef3af1c]{
  margin: 15px 0;
}
<div data-v-fe5c137a class="el-row button"></div>
```

>2.添加角色清除input框数据

> 写入请求，在确认按钮事件触发时模拟form表单提交，server端返回成功后将v-model绑定的数据清空

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
