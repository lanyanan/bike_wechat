<template>
    <yb-content-main>
        <yb-header slot="header" :left-options="{backText: '', preventGoBack: false}">
            设置
        </yb-header>
        <div class="setting" slot="main">
            <yb-menu-list class="user-menu-group-1">
                <yb-menu-list-item to="#" title="常用地址" is-link></yb-menu-list-item>
                <yb-menu-list-item to="#" title="检查新版本" is-link></yb-menu-list-item>
                <yb-menu-list-item to="#" title="关于我们" is-link></yb-menu-list-item>
            </yb-menu-list>
            <x-button class="btn-logout" @click.native="$router.push({path: '/logout'})" type="warn" >退出登录</x-button>
        </div>
    </yb-content-main>
</template>

<script type="text/javascript">
    export default {
        data() {
            return {
            }
        },
        methods: {
        },
        computed: {
        },
        created() {
        }
    }
</script>

<style lang="stylus" scoped>
@import "../assets/funcs.styl";
.btn-logout
    width 90%
    font-size $toRem(18)
    margin $height(50) auto
    height $height(200)
    line-height $height(200)
</style>