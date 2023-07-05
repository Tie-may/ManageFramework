import Vue from 'vue'
import Antd from 'ant-design-vue';
import App from './App';
import 'ant-design-vue/dist/antd.css';
import VueRouter from "vue-router";
import router from "@/router";

Vue.config.productionTip = false

Vue.use(Antd);
Vue.use(VueRouter);

new Vue({
    render: h => h(App),
    router
}).$mount('#app')
