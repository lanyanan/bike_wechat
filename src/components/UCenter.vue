<template>
    <yb-content-main>
        <yb-header slot="header" :left-options="{backText: '', preventGoBack: true}" @on-click-back="$router.push({path:'/'})">
            {{ title }}
        </yb-header>
        <div class="user-center" slot="main">
            <div class="user-info">
                <img class="background" src="../assets/drawable-xxhdpi/bg_user_profile.png">
                <div v-if="user.token === undefined">
                    <img class="avatar" src="../assets/drawable-xxhdpi/avatar_default_unlogin.png">
                    <div class="credit">
                        <router-link to="/login">
                            <img class="normal" src="../assets/drawable-xxhdpi/credit_normal_bg_default.png" />
                            <span>登录/注册</span>
                        </router-link>
                    </div>
                </div>
                <div v-else>
                    <router-link to="/user-info">
                        <img v-if="user.avatar !== undefined" class="avatar" :src="user.avatar ? user.avatar : user.defaultAvatar">
                    </router-link>
                    <div class="credit">
                        <div class="name">{{ user.nickname || user.phone }}</div>
                        <router-link to="/credit">
                            <img class="normal" src="../assets/drawable-xxhdpi/credit_normal_bg_default.png" />
                            <span>信用积分 {{ user.credit }}</span>
                        </router-link>
                    </div>
                </div>
            </div>

            <div class="user-menu" v-if="user.token">
                <group class="register-step" v-if="step < 3">
                    <router-link :to="(step == 1 && '/deposit') || (step == 2 && '/auth')">
                        <h5>完成注册即可开始用车</h5>
                        <step v-model="step">
                            <step-item title="手机绑定"></step-item>
                            <step-item title="押金充值"></step-item>
                            <step-item title="实名认证"></step-item>
                            <step-item title="开始用车"></step-item>
                        </step>
                    </router-link>
                </group>

                <flexbox :gutter="0">
                    <flexbox-item>
                        <div class="user-data">
                            <div class="value">{{user.total_ride_meter | to-kilo}}</div>
                            <div class="desc">累计骑行(公里)</div>
                        </div>
                    </flexbox-item>
                    <flexbox-item>
                        <div class="user-data" style="border-left: 1px solid #efefef; border-right: 1px solid #efefef">
                            <div class="value">{{user.total_saved_carbon | to-kilo}}</div>
                            <div class="desc">节约碳排放(千克)</div>
                        </div>
                    </flexbox-item>
                    <flexbox-item>
                        <div class="user-data">
                            <div class="value">{{user.total_calorie | to-kilo}}</div>
                            <div class="desc">运动成就(大卡)</div>
                        </div>
                    </flexbox-item>
                </flexbox>
                
                <yb-menu-list class="user-menu-group-1">
                    <yb-menu-list-item link="/wallet" title="我的钱包" :value="user.balance | cent-to-yuan | yuan" is-link>
                        
                    </yb-menu-list-item>
                    <yb-menu-list-item link="/redpacket" title="我的红包" is-link></yb-menu-list-item>
                    <yb-menu-list-item link="/journey" title="我的行程" is-link></yb-menu-list-item>
                </yb-menu-list>

                <yb-menu-list class="user-menu-group-2">
                    <yb-menu-list-item link="/message" title="我的消息" is-link></yb-menu-list-item>
                    <yb-menu-list-item link="/share" title="邀请好友" is-link></yb-menu-list-item>
                    <yb-menu-list-item link="/ucenter" title="用户指南" is-link></yb-menu-list-item>
                    <yb-menu-list-item link="/setting" title="设置" is-link></yb-menu-list-item>
                </yb-menu-list>
            </div>

            <div v-else>
                <div v-for="(item, index) in cardItems" class="card" :key="index">
                    <div class="header">
                        <div class="line"></div>
                        <span :class="'title-' + index">{{item.title}}</span>
                    </div>
                    <div class="body">
                        <img :src="item.img" />
                    </div>
                    <div class="footer">
                        {{item.content}}
                    </div>
                </div>
            </div>
            
            <x-dialog class="red-packet-dialog" v-if="redPacket" v-model="showRedPacket" :hide-on-blur="true">
                <img src="../assets/drawable-xxhdpi/red-packet-close.png" />
                <div class="packet-desc">
                    你获得一份现金红包
                </div>
                <router-link :to="'/redpacket/' + redPacket.amount">
                    <div class="open-packet">
                        <img src="../assets/drawable-xxhdpi/red-packet-open.png" />
                    </div>
                </router-link>
                <div class="adv-close-wrap" @click="showRedPacket=false">
                  <span class="close"></span>
                </div>
            </x-dialog>
        </div>

    </yb-content-main>
</template>

<script type="text/javascript">
    export default {
        data() {
            return {
                title: APP_CONFIG.title,
                redPacket: undefined,
                showRedPacket: false,
                user: {
                    avatar: undefined,
                    phone: '',
                    token: '',
                    balance: '',
                    deposit: '',
                    total_calorie: '',
                    total_ride_meter: '',
                    total_saved_carbon: '',
                    nickname: '',
                    defaultAvatar: require('../assets/drawable-xxhdpi/avatar_default_login.png')
                },
                cardItems:[
                    {
                        title: '停车点',
                        img: require('../assets/drawable-xxhdpi/hint_card_1.png'),
                        content: '单车不需要固定车桩，请将单车停放在路边公共停车区域内，方便他人取用'
                    },
                    {
                        title: '预约与计费',
                        img: require('../assets/drawable-xxhdpi/hint_card_2.png'),
                        content: '在地图上点击您想要的单车即可预约，预约车辆为您保留15分钟。开锁开始计费'
                    },
                    {
                        title: '开锁帮助',
                        img: require('../assets/drawable-xxhdpi/hint_card_3.png'),
                        content: '在单车的车把和车锁上都印有二维码，只需用手机扫码，车锁会自动打开'
                    },
                    {
                        title: '如何关锁？',
                        img: require('../assets/drawable-xxhdpi/hint_card_4.png'),
                        content: '手动关锁完成还车，结束计费（结费或受网络影响，稍等即可）'
                    },
                    {
                        title: '客户服务',
                        img: require('../assets/drawable-xxhdpi/hint_card_5.png'),
                        content: '寻找客服帮助、举报违停或发现故障车，请点击首页右下角客服图标'
                    }
                ]
            }
        },
        methods: {
            fetchRedPacket() {
                this.$http({
                    url: `${BASE_URL}/lock-account/lucky_money`,
                    params: {
                        limit: 0,
                        offset: 10
                    }
                }).then((result) => {
                    const { data, status } = result.data;
                    if (status == 0) {
                        for (let i = 0, length = data.length; i < length; i++) {
                            if (data[i].read == 0) {
                                this.redPacket = data[i];
                                this.showRedPacket = true;
                                break;
                            }
                        }
                    } 
                })
            }
        },
        computed: {
            step() {
                return (USER.isRealNameAuth && 3) || (USER.isPaidDeposit && 2) || 1;
            }
        },
        created() {
            const { phone, token } = window.USER;
            this.user.phone = phone;
            this.user.token = token;

            if (token) {

                this.fetchRedPacket();

                this.$http({
                    url: `${BASE_URL}/lock-account/balance`,
                }).then(function(result) {
                    const data = result.data;
                    if (data.status == 0) {
                       
                    }
                }.bind(this));

                this.$http({
                    url: `${BASE_URL}/lock-account/extra_account_info`,
                }).then(function(result) {
                    const data = result.data;
                    if (data.status == 0) {
                        const {balance, deposit, icon:avatar, credit, total_calorie, total_ride_meter, total_saved_carbon, nickname, name} = data;
                        this.user.avatar = avatar || '';
                        window.USER.avatar = this.user.avatar;
                        this.user.name = name || '';
                        if (this.user.name) {
                            window.USER.isRealNameAuth = true;
                        }
                        this.user.balance = data.balance;
                        this.user.deposit = data.deposit;
                        if (this.user.deposit > 0) {
                            window.USER.isPaidDeposit = true;
                        }
                        this.user.credit = credit;
                        this.user.total_calorie = total_calorie;
                        this.user.total_ride_meter = total_ride_meter;
                        this.user.total_saved_carbon = total_saved_carbon;
                        this.user.nickname = nickname;
                    }
                }.bind(this));
            }
        }
    }
</script>

<style lang="stylus">
@import "../assets/funcs.styl"
.register-step
    .weui-cells
        margin-top $height(-20)
        margin-bottom $height(50)

    h5
        margin-top $height(60)
        text-align center
        font-size $toRem(12)
        color #000
    .vux-step
        width $width(1250)
        padding-left $width(30)
        margin $height(100) auto $height(30) auto
    .vux-step-item
        overflow visible
    .vux-step-item-tail
        right 0 !important
    .vux-step-item-main
        font-size $toRem(10)
        height $height(200)
        line-height $height(200)
        display block
        text-indent $width(-70)
        color #ccc
    .vux-step-item-tail-finish
        background-color #ccc
    .vux-step-item-head-finish
        .vux-step-item-head-inner
            border 1px solid #4cc2ff
            .weui-icon-success-no-circle
                color #4cc2ff
    .vux-step-item-head-process
        .vux-step-item-head-inner
            border 1px solid #4cc2ff
            background #4cc2ff
</style>

<style lang="stylus" scoped>
@import "../assets/funcs.styl"
    .user-info 
        position relative
        .background 
            padding-top $height(280)
            background #5fcdd7
            width 100%
        
        .avatar 
            position absolute
            left 50%
            top $height(100)
            margin-left $width(-175)
            width $width(350)
            border-radius 50%
        .credit 
            position absolute
            left 50%
            top $height(600)
            margin-left $width(-200)
            width  $width(400)
            height $height(94)
            a
                color #ffffff
                text-align center
    
            img 
                position absolute
                left  0
                width 100%
                
            span 
                position absolute
                display block
                width 100%
                line-height $height(94)
            .name
                position absolute
                height $height(100)
                width $width(300)
                left 50%
                margin-left $width(-150)
                top $height(-120)
                text-align center
            .normal 
                width: 100%
    .user-menu
        background #efefef
        padding-bottom $height(200)

    .card 
        width 90%
        margin 0 auto
        .header
            position relative
            height $height(120)
            margin $height(40) 0 $height(40) 0
            overflow hidden
            text-align center
            span
                font-size $toRem(16)
                line-height $height(120)
                position absolute
                background #fff
                left 50%
            .line
                position absolute
                top $height(60)
                height 1px
                width 100%
                border-top 1px solid #e5e5e5
            .title-0
                width $width(300)
                margin-left $width(-150)
            .title-1,
            .title-3,
            .title-4,
            .title-5
                width $width(400)
                margin-left $width(-200)
            .title-2
                width $width(350)
                margin-left $width(-175)
            
        .footer
            width $width(1100)
            margin 0 auto
            font-size $toRem(14)
            text-align center
        img 
            width 100%
    
    .user-data
        padding $height(60) 0 $height(30) 0
        text-align center
        background #fff
        .value
            height $height(100)
            line-height $height(100)
            font-size $toRem(20)
            color #4cc2ff
        .desc
            color #ccc
            line-height $height(120)
            font-size $toRem(12)
            
    .user-menu-group-2
        margin-top $height(100)
</style>