import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '../layouts/MainLayout.vue'

import Home from '../pages/Home.vue'
import Jobs from '../pages/Jobs.vue'
import JobDetails from '../pages/JobDetails.vue'
import Favorites from '../pages/Favorites.vue'
import Applications from '../pages/Applications.vue'
import Dashboard from '../pages/Dashboard.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import ApplicationForm from '../pages/ApplicationForm.vue'
import ManageJobs from '../pages/ManageJobs.vue'
import JobForm from '../pages/JobForm.vue'
import AdminJobs from '../pages/AdminJobs.vue'
import EmployerApplications from '../pages/EmployerApplications.vue'
import {
  requireAuth,
  requireGuest,
  requireRole,
} from './guards'

const routes = [
  {
    path: '/',
    component: MainLayout,

    children: [
      // =========================
      // PUBLIC ROUTES
      // =========================

      {
        path: '',
        name: 'Home',
        component: Home,
      },

      {
        path: 'jobs',
        name: 'Jobs',
        component: Jobs,
      },

      {
        path: 'jobs/:id',
        name: 'JobDetails',
        component: JobDetails,
      },

      // =========================
      // PROTECTED ROUTES
      // =========================

      {
        path: 'jobs/:id/apply',
        name: 'ApplicationForm',
        component: ApplicationForm,
        beforeEnter: requireAuth,
      },

      {
        path: 'favorites',
        name: 'Favorites',
        component: Favorites,
        beforeEnter: requireAuth,
      },

      {
        path: 'applications',
        name: 'Applications',
        component: Applications,
        beforeEnter: requireAuth,
      },

      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        beforeEnter: requireAuth,
      },
      {
        path: 'manage-jobs',
        name: 'ManageJobs',
        component: ManageJobs,
        beforeEnter: requireRole('employer', 'admin'),
      },
      {
        path: 'manage-jobs/create',
        name: 'CreateJob',
        component: JobForm,
        beforeEnter: requireRole('employer', 'admin'),
      },
      {
        path: 'manage-jobs/:id/edit',
        name: 'EditJob',
        component: JobForm,
        beforeEnter: requireRole('employer', 'admin'),
      },
      {
        path: 'admin/jobs',
        name: 'AdminJobs',
        component: AdminJobs,
        beforeEnter: requireRole('admin'),
      },
      {
        path: '/employer/applications',
        name: 'EmployerApplications',
        component: EmployerApplications,
        beforeEnter: requireRole('employer'),
      },

      // =========================
      // GUEST-ONLY ROUTES
      // =========================

      {
        path: 'login',
        name: 'Login',
        component: Login,
        beforeEnter: requireGuest,
      },

      {
        path: 'register',
        name: 'Register',
        component: Register,
        beforeEnter: requireGuest,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router