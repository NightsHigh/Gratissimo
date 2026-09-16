import { createRouter, createWebHistory } from 'vue-router'
import FrontPage from './pages/FrontPage.vue'
import JobSearchPage from './pages/JobSearchPage.vue'
import NewsPage from './pages/NewsPage.vue'
import CreateListingPage from './pages/CreateListingPage.vue'
import AuthPage from './pages/AuthPage.vue'
import MyPage from './pages/MyPage.vue'
import EditProfilePage from './pages/EditProfilePage.vue'
import NotFoundPage from './pages/NotFoundPage.vue'

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
    { path: '/opret-annonce', component: CreateListingPage },
    { path: '/log-ind', component: AuthPage},
    { path: '/opret-profil', component: AuthPage },
    { path: '/min-side', component: MyPage },
    { path: '/min-side/favoritter', component: MyPage },
    { path: '/min-side/rediger', component: EditProfilePage },
    { path: '/:pathMatch(.*)*', component: NotFoundPage }
  ]
})