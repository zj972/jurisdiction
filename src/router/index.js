import Vue from 'vue'
import Router from 'vue-router'
import Apply from '@/components/Apply'
import MyAuth from '@/components/MyAuth'
import Approval from '@/components/Approval'
// 权限管理 -> 一级路由
import Manage from '@/components/Manage'
import NoAuth from '@/components/Noauth'
import ManageIndex from '@/components/ManageIndex'
// 权限管理 -> 角色管理 -> 二级路由
import RoleMenu from '@/components/RoleMenu'
import RoleMember from '@/components/RoleMember'
// 权限管理 -> 成员管理 -> 二级路由
import MemberMenu from '@/components/MemberMenu'
import MemberOperation from '@/components/MemberOperation'
// 角色管理
import MemberAuth from '@/components/MemberAuth'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/apply'
    },
    {
      path: '/apply',
      name: 'apply',
      component: Apply
    },
    {
      path: '/myauth',
      name: 'myauth',
      component: MyAuth
    },
    {
      path: '/approval',
      name: 'approval',
      component: Approval
    },
    {
      path: '/manage',
      component: Manage,
      beforeEnter: (to, from, next) => {
        if (window.localStorage.manage === '0') {
          next()
        } else {
          next({path: '/noAuth'})
        }
      },
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
    },
    {
      path: '/noauth',
      name: 'noauth',
      component: NoAuth
    },
    {
      path: '/memberauth',
      name: 'memberauth',
      component: MemberAuth,
      beforeEnter: (to, from, next) => {
        if (window.localStorage.manage === '0') {
          next()
        } else {
          next({path: '/noAuth'})
        }
      }
    }
  ],
  mode: 'history'
})
export default router
