<!-- 权限管理 -> 角色管理 -> 菜单管理 -> 二级路由 -->
<template>
  <div class="RoleMenu">
    <el-row>
      <el-button type="text"><router-link to="/Manage"><i class="el-icon-arrow-left"></i></router-link></el-button>
      {{role}}
    </el-row>
    <el-row  class="button">
      <el-col :xs="24" :sm="24" :md="10" :lg="14">
        <el-button type="primary" @click="roleMenuAdd">批量添加</el-button>
        <el-button type="primary" @click="roleMenuDel">批量取消</el-button>
      </el-col>
      <el-col :xs="24" :sm="24" :md="14" :lg="10">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-select v-model="firstMenu" clearable placeholder="一级菜单请选择" @change="toSecondMenu">
              <el-option
                v-for="item in firstOptions"
                :label="item.label"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="12">
            <el-select v-model="secondMenu" clearable placeholder="二级菜单请选择">
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
    </el-row>
    <el-table ref="table" row-key="id" :data="roleMenuTable" border style="width: 100%" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" v-loading="roleMenuTableLoading" element-loading-text="拼命加载中">
      <el-table-column type="selection" :reserve-selection="true"></el-table-column>
      <el-table-column prop="id" label="ID" align="center">
      </el-table-column>
      <el-table-column prop="firstMenu" label="一级菜单" align="center">
      </el-table-column>
      <el-table-column prop="secondMenu" label="二级菜单" align="center">
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="140">
        <template scope="scope">
          <el-button @click="roleMenuAlert(scope.$index, roleMenuTable)" size="small">{{roleMenuTable[scope.$index].operation ? '取消' : '添加'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging :msg="paging"></paging>
  </div>
</template>

<script>
import Paging from './Paging'

export default {
  components: {
    Paging
  },
  name: 'RoleMenu',
  data () {
    return {
      role: '',
      firstMenu: '',
      secondMenu: '',
      multipleSelection: [],
      firstOptions: [],
      secondOptions: [],
      options: [],
      roleMenuTableData: [],
      roleMenuTableLoading: true,
      paging: {
        currentPage: 1,
        size: 10,
        total: 0
      }
    }
  },
  methods: {
    // 已选择渲染样式
    tableRowClassName (row, index) {
      if (row.operation) {
        return 'info-row'
      } else {
        return ''
      }
    },
    // 加载数据
    load () {
      this.$refs.table.clearSelection()
      // this.roleMenuTableLoading = true
      this.role = this.getUrl('role')
      let id = this.getUrl('id')
      // 刷新页面数据
      this.multipleSelection = []
      this.firstOptions = []
      this.$http.get('manage/role-menu?id=' + id).then((res) => {
        this.options = [...res.body.data.menu]
        for (let i = 0; i < this.options.length; i++) {
          let value = this.options[i].value
          this.firstOptions.push({
            'value': value,
            'label': value
          })
        }
        this.roleMenuTableData = [...res.body.data.menuData]
        this.roleMenuTableLoading = false
      }, (res) => {
        // error callback
        this.$message.error('服务器异常！')
      })
    },
    // 获取url参数
    getUrl (name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      let r = window.location.search.substr(1).match(reg)
      if (r !== null) {
        return decodeURIComponent(decodeURI(r[2]))
      }
      return null
    },
    // 动态获取二级菜单
    toSecondMenu () {
      this.secondOptions = []
      this.secondMenu = ''
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i].value === this.firstMenu) {
          let children = this.options[i].children
          for (let j = 0; j < children.length; j++) {
            this.secondOptions.push({
              'value': children[j],
              'label': children[j]
            })
          }
        }
      }
    },
    // 添加菜单
    roleMenuAdd () {
      if (this.multipleSelection.length) {
        let id = this.getUrl('id')
        this.$http.post('manage/role-menu-add', {
          'id': this.multipleSelection,
          'role': id
        }).then((res) => {
          if (res.body.data) {
            this.$message({
              message: '添加成功！',
              type: 'success'
            })
            // 更新表格
            this.load()
          } else {
            this.$message.error('服务器异常！')
          }
        }, (res) => {
          // error callback
          this.$message.error('服务器异常！')
        })
      } else {
        this.$message.error('请选择所要添加的菜单！')
      }
    },
    // 移除菜单
    roleMenuDel () {
      if (this.multipleSelection.length) {
        let id = this.getUrl('id')
        this.$http.post('manage/role-menu-del', {
          'id': this.multipleSelection,
          'role': id
        }).then((res) => {
          if (res.body.data) {
            this.$message({
              message: '移除成功！',
              type: 'success'
            })
            // 更新表格
            this.load()
          } else {
            this.$message.error('服务器异常！')
          }
        }, (res) => {
          // error callback
          this.$message.error('服务器异常！')
        })
      } else {
        this.$message.error('请选择所要移除的菜单！')
      }
    },
    // 修改菜单
    roleMenuAlert (index, rows) {
      this.multipleSelection = [rows[index].id]
      if (rows[index].operation) {
        this.roleMenuDel()
      } else {
        this.roleMenuAdd()
      }
    },
    // 表格选择器
    handleSelectionChange (val) {
      let id = []
      for (let i = 0; i < val.length; i++) {
        id.push(val[i].id)
      }
      this.multipleSelection = [...id]
    }
  },
  computed: {
    // 动态渲染表格
    roleMenuTable () {
      let data = []
      if (this.firstMenu === '' && this.secondMenu === '') {
        this.paging.total = this.roleMenuTableData.length
        data = this.roleMenuTableData
      } else {
        let one = this.firstMenu
        let two = this.secondMenu
        data = [...this.roleMenuTableData]
        if (one) {
          for (let i = 0; i < data.length;) {
            let judge = false
            // 正则匹配
            judge = judge || (new RegExp(one).test(data[i].firstMenu))
            if (!judge) {
              data.splice(i, 1)
            } else {
              i++
            }
          }
        }
        if (two) {
          for (let i = 0; i < data.length;) {
            let judge = false
            judge = judge || (new RegExp(two).test(data[i].secondMenu))
            if (!judge) {
              data.splice(i, 1)
            } else {
              i++
            }
          }
        }
        this.paging.total = data.length
      }
      return data.slice(((this.paging.currentPage - 1) * this.paging.size), (this.paging.currentPage * this.paging.size))
    }
  },
  // 初始化
  mounted () {
    this.load()
  }
}
</script>

<style scoped>
.RoleMenu{
  margin: 10px;
}
.button>.el-col{
  margin: 10px 0;
}
.button .el-select{
  width: 100%;
}
</style>
