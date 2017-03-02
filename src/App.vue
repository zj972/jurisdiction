<template>
  <div id="app">
    <el-col :span="24">
      <el-menu router>
        <el-menu-item
          v-for="(list, index) in lists"
          :index="list.address"
          v-text="list.name">
        </el-menu-item>
      </el-menu>
    </el-col>
    <router-view></router-view>
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
.el-menu-item{
  text-align: center;
}
</style>
