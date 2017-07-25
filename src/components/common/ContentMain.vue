<template>
    <div>
        <div  :style="{display:isWebview ? 'none' : 'block'}" >
            <slot name="header" >
                <x-header :left-options="{backText: '', showBack: showBack}">
                    <slot class="title" name="title" ></slot>
                </x-header>
            </slot>
        </div>
        <div :class="{main: true, webview: isWebview}">
            <slot name="main"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        computed: {
            showBack() {
                return !(this.$route.path == '/');
            },
            isWebview() {
                return window.isWebview;
            }
        },
        beforeCreate() {
            window.USER = window.USER || {};
            if (this.$route.query.token) {
                window.USER.token = this.$route.query.token;
            }
            if (this.$route.query.isWebview) {
                window.isWebview = true;
            }
        }

    }
</script>

<style lang="stylus">
@import "../../assets/base.styl";
@import "../../assets/funcs.styl";
.main.webview
    margin-top 0
.main 
    margin-top $height($headerHeight - 2)
</style>