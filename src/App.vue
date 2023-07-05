<template>
    <div>
        <header class="flex-start-c">
            <div class="logo header-left">
                <h1>后台管理系统</h1>
            </div>
            <div class="header-right">
                <div class="menu-bar">
                    <ul class="flex-start-c">
                        <li class="menu-bar-item flex-center"
                            v-for="(route,idx) of routes"
                            :key="idx"
                            :class="{active:menuActiveIdx===idx}"
                            @click="toLink(route)"
                        >
                            <div class="flex-center">
                                <p>{{ route.meta.name }}</p>
                            </div>
                            <!--<div class="sub-menu" v-if="hasSubMenu(route)">-->
                            <!--    <ul>-->
                            <!--        <li v-for="(sub,idx) of route.children"-->
                            <!--            :key="idx"-->
                            <!--            @click="toLink(sub,true)"-->
                            <!--        >-->
                            <!--            {{ sub.meta.name }}-->
                            <!--        </li>-->
                            <!--    </ul>-->
                            <!--</div>-->
                        </li>
                    </ul>
                </div>
                <div class="setting-bar"></div>
            </div>
        </header>
        <main>
            <aside v-if="asideWidth!=='0px'">
                <aside-menu ref="asideMenu"
                            :aside-width="asideWidth"
                            :aside-menus="asideMenus"
                            :navs="navs"
                            @pushNav="pushNav"
                            @setAsideWidth="setAsideWidth"
                ></aside-menu>
            </aside>
            <section class="main-body">
                <NavBar class="nav-bar"
                        v-show="asideWidth!=='0px'"
                        :navs="navs"
                        @removeNav="removeNav"
                ></NavBar>
                <div class="content">
                    <router-view></router-view>
                </div>
            </section>
        </main>
    </div>
</template>

<script>
    import {cloneDeep} from "lodash";
    import AsideMenu from "@/components/framework/AsideMenu.vue";
    import NavBar from "@/components/framework/NavBar.vue";

    const checkMenuRoutePath = (routes) => {
        for (let i = 0; i < routes.length; i++) {
            const pathI = routes[i].path;
            for (let j = i + 1; j < routes.length; j++) {
                const pathJ = routes[j].path;
                if (pathI.startsWith(pathJ) || pathJ.startsWith(pathI)) {
                    throw new Error('菜单路由' + pathI + '和' + pathJ + '前缀重复');
                }
            }
        }
        return true;
    };

    const defaultAsideWidth = '240px';
    const collapsedAsideWidth = '80px';

    export default {
        name: 'App',
        components: {
            AsideMenu,
            NavBar
        },
        data() {
            return {
                navs: [],
                asideWidth: '0px',
            }
        },
        computed: {
            // 获取配置的路由信息
            routes() {
                const result = cloneDeep(this.$router.options.routes);
                result.shift();
                return result;
            },
            // 当前一级菜单关于routes的索引
            menuActiveIdx() {
                checkMenuRoutePath(this.routes); // 菜单路由前缀不可重复，如：/home和/homePage
                let index = 0;
                this.routes.some((route, idx) => {
                    if (this.$route.path.startsWith(route.path)) {
                        index = idx;
                        return true;
                    }
                })
                return index;
            },
            // 获取侧栏子菜单
            asideMenus() {
                const currentRoute = this.routes[this.menuActiveIdx];
                if (!this.hasSubMenu(currentRoute)) return [];
                const asideMenuTree = [];
                const getTreeData = (route, tree, preKey = '0') => {
                    route.children.forEach((r, idx) => {
                        const key = preKey + '-' + idx;
                        tree.push({
                            key,
                            title: r.meta.name,
                            link: r.meta.link,
                            children: [],
                        })
                        if (this.hasSubMenu(r)) {
                            getTreeData(r, tree[idx].children, key);
                        } else {
                            tree[idx].children = null;
                        }
                    })
                }
                getTreeData(currentRoute, asideMenuTree);
                return asideMenuTree;
            },
        },
        watch: {
            // 计算侧栏宽度
            menuActiveIdx(idx) {
                const collapsed = sessionStorage.getItem('aside_collapsed');
                const width = collapsed && Number(collapsed) ? collapsedAsideWidth : defaultAsideWidth;
                this.asideWidth = this.hasSubMenu(this.routes[idx]) ? width : '0px';
            },
        },
        methods: {
            // 设置侧栏宽度
            setAsideWidth(collapsed) {
                this.asideWidth = collapsed ? collapsedAsideWidth : defaultAsideWidth;
            },
            // 判断是否有子路由
            hasSubMenu(route) {
                return route.children && route.children.length;
            },
            // 跳转
            toLink(route) {
                this.$router.push(route.meta.link)
            },
            // 添加nav导航
            pushNav(nav) {
                const hasNav = this.navs.every(item => item.link !== nav.link)
                if (hasNav) {
                    this.navs.push(nav);
                }
            },
            removeNav(idx){
                this.navs.splice(idx, 1);
            }
        },
        mounted() {
            console.log(this.$route);
        }
    }
</script>


<style scoped lang="less">
    * {
        margin-bottom: 0;
    }

    @header-height: 60px;
    @aside-width: 240px;
    header {
        height: @header-height;
        color: #fff;
        background-color: #125ECA;

        .header-left {
            width: @aside-width;

            h1 {
                margin: 0;
                padding-left: 30px;
                color: #fff;
                line-height: 60px;
            }
        }

        .header-right {
            height: @header-height;

            .menu-bar {
                & > ul {
                    height: @header-height;
                }

                .menu-bar-item {
                    position: relative;
                    height: @header-height;
                    padding: 0 20px;
                    font-size: 16px;
                    color: rgba(255, 255, 255, 0.9);
                    cursor: pointer;

                    p {
                        margin-bottom: 0;
                        user-select: none;
                    }

                    &:hover {
                        .active();

                        .sub-menu {
                            display: block;
                        }
                    }

                    &:first-of-type {
                        margin-left: 11px;
                    }

                    &:nth-of-type(n+2) {
                        margin-left: 10px;
                    }
                }

                .sub-menu {
                    @space: 5px;
                    display: none;
                    position: absolute;
                    top: @header-height+@space;
                    left: 50%;
                    transform: translateX(-50%);
                    min-width: 110%;
                    padding: 10px 20px;
                    background-color: skyblue;
                    //background-color: #ffffff;
                    border-radius: 5px;

                    &::after {
                        content: '';
                        position: absolute;
                        top: -@space;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 100%;
                        height: @space;
                    }
                }

                .active {
                    color: #fff;
                    background-color: #1D73EC;
                }
            }
        }
    }

    main {
        display: flex;
        justify-content: space-between;
        min-width: 1000px;
        height: calc(100vh - 60px);
        background-color: #f1f2f6;

        aside {
            width: v-bind(asideWidth);
            border-right: 1px solid #e8e8e8;
            background-color: #fff;
            transition: width 300ms;
        }

        .main-body {
            width: calc(100% - v-bind(asideWidth));
            padding: 8px 16px 0;

            .content {
                margin-top: 10px;
                padding: 24px 26px;
                background-color: #fff;
            }
        }
    }
</style>

<style lang="less">
    * {
        margin: 0;
        padding: 0;
        box-sizing: content-box;
    }

    li {
        list-style: none;
    }

    .flex-start-c {
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .flex-center {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .flex-between {
        display: flex;
        justify-content: space-between;
    }

    .flex-between-c {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .flex-col-between {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
</style>
