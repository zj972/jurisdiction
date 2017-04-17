<!-- 权限管理 -> 成员管理 -> 菜单管理 -> 二级路由 -->
<template>
  <div class="MemberMenu">
    <el-row><el-col>
      <el-button type="text"><router-link :to="{path: '/manage', query: {active: 'member'}}"><i class="el-icon-arrow-left"></i></router-link></el-button>
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
      <el-col>
        角色：{{role}}
      </el-col>
      <el-col>
        <el-button type="primary" @click="roleMenuAddOne">批量添加</el-button>
        <el-button type="primary" @click="roleMenuDelOne">批量取消</el-button>
      </el-col>
    </el-row>
    <el-table  ref="tableOne" row-key="id" :data="memberMenuTableOne" border style="width: 100%" :row-class-name="tableRowClassName" @selection-change="handleSelectionChangeOne" v-loading="memberMenuTableOneLoading" element-loading-text="拼命加载中">
      <el-table-column type="selection" :reserve-selection="true"></el-table-column>
      <el-table-column prop="id" label="ID" align="center">
      </el-table-column>
      <el-table-column prop="firstMenu" label="一级菜单" align="center">
      </el-table-column>
      <el-table-column prop="secondMenu" label="二级菜单" align="center">
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="140">
        <template scope="scope">
          <el-button @click="roleMenuAlertOne(scope.$index, memberMenuTableOne)" size="small">{{memberMenuTableOne[scope.$index].operation ? '取消' : '添加'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging :msg="pagingOne"></paging>
    <el-row  class="button">
      <el-col>
        其他菜单：
      </el-col>
      <el-col>
        <el-button type="primary" @click="roleMenuAddTwo">批量添加</el-button>
        <el-button type="primary" @click="roleMenuDelTwo">批量取消</el-button>
      </el-col>
    </el-row>
    <el-table  ref="tableTwo" row-key="id" :data="memberMenuTableTwo" border style="width: 100%" :row-class-name="tableRowClassName" @selection-change="handleSelectionChangeTwo" v-loading="memberMenuTableTwoLoading" element-loading-text="拼命加载中">
      <el-table-column type="selection" :reserve-selection="true"></el-table-column>
      <el-table-column prop="id" label="ID" align="center">
      </el-table-column>
      <el-table-column prop="firstMenu" label="一级菜单" align="center">
      </el-table-column>
      <el-table-column prop="secondMenu" label="二级菜单" align="center">
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="140">
        <template scope="scope">
          <el-button @click="roleMenuAlertTwo(scope.$index, memberMenuTableTwo)" size="small">{{memberMenuTableTwo[scope.$index].operation ? '取消' : '添加'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging :msg="pagingTwo"></paging>
  </div>
</template>

<script>
import Paging from './Paging'

export default {
  components: {
    Paging
  },
  name: 'MemberMenu',
  data () {
    return {
      id: null,
      role: '',
      firstMenu: '',
      secondMenu: '',
      firstOptions: [],
      secondOptions: [],
      options: [],
      multipleSelectionOne: [],
      multipleSelectionTwo: [],
      memberMenuTableDataOne: [],
      memberMenuTableDataTwo: [],
      memberMenuTableOneLoading: true,
      memberMenuTableTwoLoading: true,
      pagingOne: {
        currentPage: 1,
        size: 5,
        total: 0
      },
      pagingTwo: {
        currentPage: 1,
        size: 5,
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
      this.role = this.getUrl('role')
      this.id = this.getUrl('id')
      // 刷新页面数据
      this.multipleSelectionOne = []
      this.multipleSelectionTwo = []
      this.firstOptions = []
      this.$http.get('manage/member-menu?id=' + this.id).then((res) => {
        this.options = [...res.body.data.menu]
        for (let i = 0; i < this.options.length; i++) {
          let value = this.options[i].value
          this.firstOptions.push({
            'value': value,
            'label': value
          })
        }
        this.memberMenuTableDataOne = [...res.body.data.menuDataOne]
        this.memberMenuTableDataTwo = [...res.body.data.menuDataTwo]
        this.memberMenuTableOneLoading = false
        this.memberMenuTableTwoLoading = false
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
    // 批量添加One
    roleMenuAddOne () {
      if (this.multipleSelectionOne.length) {
        this.$http.post('manage/member-menu-add-one', {
          'id': this.multipleSelectionOne,
          'userId': this.id
        }).then((res) => {
          if (res.body.data) {
            this.$message({
              message: '添加成功！',
              type: 'success'
            })
            // 更新表格
            this.memberMenuTableOneLoading = true
            this.load()
            this.pagingOne.currentPage = 1
            this.$refs.tableOne.clearSelection()
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
    // 批量添加Two
    roleMenuAddTwo () {
      if (this.multipleSelectionTwo.length) {
        this.$http.post('manage/member-menu-add-two', {
          'id': this.multipleSelectionTwo,
          'userId': this.id
        }).then((res) => {
          if (res.body.data) {
            this.$message({
              message: '添加成功！',
              type: 'success'
            })
            // 更新表格
            this.memberMenuTableTwoLoading = true
            this.load()
            this.pagingTwo.currentPage = 1
            this.$refs.tableTwo.clearSelection()
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
    // 批量删除One
    roleMenuDelOne () {
      if (this.multipleSelectionOne.length) {
        this.$http.post('manage/member-menu-del-one', {
          'id': this.multipleSelectionOne,
          'userId': this.id
        }).then((res) => {
          if (res.body.data) {
            this.$message({
              message: '移除成功！',
              type: 'success'
            })
            // 更新表格
            this.memberMenuTableOneLoading = true
            this.load()
            this.pagingOne.currentPage = 1
            this.$refs.tableOne.clearSelection()
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
    // 批量删除Two
    roleMenuDelTwo () {
      if (this.multipleSelectionTwo.length) {
        this.$http.post('manage/member-menu-del-two', {
          'id': this.multipleSelectionTwo,
          'userId': this.id
        }).then((res) => {
          if (res.body.data) {
            this.$message({
              message: '移除成功！',
              type: 'success'
            })
            // 更新表格
            this.memberMenuTableTwoLoading = true
            this.load()
            this.pagingTwo.currentPage = 1
            this.$refs.tableTwo.clearSelection()
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
    // 修改One
    roleMenuAlertOne (index, rows) {
      this.multipleSelectionOne = [rows[index].id]
      if (rows[index].operation) {
        this.roleMenuDelOne()
      } else {
        this.roleMenuAddOne()
      }
    },
    // 修改Two
    roleMenuAlertTwo (index, rows) {
      this.multipleSelectionTwo = [rows[index].id]
      if (rows[index].operation) {
        this.roleMenuDelTwo()
      } else {
        this.roleMenuAddTwo()
      }
    },
    // 表格选择器
    handleSelectionChangeOne (val) {
      let id = []
      for (let i = 0; i < val.length; i++) {
        id.push(val[i].id)
      }
      this.multipleSelectionOne = [...id]
    },
    handleSelectionChangeTwo (val) {
      let id = []
      for (let i = 0; i < val.length; i++) {
        id.push(val[i].id)
      }
      this.multipleSelectionTwo = [...id]
    }
  },
  computed: {
    // 动态渲染表格One
    memberMenuTableOne () {
      let data = []
      if (this.firstMenu === '' && this.secondMenu === '') {
        this.pagingOne.total = this.memberMenuTableDataOne.length
        data = this.memberMenuTableDataOne
      } else {
        let one = this.firstMenu
        let two = this.secondMenu
        data = [...this.memberMenuTableDataOne]
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
        this.pagingOne.total = data.length
      }
      return data.slice(((this.pagingOne.currentPage - 1) * this.pagingOne.size), (this.pagingOne.currentPage * this.pagingOne.size))
    },
    // 动态渲染表格Two
    memberMenuTableTwo () {
      let data = []
      if (this.firstMenu === '' && this.secondMenu === '') {
        this.pagingTwo.total = this.memberMenuTableDataTwo.length
        data = this.memberMenuTableDataTwo
      } else {
        let one = this.firstMenu
        let two = this.secondMenu
        data = [...this.memberMenuTableDataTwo]
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
        this.pagingTwo.total = data.length
      }
      return data.slice(((this.pagingTwo.currentPage - 1) * this.pagingTwo.size), (this.pagingTwo.currentPage * this.pagingTwo.size))
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
