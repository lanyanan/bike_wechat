<template>
    <cell :link="link" :title="title" :value="value" :is-link="isLink" class="yb-menu-list-item">
        <slot></slot>
        <template slot="child">
            <slot name="child"></slot>
        </template>
    </cell>
</template>
<script>
    export default {
        props: ['title', 'isLink', 'link', 'value']
    }
</script>
<style lang="stylus">
    
</style>