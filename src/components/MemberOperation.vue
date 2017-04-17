<!-- 权限管理 -> 成员管理 -> 操作权限 -> 二级路由 -->
<template>
  <div class="MemberOperation">
    <el-row>
      <el-button type="text"><router-link :to="{path: '/manage', query: {active: 'member'}}"><i class="el-icon-arrow-left"></i></router-link></el-button>
      {{user}}
    </el-row>
    <el-row>
      <el-row class="border-bottom select-btn">
        <el-col>
          <span>操作权限赋予：</span>
          <!-- 选择器 -->
          <select-auth v-on:addSelData="addSelData"></select-auth>
        </el-col>
      </el-row>
      <!-- 添加列表 -->
      <el-row>
        <el-table :data="tableAddData" border style="width: 100%" max-height="250">
          <el-table-column prop="game.name" label="游戏" align="center" width="150"></el-table-column>
          <el-table-column prop="platform.name" label="平台" align="center" width="150"></el-table-column>
          <el-table-column prop="hall.name" label="大厅" align="center"  width="100"></el-table-column>
          <el-table-column prop="terminal.name" label="终端" align="center"  width="150"></el-table-column>
          <el-table-column prop="apk.name" label="应用包" align="center" ></el-table-column>
          <el-table-column label="APPID应用" align="center"  width="150">
            <template scope="scope">
              <el-button size="small" @click="getAppid(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column label="权限内容" align="left"  header-align="center">
            <template scope="scope">
              <el-checkbox  :key="index" v-for="(item, index) in scope.row.auth" v-model="item.owned">{{item.name}}</el-checkbox>
            </template>
          </el-table-column>
          <!--<el-table-column-->
            <!--v-for="(header,index) in tableHeader"-->
            <!--:prop="header.prop"-->
            <!--:label="header.label"-->
            <!--:key="index"-->
            <!--align="center">-->
          <!--</el-table-column>-->
          <!--<el-table-column label="权限内容" align="center" width="240">-->
            <!--<template scope="scope">-->
              <!--<el-checkbox-group v-model="scope.row.auth">-->
                <!--<el-checkbox  v-for="(item, index) in allOperateAuth" :key="item" :label="item">{{item.name}}</el-checkbox>-->
              <!--</el-checkbox-group>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column label="业务审核人" prop="handler.name" align="center">
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="100">
            <template scope="scope">
              <el-button @click.native.prevent="addRow(scope.$index, tableAddData)" size="small">
                添加
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- 已有列表 -->
      <el-row>
        <el-col class="list-title">已有操作权限列表：</el-col>
        <el-col class="border-bottom"></el-col>
        <el-col class="button"><el-row>
          <el-col :xs="24" :sm="14" :md="16" :lg="18">
            <el-button type="primary" @click="alertRowDialog(multipleSelection)">批量修改</el-button>
            <el-button type="primary" @click="deleteRow(multipleSelection)">批量删除</el-button>
          </el-col>
          <el-col :xs="24" :sm="10" :md="8" :lg="6">
            <el-input placeholder="请输入关键字搜索" v-model="inputSearch"></el-input>
          </el-col>
        </el-row></el-col>
        <el-table ref="table" row-key="id" :data="tableDel" border style="width: 100%" max-height="250" @selection-change="handleSelectionChange" v-loading="tableDelLoading" element-loading-text="拼命加载中">
          <el-table-column type="selection" :reserve-selection="true"></el-table-column>
          <el-table-column
            v-for="(header,index) in tableHeader"
            :prop="header.prop"
            :label="header.label"
            :key="index"
            align="center">
          </el-table-column>
          <el-table-column label="权限内容" align="center" width="240">
            <template scope="scope">
              <el-checkbox :label="item.name" v-for="item in tableDel[scope.$index].auth" :key="item" disabled v-model="item.owned">{{item.name}}</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="业务审核人" prop="verifier" align="center">
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="140">
            <template scope="scope">
              <el-button @click.native.prevent="alertRowDialog([tableDel[scope.$index].id])" size="small">
                修改
              </el-button>
              <el-button @click.native.prevent="deleteRow([tableDel[scope.$index].id])" size="small">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <paging :msg="paging"></paging>
        <el-dialog title="批量修改" v-model="dialogVisible" size="tiny" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" align="center">
          <el-checkbox  v-for="item in auth" :key="item.id" :label="item.name" v-model="item.owned">{{item.name}}</el-checkbox>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancelAlertRow">取 消</el-button>
            <el-button type="primary" @click="alertRow">确 定</el-button>
          </span>
        </el-dialog>
      </el-row>
    </el-row>
    <AppIdTable ref="appidTable"></AppIdTable>
  </div>
</template>

<script>
import SelectAuth from 'components/SelectAuth'
import Paging from './Paging'
import AppIdTable from 'components/AppIdTable'

export default {
  name: 'MemberOperation',
  components: {
    SelectAuth,
    Paging,
    AppIdTable
  },
  data () {
    return {
      user: '',
      inputSearch: '',
      dialogVisible: false,
      multipleSelection: [],
      tableHeader: [
        {
          prop: 'game',
          label: '游戏'
        }, {
          prop: 'platform',
          label: '平台'
        }, {
          prop: 'hall',
          label: '大厅'
        }, {
          prop: 'terminal',
          label: '终端'
        }, {
          prop: 'apk',
          label: '应用包'
        }, {
          prop: 'appid',
          label: 'APPID应用'
        }
      ],
      tableAddData: [],
      tableDelData: [],
      alertRowData: [],
      allOperateAuth: [],
      auth: [],
      tableDelLoading: true,
      paging: {
        currentPage: 1,
        size: 5,
        total: 0
      }
    }
  },
  methods: {
    getAppid (params) {
      // 打开appid列表
      this.$refs.appidTable.getAppid(params)
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
    // 加载数据
    load () {
      this.$refs.table.clearSelection()
      this.auth = []
      this.user = this.getUrl('user')
      let id = this.getUrl('id')
      this.$http.get('manage/member-operation?id=' + id).then((res) => {
        this.tableDelData = [...res.body.data.list]
        this.tableDelLoading = false
      }, (res) => {
        // error callback
        this.$message.error('服务器异常！')
      })
      this.$http.get('manage/all-operation').then((res) => {
        res.body.data.forEach((item) => {
          this.auth.push({
            id: item.id,
            name: item.name,
            owned: false
          })
        })
      }, (res) => {
        // error callback
        this.$message.error('服务器异常！')
      })
    },
    // 选择器添加到表格
    addSelData (appidList) {
      // 加入等待队列
      let _appidList = JSON.stringify(appidList)
      // 根据APPID获取权限列表和该用户已有的权限
      this.$http.post('apply/appid-action', _appidList).then(response => {
        if (response.body.error_code === 0) {
          this.tableAddData = this.tableAddData.concat(response.body.data)
        } else {
          this.$message.error('参数错误！')
        }
      }, response => {
          // error callback
        this.$message.error('服务器异常')
      })
    },
    // 添加到已申请列表
    addRow (index, rows) {
      let id = this.getUrl('id')
      console.log(index, rows, rows[index].appid)
      let auth = []
      for (let i = 0; i < rows[index].auth.length; i++) {
        auth.push(rows[index].auth[i].id)
      }
      this.$confirm('此操作将添加该APPID操作权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('manage/member-operation-add?', {
          userId: id,
          appid: rows[index].appid,
          auth: auth
        }).then((res) => {
          if (res.body.data) {
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            rows.splice(index, 1)
            this.load()
          } else if (res.body.error_code === 1) {
            this.$message.error('权限内容不能为空！')
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
          message: '已取消添加'
        })
      })
    },
    // 从已申请列表删除
    deleteRow (index) {
      let id = index
      if (id.length !== 0) {
        this.$http.post('manage/member-operation-del', {
          id: id
        }).then((res) => {
          if (res.body.data) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.tableDelLoading = true
            this.load()
            this.dialogVisible = false
          } else {
            this.$message.error('服务器异常！')
          }
        }, (res) => {
          // error callback
          this.$message.error('服务器异常！')
        })
      } else {
        this.$message.error('请选择要删除的操作权限！')
      }
    },
    // 批量修改
    alertRowDialog (index) {
      if (index.length !== 0) {
        this.dialogVisible = true
        this.alertRowData = index
      } else {
        this.$message.error('请选择要修改的操作权限！')
      }
    },
    // 取消修改
    cancelAlertRow () {
      this.dialogVisible = false
      this.$message('已取消修改')
      this.auth.forEach((item) => { item.owned = false })
    },
    // 修改已申请列表
    alertRow () {
      if (this.alertRowData.length !== 0) {
        let auth = []
        for (let i = 0; i < this.auth.length; i++) {
          if (this.auth[i].owned) {
            auth.push(this.auth[i].id)
          }
        }
        this.$http.post('manage/member-operation-alert', {
          id: this.alertRowData,
          auth: auth
        }).then((res) => {
          if (res.body.data) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.tableDelLoading = true
            this.load()
            this.dialogVisible = false
          } else if (res.body.error_code === 1) {
            this.$message.error('权限内容不能为空！')
          } else {
            this.$message.error('服务器异常！')
          }
        }, (res) => {
          // error callback
          this.$message.error('服务器异常！')
        })
      } else {
        this.$message.error('请选择要修改的操作权限！')
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
    tableDel () {
      let data = []
      if (this.inputSearch === '') {
        this.paging.total = this.tableDelData.length
        data = this.tableDelData
      } else {
        let search = this.inputSearch
        data = [...this.tableDelData]
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
  .MemberOperation{
    margin: 10px;
  }
  .proposer{
    line-height: 34px;
  }
  .content>span:first-child,
  .proposer>span:first-child{
    display: block;
    font-weight: bold;
    line-height: 24px;
  }
  .content .el-row{
    margin: 15px 0;
  }
  .content .el-row>.el-col:first-child{
    font-weight: bold;
  }
  .more{
    margin-left: 15px;
  }
  .list-title{
    line-height: 34px;
    margin-top: 16px;
  }
  .button-submit{
    text-align: center;
    margin: 10px 0;
  }
  table td{
    background: red;
  }
  .button{
    margin: 10px 0;
  }
  .select-btn{
    padding: 5px 0;
    margin-bottom: 10px;
  }
</style>
