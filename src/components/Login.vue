<template>
    <yb-content-main>
        <yb-header slot="header" :left-options="{backText: '', preventGoBack: false}">
            登录
        </yb-header>
        <div slot="main">
            <group title="" class="weui-cells_form">
                <x-input keyboard="number" is-type="china-mobile" title="手机号" placeholder="请输入手机号码" class="weui-vcode" v-model="phone">
                </x-input>
                <x-input type="text" title="验证码" placeholder="请输入验证码" class="weui-vcode" v-model="captcha">
                    <x-button id="button-captcha" slot="right" type="default" :text="buttonText" :disabled="captchaDisabled" @click.native="requestCaptcha()" mini></x-button>
                </x-input>
            </group>
            <div style="padding:15px;">
                <x-button @click.native="checkCaptcha()" type="primary" :disabled="loginDisabled">登录</x-button>
                <div style="padding:8px; text-align:center; color:#666666">
                    <span>点击开始，即表示已阅读并同意</span>
                    <span style="color:red">《用车服务条款》</span>
                </div>
            </div>
        </div>
    </yb-content-main>
</template>
<script type="text/javascript">
export default {
    data() {
            return {
                phone: '',
                captcha: '',
                buttonText: '获取验证码',
                counter: 0,
                captchaDisabled: false,
            }
        },
    methods: {
        requestCaptcha() {
            this.captchaDisabled = true;
            this.$http({
                method: 'post',
                url: `${BASE_URL}/lock-account/request_captcha`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    phone: this.phone,
                    appkey: APP_KEY
                }
            }).then((result) => {

                this.counter = 60;
                this.buttonText = this.counter.toString() + ' 秒';
                this.captchaDisabled = true;
                var intervalId = setInterval(function() {
                    this.counter--;
                    if (this.counter <= 0) {
                        this.captchaDisabled = false;
                        clearInterval(intervalId);
                        this.buttonText = '获取验证码';
                    } else {
                        this.buttonText = this.counter.toString() + ' 秒';
                    }
                }.bind(this), 1000);

                const { status } = result.data;
                this.$vux.toast.show({
                    text: '发送成功'
                });
            }).catch((error) => {
                this.captchaDisabled = false;
            });
        },
        checkCaptcha() {

            this.$http({
                method: 'post',
                url: `${BASE_URL}/lock-account/check_captcha`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    phone: this.phone,
                    appkey: APP_KEY,
                    captcha: this.captcha
                }
            }).then(function(result) {
                const {
                    status,
                    token,
                    verify_status,
                    balance,
                    deposit,
                    credit,
                } = result.data;
                this.$vux.toast.show({
                    text: '登录成功'
                })
                window.USER.balance = balance;
                window.USER.credit = credit;
                window.USER.deposit = deposit;
                window.USER.phone = this.phone;
                window.USER.token = token;
                window.USER.isRealNameAuth = false;
                window.USER.isPaidDeposit = false;

                if ((verify_status & 0x01) != 0) {
                    console.log('authorized');
                    window.USER.isRealNameAuth = true;
                }

                if ((verify_status & 0x02) != 0) {
                    console.log('deposited');
                    window.USER.isPaidDeposit = true;
                }

                localStorage.setItem(USER_CACHE_KEY, JSON.stringify(window.USER));

                if (!window.USER.isPaidDeposit && !window.USER.isRealNameAuth) {
                    this.$router.replace({
                        path: '/deposit'
                    });
                } else if (!window.USER.isRealNameAuth) {
                    this.$router.replace({
                        path: '/auth'
                    });
                } else {
                    this.$router.replace({
                        path: '/'
                    });
                }
            }.bind(this)).catch((error) => {});
        }
    },
    computed: {
        loginDisabled: function () {
            if (this.phone && this.captcha) {
                return false;
            } else {
                return true;
            }
        }
    },
    created() {}
}

</script>

<style type="text/css">
    #button-captcha {
        width: 100px;
    }
</style>
