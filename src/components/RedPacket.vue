<template>
    <yb-content-main class="wallet">
        <yb-header slot="header" :left-options="{backText: '', preventGoBack: false}">
            我的红包
            <a slot="right">
                <router-link to="/redpacket_list">
                    明细
                </router-link>
            </a>
        </yb-header>
        <div slot="main">
                <div class="balance-value">
                    {{lucky_money_balance | cent-to-yuan }}<span class="unit">元</span>
                </div>
                <div class="balance-desc">
                    金额超过10元可提现, 今天还可提现1次
                </div>
                <img class="bg" src='../assets/drawable-xxhdpi/red-packet-bg.png' />
                <div class="btn-recharge">
                    <x-button :disabled="!(lucky_money_balance >= 10000)" type="primary" @click.native="topup()">提现</x-button>
                </div>
                <div class="help-link">
                    <router-link to="#">
                        常见问题
                    </router-link>
                </div>
        </div>
    </yb-content-main>
</template>

<script>
export default {
    data() {
        return {
            lucky_money_balance: '--'
        }
    },
    methods: {
        topup() {
            this.$router.push({
                path: '/topup'
            });
        },
        refund() {
            this.$http({
                method:'post',
                url: `${BASE_URL}/lock-account/payment?refund=true`,
                data: {}
            }).then(() => {
                USER.isPaidDeposit = false;
                this.$vux.toast.show({
                    text: '成功提交退押金请求'
                });
                this.fetchData();
            });
        },
        fetchData() {
            const token = USER.token;
            if (token) {
                this.$http({
                    url: `${BASE_URL}/lock-account/balance`,
                }).then(function(result) {
                    const data = result.data;
                    if (data.status == 0) {
                        this.lucky_money_balance = data.lucky_money_balance;
                    }
                }.bind(this));
            }
        }
    },
    mounted() {
        this.fetchData();
    }
}
</script>

<style lang="stylus" scoped>
@import "../assets/funcs.styl"
.wallet
    position absolute
    top 0
    width 100%
    height 100%
    min-height $height(1500)
    font-size $toRem(16)
    color #fff
    text-align center
    background #fff
    background-size cover

.balance-value
    font-size $toRem(56)
    position absolute
    top $height(500)
    width 100%
    color $theme1
    .unit
        font-size $toRem(16)

.balance-desc
    position absolute
    top $height(850)
    width 100%
    color #aaa

.btn-recharge
    position absolute
    width 90%
    left 50%
    margin-left -45%
    bottom $height(200)

.bg 
    width 80%
    left 10%
    position absolute
    top $height(1200)

.help-link
    position absolute
    width 100%
    bottom $height(50)
    text-align center
    a 
        color $theme1
</style>