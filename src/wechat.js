const IS_WECHAT = /micromessenger/.test(navigator.userAgent.toLowerCase());
export default {
    IS_WECHAT: IS_WECHAT,
    init($http) {
        // 微信签名和授权相关
        return new Promise((resolve, reject) => {
            if (IS_WECHAT) {
                const url = `${location.protocol}//${location.host}${location.pathname}${location.search}`;
                $http({
                    url: `${BASE_URL}/public_api/wechat/sign`,
                    params: {
                        url: url,
                        _brandId: window.APP_ID
                    }
                }).then((result) => {
                    const options = result.data;
                    const {appId, nonceStr, timestamp, signature} = options;
                    const config = {
                        beta: true,
                        debug: true,
                        appId: appId,
                        timestamp: Number(timestamp),
                        nonceStr: nonceStr,
                        signature: signature,
                        jsApiList: [
                            'scanQRCode',
                            'chooseWXPay',
                            'getLocation',
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareWeibo',
                            'onMenuShareQZone',
                            'openWXDeviceLib',
                            'closeWXDeviceLib',
                            'getWXDeviceInfos',
                            'getWXDeviceTicket',
                            'startScanWXDevice',
                            'connectWXDevice',
                            'sendDataToWXDevice',
                            'translateVoice',
                            'onScanWXDeviceResult',
                            'onReceiveDataFromWXDevice',
                        ]
                    };
                    wx.ready(() => {
                        resolve();
                    });
                    wx.error((res) => {
                        //alert('失败')
                        // alert(res.errMsg);
                        resolve();
                    });
                    wx.config(config);
                });
            } else {
                resolve();
            }
        });
    }
}
