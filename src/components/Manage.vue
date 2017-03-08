<!-- 权限管理 -> 一级路由 -->
<template>
  <div class="Manage">
    <router-view></router-view>
  </div>
</template>

<script>
import ManageTable from './ManageTable'
import MenuRole from './MenuRole'

export default {
  components: {
    ManageTable,
    MenuRole
  },
  name: 'Manage'
}
</script>

<style scoped>
</style>
