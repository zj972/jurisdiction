<!-- 权限管理 -> 角色管理 -> 成员管理 -> 二级路由 -->
<template>
  <div class="RoleMember">
    <el-row>
      <el-button type="text"><router-link to="/Manage"><i class="el-icon-arrow-left"></i></router-link></el-button>
      {{role}}
    </el-row>
    <el-row  class="button">
      <el-col :xs="24" :sm="24" :md="14" :lg="10">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input v-model="name" placeholder="请输入姓名">
            </el-input>
          </el-col>
          <el-col :span="12">
            <el-select v-model="status" placeholder="请选择状态">
              <el-option label="全部" value="all">全部</el-option>
              <el-option
                v-for="item in statusOptions"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-col>
      <el-col :xs="24" :sm="24" :md="10" :lg="14" align="right">
        <el-button type="primary">批量添加</el-button>
        <el-button type="primary">批量取消</el-button>
        <el-checkbox>全选</el-checkbox>
      </el-col>
    </el-row>
    <el-table :data="tableMember" border style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column prop="id" label="用户ID" align="center">
      </el-table-column>
      <el-table-column prop="name" label="中文名" align="center">
      </el-table-column>
      <el-table-column prop="englishName" label="英文名" align="center">
      </el-table-column>
      <el-table-column prop="department" label="所属项目" align="center">
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="140">
        <template scope="scope">
          <el-checkbox>
            <span v-show="tableMemberData[scope.$index].operation">取消</span><span v-show="!tableMemberData[scope.$index].operation">添加</span>
          </el-checkbox>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'RoleMember',
  data () {
    return {
      msg: 'Welcome to RoleMember.vue',
      role: '产品/运营人员',
      name: '',
      status: '',
      statusOptions: '',
      tableMemberData: [
        {
          id: 1,
          name: '杨少波',
          englishName: 'SarboYang',
          role: '超级管理员',
          department: '数据支付部/支付组/Web前端组',
          time: '2017-03-17 22:25:22'
        }, {
          id: 2,
          name: '张磊',
          englishName: 'zhanglei',
          role: '管理员',
          department: '数据支付部/支付组/Web前端组',
          time: '2017-03-17 22:23:22'
        }, {
          id: 3,
          name: '杨少波',
          englishName: 'SarboYang',
          role: '运营/产品人员',
          department: '数据支付部/支付组/Web前端组',
          time: '2017-03-17 22:12:22'
        }, {
          id: 4,
          name: '杨少波',
          englishName: 'SarboYang',
          role: '商务人员',
          department: '数据支付部/支付组/Web前端组',
          time: '2017-03-17 26:22:22'
        }, {
          id: 5,
          name: '杨波',
          englishName: 'SarboYang',
          role: '客服人员',
          department: '数据支付部/支付组/Web前端组',
          time: '2017-03-97 22:22:82'
        }
      ]
    }
  },
  methods: {
    tableRowClassName (row, index) {
      if (row.operation) {
        return 'info-row'
      } else {
        return ''
      }
    }
  },
  computed: {
    tableMember () {
      return this.tableMemberData
    }
  }
}
</script>

<style scoped>
.RoleMember{
  margin: 10px;
}
.button>.el-col{
  margin: 10px 0;
}
.button .el-select{
  width: 100%;
}
.el-table .info-row{
  background: #c9e5f5;
}
</style>
