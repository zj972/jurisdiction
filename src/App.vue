<template>
  <div id="app">
    <el-row class="title">
      <el-col :xs="24" :sm="4" :md="3" :lg="2">权限中心</el-col>
    </el-row>
    <el-row>
      <el-col :xs="24" :sm="4" :md="3" :lg="2">
        <el-menu router class="list"><!-- :default-active="lists[0].address" 默认选中第一个，需要修改index.js中lists的path:'/' -->
          <el-menu-item
            v-for="(list, index) in lists"
            :index="list.address"
            v-text="list.name">
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :xs="24" :sm="20" :md="21" :lg="22">
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      lists: [
        {
          name: '权限申请',
          address: 'Application'
        },
        {
          name: '我的权限',
          address: 'Individual'
        },
        {
          name: '我的审批',
          address: 'Approval'
        },
        {
          name: '权限管理',
          address: 'Manage'
        }
      ]
    }
  }
}
</script>

<style>
.title{
  background: #8492A6;
  color: #fff;
  line-height: 56px;
  text-align: center;
}

.el-menu-item{
  text-align: center;
}

.list>.is-active{
  background: #d1dbe5;
  color: #fff;
}
</style>
