import { useAuthStore } from '../stores/auth'

export const requireAuth = (to, from, next) => {
  const authStore = useAuthStore()

  if (authStore.isAuthenticated) {
    next()
  } else {
    next({
      name: 'Login',
      query: {
        redirect: to.fullPath,
      },
    })
  }
}

export const requireGuest = (to, from, next) => {
  const authStore = useAuthStore()

  if (authStore.isAuthenticated) {
    next({
      name: 'Dashboard',
    })
  } else {
    next()
  }
}

export const requireRole = (...allowedRoles) => {
  return (to, from, next) => {
    const authStore = useAuthStore()

    if (!authStore.isAuthenticated) {
      next({
        name: 'Login',
        query: {
          redirect: to.fullPath,
        },
      })

      return
    }

    if (!allowedRoles.includes(authStore.user?.role)) {
      next({
        name: 'Dashboard',
      })

      return
    }

    next()
  }
}