<template>
    <yb-content-main>
        <yb-header slot="header" :left-options="{backText: '', preventGoBack: true}" @on-click-back="$router.push({path:'/ucenter'})">
            押金充值
        </yb-header>
        <div slot="main">
            <div v-if="!$route.query.hideStep" class="register-step">
                <group>
                    <step v-model="step">
                        <step-item title="手机绑定"></step-item>
                        <step-item title="押金充值"></step-item>
                        <step-item title="实名认证"></step-item>
                        <step-item title="开始用车"></step-item>
                    </step>
                </group>
            </div>
            <group>
                <cell title="押金（可退）">
                    {{ depositValue ? depositValue / 100 : '' }}
                </cell>
            </group>
            <group>
                <radio :options="payTypeArray" v-model="payType" @on-change="payTypeChange"></radio>
            </group>
            <div style="padding:15px;">
                <div style="padding:8px; color:#666666">
                    <span>• 押金可原路退还</span>
                    <br>
                    <span>• 车费不再押金内扣除，需另外缴纳</span>
                </div>
                <x-button @click.native="deposit()" type="primary">交押金</x-button>
            </div>
        </div>
    </yb-content-main>
</template>
<script type="text/javascript">
export default {
    data() {
            return {
                step: 1,
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
                depositValue: null
            }
        },
    methods: {
        payTypeChange(val) {
            console.log('payTypeChange', val)
        },
        deposit() {
            this.$http({
                method: 'post',
                url: `${BASE_URL}/lock-account/payment`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    amount: this.accurateNumber(this.depositValue),
                    type: 1,
                    pay_type: this.payType,
                    openid: window.openid || '',
                    signature: gen_signature()
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
                                })
                                window.USER.isPaidDeposit = true;
                                localStorage.setItem(USER_CACHE_KEY, JSON.stringify(window.USER));
                                this.$router.replace({
                                    path: '/auth'
                                });
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
                    const { status, error } = e.response.ext;
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
        this.$http({
            url: `${BASE_URL}/lock-account/config?appkey=${APP_KEY}`,
        }).then(function(result) {
            console.log(result.data);
            const {
                status,
                deposit
            } = result.data;
            if (status == 0) {
                this.depositValue = parseInt(deposit, 10);
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
}

function gen_signature() {
    var utc = new Date().getTime();
    var str = Math.random().toString(36).slice(2);
    return utc + '-' + str;
}
</script>
