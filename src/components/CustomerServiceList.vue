<template>
    <yb-content-main>
        <yb-header slot="header" :left-options="{backText: '', preventGoBack: false}">
            客户服务
        </yb-header>
        <div slot="main">
            <div :style="{display: items !== undefined ? 'block' : 'none'}">
                <scroller lock-x scrollbar-y use-pullup :pullup-config="pullupConfig" height='-40' ref="scroller"  @on-pullup-loading="fetchData">
                    <div>
                        <div v-for="(item, index) in items" class="item">
                            <div class="inner-cell">
                                {{ item.create_at | time-format}}
                            </div class="inner-cell">
                            <div class="inner-cell">类型: {{['', '行程问题', '开不了锁', '发现单车故障', '举报违停', '退押金', '其他问题'][item.type]}}
                            </div class="inner-cell">
                            <div class="inner-cell">
                                备注: {{ item.note || ''}}
                            </div class="inner-cell">
                            <div class="inner-cell">
                                状态: {{['待处理', '处理中', '已完成'][item.status]}}
                            </div class="inner-cell">
                        </div>
                    </div>
                </scroller>
            </div>
            <div :style="{'text-align': 'center', display: items === undefined ? 'block': 'none'}">
                加载中...
            </div>
        </div>
    </yb-content-main>
</template>

<script type="text/javascript">
    export default {
        data() {
            return {
                items: undefined,
                page: 0,
                pullupConfig: {
                    content: '上拉加载更多',
                    downContent: '松开进行加载',
                    upContent: '上拉加载更多',
                    loadingContent: '加载中...'
                }
            }
        },
        methods: {
            fetchData() {
                this.page++;
                this.$http({
                    url: `${BASE_URL}/user_api/customer_service`,
                    query: {
                        page: this.page
                    }
                }).then(function(result) {
                    this.$refs.scroller.donePullup();
                    const {items, pagination}= result.data;
                    if (pagination.rows.end < pagination.rows.total) {
                        this.$refs.scroller.enablePullup();
                    } else {
                        this.$refs.scroller.disablePullup();
                    }
                    if (this.items) {
                        this.items = this.items.concat(items);
                    } else {
                        this.items = items;
                    }
                    this.$nextTick(() => {
                        this.$refs.scroller.reset();
                    });
                }.bind(this));
            }
        },
        created() {
            this.fetchData();
        },
    }
</script>

<style lang="stylus" scoped>
@import "../assets/funcs.styl"
.item 
    border-bottom 1px solid #eee
    padding $height(20) 0
    height $height(210)
    background #fff
.inner-cell
    font-size $toRem(12)
    height $height(100)
    padding 0
    margin 0
    text-indent $width(40)
    float left
    width 50%
    box-sizing border-box
</style>