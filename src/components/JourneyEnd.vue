<template>
    <yb-content-main>
        <yb-header slot="header" :left-options="{backText: '', preventGoBack: false}">
            骑行结束
        </yb-header>
        <div class="journey-end" slot="main">
                <div class="spend-info">
                    <img src="../assets/drawable-xxhdpi/finish_ride_cost_bg.png" />
                    <div class="label">本次骑行花费</div>
                    <div class="value"><span>{{ spend | cent-to-yuan}}</span>元</div>
                </div>
                <flexbox class="user-info">
                    <flexbox-item>
                        <div>骑行时间</div>
                        <div class="value">{{ duration | second-to-minute}}&nbsp;分钟</div>
                    </flexbox-item>
                    <flexbox-item>
                        <div>我的信用分</div>
                        <div class="value">{{ credit }} &nbsp;分</div>
                    </flexbox-item>
                    <flexbox-item>
                        <div>钱包余额</div>
                        <div class="value">{{ balance | cent-to-yuan }}&nbsp;元</div>
                    </flexbox-item>
                </flexbox>

                <router-link to='/'>
                    <div class="btn-done">
                        <x-button type="primary">完成</x-button>
                    </div>
                </router-link>
        </div>
    </yb-content-main>
</template>

<script type="text/javascript">
    export default {
        data() {
            return {
                spend: '',
                start: '',
                balance: '',
                credit: '',
                duration: ''
            }
        },
        methods: {
        },
        computed: {
        },
        created() {
            this.$http({
                url: `${BASE_URL}/lock-stat/session_details`,
                params: {sid: this.$route.query.journeyId},
            }).then(function(result) {
                const data = result.data;
                if(data.status == 0) {
                    const { spend, duration } = data.details;
                    this.spend = spend;
                    this.duration = duration;
                }
            }.bind(this));

            this.$http({
                url: `${BASE_URL}/lock-account/extra_account_info`,
            }).then(function(result) {
                const data = result.data;
                if (data.status == 0) {
                    this.credit = data.credit;
                    USER.credit = data.credit;
                }
            }.bind(this));

            this.$http({
                url: `${BASE_URL}/lock-account/balance`,
            }).then(function(result) {
                const data = result.data;
                if (data.status == 0) {
                    this.balance = data.balance;
                    USER.balance = data.balance;
                }
            }.bind(this));
        }
    }
</script>

<style lang="stylus" scoped>
@import "../assets/funcs.styl";
.journey-end
    text-align center
    font-size $toRem(18)
    overflow hidden
        
.spend-info 
    position relative
    margin $height(80) auto
    width $width(600)
    height $height(600)
    color #fff
    .label,
    .value,
    img 
        width 100%
        position absolute
    .label
        top $height(180)
    .value
        top $height(270)
        span
            font-size $toRem(36)
        
    img
        left 0
.user-info
    text-align center
    color #888
    .value
        color #18bffd

.btn-done
    position absolute
    width 90%
    left 50%
    margin-left -45%
    bottom $height(300)
</style>