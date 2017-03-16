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
            <el-input v-model="name" placeholder="请输入姓名" icon="search"></el-input>
          </el-col>
          <el-col :span="12">
            <el-select v-model="status" clearable placeholder="请选择状态">
              <el-option label="已添加" :value="true"></el-option>
              <el-option label="未添加" :value="false"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-col>
      <el-col :xs="24" :sm="24" :md="10" :lg="14" align="right">
        <el-button type="primary" @click="roleMemberAdd">批量添加</el-button>
        <el-button type="primary" @click="roleMemberDel">批量取消</el-button>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      </el-col>
    </el-row>
    <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
      <el-table :data="roleMemberTable" border style="width: 100%" :row-class-name="tableRowClassName">
        <el-table-column prop="id" label="用户ID" align="center">
        </el-table-column>
        <el-table-column prop="englishName" label="英文名" align="center">
        </el-table-column>
        <el-table-column prop="chineseName" label="中文名" align="center">
        </el-table-column>
        <el-table-column prop="department" label="所属部门" align="center">
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="140">
          <template scope="scope">
            <el-checkbox :label="roleMemberTableData[scope.$index].id">
              <span v-show="(roleMemberTableData[scope.$index].role === role)">取消</span><span v-show="(roleMemberTableData[scope.$index].role !== role)">添加</span>
            </el-checkbox>
          </template>
        </el-table-column>
      </el-table>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  name: 'RoleMenu',
  data () {
    return {
      role: '',
      name: '',
      status: '',
      checkAll: false,
      isIndeterminate: false,
      checkOptions: [],
      checkList: [],
      roleMemberTableData: []
    }
  },
  methods: {
    // 已选择渲染样式
    tableRowClassName (row, index) {
      if (row.role === this.role) {
        console.log(row)
        return 'info-row'
      } else {
        return ''
      }
    },
    // 加载数据
    load () {
      this.role = this.getUrl('role')
      let id = this.getUrl('id')
      // 刷新页面数据
      this.checkOptions = []
      this.checkAll = false
      this.isIndeterminate = false
      this.checkList = []
      this.name = ''
      this.$http.get('http://localhost:3000/roleMember?id=' + id).then((res) => {
        this.roleMemberTableData = res.data.member.slice()
        for (let i = 0; i < this.roleMemberTableData.length; i++) {
          this.checkOptions.push(this.roleMemberTableData[i].id)
        }
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
    // 绑定全选按钮
    handleCheckAllChange (event) {
      this.checkList = event.target.checked ? this.checkOptions : []
      this.isIndeterminate = false
      console.log(this.checkList)
    },
    // 判断全选按钮状态
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length
      this.checkAll = (checkedCount === this.checkOptions.length)
      this.isIndeterminate = (checkedCount > 0 && checkedCount < this.checkOptions.length)
      console.log(this.checkList)
    },
    roleMemberAdd () {
      if (this.checkAll || this.isIndeterminate) {
        this.$confirm('此操作将批量添加所选用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('http://localhost:3000/roleMemberAdd', {
            'id': this.checkList
          }).then((res) => {
            if (res.data.msg) {
              this.$message({
                message: '批量添加成功！',
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消批量添加'
          })
        })
      } else {
        this.$message.error('请选择所要添加的用户！')
      }
    },
    roleMemberDel () {
      if (this.checkAll || this.isIndeterminate) {
        this.$confirm('此操作将批量移除所选用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('http://localhost:3000/roleMemberDel', {
            'id': this.checkList
          }).then((res) => {
            if (res.data.msg) {
              this.$message({
                message: '批量移除成功！',
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消批量移除'
          })
        })
      } else {
        this.$message.error('请选择所要移除的用户！')
      }
    }
  },
  computed: {
    roleMemberTable () {
      if (this.name === '' && this.status === '') {
        return this.roleMemberTableData
      }
      let name = this.name
      let status = this.status
      let data = this.roleMemberTableData.slice()
      if (name) {
        for (let i = 0; i < data.length;) {
          let judge = false
          // 正则匹配
          judge = judge || (new RegExp(name).test(data[i].englishName)) || (new RegExp(name).test(data[i].chineseName))
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
      return data
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
<style>
.el-table .info-row{
  background: #c9e5f5;
}
</style>
