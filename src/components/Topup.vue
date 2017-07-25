<template>
    <yb-content-main>
        <yb-header slot="header" :left-options="{backText: '', preventGoBack: false}">
            充值
        </yb-header>
        <div class="recharge-page" slot="main">
            <group title="充值金额">
<!--                 <x-input type="number" placeholder="请输入你要充值的金额" class="weui-vcode" v-model="inputAmount">
                    <span slot="right">元</span>
                </x-input> -->
            </group>

            <div class="select-value">
                <checker v-model="checkerAmount" default-item-class="amount-item" selected-item-class="amount-item-selected" @on-change="checkerAmountChange">
                    <checker-item :value="item" v-for="(item, index) in checkerAmounts" :key="index">{{item.value}}</checker-item>
                </checker>
            </div>

            <group title="选择支付方式" class="weui-cells_form">
                <radio :options="payTypeArray" v-model="payType" @on-change="payTypeChange"></radio>
            </group>
            <div style="padding:15px;">
                <x-button @click.native="topup()" type="primary" :disabled="confirmDisabled">确定</x-button>
            </div>

        </div>
    </yb-content-main>
</template>
<script type="text/javascript">
export default {
    data() {
            return {
                payType: 4,
                payTypeArray: [{
                    icon: require('../assets/drawable-xxhdpi/wechat_pay_icon.png'),
                    key: 4,
                    value: '微信支付'
                }, {
                    icon: require('../assets/drawable-xxhdpi/a_pay_icon.png'),
                    key: 5,
                    value: '支付宝'
                }],
                checkerAmounts: [{
                    key: 1,
                    value: '1元'
                }, {
                    key: 5,
                    value: '5元'
                },{
                    key: 10,
                    value: '10元'
                }, {
                    key: 20,
                    value: '20元'
                }, {
                    key: 50,
                    value: '50元'
                }, {
                    key: 100,
                    value: '100元'
                }],
                checkerAmount: null,
                inputAmount: null,
            }
        },
    watch: {
        inputAmount: function (val, oldVal) {
            if (val) {
                this.checkerAmount = null;
            }
        }
    },
    methods: {
        payTypeChange(val) {
            console.log('payTypeChange', val)
        },
        checkerAmountChange(val) {
            this.inputAmount = null;
        },
        topup() {
            var amount = 0;
            if (this.inputAmount) {
                amount = this.inputAmount;
            } else if (this.checkerAmount) {
                amount = this.checkerAmount.key;
            } else {
                return;
            }
            this.$http({
                method: 'post',
                url: `${BASE_URL}/lock-account/payment`,
                data: {
                    amount: this.accurateNumber(amount * 100),
                    type: 2,
                    pay_type: this.payType,
                    openid: window.openid || '',
                    signature: gen_signature(),
                    return_url: `${location.protocol}//${location.host}/public_api/alipay/success`
                }
            }).then(function(result) {
                const data = result.data;
                if (data.status == 0) {
                    const ext = data.ext;

                    if (this.payType == CONST.pay_type.wechat_pay) {
                        wx.chooseWXPay({
                            timestamp: ext.timeStamp,
                            nonceStr: ext.nonceStr, // 支付签名随机串，不长于 32 位
                            package: ext.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                            signType: ext.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                            paySign: ext.paySign, // 支付签名
                            success: (res) => {
                                this.$vux.toast.show({
                                    text: '成功'
                                });
                                this.$router.back();
                            }
                        });
                    } else {
                        const url = encodeURIComponent('https://openapi.alipay.com/gateway.do?' + ext.order_str);
                        location.href= '/public_api/alipay/pay?url=' + url;
                    }
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
    computed: {
        confirmDisabled: function () {
            if (this.inputAmount || this.checkerAmount) {
                return false;
            } else {
                return true;
            }
        }
    },
    created() {}
}

function gen_signature() {
    var utc = new Date().getTime();
    var str = Math.random().toString(36).slice(2);
    return utc + '-' + str;
}
</script>


<style lang="stylus">
@import "../assets/funcs.styl";
.recharge-page
    .weui-cells__title
        font-size $toRem(14)
        height $height(150)
        line-height $height(150)
</style>

<style lang="stylus" scoped>
@import "../assets/funcs.styl";
.select-value
    background #fff
    text-align center
    padding $height(30) 0

.amount-item 
    margin $height(30) $width(30)
    height $height(200)
    width $width(600)
    background-color #fff
    font-size $toRem(16)
    line-height $height(200)
    border 1px solid #262930
    border-radius $height(10)

.amount-item-selected {
    color: #ffffff;
    background-color: #262930;
}
</style>

<style lang="stylus" scoped>

</style>
