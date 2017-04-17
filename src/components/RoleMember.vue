<!-- 权限管理 -> 角色管理 -> 成员管理 -> 二级路由 -->
<template>
  <div class="RoleMember">
    <el-row>
      <el-button type="text"><router-link to="/Manage"><i class="el-icon-arrow-left"></i></router-link></el-button>
      {{role}}
    </el-row>
    <el-row  class="button">
      <el-col :xs="24" :sm="24" :md="10" :lg="14">
        <el-button type="primary" @click="roleMemberAdd">批量添加</el-button>
        <el-button type="primary" @click="roleMemberDel">批量取消</el-button>
      </el-col>
      <el-col :xs="24" :sm="24" :md="14" :lg="10">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input v-model="name" placeholder="请输入姓名或者工号" icon="search" @change="inputChange"></el-input>
          </el-col>
          <el-col :span="12">
            <el-select v-model="status" clearable placeholder="请选择状态" @change="inputChange">
              <el-option label="已添加" :value="true"></el-option>
              <el-option label="未添加" :value="false"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-table  ref="table" row-key="id" :data="roleMemberTable" border style="width: 100%" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" v-loading="roleMemberTableLoading" element-loading-text="拼命加载中">
      <el-table-column type="selection" :reserve-selection="true"></el-table-column>
      <el-table-column prop="department" label="所属部门" align="center" :show-overflow-tooltip="true" min-width="200">
      </el-table-column>
      <el-table-column prop="id" label="工号" align="center">
      </el-table-column>
      <el-table-column prop="englishName" label="英文名" align="center">
      </el-table-column>
      <el-table-column prop="chineseName" label="中文名" align="center">
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="140">
        <template scope="scope">
          <el-button @click="roleMemberAlert(scope.$index, roleMemberTable)" size="small">{{roleMemberTable[scope.$index].role === '' ? '添加' : '取消'}}</el-button>
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
      name: '',
      status: '',
      multipleSelection: [],
      roleMemberTableData: [],
      roleMemberTableLoading: true,
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
      if (row.role === this.role) {
        return 'info-row'
      } else {
        return ''
      }
    },
    // 加载数据
    load () {
      this.$refs.table.clearSelection()
      this.roleMemberTableLoading = true
      this.role = this.getUrl('role')
      let id = this.getUrl('id')
      // 刷新页面数据
      this.multipleSelection = []
      this.$http.get('manage/role-member?id=' + id).then((res) => {
        this.roleMemberTableData = [...res.body.data.member]
        this.roleMemberTableLoading = false
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
    // 添加用户
    roleMemberAdd () {
      if (this.multipleSelection.length) {
        let id = this.getUrl('id')
        this.$http.post('manage/role-member-add', {
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
            this.paging.currentPage = 1
          } else {
            this.$message.error('服务器异常！')
          }
        }, (res) => {
          // error callback
          this.$message.error('服务器异常！')
        })
      } else {
        this.$message.error('请选择所要添加的用户！')
      }
    },
    // 移除用户
    roleMemberDel () {
      if (this.multipleSelection.length) {
        this.$http.post('manage/role-member-del', {
          'id': this.multipleSelection
        }).then((res) => {
          if (res.body.data) {
            this.$message({
              message: '移除成功！',
              type: 'success'
            })
            // 更新表格
            this.load()
            this.paging.currentPage = 1
          } else {
            this.$message.error('服务器异常！')
          }
        }, (res) => {
          // error callback
          this.$message.error('服务器异常！')
        })
      } else {
        this.$message.error('请选择所要移除的用户！')
      }
    },
    // 修改用户
    roleMemberAlert (index, rows) {
      this.multipleSelection = [rows[index].id]
      if (rows[index].role !== this.role) {
        this.roleMemberAdd()
      } else {
        this.roleMemberDel()
      }
    },
    // input输入调整页数
    inputChange () {
      this.paging.currentPage = 1
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
    roleMemberTable () {
      let data = []
      if (this.name === '' && this.status === '') {
        this.paging.total = this.roleMemberTableData.length
        data = this.roleMemberTableData
      } else {
        let name = this.name
        let status = this.status
        data = [...this.roleMemberTableData]
        if (name) {
          for (let i = 0; i < data.length;) {
            let judge = false
            // 正则匹配
            judge = judge || (new RegExp(name, 'i').test(data[i].englishName)) || (new RegExp(name, 'i').test(data[i].chineseName)) || (new RegExp(name, 'i').test(data[i].id))
            if (!judge) {
              data.splice(i, 1)
            } else {
              i++
            }
          }
        }
        if (status !== '') {
          for (let i = 0; i < data.length;) {
            let judge = status
            judge = judge ^ (data[i].role === this.role)
            if (judge) {
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
.RoleMember{
  margin: 10px;
}
.button>.el-col{
  margin: 10px 0;
}
.button .el-select{
  width: 100%;
}
</style>
