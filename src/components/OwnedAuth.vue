<template>
  <div id="own-auth" v-loading="loading">
    <!--搜索框-->
    <div class="clearfix" style="margin:10px 20px;">
      <el-input class="search-input" placeholder="请输入关键字" icon="search" @change="refreshHub"
                v-model="keywords"></el-input>
    </div>
    <!--查看权限-->
    <div class="view-auth-wrap">
      <h3 class="auth-title">查看权限</h3>
      <el-table :data="showOnePage(viewAuthHub, vCurrentPage, this.pageSize)" border>
        <el-table-column prop="index" label="ID" align="center">
          <template scope="scope">
            <span>{{scope.row.index}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="菜单" align="center">
          <template scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="pagination-wrap">
        <el-pagination layout="prev, pager, next, jumper" :total="viewAuthHub.length" :page-size="pageSize"
                       style="display: inline-block;" :current-page="vCurrentPage"
                       @current-change="vPageChange"></el-pagination>
      </div>
    </div>
    <!--操作权限-->
    <div class="operate-auth-wrap">
      <h3 class="auth-title">操作权限</h3>
      <el-table :data="showOnePage(operateAuthHub, oCurrentPage, this.pageSize)" border :fit="true">
        <el-table-column label="游戏" prop="game.name" align="center" width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="平台" prop="platform.name" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="大厅" prop="hall.name" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="终端" prop="terminal.name" align="center" width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="应用包" prop="apk.name" align="center" width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="APPID应用"  align="center" width="150">
          <template scope="scope">
            <el-button size="small" @click="getAppid(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="权限内容" align="center" :show-overflow-tooltip="true">
          <template scope="scope">
              <el-checkbox :key="index" v-for="(item, index) in scope.row.auth" checked disabled>{{item}}</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="业务审核人" prop="handler" align="center" width="150" :show-overflow-tooltip="true"></el-table-column>
      </el-table>

      <!--分页-->
      <div class="pagination-wrap">
        <el-pagination layout="prev, pager, next, jumper" :total="operateAuthHub.length"
                       :page-size="pageSize"
                       style="display: inline-block;" :current-page="oCurrentPage"
                       @current-change="oPageChange">
        </el-pagination>
      </div>
      <AppIdTable ref="appidTable"></AppIdTable>
    </div>

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
        ownedAuth: {}, // 用户所有操作权限
        vCurrentPage: 1, // 当前view分页组件page值
        oCurrentPage: 1, // 当前operate分页组件page值
        viewAuthHub: [], // 根据用户搜索输入得到的查看权限搜索结果
        operateAuthHub: [] // 根据用户搜索输入得到的操作权限搜索结果
      }
    },
    components: {
      AppIdTable
    },
    methods: {
      getAppid (params) {
        // 打开对话框
        this.$refs.appidTable.getAppid(params)
      },
      // 获取我的权限 所有数据
      getData () {
        return this.$http.get(`my-auth/owned-auth`).then(response => {
          // 在这里获取后台数据
          this.ownedAuth = response.body.data
        }, response => {
          // error callback
        })
      },
      // 更新数据
      refreshData () {
        this.loading = true
        this.getData().then(() => {
          this.refreshHub()
          this.loading = false
        })
      },
      // 更新搜索结果：将搜索结果存入数据中转站中
      refreshHub () {
        this.viewAuthHub = getResult(this.ownedAuth.viewAuth, this.keywords, ['name'])
        this.operateAuthHub = getResult(this.ownedAuth.operateAuth, this.keywords, ['auth', 'game', 'platform', 'hall', 'terminal', 'apk', 'handler'])
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
    mounted () {
      this.refreshData()
    }
  }
</script>

<style>
  #own-auth h4 {
    margin: 10px 0;
  }

  #own-auth .search-input {
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
