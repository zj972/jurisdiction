<template>
  <div id="app">
    <el-row class="title">
      <el-col :xs="24" :sm="4" :md="3" :lg="2">权限中心</el-col>
    </el-row>
    <el-row>
      <el-col :xs="24" :sm="4" :md="3" :lg="2">
        <el-menu router class="list" :default-active="active">
          <el-menu-item index="apply">
            <router-link to="/apply" class="router-item" >权限申请</router-link>
          </el-menu-item>
          <el-menu-item index="myauth" @click.native="getAuthData">
            <router-link to="/myauth" class="router-item">
              <span>我的权限</span>
              <span class="my-badge" v-show="newAuthNum > 0">{{newAuthNum}}</span>
            </router-link>
          </el-menu-item>
          <el-menu-item index="approval" @click.native="getApprovalData">
            <router-link to="/approval" class="router-item">
              <span>我的审批</span>
              <span class="my-badge" v-show="approvalNum > 0">{{approvalNum}}</span>
            </router-link>
          </el-menu-item>
          <el-menu-item index="manage" v-show="auth">
            <router-link to="/manage" class="router-item">权限管理</router-link>
          </el-menu-item>
          <el-menu-item index="memberauth" v-show="auth">
            <router-link to="/memberauth" class="router-item">角色管理</router-link>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :xs="24" :sm="20" :md="21" :lg="22">
        <keep-alive>
          <router-view :new-msg="newMsg" :user-msg="userMsg" ref="child" @getNewMsg="getNewMsg"></router-view>
        </keep-alive>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      auth: true,
      active: 'apply',
      userMsg: {},
      newMsg: {}
    }
  },
  methods: {
    // manage显示
    showManage () {
      this.$http.get('manage/auth').then(response => {
        if (response.body.data === 0) {
          this.auth = true
          window.localStorage.manage = 0
        } else {
          window.localStorage.manage = -1
          this.auth = false
        }
      }, response => {
        // error callback
      })
    },
    // 侧栏选中
    getActive () {
      this.active = window.location.pathname.substr(1).split('/')[0]
    },
    // 每次路由切换到我的权限时，都会发送一次请求,在这里获取数据后，在切换Tab标签的时候就不用再发送请求
    getAuthData () {
      this.$refs.child.getAllData()
    },
    getApprovalData () {
      this.$refs.child.refresh()
    },
    // 获取员工基本信息
    getUserId () {
      this.$http.get('app/user-msg').then(response => {
        if (response.body.error_code === 0) {
          this.userMsg = response.body.data
        }
      }, response => {
        // error callback
      })
    },
    // 获取新消息数目
    getNewMsg () {
      this.$http.get('app/new-msg').then(response => {
        if (response.body.error_code === 0) {
          this.newMsg = response.body.data
          // this.newMsg = mockNewMsg
        }
      }, response => {
        // error callback
      })
    }
  },
  computed: {
    newAuthNum () {
      return this.newMsg.pending + this.newMsg.reject
    },
    approvalNum () {
      return this.newMsg.arvView + this.newMsg.arvOpt
    }
  },
  created () {
    // manage显示
    this.showManage()
    // 侧栏选中
    this.getActive()
    // 获取员工工号
    this.getUserId()
    // 获取新消息数目
    this.getNewMsg()
  }
}
</script>

<style>
  [v-cloak] {
    display: none;
  }
.title{
  background: #8492A6;
  color: #fff;
  line-height: 56px;
  text-align: center;
}

.el-menu-item{
  text-align: center;
}

.list a{
  color: #48576a;
}
.list>.is-active{
  background: #d1dbe5;
}
.list>.is-active a{
  color: #fff;
}
.border-bottom{
  border-bottom: 1px solid #bfcbd9;
}

/*切换动画*/
.router-enter-active {
  transition: all 1s ease;
}

.router-leave-active {
  transition: all 0s;
}

.router-enter,
.router-leave-active {
  opacity: 0;
}

.router-item{
  position: relative;
}
.my-badge {
  position: absolute;
  top: -10px;
  right: -25px;
  padding:2px 7px;
  background: red;
  color: #fff;
  line-height: 14px;
  font-size: 12px;
  border-radius: 10px;
}
.el-table .info-row{
  background: #5CB85C;
}
</style>
