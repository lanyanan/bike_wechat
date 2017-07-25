<template>
    <yb-content-main>
        <yb-header slot="header" :left-options="{backText: '', preventGoBack: false}">
            客户服务
        </yb-header>
        <div class="custom-service" slot="main">
            
            <div class="probably-issue-list">
                <yb-menu-list>
                    <yb-menu-list-item link="/customer_service_journey_list" title="历史行程" is-link></yb-menu-list-item>
                    <yb-menu-list-item link="/customer_service?type=3" title="发现车辆故障" is-link></yb-menu-list-item>
                    <yb-menu-list-item link="/customer_service?type=2" title="开不了锁" is-link></yb-menu-list-item>
                </yb-menu-list>

                <yb-menu-list class="to-custom-service-list">
                    <yb-menu-list-item link="/customer_service_list" title="客户服务进度查询" is-link></yb-menu-list-item>
                </yb-menu-list>
            </div>
        </div>
    </yb-content-main>
</template>

<script>
    export default {
        data() {
            return {
            }
        }
    }
</script>


<style lang="stylus" scoped>
@import "../assets/funcs.styl"
// -----------
.journey-item 
    left 0
    top 0
    position absolute
    font-size $toRem(8)
    line-height $height(90)
    width 100%
    padding $height(20) 0 
    margin 0
    overflow hidden
    .inner-cell
        text-indent $width(40)
        display inline-block
        width 40%
        padding 0 
        margin 0
        
        label 
            color #ccc

</style>