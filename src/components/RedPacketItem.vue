<template>
    <yb-content-main class="wallet">
        <yb-header slot="header" :left-options="{backText: '', preventGoBack: false}">
            红包
        </yb-header>
        <div slot="main">
            <div class="red-packet">
                <div class="balance-value">
                    {{ $route.params.money | cent-to-yuan }}<span class="unit">元</span>
                </div>
                <div class="balance-desc">
                    已存入红包余额, 可提现
                </div>
<!--                 <div class="btn-recharge">
                    <x-button type="primary">分享</x-button>
                </div> -->
                <div class="help-link">
                    <router-link to="/redpacket">
                        查看我的红包余额
                    </router-link>
                </div>
                <img src="../assets/drawable-xxhdpi/red-packet.png" class="bg" />
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
    methods: {
    },
    created() {
    }
}
</script>

<style lang="stylus" scoped>
@import "../assets/funcs.styl"
.red-packet
    width 100%
    height 100%
    position absolute
    top 0
    width 100%
    height 100%
    min-height $height(1500)
    font-size $toRem(16)
    color #fff
    text-align center
.bg 
    position absolute
    left 0
    bottom 0
    width 100%
    z-index -1

.balance-value
    font-size $toRem(56)
    position absolute
    top $height(500)
    width 100%
    color #333
    .unit
        font-size $toRem(16)
        color #555

.balance-desc
    position absolute
    top $height(850)
    width 100%
    color #999

.btn-recharge
    position absolute
    width 90%
    left 50%
    margin-left -45%
    bottom $height(200)

.help-link
    font-size $toRem(18)
    position absolute
    width 100%
    bottom $height(100)
    text-align center
    a 
        color #fff
</style>