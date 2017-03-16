<!-- 权限管理 -> 成员管理 -> 菜单管理 -> 二级路由 -->
<template>
  <div class="MemberMenu">
    <el-row><el-col>
      <el-button type="text"><router-link to="/Manage"><i class="el-icon-arrow-left"></i></router-link></el-button>
      <el-select v-model="firstMenu" clearable placeholder="一级菜单请选择"  @change="toSecondMenu">
        <el-option
          v-for="item in firstOptions"
          :label="item.label"
          :value="item.value"
          :key="item.value">
        </el-option>
      </el-select>
      <el-select v-model="secondMenu" clearable placeholder="二级菜单请选择">
        <el-option
          v-for="item in secondOptions"
          :label="item.label"
          :value="item.value"
          :key="item.value">
        </el-option>
      </el-select>
    </el-col></el-row>
    <el-row  class="button">
      <el-col :xs="24" :sm="24" :md="14" :lg="10">
        角色：{{role}}
      </el-col>
      <el-col :xs="24" :sm="24" :md="10" :lg="14" align="right">
        <el-button type="primary" @click="roleMenuAddOne">批量添加</el-button>
        <el-button type="primary" @click="roleMenuDelOne">批量取消</el-button>
        <el-checkbox :indeterminate="isIndeterminateOne" v-model="checkAllOne" @change="handleCheckAllChangeOne">全选</el-checkbox>
      </el-col>
    </el-row>
    <el-checkbox-group v-model="checkListOne" @change="handleCheckedCitiesChangeOne">
      <el-table :data="memberMenuTableOne" border style="width: 100%" :row-class-name="tableRowClassName">
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
            <el-checkbox :label="memberMenuTableDataOne[scope.$index].id">
              <span v-show="memberMenuTableDataOne[scope.$index].operation">取消</span><span v-show="!memberMenuTableDataOne[scope.$index].operation">添加</span>
            </el-checkbox>
          </template>
        </el-table-column>
      </el-table>
    </el-checkbox-group>
    <el-row  class="button">
      <el-col :xs="24" :sm="24" :md="14" :lg="10">
        其他菜单：
      </el-col>
      <el-col :xs="24" :sm="24" :md="10" :lg="14" align="right">
        <el-button type="primary" @click="roleMenuAddTwo">批量添加</el-button>
        <el-button type="primary" @click="roleMenuDelTwo">批量取消</el-button>
        <el-checkbox :indeterminate="isIndeterminateTwo" v-model="checkAllTwo" @change="handleCheckAllChangeTwo">全选</el-checkbox>
      </el-col>
    </el-row>
    <el-checkbox-group v-model="checkListTwo" @change="handleCheckedCitiesChangeTwo">
      <el-table :data="memberMenuTableTwo" border style="width: 100%" :row-class-name="tableRowClassName">
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
            <el-checkbox :label="memberMenuTableDataTwo[scope.$index].id">
              <span v-show="memberMenuTableDataTwo[scope.$index].operation">取消</span><span v-show="!memberMenuTableDataTwo[scope.$index].operation">添加</span>
            </el-checkbox>
          </template>
        </el-table-column>
      </el-table>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  name: 'MemberMenu',
  data () {
    return {
      role: '',
      firstMenu: '',
      secondMenu: '',
      firstOptions: [],
      secondOptions: [],
      options: [],
      checkAllOne: false,
      isIndeterminateOne: false,
      checkAllTwo: false,
      isIndeterminateTwo: false,
      checkOptionsOne: [],
      checkListOne: [],
      checkOptionsTwo: [],
      checkListTwo: [],
      memberMenuTableDataOne: [],
      memberMenuTableDataTwo: []
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
      this.checkOptionsOne = []
      this.checkListOne = []
      this.checkAllOne = false
      this.isIndeterminateOne = false
      this.checkOptionsTwo = []
      this.checkListTwo = []
      this.checkAllTwo = false
      this.isIndeterminateTwo = false
      this.firstOptions = []
      this.$http.get('http://localhost:3000/memberMenu?id=' + id).then((res) => {
        this.options = res.data.menu.slice()
        for (let i = 0; i < this.options.length; i++) {
          let value = this.options[i].value
          this.firstOptions.push({
            'value': value,
            'label': value
          })
        }
        this.memberMenuTableDataOne = res.data.menuDataOne.slice()
        for (let i = 0; i < this.memberMenuTableDataOne.length; i++) {
          this.checkOptionsOne.push(this.memberMenuTableDataOne[i].id)
        }
        this.memberMenuTableDataTwo = res.data.menuDataTwo.slice()
        for (let i = 0; i < this.memberMenuTableDataTwo.length; i++) {
          this.checkOptionsTwo.push(this.memberMenuTableDataTwo[i].id)
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
    // 绑定全选按钮One
    handleCheckAllChangeOne (event) {
      this.checkListOne = event.target.checked ? this.checkOptionsOne : []
      this.isIndeterminateOne = false
      console.log(this.checkListOne)
    },
    // 判断全选按钮状态One
    handleCheckedCitiesChangeOne (value) {
      let checkedCount = value.length
      this.checkAllOne = (checkedCount === this.checkOptionsOne.length)
      this.isIndeterminateOne = (checkedCount > 0 && checkedCount < this.checkOptionsOne.length)
      console.log(this.checkListOne)
    },
    // 绑定全选按钮Two
    handleCheckAllChangeTwo (event) {
      this.checkListTwo = event.target.checked ? this.checkOptionsTwo : []
      this.isIndeterminateTwo = false
      console.log(this.checkListTwo)
    },
    // 判断全选按钮状态Two
    handleCheckedCitiesChangeTwo (value) {
      let checkedCount = value.length
      this.checkAllTwo = (checkedCount === this.checkOptionsTwo.length)
      this.isIndeterminateTwo = (checkedCount > 0 && checkedCount < this.checkOptionsTwo.length)
      console.log(this.checkListTwo)
    },
    // 批量添加
    roleMenuAddOne () {
      if (this.checkAllOne || this.isIndeterminateOne) {
        this.$confirm('此操作将批量添加所选菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('http://localhost:3000/memberMenuAddOne', {
            'id': this.checkListOne
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
    roleMenuAddTwo () {
      if (this.checkAllTwo || this.isIndeterminateTwo) {
        this.$confirm('此操作将批量添加所选菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('http://localhost:3000/memberMenuAddTwo', {
            'id': this.checkListTwo
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
    roleMenuDelOne () {
      if (this.checkAllOne || this.isIndeterminateOne) {
        this.$confirm('此操作将批量添加所选菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('http://localhost:3000/memberMenuDelOne', {
            'id': this.checkListOne
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
    },
    roleMenuDelTwo () {
      if (this.checkAllTwo || this.isIndeterminateTwo) {
        this.$confirm('此操作将批量添加所选菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('http://localhost:3000/memberMenuDelTwo', {
            'id': this.checkListTwo
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
    memberMenuTableOne () {
      if (this.firstMenu === '' && this.secondMenu === '') {
        return this.memberMenuTableDataOne
      }
      let one = this.firstMenu
      let two = this.secondMenu
      let data = this.memberMenuTableDataOne.slice()
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
    },
    memberMenuTableTwo () {
      if (this.firstMenu === '' && this.secondMenu === '') {
        return this.memberMenuTableDataTwo
      }
      let one = this.firstMenu
      let two = this.secondMenu
      let data = this.memberMenuTableDataTwo.slice()
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
