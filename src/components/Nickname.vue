<template>
    <yb-content-main>
        <yb-header slot="header" :left-options="{backText: '', preventGoBack: false}">
            设置昵称
        </yb-header>
        <div slot="main">
            <group title="">
                <x-input type="text" placeholder="昵称" class="weui-vcode" v-model="nickname">
                </x-input>
            </group>
            <div style="padding:15px;">
                <x-button @click.native="setNickname()" type="primary" :disabled="confirmDisabled">确定</x-button>
            </div>
        </div>
    </yb-content-main>
</template>
<script type="text/javascript">
export default {
    data() {
        return {
            nickname: null,
        }
    },
    methods: {
        setNickname() {
            this.$http({
                method: 'post',
                url: `${BASE_URL}/lock-account/extra_account_info`,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    nickname: this.nickname
                }
            }).then(function(result) {
                this.$vux.toast.show({
                    text: '成功'
                });
                this.$router.back();
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
            if (this.nickname) {
                return false;
            } else {
                return true;
            }
        }
    },
    created() {
        this.$http({
            url: `${BASE_URL}/lock-account/extra_account_info`
        }).then(function(result) {
            const data = result.data;
            if (data.status == 0) {
                const { nickname } = data;
                if (nickname) {
                    this.nickname = nickname;
                } else {
                    const { phone } = window.USER;
                    this.nickname = phone;
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
}
</script>
