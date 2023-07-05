<template>
    <div class="nav-bar-wrapper flex-between-c">
        <div class="left-arrow" @click="navMove(true)">
            <a-icon type="left"/>
        </div>
        <ul class="nav-bar-content">
            <li class="nav-item flex-center"
                :class="{'nav-active':activeIdx===idx}"
                v-for="(nav,idx) in navs"
                :key="idx"
                @click="navChange(nav)"
            >
                <p>{{ nav.title }}</p>
                <a-icon type="close"
                        v-show="navs.length!==1"
                        style="margin-left: 5px;font-size: 12px;"
                        @click.stop="navClose(idx)"
                />
            </li>
        </ul>
        <div class="right-arrow" @click="navMove(false)">
            <a-icon type="right"/>
        </div>
    </div>
</template>

<script>
    const move = (start, distance, contentDom, isLeft) => {
        const step = 4;
        if (start < distance) {
            start += step;
            if (isLeft) {
                contentDom.scrollLeft -= step;
            } else {
                contentDom.scrollLeft += step;
            }
            requestAnimationFrame(() => {
                move(start, distance, contentDom, isLeft);
            })
        }
    }

    let moveTimer = null;
    const throttle = (fn, delay) => {
        return function () {
            let _this = this; // 当前 this 保存，以免后续处理中 this 丢失
            if (!moveTimer) {
                fn.apply(_this, arguments);
                moveTimer = setTimeout(function () {
                    moveTimer = null;
                }, delay);
            }
        }
    }

    export default {
        name: 'NavBar',
        props: ['navs'],
        data() {
            return {
                activeIdx: 0,
                activeWatchable: true, // activeIdx变化时是否执行监听
            };
        },
        watch: {
            '$route'(route) {
                // 根据路由动态改变导航栏激活状态
                this.$nextTick(() => {
                    this.navs.some((nav, idx) => {
                        if (nav.link === route.meta.link) {
                            this.activeIdx = idx;
                            return true;
                        }
                    })
                })
            },
            activeIdx(idx) {
                if (!this.activeWatchable) {
                    this.activeWatchable = true;
                    return;
                }
                this.activeNavShow(idx); // 保证选中的nav不会被隐藏
            },
        },
        methods: {
            // 当前nav改变
            navChange(nav) {
                this.$router.push(nav.link);
            },
            // 关闭nav
            navClose(idx) {
                if (this.activeIdx === idx) {
                    this.activeWatchable = false;
                    if (idx === this.navs.length - 1) {
                        this.activeIdx = idx - 1;
                    } else {
                        this.activeIdx = idx + 1;
                    }
                    this.$router.push(this.navs[this.activeIdx].link);
                } else if (this.activeIdx > idx) {
                    this.activeWatchable = false;
                    this.activeIdx--;
                }
                this.$emit('removeNav', idx);
            },
            // 导航栏溢出时点击向左移动
            navMove(isLeft) {
                throttle(() => {
                    const navContent = document.querySelector('.nav-bar-content');
                    const distance = navContent.clientWidth / 4; // 每次最大移动宽度的1/4
                    move(0, distance, navContent, isLeft);
                }, 200)();
            },
            // 保证选中的nav不会被隐藏
            activeNavShow(idx) {
                const items = document.querySelectorAll('.nav-item');
                const currentItem = items[idx];
                const navContent = document.querySelector('.nav-bar-content');
                const contentWidth = navContent.clientWidth;
                const currentWidth = currentItem.clientWidth;
                let lisWidth = 0;
                for (let i = 0; i < idx; i++) {
                    lisWidth += items[i].offsetWidth;
                }
                const scrollLeft = navContent.scrollLeft;
                if (lisWidth < scrollLeft) {// 在左边，向右移
                    const distanceOfLeft = scrollLeft - lisWidth;
                    move(0, distanceOfLeft, navContent, true);
                } else if (lisWidth > scrollLeft + contentWidth - currentWidth) {// 在右边，向左移
                    const distanceOfRight = lisWidth - scrollLeft - contentWidth + currentWidth;
                    move(0, distanceOfRight, navContent, false);
                }
            },
        },
        mounted() {

        }
    }
</script>

<style scoped lang="less">
    @nav-height: 32px;

    .nav-bar-wrapper {
        height: @nav-height;
        padding: 0 5px;
        background-color: #fff;
    }

    .nav-bar-content {
        flex: 1;
        display: flex;
        position: relative;
        margin-bottom: 0;
        overflow-x: auto;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .nav-item {
        flex-shrink: 0;
        box-sizing: content-box;
        height: @nav-height;
        padding: 0 16px;
        font-size: 14px;
        cursor: pointer;

        p {
            margin-bottom: 0;
        }

        &:hover {
            color: #125ECA;
        }
    }

    .nav-active {
        color: #125ECA;
        border-bottom: 3px solid #125ECA;
    }

    .left-arrow, .right-arrow {
        padding: 0 10px;
        cursor: pointer;

        &:hover {
            color: #125ECA;
        }
    }
</style>