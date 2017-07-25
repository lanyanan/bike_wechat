<template>
    <yb-content-main>
        <yb-header style="z-index: 100" slot="header" :left-options="{backText: '', preventGoBack: false}">
            {{mode == 'list' ? '我的行程' : '行程详情'}}
        </yb-header>
        <div slot="main" class="journey-list">
            <div :style="{display: mode == 'list' ? 'block' : 'none'}">
                <div :style="{display: items !== undefined ? 'block' : 'none'}">
                    <scroller lock-x scrollbar-y use-pullup :pullup-config="pullupConfig" height='-40' ref="scrollerHistory" @on-pullup-loading="pullupLoad">
                        <div>
                            <timeline>
                                <timeline-item style="display:none;"></timeline-item>
                                <timeline-item class="journey-list-item" v-for="(item, index) in items" :key="index" is-link>
                                    <a href="#" @click.prevent="showDetail(index)">
                                        <p class="time">{{ calcTime(index) }}</p>
                                        <p class="bike">自行车编号: {{item.bike_id}} </p>
                                        <img src="../assets/drawable-xxhdpi/riding_time_icon.png" />
                                        <span class="info">骑行时间: {{(item.duration / 60).toFixed(0)}} 分钟</span>
                                        <img src="../assets/drawable-xxhdpi/riding_money_icon.png" />
                                        <span class="info">骑行花费: {{(item.cost / 100).toFixed(1)}} 元</span> 
                                    </a>
                                </timeline-item>
                            </timeline>
                        </div>
                    </scroller>
                </div>
                <div :style="{'text-align': 'center', display: items === undefined ? 'block': 'none'}">
                    加载中...
                </div>
            </div>
            <div v-if="mode != 'list'" class="journey-detail">
                <div class="map">
                    <baidu-map
                        ref="map"
                        :center="bdMap.center"
                        :zoom="16"
                        :scroll-wheel-zoom="true"
                        :mapClick="false"
                        @ready="baiduMapReady"
                        v-bind:style="{width: bdMap.size.width, height: bdMap.size.height}"
                        >
                        <bm-polyline :path="path" stroke-color="blue" :stroke-opacity="1" :stroke-weight="2" :editing="false"></bm-polyline>
                    </baidu-map>
                </div>
                <div class="info">
                    <div class="distance-info">
                            <img src="../assets/drawable-xxhdpi/finish_ride_cost_bg.png" />
                            <span class="val">{{distance | to-kilo}}</span>
                            <span class="label">骑行距离(km)</span>
                        </div>
                    </div>
                    <divider>自行车编号: {{currentJourney.bike_id}}</divider>
                    <flexbox :gutter="0">
                        <flexbox-item>
                            <div class="user-data">
                                <div class="value">
                                    <img src="../assets/drawable-xxhdpi/riding_time_icon.png"/>
                                    {{ currentJourney.duration | second-to-minute }}
                                </div>
                                <div class="desc">骑行时间(分钟)</div>
                            </div>
                        </flexbox-item>
                        <flexbox-item>
                            <div class="user-data" style="border-left: 1px solid #efefef; border-right: 1px solid #efefef">
                                <div class="value">
                                    <img src="../assets/drawable-xxhdpi/riding_carbon_icon.png"/>
                                    {{currentJourney.carbon}}
                                </div>
                                <div class="desc">节约碳排量(克)</div>
                            </div>
                        </flexbox-item>
                        <flexbox-item>
                            <div class="user-data">
                                <div class="value">
                                    <img src="../assets/drawable-xxhdpi/riding_calorie_icon.png"/>
                                    {{currentJourney.cal | to-kilo}}
                                </div>
                                <div class="desc">卡路里(大卡)</div>
                            </div>
                        </flexbox-item>
                    </flexbox>
                </div>
            </div>
        </div>
    </yb-content-main>
</template>

<script type="text/javascript">
    import { dateFormat } from 'vux';
    export default {
        data() {
            return {
                bdMap: {
                    center: {
                        lat: 22.542955,
                        lng: 114.059688
                    },
                    size: {
                        width: '100%',
                        height: '100%'
                    }
                },
                mode: 'list',
                items: undefined,
                currentJourney:{},
                currentJourneyTrack: [],
                phone: null,
                distance: null,
                avatar: undefined,
                defaultAvatar: require('../assets/drawable-xxhdpi/avatar_default_login.png'),
                pullupConfig: {
                    content: '上拉加载更多',
                    downContent: '松开进行加载',
                    upContent: '上拉加载更多',
                    loadingContent: '加载中...'
                },
                curPos: 1
            }
        },
        computed: {
            path() {
                const track = this.currentJourneyTrack || [];
                const path = track.map((item) =>{
                    return {lat: item.lat, lng: item.lng}
                });
                if (path.length >0) {
                        this.bdMap.center = path[Math.floor(path.length/2)];
                }
                return path;
            }
        },
        methods: {
            showDetail(index) {
                this.mode = 'detail';
                this.currentJourney = this.items[index];
                this.currentJourneyTrack = this.currentJourney.track;
                const { phone } = window.USER;
                this.phone = phone.substr(0, 3) + '****' + phone.substr(7);

                this.dist = this.currentJourney.dist;
            },
            baiduMapReady({BMap, map}) {
                this.BMap = BMap;
                this.map = map;
            },
            calcTime(index) {
                var date = new Date(this.items[index].start * 1000);
                return dateFormat(date, 'YYYY-MM-DD HH:mm')
            },
            pullupLoad () {
                this.getHistory();
            },
            getHistory() {
                this.$http({
                    url: `${BASE_URL}/lock-stat/user_history_ride?start=${this.curPos}&limit=10`
                }).then((result) => {
                    this.$refs.scrollerHistory.donePullup();
                    const data = result.data;
                    if (data.status == 0) {
                        const len = result.data.history.length;
                        const items = this.items || [];
                        this.items = items.concat(result.data.history);
                        this.curPos += len;
                        if (len < 10) {
                            this.$refs.scrollerHistory.disablePullup();
                        }
                        this.$nextTick(() => {
                            this.$refs.scrollerHistory.reset();
                        })
                    }
                }).catch(function(e) {
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
            this.getHistory();
            this.avatar = window.USER.avatar;
        }
    }
</script>

<style lang="stylus">
@import "../assets/funcs.styl"
.journey-list
    .vux-timeline-item-head
        top 0
    .vux-timeline-item-content
        padding 0 0 $height(120) $width(100)
</style>
<style lang="stylus" scoped>
@import "../assets/funcs.styl"
.journey-list-item 
    font-size $toRem(14)
    a
        color #ccc
        .time 
            height $height(50)
            line-height $height(50)
            margin-bottom $height(50)
            color #000
        .bike,
        .info
            line-height $height(120)
        img
            height $height(60)
            width $width(60)
.journey-detail
    .info
        position relative
        text-align center
        padding $height(30) 0
        background #fff
        .avatar
            position absolute
            left 50%
            top $height(-120)
            z-index 999
            margin-left $width(-90)
            width $width(180)
            border-radius 50%
        .phone
            color #000
            font-size $toRem(14)
            height $height(150)
            line-height $height(150)
.user-data
    padding $height(60) 0 $height(30) 0
    text-align center
    background #fff
    .value
        height $height(100)
        line-height $height(100)
        font-size $toRem(20)
        img
            height $height(60)
            width $width(60)
    .desc
        color #ccc
        line-height $height(120)
        font-size $toRem(12)


.distance-info
    position relative
    margin 0 auto
    height $height(600)
    width $width(600)
    color #fff
    .val
        font-size $toRem(40)
        height $height(100)
        line-height $height(100)
        top 50%
        margin-top $height(-90)
        color #fff
    .label
        font-size $toRem(12)
        bottom $height(120)
    span
        position absolute
        width 100%
        display block
        text-align center
    img 
        width 100%
        
    .outer-circle
        position absolute
        left $width(10)
        width $width(580)
        height $height(580)
        border $width(40) solid #4cc2ff
        border-radius 50%
        box-sizing border-box

    .inner-circle
        position absolute
        left $width(-10)
        top $height(-10)
        width $width(520)
        height $height(520)
        border $width(20) solid #b7def3
        border-radius 50%
        box-sizing border-box

.map
    width 100%
    height $height(300)
    min-height 200px
</style>