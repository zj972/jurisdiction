import Vue from 'vue'
import Router from 'vue-router'
import Application from '@/components/Application'
import Individual from '@/components/Individual'
import Approval from '@/components/Approval'
import Manage from '@/components/Manage'

Vue.use(Router)

export default new Router({
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
      component: Manage
    }
  ]
})

