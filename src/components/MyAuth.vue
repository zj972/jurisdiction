<!-- 我的权限 -> 一级路由 -->
<template>
  <div class="my-auth-wrap">
    <el-tabs value="ownedAuth" @tab-click="switchTab">
      <!--我的权限-->
      <el-tab-pane label="我的权限" name="ownedAuth">
        <OwnedAuth ref="owned"></OwnedAuth>
      </el-tab-pane>

      <!--待审权限-->
      <el-tab-pane name="pendingAuth">
        <span slot="label">
          <el-badge :value="newMsg.pending" class="item" size="small">
            <div style="margin: -10px 0;">待审权限</div>
          </el-badge>
        </span>
        <PendingAuth ref="pending" :news-num="newMsg"></PendingAuth>
      </el-tab-pane>

      <!--被驳回权限-->
      <el-tab-pane name="rejectAuth">
        <span slot="label">
          <el-badge :value="newMsg.reject" class="item" size="small">
            <div style="margin: -5px 0;">被驳回权限</div>
          </el-badge>
        </span>
        <RejectAuth ref="reject" :news-num="newMsg"></RejectAuth>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
  import OwnedAuth from 'components/OwnedAuth'
  import PendingAuth from 'components/PendingAuth'
  import RejectAuth from 'components/RejectAuth'
  export default {
    name: 'approval',
    data () {
      return {
      }
    },
    props: ['newMsg'],
    methods: {
      switchTab (tab) {
        if (tab.name === 'ownedAuth') {
        } else if (tab.name === 'pendingAuth') {
        } else if (tab.name === 'rejectAuth') {
          // this.newMsg.reject = 0
          // this.$refs.reject.getData()
        } else {
          console.error('tab name错误')
        }
      },
      getAllData () {
        this.$refs.owned.refreshData()
        this.$refs.pending.refreshData()
        this.$refs.reject.refreshData()
      }
    },
    mounted () {
    },
    components: {
      OwnedAuth,
      PendingAuth,
      RejectAuth
    }
  }
</script>

<style scope>

</style>
