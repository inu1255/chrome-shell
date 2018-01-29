import ext from "./utils/ext";
import Vue from 'vue/dist/vue'
import ElementUI from 'element-ui'

Vue.use(ElementUI)

var app = new Vue({
    el: "#root",
    data: {
        message: '页面加载于 ' + new Date().toLocaleString()
    }
})
