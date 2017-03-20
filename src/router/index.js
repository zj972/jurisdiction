import Vue from 'vue'
import Router from 'vue-router'
import Application from '@/components/Application'
import Individual from '@/components/Individual'
import Approval from '@/components/Approval'
// 权限管理 -> 一级路由
import Manage from '@/components/Manage'
import ManageIndex from '@/components/ManageIndex'
// 权限管理 -> 角色管理 -> 二级路由
import RoleMenu from '@/components/RoleMenu'
import RoleMember from '@/components/RoleMember'
// 权限管理 -> 成员管理 -> 二级路由
import MemberMenu from '@/components/MemberMenu'
import MemberOperation from '@/components/MemberOperation'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/Application',
      name: 'Application',
      component: Application
    },
    {
      path: '/Individual',
      name: 'Individual',
      component: Individual
    },
    {
      path: '/Approval',
      name: 'Approval',
      component: Approval
    },
    {
      path: '/Manage',
      component: Manage,
      children: [
        {
          path: '',
          component: ManageIndex
        }, {
          path: '/RoleMenu',
          name: 'RoleMenu',
          component: RoleMenu
        }, {
          path: '/RoleMember',
          name: 'RoleMember',
          component: RoleMember
        }, {
          path: '/MemberMenu',
          name: 'MemberMenu',
          component: MemberMenu
        }, {
          path: '/MemberOperation',
          name: 'MemberOperation',
          component: MemberOperation
        }
      ]
    }
  ],
  mode: 'history'
})
export default router
