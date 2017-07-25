<template>
    <yb-content-main>
        <yb-header slot="header" :left-options="{backText: '', preventGoBack: false}">
            我的消息
        </yb-header>
        <div class="message-list" slot="main">
            <ul>
                <li v-for="(item, index) in items" :key="index">
                    <a :href="item.content">
                        <div class="card">
                            <p class="time">{{ item.begin_at | time-format }}</p>
                            <div class="head"><img :src="item.cover" /></div>
                            <div class="body">
                                <p class="title"> {{ item.title }} </p>
                                <p v-html="parseIntro(item.brief_intro)"></p>
                            </div>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    </yb-content-main>

</template>
<script type="text/javascript">
export default {
    data() {
        return {
            items: []
        }
    },
    methods: {
        parseIntro(content) {
            if (content) {
                return content.replace("\n", "<br/>");
            }
        }
    },
    mounted() {
        if (USER.token) {
            this.$http({
                url: `${BASE_URL}/lock-account/advertise_event`,
                params: {
                    page_num: 1,
                    row_per_page: 10000
                }
            }).then((result) => {
                const data = result.data;
                if (data.status === 0) {
                    this.items = data.data;
                }
            });
        }
    }
}
</script>
<style lang="stylus" scoped>
@import "../assets/funcs.styl"
.message-list
    position absolute
    width 100%
    height 100%
    background #ececec
ul 
    padding 0 $width(50) $height(100) $width(50)
    list-style none
.card
    .time 
        color #9a9a9a
        text-align center
        font-size $toRem(12)
        height $height(140)
        line-height $height(140)
    .head
        line-height 0
        img
            width 100%
    .body 
        color #9d9d9d
        width 100%
        padding $height(60) $width(40)
        box-sizing border-box
        text-align left
        background #fff
        .title
            color #2d2d2d
            height $height(160)
            line-height $height(160)
            font-size $toRem(14)
            font-weight bold
            
            
</style>