import Vue from 'vue'
import VueRouter from 'vue-router'
import UserLogin from "@/components/UserLogin.vue";
import MainPage from "@/components/MainPage.vue";
import MySpaceHome from "@/components/MySpaceHome.vue";
import MySpacePost from "@/components/MySpacePost.vue";
import PostContent from "@/components/PostContent.vue";
import VideoDetail from "@/components/VideoDetail.vue";

Vue.use(VueRouter)

const routes = [
    {
        // 首页
        path:'/',
        component:MainPage,
    },
    {
        //注册登录页
        path:'/userLogin',
        component:UserLogin
    },
    {
        // 个人中心
        path:'/mySpace',
        component:MainPage,
        redirect:'/mySpace/home',
        children:[
            {
                // 主页
                path:'/home',
                component:MySpaceHome
            },
            {
                //投稿
                path:'/post',
                component:MySpacePost
            }
        ]
    },
    {
        //视频投稿
        path:'/postContent',
        component:PostContent,
    },
    {
        //视频详情
        path:'/videoDetail',
        component:VideoDetail
    }
]

const router = new VueRouter({
    routes
})

export default router //把新建的router暴露给外部