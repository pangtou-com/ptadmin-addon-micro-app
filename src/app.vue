<template>
    <main class="micro-page">
        <section class="micro-hero">
            <div class="micro-hero-copy">
                <span class="micro-eyebrow">{{ runModeLabel }}</span>
                <h1>{{ title }}</h1>
                <p>{{ description }}</p>
            </div>

            <div class="micro-hero-meta">
                <article class="micro-stat">
                    <span>运行模式</span>
                    <strong>{{ runModeLabel }}</strong>
                </article>
                <article class="micro-stat">
                    <span>路由前缀</span>
                    <strong>{{ basePath }}</strong>
                </article>
                <article class="micro-stat">
                    <span>请求模式</span>
                    <strong>{{ requestMode }}</strong>
                </article>
            </div>
        </section>

        <section class="micro-grid">
            <article class="micro-panel">
                <header>
                    <span>宿主透传信息</span>
                    <strong>Host Props</strong>
                </header>

                <dl class="micro-detail-list">
                    <div>
                        <dt>模块编码</dt>
                        <dd>{{ manifestCode }}</dd>
                    </div>
                    <div>
                        <dt>当前用户</dt>
                        <dd>{{ currentUser }}</dd>
                    </div>
                    <div>
                        <dt>布局模式</dt>
                        <dd>{{ layout }}</dd>
                    </div>
                    <div>
                        <dt>当前语言</dt>
                        <dd>{{ locale }}</dd>
                    </div>
                </dl>
            </article>

            <article class="micro-panel">
                <header>
                    <span>接入状态</span>
                    <strong>Integration Status</strong>
                </header>

                <ul class="micro-check-list">
                    <li :class="{ active: isWujie }">已通过 wujie 宿主接入</li>
                    <li :class="{ active: hasHostProps }">宿主 props 已注入</li>
                    <li :class="{ active: hasRuntimeConfig }">运行时配置已透传</li>
                    <li :class="{ active: hasSDK }">Host SDK 已准备完成</li>
                </ul>
            </article>

            <article class="micro-panel micro-panel-accent">
                <header>
                    <span>开发说明</span>
                    <strong>What To Replace</strong>
                </header>

                <p class="micro-panel-text">
                    当前页面用于演示微应用如何读取宿主上下文，以及如何复用宿主的 UI、路由和标签能力。开始做真实业务时，通常保留
                    `src/main.ts`、`src/host/` 和 `frontend.json`，其余页面可以直接替换。
                </p>
            </article>
        </section>

        <section class="micro-actions">
            <article class="micro-action-panel">
                <header>
                    <span>宿主交互演示</span>
                    <strong>Host Interaction Demo</strong>
                </header>

                <div class="micro-action-grid">
                    <button type="button" class="micro-action micro-action-primary" @click="handleHostAlert">
                        打开宿主弹层
                    </button>
                    <button type="button" class="micro-action" @click="handleHostConfirm">
                        打开宿主确认框
                    </button>
                    <button type="button" class="micro-action" @click="handleOpenHostTab">
                        宿主打开标签
                    </button>
                    <button type="button" class="micro-action" @click="handleHostRoutePush">
                        宿主跳转路由
                    </button>
                </div>

                <p class="micro-action-tip">
                    这里的按钮由微应用触发，但执行动作的是宿主提供的 `Host SDK`。这就是微应用和宿主复用能力的边界。
                </p>
            </article>
        </section>
    </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getHostSdk } from '@pangtou/host-sdk'
import { getCurrentBasePath, getCurrentMicroAppManifest, getCurrentRuntimeConfig, getMicroAppHostProps } from './host'

/**
 * 页面层只通过 host.ts 和 Host SDK 取宿主上下文。
 * 这样业务代码不会和 window.$wujie 之类的实现细节耦合。
 */
const hostProps = computed(() => getMicroAppHostProps())
const manifest = computed(() => getCurrentMicroAppManifest())
const runtimeConfig = computed(() => getCurrentRuntimeConfig())
const sdk = getHostSdk()

const isWujie = computed(() => Boolean(window.__POWERED_BY_WUJIE__))
const hasHostProps = computed(() => Object.keys(hostProps.value).length > 0)
const hasRuntimeConfig = computed(() => Object.keys(runtimeConfig.value).length > 0)
const hasSDK = computed(() => Boolean(sdk))
const title = computed(() => manifest.value.name)
const description = computed(() => isWujie.value
    ? '当前子应用正在通过 wujie 运行，页面内展示的是宿主透传的上下文和能力。'
    : '当前页面正在独立运行，可用于本地开发、样式调试和 SDK 接线验证。')
const runModeLabel = computed(() => isWujie.value ? 'Wujie Micro App' : 'Standalone App')
const basePath = computed(() => getCurrentBasePath())
const manifestCode = computed(() => manifest.value.code)
const requestMode = computed(() => sdk.runtime.getRequestMode())
const layout = computed(() => sdk.runtime.getLayoutMode())
const locale = computed(() => String(runtimeConfig.value.locale || 'zh-CN'))
const currentUser = computed(() => {
    const user = sdk.auth.getUser()
    return user?.nickname || user?.username || '匿名用户'
})

/**
 * 演示微应用直接复用宿主弹层，而不是自己再维护一套 UI 协议。
 */
async function handleHostAlert() {
    await sdk.ui.alert?.({
        title: '宿主弹层演示',
        message: '当前弹层由微应用触发，但渲染层属于宿主 console。',
        type: 'info',
        confirmButtonText: '关闭弹层',
    })
}

/**
 * 演示微应用如何调用宿主确认框，并在操作结果后继续复用宿主通知能力。
 */
async function handleHostConfirm() {
    try {
        await sdk.ui.confirm?.({
            title: '宿主确认演示',
            message: '确认后会继续触发宿主成功提示。',
            type: 'warning',
            confirmButtonText: '继续',
            cancelButtonText: '取消',
        })

        sdk.ui.success('微应用已成功调用宿主确认框。')
    }
    catch {
        sdk.ui.info('已取消宿主确认框操作。')
    }
}

/**
 * 演示由微应用请求宿主打开一个新的标签页。
 */
function handleOpenHostTab() {
    sdk.tabs.open({
        title: '云市场',
        path: '/cloud/market',
    })
}

/**
 * 演示由微应用驱动宿主路由跳转。
 */
function handleHostRoutePush() {
    sdk.router.push('/admin/admin')
}
</script>

<style scoped lang="scss">
:global(html, body, #app) {
    margin: 0;
    min-height: 100%;
}

:global(body) {
    font-family:
        'IBM Plex Sans',
        'PingFang SC',
        'Hiragino Sans GB',
        'Microsoft YaHei',
        sans-serif;
    background:
        radial-gradient(circle at top left, rgba(15, 118, 110, 0.16), transparent 30%),
        radial-gradient(circle at bottom right, rgba(249, 115, 22, 0.14), transparent 28%),
        linear-gradient(180deg, #f6fbfb 0%, #f8fafc 100%);
    color: #102a43;
}

.micro-page {
    min-height: 100vh;
    padding: 28px;
    box-sizing: border-box;
}

.micro-hero {
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.9fr);
    gap: 18px;
    align-items: stretch;
}

.micro-hero-copy,
.micro-hero-meta,
.micro-panel,
.micro-action-panel {
    border: 1px solid rgba(148, 163, 184, 0.18);
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.88);
    box-shadow: 0 24px 54px rgba(15, 23, 42, 0.08);
    backdrop-filter: blur(18px);
}

.micro-hero-copy {
    padding: 28px;
}

.micro-eyebrow {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(15, 118, 110, 0.1);
    color: #0f766e;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.micro-hero-copy h1 {
    margin: 18px 0 12px;
    font-size: 38px;
    line-height: 1.06;
}

.micro-hero-copy p {
    margin: 0;
    max-width: 620px;
    color: #52667a;
    line-height: 1.8;
}

.micro-hero-meta {
    display: grid;
    gap: 12px;
    padding: 18px;
}

.micro-stat {
    padding: 16px 18px;
    border-radius: 20px;
    background: linear-gradient(180deg, rgba(244, 247, 251, 0.92), rgba(255, 255, 255, 0.92));
    border: 1px solid rgba(148, 163, 184, 0.14);
}

.micro-stat span,
.micro-panel header span,
.micro-detail-list dt {
    display: block;
    color: #6b7c93;
    font-size: 12px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.micro-stat strong,
.micro-panel header strong {
    display: block;
    margin-top: 8px;
    color: #102a43;
    font-size: 18px;
}

.micro-grid {
    margin-top: 18px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
}

.micro-panel,
.micro-action-panel {
    padding: 22px;
}

.micro-detail-list {
    margin: 18px 0 0;
    display: grid;
    gap: 14px;
}

.micro-detail-list div {
    display: grid;
    gap: 6px;
    padding: 14px 16px;
    border-radius: 16px;
    background: rgba(244, 247, 251, 0.86);
}

.micro-detail-list dd {
    margin: 0;
    color: #102a43;
    font-weight: 600;
}

.micro-check-list {
    margin: 18px 0 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 10px;
}

.micro-check-list li {
    position: relative;
    padding: 14px 16px 14px 42px;
    border-radius: 16px;
    background: rgba(244, 247, 251, 0.86);
    color: #52667a;
}

.micro-check-list li::before {
    content: '';
    position: absolute;
    left: 16px;
    top: 50%;
    width: 12px;
    height: 12px;
    border-radius: 999px;
    background: rgba(148, 163, 184, 0.5);
    transform: translateY(-50%);
}

.micro-check-list li.active {
    color: #102a43;
}

.micro-check-list li.active::before {
    background: #0f766e;
}

.micro-panel-accent {
    background:
        linear-gradient(145deg, rgba(15, 118, 110, 0.08), rgba(255, 255, 255, 0.92)),
        rgba(255, 255, 255, 0.88);
}

.micro-panel-text,
.micro-action-tip {
    margin: 18px 0 0;
    color: #52667a;
    line-height: 1.8;
}

.micro-actions {
    margin-top: 18px;
}

.micro-action-grid {
    margin-top: 18px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.micro-action {
    border: 0;
    cursor: pointer;
    padding: 12px 16px;
    border-radius: 14px;
    background: #e8eef8;
    color: #102a43;
    font: inherit;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.micro-action:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

.micro-action-primary {
    background: #0f766e;
    color: #fff;
}

@media (max-width: 1080px) {
    .micro-hero,
    .micro-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 640px) {
    .micro-page {
        padding: 16px;
    }

    .micro-hero-copy h1 {
        font-size: 30px;
    }

    .micro-action-grid {
        flex-direction: column;
    }
}
</style>
