<template>
    <div>
        <yb-content-main :style="{display: viewType == 'map' ? 'block' : 'none'}">
            <yb-header slot="header" :left-options="{showBack: false}">
                <router-link class="to-ucenter" slot="left" to="/ucenter">
                    <img src="../assets/drawable-xxhdpi/icon_actionbar_home_normal.png" />
                </router-link>
                {{ title }}
            </yb-header>
            <div slot="main">
                <div class="wrap">
<!--                     <tab class="select-bike-type">
                        <tab-item active-class="selected" selected><span>全部</span></tab-item>
                        <tab-item active-class="selected" ><span>1G</span></tab-item>
                        <tab-item active-class="selected"><span>2G</span></tab-item>
                    </tab> -->
                    <a @click.prevent="getCurrentCenterBike()" class="refresh">
                        <img src="../assets/drawable-xxhdpi/map_refresh_bg.png" />
                        <img :class="{arrow: true, rotating: fetchingNearbyBike}" src='../assets/drawable-xxhdpi/x.png' />
                    </a>
                    <!--
                    <div class="center">
                        <img src="../assets/drawable-xxhdpi/search_location_icon.png" />
                    </div>
                    -->
                    <a @click.prevent="doGeoLocate({showLocating: false, showTips: true})" class="do-locate">
                        <img src="../assets/drawable-xxhdpi/my_location.png" />
                    </a>
                    <a v-if="hasGeoPermission" @click.prevent="handleClickScanBtn" class="scan-to-unlock" :style="{display:showRideInfo ? 'none' : 'block'}">
                        <img src="../assets/drawable-xxhdpi/qrcode_icon.png" />
                    </a>
                    <a @click.prevent="showCSModal=!showCSModal" class="customer-service">
                        <img src="../assets/drawable-xxhdpi/service_menu_btn_normal.png" />
                    </a>
                    <div class="map">
                        <baidu-map
                            ref="map"
                            :center="bdMap.center"
                            :zoom="bdMap.zoom"
                            :scroll-wheel-zoom="true"
                            @click="handleClickMap"
                            @ready="baiduMapReady"
                            @dragstart="handleDragingMap"
                            @dragging="handleDragingMap"
                            @dragend="handleDragingMap"
                            v-bind:style="{width: bdMap.size.width, height: bdMap.size.height}"
                            >
                            <bm-marker v-for="(item, index) in items" :key="index" :position="{lat: item.lat,lng: item.long}" :offset="bikeIcon.offset" @click="getWalkingPlan({bikeId: item.bike_id, lat: item.lat, lng: item.long})" :dragging="false" :icon="bikeIcon"></bm-marker>

                        </baidu-map>
                    </div>
                </div>
            </div>
        </yb-content-main>


        <confirm @on-cancel="initLocation" @on-confirm="initLocation" v-model="showGeoTips" title="获取位置信息失败" cancel-text="">
            <p style="text-align:center;">您需要打开位置信息, 并允许微信获取位置信息</p>
        </confirm>

        <input-bike-id :style="{display: viewType == 'input' ? 'block' : 'none'}" @back="viewType='map'" title='输入编号开锁' @submit="handleUnLock"></input-bike-id>

        <unlocking :style="{display: viewType == 'unlocking' ? 'block' : 'none'}" @timesup="handleUnLockEnd('开锁失败, 超时')" @count="handleUnLockCount" :time="unlockTimeoutTime"></unlocking>

        <div class="cs-popup" v-transfer-dom>
            <popup v-model="showCSModal" style="background: #fff">
                <div class="cs-title"> 客户服务</div>
                <div class="cs-cell">
                    <router-link to="/customer_service?type=2">
                        <img src="../assets/drawable-xxhdpi/icon_unlock_failed.png" />
                        <div>开不了锁</div>
                    </router-link>
                </div>
                <div class="cs-cell">
                    <router-link to="/customer_service?type=3">
                        <img src="../assets/drawable-xxhdpi/icon_bike_broken.png" />
                        <div>发现车辆故障</div>
                    </router-link>
                </div>
                <div class="cs-cell">
                    <router-link to="/customer_service?type=4">
                        <img src="../assets/drawable-xxhdpi/icon_report_illegal_parking.png" />
                        <div>举报违停</div>
                    </router-link>
                </div>
                <div class="cs-cell">
                    <router-link to="/customer_service_other_issue">
                        <img src="../assets/drawable-xxhdpi/icon_others_question.png" />
                        <div>其他问题</div>
                    </router-link>
                </div>
            </popup>
        </div>

        <div v-transfer-dom>
            <popup v-model="showScanModal">
                <group title="" class="weui-cells_form">
                    <x-input keyboard="number" title="锁编号" placeholder="请输入锁编号" class="weui-vcode" v-model="session.lockUid"></x-input>
                </group>
                <div style="padding:15px;">
                    <x-button type="primary" @click.native="handleUnLock()">开锁</x-button>
                </div>
            </popup>
        </div>

        <div class="walking-plan-popup" :style="{display: plan.show ? 'block' : 'none'}">
            <div class="title">
                <img src="../assets/drawable-xxhdpi/bike_info_board_location.png" />{{ plan.address }}
            </div>
            <div class="bike">
                <img src="../assets/drawable-xxhdpi/bike_code_icon.png" /> 单车编号: {{ plan.bikeId}}
            </div>
            <div class="info">
                <div class="info-cell">
                    <div><span>1</span>辆</div>
                    <div>可用自行车</div>
                </div>
                <div class="info-cell">
                    <div><span>{{ plan.distance }}</span>米</div>
                    <div>距离起始位置</div>
                </div>
                <div class="info-cell">
                    <div><span>{{ plan.duration }}</span>分钟</div>
                    <div>步行可到达</div>
                </div>
            </div>
        </div>

        <div class="ride-info-popup" :style="{display: showRideInfo ? 'block' : 'none'}">
                <div class="title">
                    <span class="tips">
                        <img src="../assets/drawable-xxhdpi/lock_icon.png" />合上车锁即可完成还车
                    </span>
                    <router-link :to="'/customer_service?type=5&bike_id=' + session.lockUid">关锁不能结束计费?</router-link>
                </div>
                <div class="bike-info"><label>单车编号:</label> {{ session.lockUid }}</div>
                <flexbox class="ride-info-row" :gutter="0" style="border:none">
                    <flexbox-item class="ride-info-cell">
                        <span class="label"><img src="../assets/drawable-xxhdpi/riding_mileage_icon.png" />里程</span>
                        <span>{{ session.distance | proper-unit('m', 'km')}}</span>
                    </flexbox-item>
                    <flexbox-item class="ride-info-cell">
                        <span class="label"><img src="../assets/drawable-xxhdpi/riding_calorie_icon.png" />卡路里</span>
                        <span>{{ session.cal | to-kilo }} 大卡</span>
                    </flexbox-item>
                </flexbox>
                <flexbox class="ride-info-row" :gutter="0">
                    <flexbox-item class="ride-info-cell">
                        <span class="label"><img src="../assets/drawable-xxhdpi/riding_time_icon.png" />骑行时间</span>
                        <span>{{ session.duration | second-to-minute }}分钟</span>
                    </flexbox-item>
                    <flexbox-item class="ride-info-cell">
                        <span class="label"><img src="../assets/drawable-xxhdpi/riding_money_icon.png" />预计费用</span>
                        <span>{{ session.spend | cent-to-yuan }}元</span>
                    </flexbox-item>
                </flexbox>
        </div>

        <div>
            <loading v-model="locating" text="正在获取位置信息..."></loading>
        </div>

        <x-dialog v-if="advertisement" v-model="showAdv" :hide-on-blur="true" class="adv-dialog">
            <div class="img-box">
                <a :href="advertisement.content">
                  <img :src="advertisement.cover" style="width:100%">
                </a>
            </div>
            <div class="adv-content">
                <h5>{{ advertisement.title }}</h5>
                <p v-html="parseAdvContent(advertisement.brief_intro)"></p>
            </div>
            <div class="adv-close-wrap" @click="showAdv=false">
              <span class="close"></span>
            </div>
        </x-dialog>

    </div>
</template>

<script>


import { TransferDom } from 'vux';
import InputBikeId from './InputBikeId';
import Unlocking from './Unlocking'
export default {
    components: {
        'input-bike-id': InputBikeId,
        'unlocking': Unlocking
    },
    directives: {
        TransferDom
    },
    data() {
        return {
            title: APP_CONFIG.title,
            locating: false,
            showGeoTips: false,
            hasGeoPermission: false,
            ready: undefined,
            viewType: 'map',// map | input | scan | unlocking
            bdMap: {
                size: {
                    width: '100%',
                    height: '100%'
                },
                zoom: 18,
                center: {
                    lat: 22.542955,
                    lng: 114.059688
                },
                centerIcon: null
            },
            plan:{
                show: false,
                address: '',
                distance: 0,
                duration: 0
            },
            selectPositionIcon: {
                url: require('../assets/drawable-xxhdpi/search_location_icon.png'),
                size: {width: 23, height: 40},
                anchor: {width: 12, height: 37}
            },
            currentPositionIcon: {
                url: require('../assets/drawable-xxhdpi/news_content_background.png'),
                size: {width: 10, height: 10},
                anchor: {width: 0, height: 0}
            },
            bikeIcon: {
                url: require('../assets/drawable-xxhdpi/bike_location_icon_small.png'),
                size: {width: 44, height: 46},
                offset: {width: 0, height: -23}
            },
            advertisement: undefined,
            items: [
            ],
            // lockUid: '766123456',
            showCSModal: false,
            showScanModal: false,
            showRideInfo: false,
            showAdv: true,
            fetchingNearbyBike: false,

            session: {
                lockUid: '',
                distance: 0,
                speed: 0,
                heat: 0,
                carbon: 0,
                duration: 0,
                spend: 0,
                sessionId: '',
                lastTrack: {
                    id: 0,
                    lat: null,
                    lng: null
                }
            },
            loopInterval: 0,
            config: {
                unlockTimeout: undefined
            },
            unlockTimeoutTime: undefined
        }
    },
    methods: {
        parseAdvContent(content) {
            if (content) {
                return content.replace("\n", "<br/>");
            }
        },
        initLocation() {
            setTimeout(() => {
                this.ready.then(() => {
                    if (!this.hasGeoPermission) {
                        this.doGeoLocate({showLocating: true, showTips: true});
                    }
                });
            }, 3000);
        },
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
        parseLockUid(lockUid) {
            const match = lockUid.match(/id=(\d+)/);
            if (match) {
                lockUid = match[1];
            }
            return lockUid;
        },
        /**
         * @Author    lan
         * @DateTime  2017-07-21
         * @函数描述   添加一个启动扫秒的函数
         */
        startWXDeviceLib(lockUid) {
            window.device_id = '';
            if(lockUid == '7880123456'){
                window.device_id = 'BFBB1CD0YBBLE';
            }else if(lockUid == '6880123456'){
                window.device_id = '11aaccdd';
            }
        },
        handleUnLock(lockUid) {
            this.viewType = 'map';
            const position = this.bdMap.currentPositionMarker.getPosition();
            var topic = ',ybl/' + this.parseLockUid(lockUid);
            var token = USER.token;
            var obj = {
                u: token,
                // UNLOCK_REQUEST
                a: 0,
                lng: position.lng,
                lat: position.lat
            }
            var msg = JSON.stringify(obj);
            //alert(msg)
            setTimeout(function(){
                yunba._publish({
                    topic: topic,
                    msg: msg,
                    qos: 1
                }, (err) => {
                   // alert(err)
                    if (err) {
                        this.$vux.toast.show({
                            type: 'warn',
                            text: err
                        });
                }
                });
            }, 2000)
            
            this.countStart();
        },
        handleUnLockCount(leftTime) {
            leftTime = Math.floor(leftTime/1000);
            if ((leftTime-2)%5 == 0) {
                console.log('getsession');
                this.getCurrentSession();
            }
        },
        countStart() {
            // unlockTimeout 可能获取失败 ? 现在默认 60s
            const timeout = this.config.unlockTimeout || 60;
            this.viewType = 'unlocking';
            this.unlockTimeoutTime = Date.now() + timeout * 1000;
        },
        countEnd() {
            this.viewType = 'map';
            this.unlockTimeoutTime = -1;
        },
        handleUnLockEnd(err) {
            this.countEnd();
            if (err) {
                this.$vux.toast.show({
                    type: 'warn',
                    text: err
                });
            }
        },

        postTrack() {
            return new Promise(function(resolve, reject) {
                this.getCurrentPosition().then(function({lng, lat}){
                    this.bdMap.currentPositionMarker.setPosition(new this.BMap.Point(lng, lat));
                    const {lastTrack, sessionId} = this.session;
                    const {id, lng: lastLng, lat: lastLat} = lastTrack;
                    let distance = parseInt(this.session.distance);
                    if (lastLng && lastLat) {
                        distance += this.getDistance(lat, lng, lastLat, lastLng);
                    }
                    lastTrack.id++;
                    lastTrack.lng = lng;
                    lastTrack.lat = lat;
                    this.session.distance = parseInt(distance);
                    const data = {
                        sid: sessionId,
                        track: [
                            {
                                id: lastTrack.id,
                                lat: lastTrack.lat,
                                long: lastTrack.lng
                            }
                        ],
                        distance: distance
                    }
                    this.$http({
                        method: 'post',
                        url: `${BASE_URL}/lock-stat/stat_track`,
                        data: data
                    });
                }.bind(this));
            }.bind(this));
        },
        // ==========================
        // http://stackoverflow.com/questions/27928
        // /calculate-distance-between-two-latitude-longitude-points-haversine-formula
        getDistance(lat1,lon1,lat2,lon2) {
            const deg2rad = this.deg2rad;
            var R = 6371000; // Radius of the earth in km
            var dLat = deg2rad(lat2-lat1);  // deg2rad below
            var dLon = deg2rad(lon2-lon1); 
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
                Math.sin(dLon/2) * Math.sin(dLon/2)
                ;
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
            var d = R * c; // Distance in km
            return d;
        },
        deg2rad(deg) {
            return deg * (Math.PI/180)
        },
        // ======================
        getCurrentSession() {
            if (USER.token) {
                this.$http({
                    url: `${BASE_URL}/lock-stat/session`
                }).then(function(result) {
                    const { status, session } = result.data;
                    if (status == 0) {
                        const { s, l } = session;
                        this.handleJourneyStart({
                            lockUid: l,
                            sessionId: s
                        });
                    }
                }.bind(this));
            }
        },
        getCurrentCenterBike() {
            const {lng, lat} = this.map.getCenter();
            this.fetchingNearbyBike = true;
            this.getNearbyBike({lat,lng}).then(() => {
                this.fetchingNearbyBike = false;
            }).catch(() => {
                this.fetchingNearbyBike = false;
            })
        },
        handleDragingMap() {
            if (!this.plan.show) {
                this.bdMap.selectPositionMarker.setPosition(this.map.getCenter());
            }
        },
        handleClickMap() {
            this.plan.show = false;
            this.map.setZoom(this.bdMap.zoom);
            this.map.setCenter(this.bdMap.selectPositionMarker.getPosition());
            this.bdMap.walking.clearResults();
        },
        doGeoLocate(options) {
            this.ready.then(() => {
                this.getCurrentPosition(options).then(function({lng, lat}) {
                    const point = new this.BMap.Point(lng, lat);
                    this.bdMap.centerPoint = point;
                    this.bdMap.currentPositionMarker.setPosition(point);
                    this.bdMap.selectPositionMarker.setPosition(point);
                    this.bdMap.centerCircle.setCenter(point);
                    this.map.setZoom(this.bdMap.zoom);
                    this.map.panTo(point);
                    this.getNearbyBike({lat: lat, lng: lng});
                }.bind(this));
            });
        },
        getPositionFromWechat() {
            return new Promise((resolve, reject) => {
                wx.getLocation({
                    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: (res) => {
                        var lat = res.latitude;
                        var lng = res.longitude;
                        resolve({lat, lng});
                    },
                    fail:() => {
                        reject(new Error('获取位置信息失败'));
                    },
                    cancel: () => {
                        reject(new Error('获取位置信息失败'));
                    }
                });
                // setTimeout(() => {
                //     reject(new Error('获取位置信息失败'));
                // }, 1000);
            });
        },
        getCurrentPosition(options) {
            options = options || {showLocating: false, showTips: false};
            return new Promise((resolve, reject) => {
                this.ready.then(() => {
                    if (IS_WECHAT) {
                        if (options.showLocating) {
                            this.locating = true;
                        }
                        this.getPositionFromWechat().then(({lng, lat}) => {
                            
                            this.locating = false;
                            this.hasGeoPermission = true;

                            var point = new this.BMap.Point(lng, lat);
                            var convertor = new this.BMap.Convertor();
                            convertor.translate([point], 1, 5, function(data){
                                 if(data.status === 0) {
                                    resolve({lat: data.points[0].lat, lng: data.points[0].lng});
                                 } else {
                                    reject(new Error('坐标转换失败'));
                                 }
                            });

                        }).catch(() => {
                            this.locating = false;
                            this.hasGeoPermission = false;
                            if (options.showTips) {
                                this.showGeoTips = true;
                            }
                            reject(new Error('获取位置信息失败'));
                        });
                    } else {
                        this.bdMap.geolocation.getCurrentPosition(function(r){
                            if(this.getStatus() == 0){ //BMAP_STATUS_SUCCESS
                                resolve({lat: r.point.lat, lng: r.point.lng});
                            }else {
                                reject(new Error('获取位置信息失败'));
                            }        
                        },{enableHighAccuracy: true})
                    }
                });
            });
        },
        baiduMapReady({BMap, map}) {
            this.BMap = BMap;
            this.map = map;
            var center = new BMap.Point(this.bdMap.lng, this.bdMap.lat);
            
            const centerIconOpt = this.currentPositionIcon;
            const centerIconSize = new BMap.Size(centerIconOpt.size.width, centerIconOpt.size.height);
            const centerIcon = new BMap.Icon(centerIconOpt.url,
                    centerIconSize, {
                        imageSize: centerIconSize
                    })
            this.bdMap.currentPositionMarker = new BMap.Marker(center, {
                icon: centerIcon
            });

            const selectPositionIconOpt = this.selectPositionIcon;
            const selectPositionIconSize = new BMap.Size(selectPositionIconOpt.size.width, selectPositionIconOpt.size.height);
            const selectPositionIconAnchor = new BMap.Size(selectPositionIconOpt.anchor.width, selectPositionIconOpt.anchor.height);
            const selectPositionIcon = new BMap.Icon(selectPositionIconOpt.url, selectPositionIconSize, {
                    imageSize:selectPositionIconSize, 
                    anchor: selectPositionIconAnchor
                });
            this.bdMap.selectPositionMarker = new BMap.Marker(center, {
                icon: selectPositionIcon
            });
            this.bdMap.centerCircle = new BMap.Circle(center,50,{strokeColor:"#75a9f1", strokeWeight:1, strokeOpacity:0.8,fillColor: '#1992f7', fillOpacity: 0.1})
            this.map.addOverlay(this.bdMap.currentPositionMarker);
            this.map.addOverlay(this.bdMap.centerCircle);
            this.map.addOverlay(this.bdMap.selectPositionMarker);

            this.bdMap.geolocation = new BMap.Geolocation();
            this.bdMap.geocoder = new BMap.Geocoder();
            this.bdMap.walking = new BMap.WalkingRoute(this.map, {
                renderOptions: {
                    map: this.map, panel: "walking-plan-result", autoViewport: true
                },
                onSearchComplete: this.showWalkingPlan.bind(this)
            });
            this.doGeoLocate({showLocating: true, showTips: true});
        },
        getWalkingPlan({bikeId, lat, lng}) {
            this.bdMap.walking.clearResults();
            var endPoint = new BMap.Point(lng, lat);
            this.bdMap.geocoder.getLocation(endPoint, function(rs){
               var addComp = rs.addressComponents;
               this.plan.bikeId = bikeId;
               this.plan.address = addComp.street + addComp.streetNumber;
               this.bdMap.walking.search(this.map.getCenter(), endPoint);
            }.bind(this));

        },
        showWalkingPlan(result) {
            const plan = result.getPlan(0);
            this.plan.distance = parseInt(plan.getDistance());
            this.plan.duration = parseInt(plan.getDuration());
            this.plan.show = true
        },
        getNearbyBike({lat, lng}) {
            const radius = 1000;
            const data = {
                long: lng,
                lat: lat,
                radius: radius.toFixed(2),
                bike_type: 0,
                status: 0,
                appkey: APP_KEY
            };
            return this.$http({
                url: `${BASE_URL}/lock-stat/nearby`,
                params: data
            }).then((result) => {
                this.items = result.data.bike;
            });
        },
        updateSessionDetails() {
            return this.$http({
                url: `${BASE_URL}/lock-stat/session_details`,
                params: {sid: this.session.sessionId},
            }).then(function(result) {
                const { status, details } = result.data;
                if (status == 0) {
                    if (details.end <= 0) {
                        this.session.distance = parseInt(details.dist) || 0;
                        this.session.duration = details.duration;
                        if (this.session.duration > 0) {
                            this.session.speed = (this.session.distance * 3.6 / this.session.duration).toFixed(2);
                        } else {
                            this.session.speed = 0;
                        }
                        this.session.cal = details.cal;
                        this.session.carbon = details.carbon;
                        this.session.spend = Number(details.spend) || 0;
                    } else {
                        this.handleJourneyEnd();
                    }
                }
            }.bind(this))
        },

        initJourney() {
            // 由于上报需要依赖上一次上报的信息...所以增加一个初始化上一次的数据
            return this.updateSessionDetails();
        },
        handleJourneyStart({lockUid, sessionId}) {
            this.handleUnLockEnd();
            this.showScanModal = false;
            this.showRideInfo = true;
            this.session.lockUid = lockUid;
            this.session.sessionId = sessionId;
            // 初始化 session 信息
            this.initJourney().then(function() {
                // 初始化
                this.loop();
            }.bind(this));
        },
        handleJourneyEnd(sessionId) {
            if (this.session.sessionId == sessionId) {
                console.info('journey end');
                window.clearInterval(this.loopInterval);
                this.loopInterval = 0;
                this.$router.push({
                    path: '/journey-end',
                    query: {journeyId: this.session.sessionId}
                });
            }
        },
        handleJourneyUpdate() {
            if (this.loopInterval) {
                console.info('journey update');
                this.updateSessionDetails();
                this.postTrack();
            }
        },
        loop() {
            if (!this.loopInterval) {
                this.loopInterval = setInterval(function(){
                    this.handleJourneyUpdate();
                    this.loop();
                }.bind(this), 20000);
            }
        },
        init() {
            this.initYunba();
            return new Promise((resolve, reject) => {
                if (IS_WECHAT) {
                    resolve(window.WECHAT_READY);
                } else {
                    this.hasGeoPermission = true;
                    resolve();
                }
            });
        },
        initYunba() {
            yunba._subscribe({
                topic: ',yblc',
                messageHandler: (data) => {
                    var json = data.msg.replace (/:(\d+)([,\}])/g, ':"$1"$2');
                    const msg = JSON.parse(json);
                    if (msg.status == 0) {
                        this.handleJourneyStart({
                            sessionId: msg.s,
                            lockUid: msg.l
                        });
                    } else if (msg.status == 13) {
                        this.handleJourneyEnd(msg.s);
                    } else {
                        this.handleUnLockEnd(msg.desc);
                    }
                }
            }, (err, result) => {
                if (err) {
                    this.$vux.toast.show({
                        type: 'warn',
                        text: '无法接收服务器信息'
                    });
                }
            });
            yunba._subscribe({
                topic: ',yble',
                messageHandler: (data) => {
                    this.my_sendDataToWXDevice(data.msg);
                    // var json = data.msg.replace (/:(\d+)([,\}])/g, ':"$1"$2');
                    // const msg = JSON.parse(json);
                    // alert(JSON.stringify(msg))
                    // if (msg.status == 0) {
                    //     this.handleJourneyStart({
                    //         sessionId: msg.s,
                    //         lockUid: msg.l
                    //     });
                    //     //下发开锁指令
                    // } else if (msg.status == 13) {
                    //     this.handleJourneyEnd(msg.s);
                    // } else {
                    //     this.handleUnLockEnd(msg.desc);
                    // }
                    
                }
            }, (err, result) => {
                //alert(JSON.stringify(result))
                if (err) {
                    this.$vux.toast.show({
                        type: 'warn',
                        text: '无法接收服务器信息'
                    });
                }
            });
            yunba._subscribe({
                topic: ',ygetconfig',
                messageHandler: (data) => {
                    const msg = JSON.parse(data.msg);
                    if (msg.status === 0) {
                        this.config.unlockTimeout = Number(msg.config.unlock_timeout);
                    } else {
                        this.$vux.toast.show({
                            type: 'warn',
                            text: '服务器错误, 无法获取配置信息'
                        });
                    }
                }
            }, (err, result) => {
                if (!err) {
                    yunba._publish({
                        topic: ',ygetconfig',
                        msg: 'getconfig'
                    }, (err) => {
                        if (err) {
                            this.$vux.toast.show({
                                type: 'warn',
                                text: '获取配置信息失败, 请检查你的网络状态'
                            });
                        }
                    });
                }
            });


        },
        handleScanCode() {
            let _this = this;
            wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: (res) => {
                    if (res.errMsg == 'scanQRCode:ok') {
                        this.getDeviceId('7880123456')
                        //this.handleUnLock(res.resultStr);
                        //this.my_openWXDeviceLib();
                    }
                }
            });
        },
        fetchAdvertisement() {
            this.$http({
                url: `${BASE_URL}/lock-account/advertise_event`,
                params: {
                    page_num: 1,
                    row_per_page: 10000,
                    show_when_open:1,
                    appkey: APP_KEY
                }
            }).then((result) => {
                const data = result.data;
                if (data.status === 0 && data.data.length > 0) {
                    this.advertisement = data.data[0];
                }
            });
        },


        /**
         * 得到设备的Id
         * 
         */
        getDeviceId(number) {
            alert('diaoyongle')
            this.$http({
                url: `${BASE_URL}/lock-wechat/ble_info?bike_number=${number}&appkey=${APP_KEY}`
            }).then(function(res) {
                if(res.data.status == 0) {

                }
                alert(JSON.stringify(result))
                this.my_openWXDeviceLib();
            }.bind(this));
        },


        /**
         * 绑定设备
         * 
         */
        bindDevice(id) {
            alert('diaoyongle')
            this.$http({
                method: 'post',
                
                url: `${BASE_URL}/lock-wechat/ble_info?bike_number=${number}&appkey=${APP_KEY}`,
                data: {
                    device_id: id,
                    openid: openid
                }
            }).then(function(res) {
                if(res.status == 0) {
                    this.my_openWXDeviceLib();
                }
                alert(JSON.stringify(result))
            }.bind(this));
        },

        /**
         * @Author    lan
         * @DateTime  2017-07-20
         * @函数描述    关闭设备的初始化库
         */
        
        // my_closeWXDeviceLib() {
        //     wx.ready(function() {
        //         wx.invoke('closeWXDeviceLib', {
        //                 'connType': 'blue'
        //             },
        //             function(res) {
        //                 console.log(res);
        //                 alert(JSON.stringify(res))
        //             });
        //     })
        // },


        /**
         * @Author    lan
         * @DateTime  2017-07-20
         * @函数描述    主要是打开设备
         * @return    {[type]}    [description]
         */
        
        my_openWXDeviceLib() {
            let _this = this;
            var x=0; 
            wx.ready(function(){
                wx.invoke('openWXDeviceLib', {'connType':'blue'}, 
                function(res){
                    //监听蓝牙链接的状态 如果链接上了直接发送开锁请求，如果没有链接上就需要调用接口连接
                    _this.my_onWXDeviceStateChange()
                    _this.my_onScanWXDeviceResult();
                    _this.my_onReceiveDataFromWXDevice();
                });
            })
            return x;  //0表示成功 1表示失败
        },


        /**
         * @Author    lan
         * @DateTime  2017-07-20
         * onWXDeviceStateChange   监听设备蓝牙链接的状态的改变 
         */
        my_onWXDeviceStateChange() {
            let _this = this;
            wx.on('onWXDeviceStateChange', function(res) {
                if(res.state == "connecting"){
                    alert('lianjiezhong')
                }else if(res.state == "connected") {
                    alert('已链接')
                    _this.handleUnLock('7880123456')
                }else {
                    alert('weilainjie')
                    _this.my_startScanWXDevice();
                }
                alert(JSON.stringify(res))

            });
        },


        /**
         * @Author    lan
         * @DateTime  2017-07-20
         * 函数描述    开始调用设备微信的扫描
         */
        my_startScanWXDevice() {
            let _this = this;
            wx.invoke('startScanWXDevice', {'connType':'blue','btVersion':'ble'
            }, function(res) {
                //alert(JSON.stringify(res))
                
            });
        },


        /**
         * @Author    lan
         * @DateTime  2017-07-20
         * 函数描述     当开始扫描并得到结果有一个事件的回调我要根据事件的回调过来的结果来调用
         * @return    {[type]}    [description]
         */
        my_onScanWXDeviceResult() {
            let _this = this;
            wx.on('onScanWXDeviceResult',function(res){
                //alert(JSON.stringify(res))
                let devices = res.deviceId;
                _this.my_connectWXDevice();
                // devices.map((item,index)=>{
                //     if(item.deviceId == window.device_id){
                //         _this.my_connectWXDevice(item.deviceId, lockUid);
                //     }
                // })
            })
            
        },


        /**
         * @Author    lan
         * @DateTime  2017-07-20
         * 函数描述     当开始扫描并得到结果有一个事件的回调我要根据事件的回调过来的结果来调用
         * @return    {[type]}    [description]
         */
        my_connectWXDevice() {
            let _this = this;
            wx.invoke('connectWXDevice', {'deviceId' : 'BFBB1CD0YBBLE', 'connType':'blue' }, function(res) {
            //alert(JSON.stringify(res))
            _this.handleUnLock('7880123456')
            if (res.errMsg == 'connectWXDevic:ok') {
                //_this.handleUnLock()
            }
        });
        },


        /**
         * @Author    lan
         * @DateTime  2017-07-20
         * 函数描述     当开始扫描并得到结果有一个事件的回调我要根据事件的回调过来的结果来调用
         * @return    {[type]}    [description]
         */
        my_getWXDeviceTicket() {
            let _this = this;
            wx.invoke('getWXDeviceTicket', {'deviceId':'BFBB1CD0YBBLE',type:1,'connType':'blue'}, function(res) {
            //alert(JSON.stringify(res));
            _this.my_connectWXDevice();

        });
        },


        /**
         * @Author    lan
         * @DateTime  2017-07-20
         * 函数描述     当开始扫描并得到结果有一个事件的回调我要根据事件的回调过来的结果来调用
         * @return    {[type]}    [description]
         */
        my_sendDataToWXDevice(data) {
            let _this = this;
            //alert(data);
            var base = new Base64();  
            var result = base.encode(data);
            //alert(result);
            wx.invoke('sendDataToWXDevice', {deviceId:'BFBB1CD0YBBLE',base64Data:result},function(res) {
            //alert(JSON.stringify(res));
        });
        },

        /**
         * @Author    lan
         * @DateTime  2017-07-25
         * @copyright [copyright]
         * @license   [license]
         * @version   [version]
         * @param     {[type]}    str [description]
         * @return    {[type]}        [description]
         */
        my_onReceiveDataFromWXDevice() {
            let _this = this;
            wx.on('onReceiveDataFromWXDevice',function(res){
                //alert(res.base64Data);
                var base = new Base64();  
                var result = base.decode(res.base64Data);
                //alert('yifa')
                //alert(JSON.stringify(result))
                yunba._publish({
                    topic: ',yble',
                    msg: result,
                    qos: 0
                }, (err) => {
                    //alert(err)
                    if (err) {
                        this.$vux.toast.show({
                            type: 'warn',
                            text: err
                        });
                    }
                });
                // devices.map((item,index)=>{
                //     if(item.deviceId == window.device_id){
                //         _this.my_connectWXDevice(item.deviceId, lockUid);
                //     }
                // })
            })
        }
    },
    created() {
        this.fetchAdvertisement();
        this.getCurrentSession();
        this.ready = this.init();
        //先关闭设备库以免自动连接
        //this.my_closeWXDeviceLib();
    },
    computed: {
    }
}
</script>

<style lang="less" scoped>
@import '~vux/src/styles/close';
</style>

<style lang="stylus">
@import "../assets/funcs.styl";
.walking-plan-popup .vux-popup-show,
.walking-plan-popup .vux-popup,
.ride-info-popup .vux-popup-show,
.ride-info-popup .vux-popup
        top $height($headerHeight)
.select-bike-type
    position absolute
    top $height($headerHeight)
    z-index 10
    width 100%
    background #262930
    .vux-tab-item
        color #fff
        span
            display block
            width $width(250)
            height $height(120)
            line-height $height(120)
            margin 0 auto
            border-radius $width(100)
    .vux-tab-item.selected
        color #fff
        border none !important
        span
            background #4cc2ff
    .vux-tab-ink-bar
        display none !important

.red-packet-dialog
    .weui-dialog
        max-width 80%
    .packet-desc
        width 100%
        text-align center
        position absolute
        font-size $toRem(18)
        top $height(300)
        color #fff
    .open-packet
        width 30%
        left 50%
        margin-left -15%
        text-align center
        position absolute
        color #dd4c3f
        bottom $height(200)
    img 
        display block
        width 100%
    
    .adv-close-wrap
        position absolute
        right $width(10)
        top $height(10)
        padding $width(10)
        text-align center
        border-radius 50%
        .close 
            position relative
            display inline-block
            vertical-align middle
            color #aaa
            width $width(100)
            height $height(100)
        .close:before,
        .close:after
            content  ''
            position absolute
            left 0
            top $width(50)
            width $width(100)
            height 1px
            background #ccc
            -webkit-transform rotate(-45deg)
            transform rotate(-45deg)
        .close:after
            transform rotate(45deg)

.adv-dialog
    .weui-dialog
        overflow visible
        max-width 80%
    .adv-content
        padding $height(30) 0
        h5
            font-size $toRem(14)
    .adv-close-wrap
        position absolute
        right $width(-40)
        top $height(-40)
        padding $width(10)
        text-align center
        border-radius 50%
        background #fff
        .close 
            position relative
            display inline-block
            vertical-align middle
            color #999
            width $width(100)
            height $height(100)
        .close:before,
        .close:after
            content  ''
            position absolute
            left 0
            top $width(50)
            width $width(100)
            height 1px
            background #ccc
            -webkit-transform rotate(-45deg)
            transform rotate(-45deg)
        .close:after
            transform rotate(45deg)
</style>

<style lang="stylus" scoped>
@import "../assets/funcs.styl";
.to-ucenter
    img 
        position absolute
        height $height($headerHeight/1.5)
        top $height($headerHeight/7)
        left $width(-30)
.wrap 
    top 0
    position absolute
    height 100%
    width 100%
    min-height $height(1000)
    z-index 0
            
    .center
        z-index 99
        position absolute
        width 25px
        height 50px
        top 50%
        margin-left -12.5px
        margin-top -75px
        left 50%
        overflow hidden
        img
            width 25px
            height 50px
    .scan-to-unlock
        z-index 99
        position absolute
        width $width(500)
        bottom $height(100)
        left 50%
        margin-left $width(-250)
        img 
            width 100%
    .refresh
        z-index 99
        position absolute
        width $width(150)
        height $height(150)
        bottom $height(340)
        left $width(30)
        img 
            width 100%
        .arrow
            position absolute
            width $width(70)
            height $width(70)
            top $width(37)
            left $width(40)
    .do-locate
        z-index 99
        position absolute
        width $width(150)
        height $height(150)
        bottom $height(150)
        left $width(30)
        img 
            width 100%
        
    .customer-service
        z-index 99
        position absolute
        width $width(180)
        height $width(180)
        bottom $height(130)
        right $width(30)
        img
            width 100%
    .map
        z-index 1
        position absolute
        width 100%
        height 100%

.cs-popup
    width 90%
    left 50%
    margin-left -45%
    text-align center
    background #fff
    font-size $toRem(14)
    .cs-title
        color #aaa
        font-weight bold
        border-bottom 1px solid #f5f5f5
        height $height(200)
        line-height $height(200)
    .cs-cell
        float left
        padding-top $height(40)
        padding-bottom $height(30)
        width 50%
        a 
            color #000

.walking-plan-popup
    position: absolute;
    width: 100%;
    vertical-align middle
    color #888
    background: #fff;
    .title,
    .bike
        position relative
        font-size $toRem(12)
        line-height $height(140)
        padding-left $width(20)
        border-bottom 1px solid #eaf1f7
        text-indent $width(80)
        img 
            position absolute
            top $height(40)
            left $width(10)
            margin-left $width(20)
            height $height(50)
        
    .info-cell
        padding $height(20) 0 
        margin 0
        width 33.33333%
        float left
        text-align center
        span 
            color #4cc2ff

.ride-info-popup
    position absolute
    width 100%
    top $height($headerHeight)
    background #fff
    vertical-align middle
    .title
        font-size $toRem(14)
        padding $width(30)
        .tips 
            color #f05b48
            img 
                width $width(40)
                margin-right $width(40)
        a 
            color #888
            float right
    .bike-info
        padding 0 $width(110)

    .ride-info-row
        padding $height(20) 0
        border-top 1px solid #bfdff9
        font-size $toRem(14)
        text-align center
        img 
            width $width(60)
            margin-right $width(20)
        span 
            line-height $height(90)
            display block



@-webkit-keyframes rotating {
  from {
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes rotating {
  from {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.rotating {
  -webkit-animation: rotating 0.5s linear infinite;
  -moz-animation: rotating 0.5s linear infinite;
  -ms-animation: rotating 0.5s linear infinite;
  -o-animation: rotating 0.5s linear infinite;
  animation: rotating 0.5s linear infinite;
}
</style>