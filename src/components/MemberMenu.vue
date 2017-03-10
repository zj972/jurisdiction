<!-- 权限管理 -> 成员管理 -> 菜单管理 -> 二级路由 -->
<template>
  <div class="MemberMenu">
    <el-row>
      <el-button type="text"><router-link to="/Manage"><i class="el-icon-arrow-left"></i></router-link></el-button>
      {{role}}
    </el-row>
    <el-row  class="button">
      <el-col :xs="24" :sm="24" :md="14" :lg="10">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-select v-model="firstMenu" placeholder="一级菜单请选择">
              <el-option label="全部" value="all">全部</el-option>
              <el-option
                v-for="item in firstOptions"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="12">
            <el-select v-model="secondMenu" placeholder="二级菜单请选择">
              <el-option label="全部" value="all">全部</el-option>
              <el-option
                v-for="item in secondOptions"
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
    <el-table :data="tableRole" border style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column prop="id" label="ID" align="center">
      </el-table-column>
      <el-table-column prop="project" label="所属项目" align="center">
      </el-table-column>
      <el-table-column prop="firstMenu" label="一级菜单" align="center">
      </el-table-column>
      <el-table-column prop="secondMenu" label="二级菜单" align="center">
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="140">
        <template scope="scope">
          <el-checkbox>
            <span v-show="tableRoleData[scope.$index].operation">取消</span><span v-show="!tableRoleData[scope.$index].operation">添加</span>
          </el-checkbox>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'MemberMenu',
  data () {
    return {
      role: '产品/运营人员',
      firstMenu: '',
      secondMenu: '',
      firstOptions: [
        {
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      secondOptions: '',
      tableRoleData: [
        {
          id: '1',
          project: '支付服务中心',
          firstMenu: '订单查询',
          secondMenu: '订单查询-查询',
          operation: true
        }, {
          id: '2',
          project: '支付服务中心',
          firstMenu: '订单查询',
          secondMenu: '订单查询-操作',
          operation: false
        }, {
          id: '3',
          project: '支付服务中心',
          firstMenu: '产品配置',
          secondMenu: '产品配置-产品列表',
          operation: true
        }, {
          id: '4',
          project: '支付服务中心',
          firstMenu: '产品配置',
          secondMenu: '产品配置-产品审核',
          operation: true
        }, {
          id: '5',
          project: '支付服务中心',
          firstMenu: '产品配置',
          secondMenu: '产品配置-我的申请',
          operation: true
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
    tableRole () {
      return this.tableRoleData
    }
  }
}
</script>

<style scoped>
.MemberMenu{
  margin: 10px;
}
.button>.el-col{
  margin: 10px 0;
}
.button .el-select{
  width: 100%;
}
</style>
<style>
.el-table .info-row{
  background: #c9e5f5;
}
</style>
