<!-- 权限管理 -> 二级路由 -->
<template>
  <div class="ManageIndex">
    <el-tabs value="role" v-model="activeName" @tab-click="tabClick">
      <!-- 角色管理 -->
      <el-tab-pane label="角色管理" name="role">
        <el-row type="flex" justify="space-between" class="button-row">
          <el-col :xs="24" :sm="16" :md="14" :lg="12">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-input placeholder="请输入内容" v-model="inputRole" @change="inputChange">
                  <template slot="prepend">角色</template>
                </el-input>
              </el-col>
              <el-col :span="12">
                <el-input placeholder="请输入内容" v-model="inputMember" @change="inputChange">
                  <template slot="prepend">成员</template>
                </el-input>
              </el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="4" :md="3" :lg="2">
            <el-row><el-col align="right">
              <!-- 添加角色 -->
              <role-add @loading="load"></role-add>
            </el-col></el-row>
          </el-col>
        </el-row>
        <el-table :data="tableRole" border style="width: 100%" v-loading="tableRoleLoading" element-loading-text="拼命加载中">
          <el-table-column prop="id" label="角色ID" align="center" width="80">
          </el-table-column>
          <el-table-column prop="role" label="角色" align="center" width="150">
          </el-table-column>
          <el-table-column label="菜单管理" align="center" width="120">
            <template scope="scope">
              <el-button @click.native.prevent="roleMenu(scope.$index, tableRole)" size="small">
                菜单管理
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="成员管理" align="center" width="120">
            <template scope="scope">
              <el-button @click.native.prevent="roleMember(scope.$index, tableRole)" size="small">
                成员管理
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="checked" label="已选菜单" align="center" :show-overflow-tooltip="true" min-width="300">
          </el-table-column>
          <el-table-column prop="remark" label="备注" align="center" :show-overflow-tooltip="true" min-width="200">
          </el-table-column>
          <el-table-column label="操作" align="center" width="140"><!--  fixed="right" -->
            <template scope="scope">
              <!-- 修改角色 -->
              <el-button @click.native.prevent="roleAlert(tableRole[scope.$index].id)" size="small">修改</el-button>
              <el-button @click.native.prevent="roleDel(scope.$index, tableRole)" size="small">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 修改角色dialog -->
        <role-modify @loading="load" ref="roleModify"></role-modify>
        <!-- 分页 -->
        <paging :msg="rolePaging"></paging>
      </el-tab-pane>
      <!-- 成员管理 -->
      <el-tab-pane label="成员管理" name="member">
        <el-row>
          <el-col :span="6" :offset="18">
            <el-input
              placeholder="请输入关键字搜索"
              icon="search"
              v-model="inputSearch"
              @change="inputChange">
            </el-input>
          </el-col>
        </el-row>
        <el-table :data="tableMember" border style="width: 100%" v-loading="tableMemberLoading" element-loading-text="拼命加载中">
          <el-table-column prop="id" label="用户ID" align="center" width="80">
          </el-table-column>
          <el-table-column label="用户姓名" align="center">
            <template scope="scope">
            {{tableMember[scope.$index].chineseName}}（{{tableMember[scope.$index].englishName}}）
            </template>
          </el-table-column>
          <el-table-column prop="role" label="用户角色" align="center">
          </el-table-column>
          <el-table-column prop="department" label="所属部门" align="center" :show-overflow-tooltip="true" width="280">
          </el-table-column>
          <el-table-column prop="lastLoginTime" label="最后登录时间" align="center">
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="200">
            <template scope="scope">
              <el-button @click.native.prevent="menuMember(scope.$index, tableMember)" size="small">
                菜单管理
              </el-button>
              <el-button @click.native.prevent="memberOperation(scope.$index, tableMember)" size="small">
                操作权限
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <paging :msg="memberPaging"></paging>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import RoleAdd from './RoleAdd'
import RoleModify from './RoleModify'
import Paging from './Paging'

export default {
  components: {
    RoleAdd,
    RoleModify,
    Paging
  },
  name: 'ManageIndex',
  data () {
    return {
      activeName: '',
      tableRoleData: [],
      tableMemberData: [],
      tableRoleLoading: true,
      tableMemberLoading: true,
      inputRole: '',
      inputMember: '',
      inputSearch: '',
      rolePaging: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      memberPaging: {
        currentPage: 1,
        size: 10,
        total: 0
      }
    }
  },
  methods: {
    // 获取url参数
    getUrl (name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      let r = window.location.search.substr(1).match(reg)
      if (r !== null) {
        return decodeURIComponent(decodeURI(r[2]))
      }
      return null
    },
    // 菜单管理（角色管理页）
    roleMenu (index, rows) {
      this.$router.push({name: 'RoleMenu', query: {id: rows[index].id, role: encodeURIComponent(rows[index].role)}})
    },
    // 成员管理
    roleMember (index, rows) {
      this.$router.push({name: 'RoleMember', query: {id: rows[index].id, role: encodeURIComponent(rows[index].role)}})
    },
    // 修改
    roleAlert (index) {
      this.$refs.roleModify.open(index)
    },
    // 删除
    roleDel (index, rows) {
      this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('manage/role-del?id=' + rows[index].id).then((res) => {
          if (res.body.data) {
            rows.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
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
          message: '已取消删除'
        })
      })
    },
    // 菜单管理（成员管理页）
    menuMember (index, rows) {
      this.$router.push({name: 'MemberMenu', query: {id: rows[index].id, role: encodeURIComponent(rows[index].role)}})
    },
    // 操作权限
    memberOperation (index, rows) {
      this.$router.push({name: 'MemberOperation', query: {id: rows[index].id, user: encodeURIComponent(rows[index].chineseName)}})
    },
    // 加载数据
    load () {
      this.tableRoleLoading = true
      this.tableMemberLoading = true
      this.$http.get('manage/index').then((res) => {
        this.tableRoleData = [...res.body.data.role]
        for (let i = 0; i < this.tableRoleData.length; i++) {
          this.tableRoleData[i].checked = this.tableRoleData[i].checked.join('、')
        }
        this.tableMemberData = [...res.body.data.member]
        this.tableRoleLoading = false
        this.tableMemberLoading = false
      }, (res) => {
        // error callback
        this.$message.error('服务器异常！')
      })
    },
    // input输入调整页数
    inputChange () {
      this.rolePaging.currentPage = 1
      this.memberPaging.currentPage = 1
    },
    // 统一加载动画样式
    tabClick () {
      this.tableRoleLoading = true
      this.tableMemberLoading = true
      setTimeout(() => {
        this.tableRoleLoading = false
        this.tableMemberLoading = false
      }, 200)
    }
  },
  computed: {
    // 动态渲染表格Role
    tableRole () {
      let data = []
      if (this.inputRole === '' && this.inputMember === '') {
        this.rolePaging.total = this.tableRoleData.length
        data = this.tableRoleData
      } else {
        let role = this.inputRole
        let member = this.inputMember
        let roleData = [...this.tableRoleData]
        if (role) {
          for (let i = 0; i < roleData.length;) {
            let judge = false
            // 正则匹配
            judge = judge || (new RegExp(role, 'i').test(roleData[i].role))
            if (!judge) {
              roleData.splice(i, 1)
            } else {
              i++
            }
          }
        }
        let memberData = [...this.tableMemberData]
        let roleMember = []
        if (member) {
          for (let i = 0; i < memberData.length; i++) {
            let judge = false
            judge = judge || (new RegExp(member, 'i').test(memberData[i].chineseName)) || (new RegExp(member, 'i').test(memberData[i].englishName))
            if (judge) {
              roleMember.push(memberData[i].role)
            }
          }
          for (let i = 0; i < roleData.length;) {
            let judge = false
            for (let j = 0; j < roleMember.length; j++) {
              if (roleData[i].role === roleMember[j]) {
                judge = true
              }
            }
            if (!judge) {
              roleData.splice(i, 1)
            } else {
              i++
            }
          }
        }
        this.rolePaging.total = roleData.length
        data = roleData
      }
      return data.slice(((this.rolePaging.currentPage - 1) * this.rolePaging.size), (this.rolePaging.currentPage * this.rolePaging.size))
    },
    // 动态渲染表格Member
    tableMember () {
      let data = []
      if (this.inputSearch === '') {
        this.memberPaging.total = this.tableMemberData.length
        data = [...this.tableMemberData]
      } else {
        let search = this.inputSearch
        data = [...this.tableMemberData]
        for (let i = 0; i < data.length;) {
          let judge = false
          for (let value in data[i]) {
            // 正则匹配
            judge = judge || (new RegExp(search, 'i').test(data[i][value]))
          }
          if (!judge) {
            data.splice(i, 1)
          } else {
            i++
          }
        }
        this.memberPaging.total = data.length
      }
      return data.slice(((this.memberPaging.currentPage - 1) * this.memberPaging.size), (this.memberPaging.currentPage * this.memberPaging.size))
    }
  },
  // 初始化
  mounted () {
    this.activeName = this.getUrl('active') || 'role'
    this.load()
  }
}
</script>

<style scoped>
.el-tab-pane {
  margin: 15px;
}
.el-row {
  margin: 15px 0;
}
.button-row>.el-col>.el-row{
  margin: 0;
}
.RoleAdd{
}
</style>
<style>
.el-table .cell{
  white-space: nowrap;
}
</style>
