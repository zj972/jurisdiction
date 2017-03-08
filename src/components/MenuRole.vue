<!-- 菜单管理 -> 二级路由 -->
<template>
  <div class="MenuRole">
    <el-row>
      <el-button type="text"><router-link to="/Manage"><i class="el-icon-arrow-left"></i></router-link></el-button>
      {{role}}
    </el-row>
    <el-row>
      <el-col :span="12">
        一级菜单：
        <el-select v-model="firstMenu" placeholder="一级菜单请选择">
          <el-option
            v-for="item in firstOptions"
            :label="item.label"
            :value="item.value"
            :key="item.value">
          </el-option>
        </el-select>
        二级菜单：
        <el-select v-model="secondMenu" placeholder="二级菜单请选择">
          <el-option
            v-for="item in secondOptions"
            :label="item.label"
            :value="item.value"
            :key="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col>
        <el-button type="primary">批量添加</el-button>
        <el-button type="primary">批量取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'MenuRole',
  data () {
    return {
      msg: 'Welcome to MenuRole.vue',
      role: '产品/运营人员',
      firstMenu: '',
      secondMenu: '',
      firstOptions: '',
      secondOptions: ''
    }
  },
  computed: {

  }
}
</script>

<style scoped>
.MenuRole{
  margin: 10px;
}
</style>
