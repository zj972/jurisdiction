<!-- 权限管理 -> 角色管理 -> 菜单管理 -> 二级路由 -->
<template>
  <div class="RoleMenu">
    <el-row>
      <el-button type="text"><router-link to="/Manage"><i class="el-icon-arrow-left"></i></router-link></el-button>
      {{role}}
    </el-row>
    <el-row  class="button">
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
      <el-col :xs="24" :sm="24" :md="10" :lg="14" align="right">
        <el-button type="primary" @click="roleMenuAdd">批量添加</el-button>
        <el-button type="primary" @click="roleMenuDel">批量取消</el-button>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      </el-col>
    </el-row>
    <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
      <el-table :data="roleMenuTable" border style="width: 100%" :row-class-name="tableRowClassName">
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
            <el-checkbox :label="roleMenuTableData[scope.$index].id">
              <span v-show="roleMenuTableData[scope.$index].operation">取消</span><span v-show="!roleMenuTableData[scope.$index].operation">添加</span>
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
      firstMenu: '',
      secondMenu: '',
      firstOptions: [],
      secondOptions: [],
      options: [],
      checkAll: false,
      isIndeterminate: false,
      checkOptions: [],
      checkList: [],
      roleMenuTableData: []
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
      this.role = this.getUrl('role')
      let id = this.getUrl('id')
      // 刷新页面数据
      this.checkOptions = []
      this.checkAll = false
      this.isIndeterminate = false
      this.checkList = []
      this.firstOptions = []
      this.$http.get('http://localhost:3000/roleMenu?id=' + id).then((res) => {
        this.options = res.data.menu.slice()
        for (let i = 0; i < this.options.length; i++) {
          let value = this.options[i].value
          this.firstOptions.push({
            'value': value,
            'label': value
          })
        }
        this.roleMenuTableData = res.data.menuData.slice()
        for (let i = 0; i < this.roleMenuTableData.length; i++) {
          this.checkOptions.push(this.roleMenuTableData[i].id)
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
    // 批量添加
    roleMenuAdd () {
      if (this.checkAll || this.isIndeterminate) {
        this.$confirm('此操作将批量添加所选菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('http://localhost:3000/roleMenuAdd', {
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
        this.$message.error('请选择所要添加的菜单！')
      }
    },
    // 批量删除
    roleMenuDel () {
      if (this.checkAll || this.isIndeterminate) {
        this.$confirm('此操作将批量添加所选菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('http://localhost:3000/roleMenuDel', {
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
        this.$message.error('请选择所要移除的菜单！')
      }
    }
  },
  computed: {
    roleMenuTable () {
      if (this.firstMenu === '' && this.secondMenu === '') {
        return this.roleMenuTableData
      }
      let one = this.firstMenu
      let two = this.secondMenu
      let data = this.roleMenuTableData.slice()
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
<style>
.el-table .info-row{
  background: #c9e5f5;
}
</style>
