import Vue from 'vue'
import Router from 'vue-router'
const inStore = () => import('@/page/storekeeper/inStore');
const outStore = () => import('@/page/storekeeper/outSotre');
const storeView = () => import('@/page/storekeeper/storeView');
const check = () => import('@/page/assessor/myCheck');
const staffView = () => import ('@/page/staff/staffView');
const myRecord = () => import ('@/page/staff/myRecord');
const mySearch = () => import ('@/page/staff/mySearch');
const product = () => import ('@/page/staff/product');
// const result = () => import ('@/page/staff/result');
const storeCenter = () => import ('@/page/storekeeper/storeCenter');
const orderSearch = () => import ('@/page/storekeeper/orderSearch');
const storeSearch = () => import ('@/page/storekeeper/storeSearch');
const cart = () => import ('@/page/staff/cart');
const order = () => import ('@/page/staff/order');
const addressList = () => import ('@/page/staff/addressList');
const addressDetail = () => import ('@/page/staff/addressDetail');
const finish = () => import ('@/page/staff/finish');

Vue.use(Router)

export default new Router({
  routes: [
      {path:'/', component:storeView,children:[
              {path:'',component:outStore}
          ]},
      {path:'/storeView',component:storeView,children:[
              {path:'',component:outStore},
              {path:'inStore',component:inStore},
              {path:'outStore',component:outStore},
              {path:'storeCenter',component:storeCenter}
          ]},
      {path:'/check', component:check},
      {path:'/staffView', component:staffView, children:[
              {path:'',component:product},
              {path:'product',component:product},
              {path:'myRecord',component:myRecord},
              // {path:'result', component:result},
              {path:'cart', component:cart}
          ]},
      {path:'/mySearch', component:mySearch},
      {path:'/orderSearch',component:orderSearch},
      {path:'/storeSearch',component:storeSearch},
      {path:'/order',component:order},
      {path:'/addressList',component:addressList},
      {path:'/addressDetail',component:addressDetail},
      {path:'/finish',component:finish}
  ]
})
