import { createApp } from 'vue'
import App from './app.vue'
import { ensureMicroAppSDK } from './host'

let app: ReturnType<typeof createApp> | null = null

/**
 * 创建并挂载微应用实例。
 * 每次挂载前先确保 Host SDK 已准备好，这样组件里可以直接读取宿主能力。
 */
function mount() {
    if (app) {
        return
    }

    ensureMicroAppSDK()
    app = createApp(App)
    app.mount('#app')
}

/**
 * wujie 卸载时需要把 Vue 实例和容器一起清理掉，
 * 否则再次挂载时可能残留旧节点或旧状态。
 */
function unmount() {
    app?.unmount()
    app = null
    document.getElementById('app')?.replaceChildren()
}

if (window.__POWERED_BY_WUJIE__) {
    window.__WUJIE_MOUNT = () => {
        mount()
    }

    window.__WUJIE_UNMOUNT = () => {
        unmount()
    }
} else {
    mount()
}
