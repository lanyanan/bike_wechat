<template>
    <yb-content-main>
        <yb-header slot="header" :left-options="{backText: '', preventGoBack: true}" @on-click-back="$router.push({path:'/ucenter'})">
            实名认证
        </yb-header>
        <div slot="main">
            <div class="register-step">
                <group>
                    <step v-model="step">
                        <step-item title="手机绑定"></step-item>
                        <step-item title="押金充值"></step-item>
                        <step-item title="实名认证"></step-item>
                        <step-item title="开始用车"></step-item>
                    </step>
                </group>
            </div>
            <group title="" class="weui-cells_form">
                <x-input is-type="china-name" title="姓名" placeholder="请输入真实姓名" class="weui-vcode" v-model="name">
                </x-input>
                <x-input type="text" title="身份证号" placeholder="请输入身份证号" class="weui-vcode" v-model="id">
                </x-input>
            </group>
            <div style="padding:15px;">
                <x-button @click.native="auth()" type="warn" :disabled="authDisabled">认证</x-button>
                <div style="padding:8px; text-align:center; color:#666666">
                    <span style="color:red">无中华人民共和国居民身份证，请点击这里</span>
                </div>
            </div>
        </div>
    </yb-content-main>
</template>
<script type="text/javascript">
export default {
    data() {
            return {
                step: 2,
                name: '',
                id: '',
            }
        },
    methods: {
        auth() {
            this.$http({
                method: 'post',
                url: `${BASE_URL}/lock-account/verify`,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Token': window.USER.token
                },
                data: {
                    idcard: this.id,
                    name: this.name
                }
            }).then(function(result) {
                const {
                    status,
                } = result.data;
                if (status == 0) {
                    this.$vux.toast.show({
                        text: '成功'
                    })
                    window.USER.isRealNameAuth = true;
                    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(window.USER));
                    this.$router.replace({
                        path: '/'
                    });
                } else {
                    this.$vux.toast.show({
                        type: 'warn',
                        text: '错误：' + status
                    })
                }
            }.bind(this)).catch(function(e) {
                this.$vux.toast.show({
                    type: 'warn',
                    text: '出现错误'
                })
                console.log(e);
            }.bind(this));
        }
    },
    computed: {
        authDisabled: function () {
            if (this.name && this.id) {
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
