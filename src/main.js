// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

const TEST_CONFIG = {
    id: 'demo',
    title: "共享单车",
    appkey: "56a0a88c4407a3cd028ac2fe",
    baseUrl: 'http://bike.yunba.io',
    uploadUrl: 'https://abj-elogic-test1.yunba.io:4145/file',
    uploadBaseUrl: 'https://abj-elogic-test1.yunba.io:4145',
    ybServerUrl: 'http://abj-rest-test1.yunba.io:5555'
};
try {
    window.APP_CONFIG = JSON.parse(window.APP_CONFIG);
} catch(e) {
    window.APP_CONFIG = TEST_CONFIG;
}
window.APP_ID = APP_CONFIG.id;
document.title = APP_CONFIG.title;
window.USER_CACHE_KEY = APP_CONFIG.id + '_USER';
window.UPLOAD_URL= APP_CONFIG.uploadUrl;
window.UPLOAD_BASE_URL = APP_CONFIG.uploadBaseUrl;
window.BASE_URL = APP_CONFIG.baseUrl;
window.APP_KEY = APP_CONFIG.appkey;
window.YB_SERVER_URL = APP_CONFIG.ybServerUrl;
window.DEBUG_YUNBA = true;
require('./yunba-js-sdk');
window.yunba = new Yunba({
    appkey: APP_KEY,
    url: YB_SERVER_URL,
    logLevel: 'debug'
});
// polyfills
require('es6-promise').polyfill();

import Vue from 'vue';
Vue.config.productionTip = false
import axios from 'axios';

const $http = axios.create({});
Vue.prototype.$http = $http;
Vue.prototype.accurateNumber = util.accurateNumber;

import CONST from './const.js';
window.CONST = CONST;
import util from './util.js';

import wechat from './wechat.js';
window.IS_WECHAT = wechat.IS_WECHAT;
window.WECHAT_READY = wechat.init($http);

import { cookie } from 'vux';
window.openid = cookie.get(APP_CONFIG.id + '_openid');

const AlloyFinger = require('alloyfinger');
require('./vendor/alloy_finger.vue.js');
Vue.use(window.AlloyFingerVue, { AlloyFinger: AlloyFinger });
require('./vendor/canvas-toBlob.js');


var dateformat = require('dateformat');
Vue.filter('time-format', function(timestamp, format) {
  if (timestamp) {
    let pow = timestamp.toString().length - 13;
    timestamp = timestamp/Math.pow(10, pow);
    format = format || 'yyyy-mm-dd HH:MM:ss';
    return dateformat(timestamp, format);
  }
  return '';
});
Vue.filter('cent-to-yuan', function(cent) {
    if (parseFloat(cent)) {
        // 转为12位有效数字的指数记数法，再转为浮点数
        return (parseFloat((cent/100).toPrecision(12)));
    }
    return cent;
});
Vue.filter('yuan', function(val) {
    return val + '元';
});
Vue.filter('second-to-minute', function(second) {
    return Math.floor(second/60);
});
Vue.filter('to-kilo', function(val) {
    return (parseFloat((val/1000).toPrecision(12)));
});
Vue.filter('convert-breakline', util.convertBreakline);


Vue.filter('proper-unit', function(val, unit, kUnit) {
    return util.properUnit(val, unit, kUnit);
});

import BaiduMap from 'vue-baidu-map';
Vue.use(BaiduMap, {
  ak: '5rK75pROokpGQOhZC3ZIMvGDG6bcXItz'
});

import { XHeader, Actionsheet} from 'vux';
import { Group, Cell, CellBox } from 'vux';
import { XInput, XButton} from 'vux';
import { TransferDom, Popup } from 'vux';
import { Grid, GridItem, GroupTitle } from 'vux';
import { XTextarea } from 'vux';
import { Checker, CheckerItem } from 'vux';
import { Timeline, TimelineItem } from 'vux';
import { Step, StepItem } from 'vux';
import { Radio } from 'vux';
import { Flexbox, FlexboxItem } from 'vux'
import  { ToastPlugin } from 'vux';
Vue.use(ToastPlugin);
import { Tabbar, TabbarItem } from 'vux';
import { Divider } from 'vux';
import { Scroller } from 'vux';
import { Loading } from 'vux';
import { Confirm } from 'vux';
import { Tab, TabItem } from 'vux';
import { XDialog } from 'vux';

const components = [
    {
        n: 'x-header',
        c: XHeader
    },
    {
        n: 'actionsheet',
        c: Actionsheet
    },
    {
        n: 'group',
        c: Group,
    },
    {
        n: 'cell',
        c: Cell
    },
    {
        n: 'cell-box',
        c: CellBox
    },
    {
        n: 'x-input',
        c: XInput
    },
    {
        n: 'x-button',
        c: XButton
    },
    {
        n: 'popup',
        c: Popup
    },
    {
        n: 'grid',
        c: Grid
    },
    {
        n: 'grid-item',
        c: GridItem
    },
    {
        n: 'grout-title',
        c: GroupTitle
    },
    {
        n: 'x-textarea',
        c: XTextarea
    },
    {
        n: 'checker',
        c: Checker
    },
    {
        n: 'checker-item',
        c: CheckerItem
    },
    {
        n: 'timeline',
        c: Timeline
    },
    {
        n: 'timeline-item',
        c: TimelineItem
    },
    {
        n: 'step',
        c: Step
    },
    {
        n: 'step-item',
        c: StepItem
    },
    {
        n: 'radio',
        c: Radio
    },
    {
        n: 'flexbox',
        c: Flexbox
    },
    {
        n: 'flexbox-item',
        c: FlexboxItem
    },
    {
        n: 'tabbar',
        c: Tabbar
    },
    {
        n: 'tabbar-item',
        c: TabbarItem
    },
    {
        n: 'divider',
        c: Divider
    },
    {
        n: 'scroller',
        c: Scroller
    },
    {
        n: 'loading',
        c: Loading
    },
    {   
        n: 'confirm',
        c: Confirm
    },
    {
        n: 'tab',
        c: Tab
    },
    {
        n: 'tab-item',
        c: TabItem
    }, {
        n: 'x-dialog',
        c: XDialog
    }
]
components.forEach(function(item) {
    Vue.component(item.n, item.c);
});

import YbContentMain from '@/components/common/ContentMain';
import YbUploader from '@/components/common/Uploader';
import YbMenuList from '@/components/common/MenuList';
import YbMenuListItem from '@/components/common/MenuListItem';
import YbHeader from '@/components/common/Header';

Vue.component('yb-content-main', YbContentMain);
Vue.component('yb-uploader', YbUploader);
Vue.component('yb-menu-list', YbMenuList);
Vue.component('yb-menu-list-item', YbMenuListItem);
Vue.component('yb-header', YbHeader);




import router from './router';
import FastClick from 'fastclick';
FastClick.attach(document.body);
import App from './App'

// {"balance":10000,"credit":0,"deposit":29900,"phone":"13750000775","token":"iizhMRucR+bPPbJLEeg2KOmgOGs+3u/mtQK6z+Jg0I4nVT+hLdEvF6HrSXOwGoWCglGPXTUTCP55e854ReQP3g==","isRealNameAuth":true,"isPaidDeposit":true}
try {
    window.USER = JSON.parse(localStorage.getItem(USER_CACHE_KEY)) || {};
}catch(e) {
    window.USER = {};
}


/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')
