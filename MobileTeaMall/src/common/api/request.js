// 引入加载样式
import { Indicator } from 'mint-ui';
import axios from 'axios';
import store from '@/store/index.js'
import router from '@/router/index.js'
export default {
    common: {
        method: "GET",
        data: {},
        params: {},
        headers: {}
    },
    $axios(options = {}) {
        options.method = options.method || this.common.method
        options.data = options.data || this.common.data
        options.params = options.params || this.common.params
        options.headers = options.headers || this.common.headers



        // 请求前，显示加载中
        Indicator.open('加载中...');

        // 通过token验证是否是登录状态
        if (options.headers.token) {
            options.headers.token = store.state.user.token;
            if (!options.headers.token) {
                router.push('/login')
            }
        }


        return axios(options).then(
            v => {
                let data = v.data.data

                // 如果token过期，重新登录
                if (data.code == 1000) {
                    Indicator.close();
                    router.push('/login')
                } else {
                    return new Promise((res, rej) => {
                        if (!v) rej();
                        setTimeout(() => {
                            // 请求后 关闭加载中
                            Indicator.close();
                        }, 300)
                        res(data)
                    })
                }
            }
        )
    }
}