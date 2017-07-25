import Vue from 'vue';
import Router from 'vue-router';

const Home = (resolve) => require(['../components/Home.vue'], resolve);
const UCenter = (resolve) => require(['../components/UCenter.vue'], resolve);
const Login = (resolve) => require(['../components/Login'], resolve);
const Logout = (resolve) => require(['../components/Logout'], resolve);

const CustomerService = (resolve) => require(['../components/CustomerService'], resolve);
const CustomerServiceList = (resolve) => require(['../components/CustomerServiceList'], resolve);
const Journey = (resolve) => require(['../components/Journey'], resolve);

const Deposit = (resolve) => require(['../components/Deposit'], resolve);
const Auth = (resolve) => require(['../components/Auth'], resolve);
const Topup = (resolve) => require(['../components/Topup'], resolve);

const Wallet = (resolve) => require(['../components/Wallet'], resolve);
const Setting = (resolve) => require(['../components/Setting'], resolve);
const PayLog = (resolve) => require(['../components/PayLog'], resolve);

const JourneyEnd = (resolve) => require(['../components/JourneyEnd'], resolve);

const UserInfo = (resolve) => require(['../components/UserInfo'], resolve);

const Nickname = (resolve) => require(['../components/Nickname'], resolve);
const SetAvatar = (resolve) => require(['../components/SetAvatar'], resolve);
const Credit = (resolve) => require(['../components/Credit'], resolve);

const CustomerServiceOtherIssue = (resolve) => require(['../components/CustomerServiceOtherIssue'], resolve);
const CustomerServiceJourneyList = (resolve) => require(['../components/CustomerServiceJourneyList'], resolve);
const CustomerServiceForAnJourney = (resolve) => require(['../components/CustomerServiceForAnJourney'], resolve);


const CreditRules = (resolve) => require(['../components/CreditRules'], resolve);
const CreditList = (resolve) => require(['../components/CreditList'], resolve);

const Message = (resolve) => require(['../components/Message'], resolve);

const Share = (resolve) => require(['../components/Share'], resolve);

const Coupon = (resolve) => require(['../components/Coupon'], resolve);

const RedPacket = (resolve) => require(['../components/RedPacket'], resolve);

const RedPacketList = (resolve) => require(['../components/RedPacketList'], resolve);

const RedPacketItem = (resolve) => require(['../components/RedPacketItem'], resolve);

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'Home',
        component: Home
    }, {
        path: '/ucenter',
        name: 'UCenter',
        component: UCenter
    }, {
        path: '/login',
        name: 'Login',
        component: Login
    }, {
        path: '/logout',
        name: 'Logout',
        component: Logout
    },
    {
        path: '/customer_service',
        name: 'CustomerService',
        component: CustomerService
    },
    {
        path: '/customer_service_other_issue',
        name: 'CustomerServiceOtherIssue',
        component: CustomerServiceOtherIssue
    },
    {
        path: '/customer_service_journey_list',
        name: CustomerServiceJourneyList,
        component: CustomerServiceJourneyList
    },
    {
        path: '/customer_service_list',
        name: 'CustomerServiceList',
        component: CustomerServiceList
    },
    {
        path: '/journey',
        name: 'Journey',
        component: Journey
    },{
        path: '/journey-end',
        name: 'JourneyEnd',
        component: JourneyEnd
    },{
        path: '/deposit',
        name: 'Deposit',
        component: Deposit
    }, {
        path: '/auth',
        name: 'Auth',
        component: Auth
    }, {
        path: '/topup',
        name: 'Topup',
        component: Topup
    }, {
        path: '/setting',
        name: 'Setting',
        component: Setting
    }, {
        path: '/wallet',
        name: 'Wallet',
        component: Wallet
    }, {
        path: '/pay-log',
        name: 'PayLog',
        component: PayLog
    }, {
        path: '/user-info',
        name: 'UserInfo',
        component: UserInfo
    }, {
        path: '/nickname',
        name: 'Nickname',
        component: Nickname
    }, {
        path: '/set-avatar',
        name: 'SetAvatar',
        component: SetAvatar
    }, {
        path: '/credit',
        name: 'Credit',
        component: Credit
    }, {
        path: '/credit_rules',
        name: 'CreditRules',
        component: CreditRules
    }, {
        path: '/credit_list',
        name: 'CreditList',
        component: CreditList
    },{
        path: '/message',
        name: 'Message',
        component: Message
    }, {
        path: '/share',
        name: 'Share',
        component: Share
    }, {
        path: '/coupon',
        name: 'Coupon',
        component: Coupon
    }, {
        path: '/redpacket',
        name: 'RedPacket',
        component: RedPacket
    }, {
        path: '/redpacket_list',
        name: 'RedPacketList',
        component: RedPacketList
    }, {
        path: '/redpacket/:money',
        name: 'RedPacketItem',
        component: RedPacketItem
    }]
});
