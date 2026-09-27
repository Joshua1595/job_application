<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const mobileMenuOpen = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const isStudent = computed(() => user.value?.role === 'student')
const isEmployerOrAdmin = computed(() =>
  user.value?.role === 'employer' || user.value?.role === 'admin'
)

const logout = () => {
  authStore.logout()
  mobileMenuOpen.value = false
  router.push('/')
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
</script>

<template>
  <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <RouterLink
          to="/"
          class="flex items-center gap-2.5 group"
          @click="closeMobileMenu"
        >
          <div class="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20 group-hover:bg-blue-700 transition">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <span class="text-xl font-bold tracking-tight text-slate-900">
            JobBoard
          </span>
        </RouterLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-1">
          <!-- Public / Guest + Student -->
          <RouterLink
            v-if="!isAuthenticated || isStudent"
            to="/jobs"
            class="px-3.5 py-2 text-sm font-medium text-slate-600 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition"
          >
            Jobs
          </RouterLink>

          <!-- Student links -->
          <template v-if="isAuthenticated && isStudent">
            <RouterLink
              to="/favorites"
              class="px-3.5 py-2 text-sm font-medium text-slate-600 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition"
            >
              Favorites
            </RouterLink>
            <RouterLink
              to="/applications"
              class="px-3.5 py-2 text-sm font-medium text-slate-600 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition"
            >
              Applications
            </RouterLink>
          </template>

          <!-- Employer / Admin -->
          <RouterLink
            v-if="isAuthenticated && isEmployerOrAdmin"
            to="/manage-jobs"
            class="px-3.5 py-2 text-sm font-medium text-slate-600 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition"
          >
            Manage Jobs
          </RouterLink>
          <RouterLink
            v-if="isAuthenticated && user?.role === 'employer'"
            to="/employer/applications"
            class="px-3.5 py-2 text-sm font-medium text-slate-600 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition"
          >
            Applications
          </RouterLink>
          <RouterLink
            v-if="isAuthenticated && user?.role === 'admin'"
            to="/admin/jobs"
            class="px-3.5 py-2 text-sm font-medium text-slate-600 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition"
          >
            Admin Jobs
          </RouterLink>

          <!-- Dashboard -->
          <RouterLink
            v-if="isAuthenticated"
            to="/dashboard"
            class="px-3.5 py-2 text-sm font-medium text-slate-600 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition"
          >
            Dashboard
          </RouterLink>
        </div>

        <!-- Desktop Auth Actions -->
        <div class="hidden md:flex items-center gap-3">
          <template v-if="!isAuthenticated">
            <RouterLink
              to="/login"
              class="px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition"
            >
              Sign in
            </RouterLink>
            <RouterLink
              to="/register"
              class="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl shadow-sm shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30 transition"
            >
              Create account
            </RouterLink>
          </template>

          <template v-else>
            <div class="flex items-center gap-3 pl-2">
              <div class="flex items-center gap-2.5">
                <div class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                  {{ user?.fullName?.charAt(0)?.toUpperCase() || 'U' }}
                </div>
                <span class="text-sm font-medium text-slate-700 max-w-[140px] truncate">
                  {{ user?.fullName }}
                </span>
              </div>
              <button
                type="button"
                @click="logout"
                class="px-3.5 py-2 text-sm font-medium text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition"
              >
                Log out
              </button>
            </div>
          </template>
        </div>

        <!-- Mobile menu button -->
        <button
          type="button"
          class="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div
      v-show="mobileMenuOpen"
      class="md:hidden border-t border-slate-200 bg-white"
    >
      <div class="px-4 py-4 space-y-1">
        <!-- Public / Student -->
        <RouterLink
          v-if="!isAuthenticated || isStudent"
          to="/jobs"
          class="block px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
          @click="closeMobileMenu"
        >
          Jobs
        </RouterLink>

        <template v-if="isAuthenticated && isStudent">
          <RouterLink
            to="/favorites"
            class="block px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
            @click="closeMobileMenu"
          >
            Favorites
          </RouterLink>
          <RouterLink
            to="/applications"
            class="block px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
            @click="closeMobileMenu"
          >
            Applications
          </RouterLink>
        </template>

        <RouterLink
          v-if="isAuthenticated && isEmployerOrAdmin"
          to="/manage-jobs"
          class="block px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
          @click="closeMobileMenu"
        >
          Manage Jobs
        </RouterLink>
        <RouterLink
          v-if="isAuthenticated && user?.role === 'employer'"
          to="/employer/applications"
          class="block px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
          @click="closeMobileMenu"
        >
          Applications
        </RouterLink>
        <RouterLink
          v-if="isAuthenticated && user?.role === 'admin'"
          to="/admin/jobs"
          class="block px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
          @click="closeMobileMenu"
        >
          Admin Jobs
        </RouterLink>

        <RouterLink
          v-if="isAuthenticated"
          to="/dashboard"
          class="block px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
          @click="closeMobileMenu"
        >
          Dashboard
        </RouterLink>

        <div class="pt-3 mt-3 border-t border-slate-100 space-y-2">
          <template v-if="!isAuthenticated">
            <RouterLink
              to="/login"
              class="block px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 transition"
              @click="closeMobileMenu"
            >
              Sign in
            </RouterLink>
            <RouterLink
              to="/register"
              class="block px-3 py-2.5 text-sm font-semibold text-center text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition"
              @click="closeMobileMenu"
            >
              Create account
            </RouterLink>
          </template>

          <template v-else>
            <div class="flex items-center gap-3 px-3 py-2">
              <div class="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                {{ user?.fullName?.charAt(0)?.toUpperCase() || 'U' }}
              </div>
              <span class="text-sm font-medium text-slate-800 truncate">
                {{ user?.fullName }}
              </span>
            </div>
            <button
              type="button"
              @click="logout"
              class="w-full px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
            >
              Log out
            </button>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>