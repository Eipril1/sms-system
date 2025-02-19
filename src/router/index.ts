import {createRouter, createWebHashHistory, type RouteRecordRaw} from 'vue-router'
import home from './modules/home'
import policy from './modules/policy'
import assurance from './modules/assurance'
import supervision from './modules/supervision'
import correction from './modules/correction'
import system from './modules/system'
import database from './modules/database'
import risk from './modules/risk'

const routes: RouteRecordRaw[] = [
    home,
    policy,
    assurance,
    supervision,
    risk,
    correction,
    system,
    database
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router 