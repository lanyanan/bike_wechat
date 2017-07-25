<template>
    <group class="yb-menu-list">
        <slot></slot>
    </group>
</template>
<script>
    
</script>
<style lang="stylus">
@import "../../assets/funcs.styl";
.yb-menu-list
    .weui-cell
        height $height(140)
        line-height $height(140)
        font-size $toRem(14)
        border-top none
    .weui-cells 
        margin-top 0
        a 
            color #000
</style>