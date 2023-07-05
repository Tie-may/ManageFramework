<template>
    <div class="aside-content flex-col-between">
        <div class="toggle-collapsed flex-center" @click="toggleCollapsed">
            <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'"/>
        </div>
        <a-menu
                :style="{width: asideWidth}"
                :selected-keys="selectedKeys"
                :inline-collapsed="collapsed"
                mode="inline"
                @click="SubMenuClick"
        >
            <template v-for="item in asideMenus">
                <a-menu-item v-if="!item.children" :key="item.key">
                    <a-icon type="pie-chart"/>
                    <span>{{ item.title }}</span>
                </a-menu-item>
                <sub-menu v-else :key="item.key" :menu-info="item"/>
            </template>
        </a-menu>
    </div>
</template>

<script>
    import {Menu} from "ant-design-vue";

    const SubMenu = {
        template: `
			<a-sub-menu :key="menuInfo.key" v-bind="$props" v-on="$listeners">
			<span slot="title">
          <a-icon type="mail"/><span>{{ menuInfo.title }}</span>
        </span>
			<template v-for="item in menuInfo.children">
				<a-menu-item v-if="!item.children" :key="item.key">
					<a-icon type="pie-chart"/>
					<span>{{ item.title }}</span>
				</a-menu-item>
				<sub-menu v-else :key="item.key" :menu-info="item"/>
			</template>
			</a-sub-menu>
        `,
        name: 'SubMenu',
        // must add isSubMenu: true
        isSubMenu: true,
        props: {
            ...Menu.SubMenu.props,
            // Cannot overlap with properties within Menu.SubMenu.props
            menuInfo: {
                type: Object,
                default: () => ({}),
            },
        },
    };

    // 通过key或着路由地址获取侧边子菜单信息，key和link只能传入一个，另一个用null赋值
    const getSubMenuInfo = (key, link, menus, result) => {
        menus.some(menu => {
            if (key && menu.key === key) {
                result.push(menu);
                return;
            } else if (link && menu.link === link) {
                result.push(menu);
            }
            if (menu.children) {
                getSubMenuInfo(key, link, menu.children, result);
            }
        })
    };

    export default {
        name: 'AsideMenu',
        components: {
            'sub-menu': SubMenu,
        },
        props: ['asideWidth', 'asideMenus', 'navs'],
        data() {
            return {
                collapsed: false,
            }
        },
        computed: {
            // 通过当前路由获取选中菜单的keys
            selectedKeys() {
                const link = this.$route.meta.link;
                const menus = []
                getSubMenuInfo(null, link, this.asideMenus, menus);
                return [menus[0].key];
            },
            // defaultOpenKeys() {
            //     const opens = [];
            //     this.selectedKeys.forEach(key => {
            //         const keySymbols = key.split('-');
            //         let preKeySymbol = null;
            //         keySymbols.forEach(keySymbol => {
            //             if (preKeySymbol === null) {
            //                 preKeySymbol = keySymbol;
            //             } else {
            //                 const key = preKeySymbol + '-' + keySymbol;
            //                 opens.push(key);
            //                 preKeySymbol = key;
            //             }
            //         })
            //     })
            //     return opens;
            // },
        },
        watch: {
            '$route'(route) {
                const link = route.meta.link;
                const hasNav = this.navs.some(nav => nav.link === link);
                if (!hasNav) {
                    this.pusNavByLink(link);
                }
            },
        },
        methods: {
            // 切换折叠状态
            toggleCollapsed() {
                this.collapsed = !this.collapsed;
                sessionStorage.setItem('aside_collapsed', this.collapsed ? '1' : '0');
                this.$emit('setAsideWidth', this.collapsed);
            },
            // 侧栏菜单点击
            SubMenuClick(e) {
                let asideMenu = [];
                getSubMenuInfo(e.key, null, this.asideMenus, asideMenu);
                asideMenu = asideMenu[0];
                this.$emit('pushNav', asideMenu);
                this.$router.push(asideMenu.link);
            },
            // 通过link比较给导航栏添加nav
            pusNavByLink(link) {
                const menus = [];
                getSubMenuInfo(null, link, this.asideMenus, menus);
                this.$emit('pushNav', menus[0]);
            }
        },
        mounted() {
            this.pusNavByLink(this.$route.meta.link);
            const collapsed = sessionStorage.getItem('aside_collapsed');
            this.collapsed = Boolean(collapsed && parseInt(collapsed));
        }
    }
</script>

<style scoped lang="less">
    .aside-content {
        height: 100px;
    }

    /deep/ .ant-menu {
        .ant-menu-submenu-title,
        .ant-menu-item {
            font-size: 16px;
        }
    }

    .toggle-collapsed {
        padding: 13px 10px;
        font-size: 18px;
        background-color: #e8e8e8;
        cursor: pointer;
    }
</style>