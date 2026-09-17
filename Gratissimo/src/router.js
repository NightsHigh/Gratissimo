import { createRouter, createWebHistory } from 'vue-router'
import FrontPage from './pages/FrontPage.vue'
import JobSearchPage from './pages/JobSearchPage.vue'
import NewsPage from './pages/NewsPage.vue'
import CreateListingPage from './pages/CreateListingPage.vue'
import AuthPage from './pages/AuthPage.vue'
import MyPage from './pages/MyPage.vue'
import NotFoundPage from './pages/NotFoundPage.vue'
import { isLoggedIn } from './auth'

export default createRouter({
  history: createWebHistory(),
  // Scroll to top when navigating to a new page
  scrollBehavior: () => ({ top: 0,  behavior: 'smooth'}),
  routes: [
    { path: '/', component: FrontPage },
    { path: '/jobs', component: JobSearchPage },
    { path: '/jobs/:id', component: JobSearchPage },
    { path: '/nyheder', component: NewsPage },
    { path: '/nyheder/:id', component: NewsPage},
    { path: '/log-ind', component: AuthPage},
    { path: '/opret-profil', component: AuthPage },

    // Add vue router meta tag with requiresAuth so we can prevent people from accesing it
    // If they arent logged in
    { meta: { requiresAuth: true }, path: '/min-side', component: MyPage },
    { meta: { requiresAuth: true }, path: '/min-side/favoritter', component: MyPage },
    { meta: { requiresAuth: true }, path: '/opret-annonce', component: CreateListingPage },

    { path: '/:pathMatch(.*)*', component: NotFoundPage }
  ]
})

router.beforeEach((to) => {
  if (
    // Check if the path to the site with requiresAuth aka the only site "min side"
    // if the user goes there we add a guard to check if they are logged in
    to.meta.requiresAuth &&
    // and the user isnt logged in
    !isLoggedIn.value
  ) {
    // send brugeren til login
    return { path: '/log-ind' }
  }
})