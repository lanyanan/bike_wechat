<template>
    <yb-content-main class="wallet">
        <yb-header slot="header" :left-options="{backText: '', preventGoBack: false}">
            钱包
            <a slot="right">
                <router-link to="/pay-log">
                    明细
                </router-link>
            </a>
        </yb-header>
        <div slot="main">
                <div class="balance-desc">
                    车费余额(元)
                </div>
                <div class="balance-value">
                    {{balance}}
                </div>
                <div class="btn-recharge">
                    <x-button type="primary" @click.native="topup()">充值</x-button>
                </div>
                <div class="deposit-info">
                    押金: {{deposit}}元 &nbsp; 
                    <a v-if="typeof deposit == 'number' && deposit > 0" @click.prevent="refund">
                        退押金
                    </a>

                    <router-link v-if="typeof deposit == 'number' && deposit == 0 " to="/deposit?hideStep=true">
                        充押金
                    </router-link>

                </div>
        </div>
    </yb-content-main>
</template>

<script>
export default {
    data() {
        return {
            deposit: '---',
            balance: '--'
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
            this.$http({
                url: `${BASE_URL}/lock-account/balance`
            }).then(function(result) {
                const data = result.data;
                if (data.status == 0) {
                    this.deposit = data.deposit/100;
                    this.balance = data.balance/100;
                } else {
                    this.$vux.toast.show({
                        type: 'warn',
                        text: '获取数据失败'
                    })
                }
            }.bind(this)).catch(function(e) {
                var msg = '';
                if (e.response) {
                    const { status, error } = e.response.data;
                    msg = error;
                } else if (e.request) {
                    msg = e.request;
                } else {
                    msg = e.message;
                }
                this.$vux.toast.show({
                    type: 'warn',
                    text: msg
                })
            }.bind(this));
            
        }
    },
    created() {
        this.fetchData();
    }
}
</script>

<style lang="stylus">
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
    background url('../assets/drawable-xxhdpi/bg_user_wallet.png') #404257
    background-size cover

.balance-value
    font-size $toRem(22)
    position absolute
    top $height(850)
    width 100%
    color #4cc2ff

.balance-desc
    position absolute
    top $height(700)
    width 100%

.btn-recharge
    position absolute
    width 90%
    left 50%
    margin-left -45%
    bottom $height(200)

.deposit-info
    position absolute
    width 100%
    bottom $height(50)
    text-align center
    a 
        color orange
</style>