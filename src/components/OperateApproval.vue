<template>
    <div id='operate-approval'>
      <ApprovalCommon :select-list="operateAuthSelectList" v-on:resolveInput="resolveInput" v-on:refreshData="emitRefresh"></ApprovalCommon>
      <el-table :data="showPartData" border style="width: 100%" @selection-change="sctChange" row-key="uuid" :fit="true" >
        <el-table-column label="选项" align="center" width="50" type="selection" reserve-selection ></el-table-column>
        <el-table-column label="申请人" prop="applicant" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="申请人角色" prop="role" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="所属部门" prop="department" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="游戏" prop="game.name" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="平台" prop="platform.name" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="大厅" prop="hall.name" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="终端" prop="terminal.name" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="应用包" prop="apk.name" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="APPID应用" align="center" :show-overflow-tooltip="true">
          <template scope="scope">
            <el-button size="small" @click="getAppid(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="权限内容" align="left" header-align="center" :show-overflow-tooltip="true">
          <template scope="scope">
            <div v-for="(item, index) in scope.row.auth">
              <el-checkbox :label="item" :key="index"  disabled checked></el-checkbox>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" prop="applyTime" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="申请理由" prop="reason" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" align="center" width="180" :show-overflow-tooltip="true">
          <template scope="scope">
            <el-button type="primary" size="mini" @click="operateOne(scope.row, true, authPassOne)">审核通过</el-button>
            <el-button type="warning" size="mini" @click="operateOne(scope.row, false, authRejectOne)">审核驳回</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <div class="pagination-wrap">
        <el-pagination layout="prev, pager, next, jumper" :total="searchData.length" :page-size="pageSize"
                       style="display: inline-block;" :current-page="currentPage"
                       @current-change="pageChange"></el-pagination>
      </div>

      <AppIdTable ref="appidTable"></AppIdTable>
    </div>
</template>

<script type="text/ecmascript-6">
    import { getResult } from 'common/js/public.js'
    import AppIdTable from 'components/AppIdTable'
    import ApprovalCommon from 'components/ApprovalCommon'
    const searchItemConfig = ['applicant', 'role', 'department', 'auth', 'game', 'platform', 'hall', 'terminal', 'apk', 'reason', 'handler', 'applyTime']
    export default {
      data () {
        return {
          keywords: '', // 用户输入搜索关键字
          operateAuthSelectList: [],  // 用户勾选CheckBox集合
          pageSize: 10,  // 分页每页数据量
          currentPage: 1,  // 当前页面page值
          searchData: [],  // 通过搜索获取的结果集合
          showPartData: [] // 从搜索集合提取的展示数据集合，长度等于pageSize的值
        }
      },
      props: ['approvalData'], // 传入ApprovalCommon子组件的所有后台审批数据
      components: {
        ApprovalCommon,
        AppIdTable
      },
      methods: {
        getAppid (params) {
          // 打开appid列表
          this.$refs.appidTable.getAppid(params)
        },
        // 选择CheckBox触发事件，得到勾选集合
        sctChange (selection) {
          this[`operateAuthSelectList`] = selection
//          console.log('选择数据')
//          console.log(selection)
        },
        // 发送通过单条请求，作为operateOne的回调函数
        authPassOne (id) {
          return this.$http.get(`approval/pass-one?id=${id}`).then(response => {
            // 根据返回状态值判断，进行相关操作，0为成功
            if (response.body.error_code === 0) {
              this.$message.success('通过申请')
            } else {
              this.$message.error('参数错误')
            }
          }, response => {
            this.$message.error('服务器异常')
          })
        },
        // 发送拒绝单条请求，作为operateOne的回调函数
        authRejectOne (data) {
          return this.$http.post(`approval/reject-one`, data).then(response => {
            // 根据返回状态值判断，进行相关操作，0为成功
            if (response.body.error_code === 0) {
              this.$message.success('拒绝该条申请')
            } else {
              this.$message.error('参数错误')
            }
          }, response => {
            this.$message.error('服务器异常')
          })
        },
        // 单条操作
        operateOne (data, flag, callback) {
          let _data = {}
          _data.id = data.uuid
          if (!flag) {
            this.$prompt('驳回理由', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(({ value }) => {
              _data.reason = value

              if (callback) {
                callback(_data).then(() => {
                  this.emitRefresh()
                })
              }
            }).catch(() => {
              // todo
            })
          } else {
            if (callback) {
              callback(_data).then(() => {
                this.emitRefresh()
              })
            }
          }
        },
        emitRefresh () {
          // 这里出发事件更新数据
          this.$emit('refresh')
        },
        // 展示部分搜索结果，取决于pageSize
        showPart (data, currentPage, pageSize) {
          let _start = (currentPage - 1) * pageSize
          let _end = currentPage * pageSize
          return data.slice(_start, _end)
        },
        // 获取在ApprovalCommon子组件中用户在搜索框的输入
        resolveInput (keywords) {
          this.keywords = keywords // 保留搜索关键字
          this.searchData = getResult(this.approvalData, this.keywords, searchItemConfig)  // 获取搜索结果
          this.showPartData = this.showPart(this.searchData, this.currentPage, this.pageSize) // 提取需要展示的数据
        },
        // 分页切换触发事件：1 改变当前页面page值 2 提取相应展示条目
        pageChange (page) {
          this.currentPage = page
          this.showPartData = this.showPart(this.searchData, this.currentPage, this.pageSize)
        }
      },
      watch: {
        // 这里必须监测approvalData的变化，因为只能在approvalData数据拿到的时候，才能赋值给searchData，否则会是undefined
        approvalData () {
          this.searchData = this.approvalData
          this.showPartData = this.showPart(this.searchData, this.currentPage, this.pageSize)
        }
      }
    }
</script>

<style>
</style>
