<template>
    <div>
        <yb-content-main :style="{display: viewType == 'main' ? 'block' : 'none'}">
            <yb-header slot="header" :left-options="{backText: '', preventGoBack: false}">
                客户服务
            </yb-header>
            <div class="custom-service" slot="main">
                <div class="form" v-if="type==2">
                    <h4>开不了锁</h4>
                    <group class="bike-info">
                        <div class="click-to-scan">
                            <img src='../assets/drawable-xxhdpi/report_violation_img.png' />
                        </div>
                        <div class="input-wrap" @click.prevent="handleClickScanBtn">
                            <input class="input-bike-id" v-model="bike_id" placeholder="扫描二维码或手动输入编码" />
                        </div>
                    </group>
                    
                    <div class="desc">
                        <p class="title">1. 观察车锁是否亮灯</p>
                        <p>如果车锁蓝灯亮起, 代表这辆车已经被预约, 请换其他单车使用.</p>

                        <p class="title">2. App提示我在休息, 请换其他单车</p>
                        <p>当前提示下, 该辆单车可能处于故障中, 正在等待维修人员前往维修. 请换其他单车使用.</p>

                        <p class="title">3. App提示请确认您在车旁并再次尝试开锁或提示超时</p>
                        <p>多次尝试开锁仍开锁失败, 请描述现象并提交, 单车会因你的关怀越变越好.</p>
                    </div>

                    <group>
                        <x-textarea show-counter :max="140" class="note" v-model="note" placeholder="问题补充描述"></x-textarea>
                    </group>
                    <group>
                        <x-button :type="disabled? 'default' : 'primary'" @click.native="handleSubmit()" :disabled="disabled">
                            提交
                        </x-button>
                    </group>
                </div>

                <div class="form" v-if="type==3">
                    <h4>发现车辆故障</h4>
                    <group class="bike-info">
                        <div class="click-to-scan">
                            <img src='../assets/drawable-xxhdpi/report_violation_img.png' />
                        </div>
                        <div class="input-wrap" @click.prevent="handleClickScanBtn">
                            <input class="input-bike-id" v-model="bike_id" placeholder="扫描二维码或手动输入编码" />
                        </div>
                    </group>

                    <div class="info-check-list">
                        <div v-for="(item, index) in infoMembers" :key="item" class="info-check-list-item">
                            <input v-model="item.checked" @change="checkInfo" :id="'cb-' + index" :value="item.desc" type="checkbox" />
                            <label :for="'cb-' + index">
                                {{item.desc}}
                            </label>
                        </div>
                    </div>

                    <group>
                        <yb-uploader v-model="imgFile">
                            <div class="upload-tips" slot="tips">请拍摄违规停车照片<br />含周围环境</div>
                        </yb-uploader>
                    </group>


                    <group>
                        <x-textarea show-counter :max="140" class="note" v-model="note" placeholder="备注"></x-textarea>
                    </group>

                    <group>
                        <x-button :type="disabled? 'default' : 'primary'" @click.native="handleSubmit()" :disabled="disabled">
                            提交
                        </x-button>
                    </group>
                </div>

                <div class="form" v-if="type==4">
                    <h4>举报违停, 加信用分</h4>
                    
                    <group class="bike-info">
                        <div class="click-to-scan">
                            <img src='../assets/drawable-xxhdpi/report_violation_img.png' />
                        </div>
                        <div class="input-wrap" @click.prevent="handleClickScanBtn">
                            <input class="input-bike-id" v-model="bike_id" placeholder="扫描二维码或手动输入编码" />
                        </div>
                    </group>

                    <group>
                        <yb-uploader v-model="imgFile">
                            <div class="upload-tips" slot="tips">请拍摄违规停车照片<br />含周围环境</div>
                        </yb-uploader>
                    </group>
                    
                    <group>
                        <x-textarea class="note" v-model="note" placeholder="备注"></x-textarea>
                    </group>

                    <group>
                        <x-button :type="disabled? 'default' : 'primary'" @click.native="handleSubmit()" :disabled="disabled">
                            提交
                        </x-button>
                    </group>
                </div>

                <div class="form" v-if="type==5">
                    <h4>关锁很久了, 计费没有结束</h4>
                    
                    <div class="desc">
                        <p class="title">单车编号: {{ bike_id }}</p>
                        <p>第一步, 确定锁环已扣紧, 无法反向拉开.</p>
                        <p>第二步, 完全关掉App, 再次启动, 如计费自动结束, 可继续使用单车.</p>
                        <p>第三步, 重启后依在计费, 拍摄已关锁的锁环照片, 并发送给我们等待人工处理.</p>
                        <p class="important-tips">提醒: 提交后您的账户会被暂时冻结</p>
                    </div>

                    <group>
                        <yb-uploader v-model="imgFile">
                            <div class="upload-tips" slot="tips">如果您已经离开单车则不必上传照片</div>
                        </yb-uploader>
                    </group>
                    
                    <group>
                        <x-textarea show-counter :max="140" class="note" v-model="note" placeholder="备注"></x-textarea>
                    </group>

                    <group>
                        <x-button :type="disabled? 'default' : 'primary'" @click.native="handleSubmit()" :disabled="disabled">
                            提交
                        </x-button>
                    </group>
                </div>

                <div class="form" v-if="type==30">
                    <h4>其它</h4>
                    
                    <group>
                        <p>请描述你的问题</p>
                        <x-textarea class="note" v-model="note" placeholder="备注"></x-textarea>
                    </group>
                
                    <group>
                        <yb-uploader v-model="imgFile"></yb-uploader>
                    </group>

                    <group>
                        <x-button :type="disabled? 'default' : 'primary'" @click.native="handleSubmit()" :disabled="disabled">
                            提交
                        </x-button>
                    </group>
                </div>

                <div>
                    <loading v-model="submiting" text="提交中..."></loading>
                </div>
            </div>
        </yb-content-main>
        <input-bike-id title="输入单车编号" :style="{display: viewType == 'input' ? 'block' : 'none'}" @back="viewType='main'" @submit="inputBikeId"></input-bike-id>
    </div>
</template>

<script>
import InputBikeId from './InputBikeId';
    export default {
        components: {
            'input-bike-id': InputBikeId
        },
        data() {
            return {
                viewType: 'main',
                submiting: false,
                mode: '',// select_journey
                type: '',
                bike_id: '',
                journey_id: '',
                info: [],
                infoMembers: [
                    {
                        checked: false,
                        desc: '车太重,骑不动'
                    },{
                        checked: false,
                        desc: '二维码脱落'
                    },{
                        checked: false,
                        desc: '把套歪了'
                    },{
                        checked: false,
                        desc: '车铃丢了'
                    },{
                        checked: false,
                        desc: '踏板坏了'
                    },{
                        checked: false,
                        desc: '龙头歪斜'
                    },{
                        checked: false,
                        desc: '刹车失灵'
                    }, {
                        checked: false,
                        desc: '其他'
                    }
                ],
                img: '',
                imgFile: '',
                imgFileFieldName: 'file',
                note: '',
                journeyList:[],
                pullupConfig: {
                    content: '上拉加载更多',
                    downContent: '松开进行加载',
                    upContent: '上拉加载更多',
                    loadingContent: '加载中...'
                }
            }
        },
        computed: {
            disabled() {
                let isDisabled = true;
                if(this.type == 3) {
                    isDisabled = !(this.bike_id && this.info.length);
                } else if (this.type == 30) {
                    isDisabled = !this.note;
                } else {
                    isDisabled = !this.bike_id;
                }
                return isDisabled;
            }
        },
        methods: {
            handleClickScanBtn() {
                if (USER.token) {
                    if (IS_WECHAT) {
                        this.handleScanCode();
                    } else {
                        this.viewType = 'input';
                    }
                } else {
                    this.$router.push({
                        path: '/login'
                    });
                }
            },
            handleScanCode() {
                window.WECHAT_READY.then(() => {
                    wx.scanQRCode({
                        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                        success: (res) => {
                            if (res.errMsg == 'scanQRCode:ok') {
                                this.inputBikeId(res.resultStr);
                            }
                        }
                    });
                });
            },
            parseBikeId(bikeId) {
                const match = bikeId.match(/id=(\d+)/);
                if (match) {
                    bikeId = match[1];
                }
                return bikeId;
            },
            inputBikeId(bikeId) {
                this.bike_id= this.parseBikeId(bikeId);
                this.viewType = 'main';
            },
            checkInfo() {
                const info = [];
                this.infoMembers.forEach(function(item) {
                    if (item.checked) {
                        info.push(item.desc);
                    }
                });
                this.info = info;
            },
            // pass in a file
            // pass out a file or blobdata
            compressFile(file) {
                return new Promise((resolve, reject) => {
                    const fileSize = file.size;
                    const size1M = 1024 * 1024;
                    if (fileSize > size1M) {
                        const url = window.URL.createObjectURL(file);
                        const rate = size1M/fileSize;
                        const tmpImg = new Image();
                        tmpImg.onload = () => {
                            const cvn = document.createElement('canvas');
                            const ctx = cvn.getContext('2d');
                            const naturalWidth = tmpImg.naturalWidth;
                            const naturalHeight = tmpImg.naturalHeight;
                            let width, height;
                            if (naturalWidth > naturalHeight) {
                                width = naturalWidth * rate;
                                height = width/naturalWidth * naturalHeight;
                            } else{
                                height = naturalHeight * rate;
                                width = height/naturalHeight * naturalWidth;
                            }
                            cvn.width = width;
                            cvn.height = height;
                            ctx.drawImage(tmpImg, 0, 0, naturalWidth, naturalHeight, 0, 0, width, height);
                            cvn.toBlob((blobData) => {
                                resolve(blobData);
                                URL.revokeObjectURL(url);
                            });
                        }
                        tmpImg.src = url;
                    } else {
                        resolve(file);
                    }
                });
            },
            uploadIfNeeded() {
                return new Promise((resolve, reject) => {
                    if (this.imgFile) {
                        this.compressFile(this.imgFile).then((file) => {
                            const formData = new FormData();
                            formData.append(this.imgFileFieldName, file);
                            this.$http.post(`${UPLOAD_URL}`, formData).then((result) => {
                                this.img = result.data.path;
                                resolve();
                            }).catch((error) => {
                                reject(error);
                            });
                        });
                    } else {
                        resolve()
                    }
                });
            },
            handleSubmit() {
                this.submiting = true;
                this.uploadIfNeeded().then(() => {
                    const data  = {
                        type: this.type,
                        info: this.info.join(','),
                        img: this.img,
                        note: this.note
                    }

                    if(this.bike_id) {
                        data.bike_id = this.bike_id;
                    }
                    if (this.journey_id) {
                        this.journey_id = this.journey_id;
                    }

                    this.$http({
                        method: 'post',
                        url: `${BASE_URL}/user_api/customer_service`,
                        data: data
                    }).then((result) => {
                        this.submiting = false;
                        this.$vux.toast.show({
                            text: '提交成功'
                        });
                        this.$router.replace({
                            path: '/'
                        });
                    }).catch((e) => {
                        this.submiting = false;
                        this.$vux.toast.show({
                            type: 'warn',
                            text: e.response.data.msg || '提交失败, 请重试'
                        });
                    });
                }).catch((error) => {
                    console.log(error);
                    this.submiting = false;
                    this.$vux.toast.show({
                        text: '提交失败, 请重试'
                    });
                })
            }
        },
        created() {
            this.type = this.$route.query.type || '';
            this.bike_id = this.$route.query.bike_id || '';
            this.journey_id = this.$route.query.journey_id || '';
        }
    }
</script>

<style lang="stylus">
@import "../assets/funcs.styl"
.custom-service
    .weui-cells
        margin-top $height(50)
    .weui-cells:before,
    .weui-cells:after
        display none
    .weui-uploader__bd
        height $height(390)
        padding $height(10) 0
    .weui-uploader__input-box
        width $width(360)
        height $height(360)

.custom-service
    .note 
        textarea
            background #f5f5f5
</style>

<style lang="stylus" scoped>
@import "../assets/funcs.styl"

.custom-service
    position absolute
    background #fff
    height 100%
    width 100%

.form 
    padding $height(30) $width(30)
    h4
        font-size $toRem(16)
        padding 0
        margin $height(30) 0

.note 
    font-size $toRem(16)
    background #f5f5f5
    padding $height(20) $width(40)

.bike-info
    position relative
    width 100%
    .click-to-scan
        position absolute
        z-index 1
        top $height(20)
        left $width(40)
        height $height(160)
        width $width(160)
        img 
            width 100%
    .input-wrap
        background #f5f5f5
        padding $height(20) $width(40)
        width 100%
        height $height(200)
        background #f5f5f5
        box-sizing border-box
    input
        height 100%
        width 100%
        background transparent
        font-size $toRem(16)
        display block
        border none
        text-indent $width(200)
    input:focus
        outline none

.info-check-list-item
    display inline-block
    width $width(600)
    margin $height(50) 0
    input[type="checkbox"] {
      display: none;
    }
    label {
      cursor: pointer;
    }
    input[type="checkbox"] + label:before {
      border 1px solid #d9d9d9
      content "\00a0";
      display inline-block
      height $height(80)
      width $width(80)
      margin 0 $width(50) 0 0
      padding 0
      vertical-align top
    }
    input[type="checkbox"]:checked + label:before {
      background #4cc2ff
      color #fff
      content "\2713"
      text-align center
      border-color #4cc2ff
    }
    input[type="checkbox"]:checked + label:after {
      font-weight: bold;
    }

.upload-tips
    margin $height(200) 0 0 $width(400)
    font-size $toRem(14)
    color #d9d9d9
    
.desc
    p 
        margin $height(50) 0
    .title
        font-weight bold
    .important-tips
        color #4cc2ff

</style>