import Vue from 'vue'
import App from './App'
import './static/font/iconfont.css'
import './static/font/iconfont.eot'
import './static/font/iconfont.ttf'
import './static/font/iconfont.svg'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
