# jurisdiction

> permission management system

## 待解决的问题

>1.server端（express）获取post数据，并打印

## 已解决的问题

>1.动态修改table样式

由于style标签上添加了scope属性，动态生成的class后的标签并没有scope属性，所以无法渲染css

```
.content .el-row[data-v-5ef3af1c]{
  margin: 15px 0;
}
<div data-v-fe5c137a class="el-row button"></div>
```

>2.添加角色清除input框数据

写入请求，在确认按钮事件触发时模拟form表单提交，server端返回成功后将v-model绑定的数据清空

>3.遮罩层处于弹出框的上方

遮罩层存放在table表中，列标签属性flexd会调用z-index与遮罩层产生冲突

```
<el-table-column fixed="right">
  <dialog></dialog>
</el-table-column>
```

>4.url中文&符号乱码

编码用encodeURIComponent，解码用decodeURIComponent

>5.在子路里切换父路由会叠加url

在路由设置里面，子路由前面要加'/'

### 但并没有找到解释以及为什么加'/'

```
path: '/Manage',
  component: Manage,
    children: [
      {
        path: '/RoleMenu',
        name: 'RoleMenu',
        component: RoleMenu
      }
    ]
  }
```

上面的加'/'是一种妥协办法，其根本原因是Element-UI他的<el-menu-item>标签有个index属性是用来负责跳转的，所以不用再加<router-link>跳转路由，index标签没有加“/”，所以会出现偶尔跳转错误。

```
        <el-menu router class="list" :default-active="active">
          <el-menu-item index="/apply">
            <!--<router-link to="/apply" class="router-item" >权限申请</router-link>-->
            权限申请
          </el-menu-item>
          <el-menu-item index="/myauth" @click.native="getAuthData">
            <!--<router-link to="/myauth" class="router-item">-->
              <span>我的权限</span>
              <span class="my-badge" v-show="newAuthNum > 0">{{newAuthNum}}</span>
            <!--</router-link>-->
          </el-menu-item>
          <el-menu-item index="/approval" @click.native="getApprovalData">
            <!--<router-link to="/approval" class="router-item">-->
              <span>我的审批</span>
              <span class="my-badge" v-show="approvalNum > 0">{{approvalNum}}</span>
            <!--</router-link>-->
          </el-menu-item>
          <el-menu-item index="/manage" v-show="auth">
            <!--<router-link to="/manage" class="router-item">权限管理</router-link>-->
            权限管理
          </el-menu-item>
          <el-menu-item index="/memberauth" v-show="auth">
            <!--<router-link to="/memberauth" class="router-item">角色管理</router-link>-->
            角色管理
          </el-menu-item>
        </el-menu>
```

注释为错误示范

>6.tabs首次切换时，table宽度跳动

在数据渲染前，table的宽度是没有撑开的，当数据渲染后，宽度被撑开，导致了宽度的跳动，解决方案是将table中的数据设置不允许换行，这样就没有初始时数据挤压在一起的现象，也除去了宽度跳动的效果

```
.el-table .cell{
  white-space: nowrap;
}
```

>7.弹出框复用

将button放在父组件，然后将弹出框子组件放在table外面，点击button后传入对应行的ID进行数据请求

>8.搜索后全选按钮范围更改

调整全选数组初始化位置，将其作为计算属性的一部分进行动态调整

>9.侧栏样式动态锁定，tabs标签样式动态锁定

给default-active设置v-model值，然后在每次切换时动态获取url的参数或者path，同时修改active值

```
// 侧栏
getActive () {
  this.active = window.location.pathname.substr(1).split('/')[0]
}
// tabs
load () {
  this.activeName = this.getUrl('active') || 'role'
}
```

>10.判断当前表格值是否存在于数组中（优化）

使用ES6中新添加的MAP数据结构，优化时间复杂度

```
let checked = new Map()
for (let item of val) {
  checked.set(item.menu)
}
for (let item of this.options) {
  if (checked.has(item.value)) {
    for (let i = 0; i < item.children.length; i++) {
      this.secondOptions[0].data.push(item.value + '-' + item.children[i])
    }
  }
}
```

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
