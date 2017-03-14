<!-- 权限管理 -> 二级路由 -->
<template>
  <div class="ManageIndex">
    <el-tabs value="role">
      <!-- 角色管理 -->
      <el-tab-pane label="角色管理" name="role">
        <el-row type="flex" justify="space-between" class="button-row">
          <el-col :xs="24" :sm="16" :md="14" :lg="12">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-input placeholder="请输入内容" v-model="inputRole">
                  <template slot="prepend">角色</template>
                </el-input>
              </el-col>
              <el-col :span="12">
                <el-input placeholder="请输入内容" v-model="inputMember">
                  <template slot="prepend">成员</template>
                </el-input>
              </el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="4" :md="3" :lg="2">
            <el-row><el-col align="right">
              <role-add></role-add>
            </el-col></el-row>
          </el-col>
        </el-row>
        <el-table :data="tableRole" border style="width: 100%">
          <el-table-column prop="id" label="角色ID" align="center" width="80">
          </el-table-column>
          <el-table-column prop="role" label="角色" align="center" width="150">
          </el-table-column>
          <el-table-column label="菜单管理" align="center" width="120">
            <template scope="scope">
              <el-button @click.native.prevent="roleMenu(scope.$index, tableRoleData)" size="small">
                菜单管理
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="成员管理" align="center" width="120">
            <template scope="scope">
              <el-button @click.native.prevent="roleMember(scope.$index, tableRoleData)" size="small">
                成员管理
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="checked" label="已选菜单" align="center" :show-overflow-tooltip="true" min-width="200">
          </el-table-column>
          <el-table-column prop="remark" label="备注" align="center" :show-overflow-tooltip="true" min-width="200">
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="140">
            <template scope="scope">
              <el-button @click.native.prevent="alertRow(scope.$index, tableRole)" size="small">
                修改
              </el-button>
              <el-dialog title="修改角色" v-model="dialogVisibleModify" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
                <RoleModify></RoleModify>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="cancelModify">取 消</el-button>
                  <el-button type="primary" @click="RoleModify">确认修改</el-button>
                </span>
              </el-dialog>
              <el-button @click.native.prevent="roleDel(scope.$index, tableRole)" size="small">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 成员管理 -->
      <el-tab-pane label="成员管理" name="member">
        <el-row>
          <el-col :span="6" :offset="18">
            <el-input
              placeholder="请输入关键字搜索"
              icon="search"
              v-model="inputSearch">
            </el-input>
          </el-col>
        </el-row>
        <el-table :data="tableMember" border style="width: 100%">
          <el-table-column prop="id" label="用户ID" align="center" width="80">
          </el-table-column>
          <el-table-column label="用户姓名" align="center">
            <template scope="scope">
            {{tableMember[scope.$index].name}}（{{tableMember[scope.$index].englishName}}）
            </template>
          </el-table-column>
          <el-table-column prop="role" label="用户角色" align="center">
          </el-table-column>
          <el-table-column prop="department" label="所属部门" align="center">
          </el-table-column>
          <el-table-column prop="lastLoginTime" label="最后登录时间" align="center">
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="200">
            <template scope="scope">
              <el-button @click.native.prevent="menuMember(scope, tableMember)" size="small">
                菜单管理
              </el-button>
              <el-button @click.native.prevent="memberOperation(scope.$index, tableMember)" size="small">
                操作权限
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import RoleAdd from './RoleAdd'
import RoleModify from './RoleModify'

export default {
  components: {
    RoleAdd,
    RoleModify
  },
  name: 'ManageIndex',
  data () {
    return {
      tableRoleData: [],
      // 接收数据是使用slice()克隆tableMemberData
      tableMemberData: [],
      inputRole: '',
      inputMember: '',
      inputSearch: '',
      dialogVisibleModify: false
    }
  },
  methods: {
    // 菜单管理（角色管理页）
    roleMenu (index, rows) {
      console.log(this.$router)
      console.log(rows[index])
      this.$router.push({name: 'RoleMenu', query: {id: rows[index].id}})
    },
    // 成员管理
    roleMember (index, rows) {
      console.log(this.$router)
      console.log(rows[index])
      this.$router.push({name: 'RoleMember', query: {id: rows[index].id}})
    },
    // 修改
    alertRow (index, rows) {
      this.dialogVisibleModify = true
    },
    RoleModify () {
      this.dialogVisibleModify = true
    },
    cancelModify () {
      this.dialogVisibleModify = true
    },
    // 删除
    roleDel (index, rows) {
      this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('http://localhost:3000/roleDel?id=' + rows[index].id).then((response) => {
          if (response.data.msg) {
            rows.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message.error('服务器异常！')
          }
        }, (response) => {
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
      console.log(this.$router)
      console.log(rows[index])
      this.$router.push({name: 'MemberMenu'})
    },
    // 操作权限
    memberOperation (index, rows) {
      console.log(this.$router)
      console.log(rows[index])
      this.$router.push({name: 'MemberOperation'})
    },
    // 初始化页面，请求数据
    initialize () {
      this.$http.get('http://localhost:3000/manageIndex').then((response) => {
        this.tableRoleData = response.data.role.slice()
        this.tableMemberData = response.data.member.slice()
      }, (response) => {
        // error callback
      })
    }
  },
  computed: {
    // 动态渲染表格
    tableMember () {
      if (this.inputSearch === '') {
        return this.tableMemberData
      }
      let search = this.inputSearch
      let data = this.tableMemberData.slice()
      for (let i = 0; i < data.length;) {
        let judge = false
        for (let value in data[i]) {
          // 正则匹配
          judge = judge || (new RegExp(search).test(data[i][value]))
        }
        if (!judge) {
          data.splice(i, 1)
        } else {
          i++
        }
      }
      return data
    },
    // 动态渲染表格
    tableRole () {
      if (this.inputRole === '' && this.inputMember === '') {
        return this.tableRoleData
      }
      let role = this.inputRole
      let member = this.inputMember
      let roleData = this.tableRoleData.slice()
      if (role) {
        for (let i = 0; i < roleData.length;) {
          let judge = false
          // 正则匹配
          judge = judge || (new RegExp(role).test(roleData[i].role))
          if (!judge) {
            roleData.splice(i, 1)
          } else {
            i++
          }
        }
      }
      let memberData = this.tableMemberData.slice()
      let roleMember = []
      if (member) {
        console.log(this.tableMemberData)
        for (let i = 0; i < memberData.length; i++) {
          let judge = false
          judge = judge || (new RegExp(member).test(memberData[i].name))
          if (judge) {
            roleMember.push(memberData[i].role)
          }
        }
        console.log(roleMember)
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
      return roleData
    }
  },
  mounted () {
    this.initialize()
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
