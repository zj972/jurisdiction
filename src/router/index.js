import Vue from 'vue'
import Router from 'vue-router'
import Application from '@/components/Application'
import Individual from '@/components/Individual'
import Approval from '@/components/Approval'
import Manage from '@/components/Manage'
import ManageTable from '@/components/ManageTable'
import MenuRole from '@/components/MenuRole'
import MemberRole from '@/components/MemberRole'

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
          component: ManageTable
        }, {
          path: 'MenuRole',
          name: 'MenuRole',
          component: MenuRole
        }, {
          path: 'MemberRole',
          name: 'MemberRole',
          component: MemberRole
        }
      ]
    }
  ],
  mode: 'history'
})
export default router
