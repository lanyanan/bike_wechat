<template>
    <x-header class="yb-header" :left-options="leftOptions" @on-click-back="handlerClickBack">
        <template slot="left">
            <slot name="left"></slot>
        </template>
        <slot></slot>
        <template slot="right">
            <slot name="right"></slot>
        </template>
    </x-header>
</template>

<script>
export default {
    props: ['leftOptions', 'title'],
    methods:{
        handlerClickBack() {
            this.$emit('on-click-back');
        }
    }
}
</script>

<style lang="stylus">
@import "../../assets/funcs.styl";
.yb-header 
    position fixed
    top 0
    width 100%
    height $height($headerHeight)
    padding 0
    margin 0
    background #262930
    z-index 10
    .vux-header-left
        height $height($headerHeight)
        top 0
        left $width(50)
        .left-arrow
        .left-arrow:before
            width $width($headerHeight/4)
            height $height($headerHeight/4)
            top $height($headerHeight/6)
        a 
            display block
            height $height($headerHeight)
            width $width($headerHeight/3)
            padding 0

    .vux-header-title
        margin 0
        padding 0
        height $height($headerHeight)
        font-size $toRem(20)
        line-height $height($headerHeight)
    
    .vux-header-right
        top 0
        right $width(50)
        font-size $toRem(18)
        height $height($headerHeight)
        line-height $height($headerHeight)
        
</style>