import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: "link-active",
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/tips',
      name: 'tips',
      component: () => import('../views/TipsView.vue')
    },
    {
      path: '/guides/curiosity',
      name: 'curiosity',
      component: () => import('../views/Guides/CuriosityGuide.vue')
    },
    {
      path: '/guides/beat-a-player',
      name: 'beat-a-player',
      component: () => import('../views/Guides/BeatAPlayerGuide.vue')
    },
    {
      path: '/guides/red-burr-location',
      name: 'red-burr-location',
      component: () => import('../views/Guides/RedBurrLocationGuide.vue')
    },
    {
      path: '/tools/mohist-clairvoyant',
      name: 'mohist-clairvoyant',
      component: () => import('../views/Tools/MohistClairvoyant.vue')
    },
    {
      path: '/tools/season-points-calculator',
      name: 'season-points-calculator',
      component: () => import('../views/Tools/SeasonPointsCalculator.vue')
    },
  ]
})

export default router