import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: () => useAuthStore().isAuthenticated ? { name: 'search' } : { name: 'login' },
    },
    {
      component: AuthLayout,
      children: [
        { path: '/login',
          name: 'login', component: () => import('@/views/LoginView.vue'),
          meta: { guestOnly: true, title: 'Вход — RentSpace' }
        },
        { path: '/register',
          name: 'register', component: () => import('@/views/RegisterView.vue'),
          meta: { guestOnly: true, title: 'Регистрация — RentSpace' }
        },
      ],
    },
    {
      component: DefaultLayout,
      children: [
        { path: '/search',
          name: 'search', component: () => import('@/views/SearchView.vue'),
          meta: { title: 'Поиск недвижимости — RentSpace' }
        },
        { path: '/listings/:id',
          name: 'listing', component: () => import('@/views/ListingView.vue'),
          meta: { title: 'Объект — RentSpace' }
        },
        { path: '/profile',
          name: 'profile', component: () => import('@/views/ProfileView.vue'),
          meta: { requiresAuth: true, title: 'Личный кабинет — RentSpace' }
        },
        { path: '/activity',
          name: 'activity', component: () => import('@/views/ActivityView.vue'),
          meta: { requiresAuth: true, title: 'Сообщения и сделки — RentSpace' }
        },
      ],
    },
    { path: '/:pathMatch(.*)*',
      redirect: { name: 'search' }
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return { name: 'login', query: { redirect: to.fullPath } }
  if (to.meta.guestOnly && auth.isAuthenticated) return { name: 'search' }
})

router.afterEach((to) => {
  if (typeof to.meta.title === 'string') document.title = to.meta.title
})

export default router
