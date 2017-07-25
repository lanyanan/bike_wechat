<template>
    <yb-content-main >
        <yb-header slot="header" :left-options="{backText: '', preventGoBack: false}">
            邀请好友
        </yb-header>
        <div slot="main">
            <div class="head">
                <img src="../assets/drawable-xxhdpi/share_with_friend_img.png" />
            </div>
            <div class="body">
                <h5> 邀请好友一起骑行 </h5>
                <p>好友用您的邀请码成功注册,<p>
                <p>您的信用值会增加哦!</p>
                
                <div class="invite-code-wrap">
                    <p>您的专属邀请码为 :</p>
                    <p class="invite-code">{{ inviteCode }}</p>
                </div>
            </div>

            <div class="footer">
                点击右上角, 分享给好友
            </div>
        </div>
    </yb-content-main>
</template>

<script>
    export default {
        data() {
            return {
                inviteCode: '----'
            }
        },
        methods: {
            initShare() {
                const shareTypes = [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone'
                ]
                const data = {
                    title: APP_CONFIG.share.title, // 分享标题
                    desc: APP_CONFIG.share.desc, // 分享描述
                    link: `http://bike.yunba.io/${APP_CONFIG.id}/invite?code=${this.inviteCode}`,
                    imgUrl: '',
                    success: () => {
                        this.$vux.toast.show({
                            text: '分享成功'
                        });
                    }
                };
                window.WECHAT_READY.then(() => {
                    shareTypes.forEach((item) => {
                        wx[item](data);
                    });
                });
            }
        },
        created() {
            // 获取邀请码
            this.$http({
                url: `${BASE_URL}/lock-account/invite_code`
            }).then((result) => {
                const data = result.data;
                if (data.status == 0) {
                    this.inviteCode = data.code;
                    this.initShare();
                } else {
                    this.$vux.toast.show({
                        type: 'warn',
                        text: '获取数据失败'
                    })
                }
            });
        }
    }
</script>

<style lang="stylus" scoped>
@import "../assets/funcs.styl";
.head 
    img 
        width 100%

.body 
    text-align center
    color #555
    h5 
        font-size $toRem(16)
        color #000
    
    .invite-code-wrap
        margin-top $height(100)
        .invite-code
            color #000
            font-size $toRem(25)
.footer
    width 100%
    height $height(350)
    position absolute
    bottom 0
    text-align center
    color #000
    .title
        font-size $toRem(14)
        color #555
    ul
        margin-top $height(30)
        li
            padding $height(20) 0
            list-style none
            display inline-block
            width 25%
            float left
            img 
                width 60%
                display block
                margin 0 auto
</style>