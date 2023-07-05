import VueRouter from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        component: () => import('@/views/home'),
        meta: {
            name: '首页', // 当前路由名称
            link: '/home', // 当前路由跳转的完整地址
            isMenu: true, // 是否是菜单
        }
    },
    {
        path: '/message',
        redirect: '/message/read/my',
        component: () => import('@/views/message'),
        meta: {
            name: '消息1',
            link: '/message',
            isMenu: true,
        },
        children: [
            {
                path: 'read',
                component: () => import('@/views/message/components/read/ReadView.vue'),
                meta: {
                    name: '已读',
                    link: '/message/read',
                },
                children: [
                    {
                        path: 'my',
                        component: () => import('@/views/message/components/read/ReadOfMe.vue'),
                        meta: {
                            name: '我的1',
                            link: '/message/read/my'
                        }
                    },
                    {
                        path: 'other',
                        component: () => import('@/views/message/components/read/readofother'),
                        meta: {
                            name: '其他1',
                            link: '/message/read/other'
                        },
                        children:[
                            {
                                path: 'family',
                                component: () => import('@/views/message/components/read/readofother/ReadOfFamily.vue'),
                                meta: {
                                    name: '亲人',
                                    link: '/message/read/other/family'
                                }
                            },
                            {
                                path: 'friend',
                                component: () => import('@/views/message/components/read/readofother/ReadOfFriend.vue'),
                                meta: {
                                    name: '朋友',
                                    link: '/message/read/other/friend'
                                }
                            },

                        ]
                    }
                ],
            },
            {
                path: 'unread',
                component: () => import('@/views/message/components/unread/UnreadView.vue'),
                meta: {
                    name: '未读',
                    link: '/message/unread'
                },
                children: [
                    {
                        path: 'my',
                        component: () => import('@/views/message/components/unread/UnreadOfMe.vue'),
                        meta: {
                            name: '我的2',
                            link: '/message/unread/my'
                        }
                    },
                    {
                        path: 'other',
                        component: () => import('@/views/message/components/unread/UnreadOfOther.vue'),
                        meta: {
                            name: '其他2',
                            link: '/message/unread/other'
                        }
                    }
                ],
            },
        ],
    },
    {
        path: '/msg',
        redirect: '/msg/read/my',
        component: () => import('@/views/msgcopy'),
        meta: {
            name: '消息2',
            link: '/msg',
            isMenu: true,
        },
        children: [
            {
                path: 'read',
                component: () => import('@/views/msgcopy/components/read/ReadView.vue'),
                meta: {
                    name: '已读',
                    link: '/msg/read',
                },
                children: [
                    {
                        path: 'my',
                        component: () => import('@/views/msgcopy/components/read/ReadOfMe.vue'),
                        meta: {
                            name: '我的3',
                            link: '/msg/read/my'
                        }
                    },
                    {
                        path: 'other',
                        component: () => import('@/views/msgcopy/components/read/ReadOfOther.vue'),
                        meta: {
                            name: '其他3',
                            link: '/msg/read/other'
                        }
                    }
                ],
            },
            {
                path: 'unread',
                component: () => import('@/views/msgcopy/components/unread/UnreadView.vue'),
                meta: {
                    name: '未读',
                    link: '/msg/unread'
                },
                children: [
                    {
                        path: 'my',
                        component: () => import('@/views/msgcopy/components/unread/UnreadOfMe.vue'),
                        meta: {
                            name: '我的4',
                            link: '/msg/unread/my'
                        }
                    },
                    {
                        path: 'other',
                        component: () => import('@/views/msgcopy/components/unread/UnreadOfOther.vue'),
                        meta: {
                            name: '其他4',
                            link: '/msg/unread/other'
                        }
                    }
                ],
            },
        ],
    }

];


let originPush = VueRouter.prototype.push;
VueRouter.prototype.push = function (location, resolve, reject) {
    if (resolve && reject) {
        // 新定义的originPush为window的实例
        originPush.call(this, location, resolve, reject)
    } else {
        originPush.call(this, location, () => {
        }, () => {
        })
    }
}

// 创建router实例对象，去管理一组一组的路由规则
const router = new VueRouter({routes});

export default router;