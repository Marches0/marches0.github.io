import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: "link-active",
  scrollBehavior (to, from, savedPosition) {
    return { 
      top: 0 // scroll back to the top after navigating
    }
  },
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
      path: '/tools/dragon-soul-calculator',
      name: 'dragon-soul-calculator',
      component: () => import('../views/Tools/DragonSoulCalculator.vue')
    },
    {
      path: '/tools/event-calendar',
      name: 'event-calendar',
      component: () => import('../views/Tools/EventCalendar.vue')
    },
    {
      path: '/tools/minister-soul-calculator',
      name: 'minister-soul-calculator',
      component: () => import('../views/Tools/MinisterSoulCalculator.vue')
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
    {
      path: '/tools/talent-calculator',
      name: 'talent-calculator',
      component: () => import('../views/Tools/TalentCalculator.vue')
    },
  ]
})

export default router