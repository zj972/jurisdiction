<template>
  <div class="MemberAuth">
    <el-row>
      <el-col :xs="24" :sm="21" :md="22" :lg="22">
        <div id="uc_test"></div>
      </el-col>
      <el-col :xs="24" :sm="3" :md="2" :lg="2" align="right">
        <el-button @click="memberAdd" style="width: 100%;">添加</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableMember" border style="width: 100%" v-loading="tableMemberLoading" element-loading-text="拼命加载中">
      <el-table-column prop="user_id" label="用户ID" align="center" width="80">
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
      <el-table-column fixed="right" label="操作" align="center" width="100">
        <template scope="scope">
          <el-button @click.native.prevent="memberDel(scope.$index, tableMember)" size="small">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
  </div>
</template>
<script>
  import Paging from './Paging'
  import $ from 'jquery'
  import load from '../load'

  export default {
    components: {
      Paging
    },
    name: 'MemberAuth',
    data () {
      return {
        tableMember: [],
        tableMemberLoading: false,
        memberPaging: {
          currentPage: 1,
          size: 10,
          total: 0
        }
      }
    },
    methods: {
      memberDel (index, rows) {
        this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get('auth-self/role-member-del?id=' + rows[index].user_id).then((res) => {
            if (res.body.data) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.loading()
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
      memberAdd () {
        if ($('input[name=checked]').val() === '') {
          this.$message.error('请选择所要添加的角色！')
        } else {
          let list = []
          list = $('input[name=checked]').val().split(',')
          this.$http.post('auth-self/role-member-add', {
            id: list
          }).then((res) => {
            if (res.body.data) {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.loading()
            } else {
              this.$message.error('服务器异常！')
            }
          }, (res) => {
            // error callback
            this.$message.error('服务器异常！')
          })
        }
      },
      loading () {
        this.tableMemberLoading = true
        this.$http.get('auth-self/index').then((res) => {
          this.tableMember = [...res.body.data]
          this.tableMemberLoading = false
        }, (res) => {
          // error callback
          this.$message.error('服务器异常！')
        })
        load('http://tool.oa.com/api/?id=uCheck2').then(() => {
          $('#uc_test').uCheck('checked', undefined, {showNum: 5, showFull: 1})
        }, (res) => {
          // error callback
        })
      }
    },
    // 初始化
    mounted () {
      this.loading()
    }
  }
</script>

<style scoped>
  .MemberAuth {
    margin: 15px;
  }
  .MemberAuth > .el-row {
    margin: 0 0 10px;
  }
</style>
<style>
  #uc_test input[type='text'] {
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #bfcbd9;
    box-sizing: border-box;
    color: #1f2d3d;
    display: inline-block;
    height: 36px;
    line-height: 1;
    outline: 0;
    padding: 3px 10px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 162px;
  }
  #uc_test button {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #bfcbd9;
    color: #1f2d3d;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    padding: 10px 15px;
    border-radius: 4px;
  }
</style>
