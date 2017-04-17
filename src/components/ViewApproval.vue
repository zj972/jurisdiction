<template>
    <div id=''>
      <ApprovalCommon :select-list="viewAuthSelectList" v-on:resolveInput="resolveInput" v-on:refreshData="emitRefresh"></ApprovalCommon>
      <el-table :data="showPartData
" border style="width: 100%" resizable="true" border
                @selection-change="sctChange" row-key="uuid">
        <el-table-column label="选项" align="center" width="50" type="selection" reserve-selection></el-table-column>
        <el-table-column label="申请人" prop="applicant" align="center" width="90"></el-table-column>
        <el-table-column label="申请人角色" prop="role" align="center"></el-table-column>
        <el-table-column label="所属部门" prop="department" align="center"></el-table-column>
        <el-table-column label="查看权限"  align="left" header-align="center" min-width="200">
          <template scope="scope">
            <el-checkbox-group v-model="scope.row.auth">
              <el-checkbox :label="item" :key="index" v-for="(item, index) in scope.row.auth" disabled
                           style="margin-left: 10px;"></el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" prop="applyTime" align="center"></el-table-column>
        <el-table-column label="申请理由" prop="reason" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
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
    </div>
</template>

<script type="text/ecmascript-6">
    import { getResult } from 'common/js/public.js'
    import ApprovalCommon from 'components/ApprovalCommon'
    const searchItemConfig = ['applicant', 'role', 'department', 'reason', 'auth', 'applyTime']
    export default {
      data () {
        return {
          keywords: '',  // 用户输入搜索关键字
          viewAuthSelectList: [], // 用户勾选CheckBox集合
          searchData: [], // 通过搜索获取的结果集合
          showPartData: [], // 从搜索集合提取的展示数据集合，长度等于pageSize的值
          currentPage: 1, // 当前页面page值
          pageSize: 10  // 分页每页数据量
        }
      },
      props: ['approvalData'], // 传入ApprovalCommon子组件的所有后台审批数据
      components: {
        ApprovalCommon
      },
      methods: {
        // 选择CheckBox触发事件，得到勾选集合
        sctChange (selection) {
          this[`viewAuthSelectList`] = selection
//          console.log('选择数据')
//          console.log(selection)
        },
        // 发送通过单条请求，作为operateOne的回调函数
        authPassOne (data) {
          console.log(data.id)
          return this.$http.get(`approval/pass-one?id=${data.id}`).then(response => {
            // 根据状态值判断，进行相关操作
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
            // 根据状态值判断，进行相关操作
            if (response.body.error_code === 0) {
              this.$message.success('成功拒绝该条申请')
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
        // 获取在ApprovalCommon子组件中用户在搜索框的输入
        resolveInput (keywords) {
          this.keywords = keywords  // 保留搜索关键字
          this.searchData = getResult(this.approvalData, this.keywords, searchItemConfig)   // 获取搜索结果
          this.showPartData = this.showPart(this.searchData, this.currentPage, this.pageSize)  // 提取需要展示的数据
        },
        // 展示部分搜索结果，取决于pageSize
        showPart (data, currentPage, pageSize) {
          let _start = (currentPage - 1) * pageSize
          let _end = currentPage * pageSize
          return data.slice(_start, _end)
        },
        // 分页切换触发事件：1 改变当前页面page值 2 提取相应展示条目
        pageChange (page) {
          this.currentPage = page
          this.showPartData = this.showPart(this.searchData, this.currentPage, this.pageSize)
        }
      },
      watch: {
        // 这里必须监测approvalData的变化，因为只能在approvalData数据拿到的时候，才能赋值给searchData，否则会使undefined
        approvalData () {
          this.searchData = this.approvalData
          this.showPartData = this.showPart(this.searchData, this.currentPage, this.pageSize)
        }
      }
    }
</script>

<style>
</style>
