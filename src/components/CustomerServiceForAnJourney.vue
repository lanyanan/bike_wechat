<template>
    <yb-content-main>
        <yb-header slot="header" :left-options="{backText: '', preventGoBack: false}">
            客户服务
        </yb-header>
        <div class="custom-service" slot="main">
            <div class="probably-issue-list">
                <h5>遇到什么问题?</h5>
                <yb-menu-list>
                    <yb-menu-list-item :link="'/customer_service?type=3&journey_id=' + journey_id + '&bike_id=' + bike_id" title="发现车辆故障" is-link></yb-menu-list-item>

                    <yb-menu-list-item :link="'/customer_service?type=30&journey_id=' + journey_id + '&bike_id=' + bike_id" title="其它" is-link></yb-menu-list-item>
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
        },
        created() {
            this.bike_id = this.$route.query.bike_id || '';
            this.journey_id = this.$route.query.journey_id || '';
        }
    }
</script>


<style lang="stylus" scoped>
@import "../assets/funcs.styl"
h5 
    padding 0
    margin 0
    text-indent $width(30)
    font-size $toRem(12)
    height $height(100)
    line-height $height(100)

</style>