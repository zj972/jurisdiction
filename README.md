# jurisdiction

> permission management system

## 待解决的问题

>1.在子路里切换父路由会叠加url

>2.server端（express）获取post数据，并打印

>3.tabs首次切换时，table宽度跳动

>4.弹出框复用

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

>3.遮罩层处于弹出框的上方

> 遮罩层存放在table表中，列标签属性flexd会调用z-index与遮罩层产生冲突
```
<el-table-column fixed="right">
  <dialog></dialog>
</el-table-column>
```

>4.url中文&符号乱码

>编码用encodeURIComponent，解码用decodeURIComponent

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
