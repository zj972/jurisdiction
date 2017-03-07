import Vue from 'vue'
import Router from 'vue-router'
import Application from '@/components/Application'
import Individual from '@/components/Individual'
import Approval from '@/components/Approval'
import Manage from '@/components/Manage'
import AddRoles from '@/components/AddRoles'

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
      name: 'Manage',
      component: Manage,
      children: [
        {
          path: 'AddRoles',
          name: 'AddRoles',
          component: AddRoles
        }
      ]
    }
  ],
  mode: 'history'
})
export default router
