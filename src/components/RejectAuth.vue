<template>
  <div id='reject-auth-wrap' v-loading="loading">
    <div class="clearfix" style="margin:10px 20px;">
      <el-input class="search-input" placeholder="请输入关键字" icon="search" @change="refreshHub" v-model="keywords"></el-input>
    </div>
    <!--被驳回的查看权限-->
    <div class="view-auth-wrap">
      <h3 class="auth-title">查询权限</h3>
      <!--待审权限 -> 查看权限表-->
      <el-table :data="showOnePage(viewAuthHub, vCurrentPage, this.pageSize)" border :fit="true">
        <el-table-column label="ID" align="center" width="100">
          <template scope="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column label="权限内容" align="left" header-align="center">
          <template scope="scope">
            <el-checkbox-group v-model="scope.row.auth">
              <el-checkbox v-for="(item, index) in scope.row.auth" :key="index" :label="item"
                           style="margin-left: 10px;" disabled>{{item}}
              </el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" prop="applyTime" align="center" width="150"></el-table-column>
        <el-table-column label="当前状态" align="center" width="100">
          <template scope="scope">
            {{scope.row.status | formatStatus }}
          </template>
        </el-table-column>
        <el-table-column label="当前处理人" prop="handler" align="center" width="150"></el-table-column>
        <el-table-column label="驳回理由" prop="reason" align="left" header-align="center"></el-table-column>
      </el-table>

      <!--分页-->
      <div class="pagination-wrap">
        <el-pagination layout="prev, pager, next, jumper" :total="viewAuthHub.length" :page-size="pageSize"
                       style="display: inline-block;" :current-page='vCurrentPage'
                       @current-change="vPageChange"></el-pagination>
      </div>
    </div>
    <!--被驳回的操作权限-->
    <div class="operate-auth-wrap">
      <h4 class="auth-title">操作权限</h4>
      <el-table :data="showOnePage(operateAuthHub, oCurrentPage, this.pageSize)" border style="width: 100%" :fit="true">
        <el-table-column label="游戏" prop="game.name" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="平台" prop="platform.name" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="大厅" prop="hall.name" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="终端" prop="terminal.name" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="应用包" prop="apk.name" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="APPID应用" align="center" width="120" :show-overflow-tooltip="true">
          <template scope="scope">
            <el-button size="small" @click="getAppid(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="权限内容" align="left" header-align="center" :show-overflow-tooltip="true">
          <template scope="scope">
              <el-checkbox :label="item" :key="index" v-for="(item, index) in scope.row.auth" disabled
                           style="margin-left: 10px;" checked></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" prop="applyTime" align="center" width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="处理状态"  align="center" width="100" :show-overflow-tooltip="true">
          <template scope="scope">
            {{scope.row.status | formatStatus }}
          </template>
        </el-table-column>
        <el-table-column label="当前处理人" prop="handler" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="驳回理由" prop="reason" header-align="center" align="left" width="200" :show-overflow-tooltip="true"></el-table-column>
      </el-table>

      <!--分页-->
      <div class="pagination-wrap">
        <el-pagination layout="prev, pager, next, jumper" :total="operateAuthHub.length" :page-size="pageSize"
                       style="display: inline-block;" :current-page="oCurrentPage"
                       @current-change="oPageChange"></el-pagination>
      </div>
    </div>

    <AppIdTable ref="appidTable"></AppIdTable>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getResult } from 'common/js/public.js'
  import AppIdTable from 'components/AppIdTable'
  export default {
    data () {
      return {
        loading: true,
        pageSize: 5,  // 分页每页数据量
        keywords: '', // 用户输入搜索关键字
        rejectAuth: {}, // 用户所有操作权限
        vCurrentPage: 1, // 当前view分页组件page值
        oCurrentPage: 1, // 当前operate分页组件page值
        viewAuthHub: [], // 根据用户搜索输入得到的查看权限搜索结果
        operateAuthHub: [] // 根据用户搜索输入得到的操作权限搜索结果
      }
    },
    props: ['newsNum'],
    components: {
      AppIdTable
    },
    methods: {
      getAppid (params) {
        // 打开对话框
        this.$refs.appidTable.getAppid(params)
      },
      // 获取 驳回权限 所有数据
      getData () {
        return this.$http.get(`my-auth/reject-auth`).then(response => {
          // 在这里获取后台数据
          this.rejectAuth = response.body.data
        }, response => {
          // error callback
        })
      },
      // 更新数据
      refreshData () {
        this.loading = true
        this.getData().then(() => {
          this.refreshHub()
          // 设置权限数目
          this.newsNum.reject = this.rejectAuth.viewAuth.length + this.rejectAuth.operateAuth.length
          this.loading = false
        })
      },
      // 更新搜索结果：将搜索结果存入数据中转站中
      refreshHub () {
        this.viewAuthHub = getResult(this.rejectAuth.viewAuth, this.keywords, ['auth', 'reason', 'handler', 'applyTime'])
        this.operateAuthHub = getResult(this.rejectAuth.operateAuth, this.keywords, ['auth', 'game', 'platform', 'hall', 'terminal', 'apk', 'APPID', 'reason', 'handler', 'applyTime'])
      },
      // 展示一页的数据
      showOnePage (data, currentPage, pageSize) {
        let _start = (currentPage - 1) * pageSize
        let _end = currentPage * pageSize
        // 如果数据中转站为空直接返回 空数组
        return data.length === 0 ? [] : data.slice(_start, _end)
      },
      // 跳页
      vPageChange (currentPage) {
        this.vCurrentPage = currentPage
      },
      oPageChange (currentPage) {
        this.oCurrentPage = currentPage
      }
    },
    filters: {
      formatStatus (statusCode) {
        let _status = ''
        statusCode = Number(statusCode)
        if (statusCode === 0) {
          _status = '审核中'
        } else if (statusCode === 1) {
          _status = '通过'
        } else if (statusCode === 2) {
          _status = '驳回'
        } else {
          _status = '后台状态码返回错误'
        }
        return _status
      }
    },
    mounted () {
      // 初始化
//      this.refreshData()
    }
  }
</script>

<style scope>
  .search-input {
    width: 300px;
    float: right;
    margin-bottom: 10px;
  }

  .view-auth-wrap,
  .operate-auth-wrap {
    border: 1px solid #e5e5e5;
    margin: 20px;
  }

  .view-auth-wrap .auth-title,
  .operate-auth-wrap .auth-title {
    margin: 15px
  }

  .pagination-wrap {
    text-align: center;
    margin: 20px;
  }
</style>
