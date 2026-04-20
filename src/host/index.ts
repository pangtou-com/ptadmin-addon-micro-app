import { defineHostSdk, getHostSdk } from '@pangtou/host-sdk'
import type { FrontendManifest } from '@pangtou/shared'
import { mockMicroAppManifest, mockMicroAppSDK } from '../mock'
import type { MicroAppHostProps } from '../types'

/**
 * 统一读取 wujie 宿主注入的 props。
 * 这样页面不需要直接访问 window.$wujie，便于后续替换协议实现。
 */
export function getMicroAppHostProps(): MicroAppHostProps {
    return (window.$wujie?.props ?? {}) as MicroAppHostProps
}

/**
 * 返回当前生效的 frontend manifest。
 * 宿主模式下读取注入值，独立模式下回退到 mock 配置。
 */
export function getCurrentMicroAppManifest(): FrontendManifest {
    return getMicroAppHostProps().manifest ?? mockMicroAppManifest
}

/**
 * 当前微应用的基础路径。
 * 宿主通常会透传 routeBase，独立模式下则直接使用 manifest.routeBase。
 */
export function getCurrentBasePath() {
    const props = getMicroAppHostProps()
    return props.basePath || getCurrentMicroAppManifest().routeBase
}

/**
 * 读取当前运行时配置。
 * 微应用如果只需要展示信息或做只读判断，可以直接从这里取值。
 */
export function getCurrentRuntimeConfig() {
    return getMicroAppHostProps().runtimeConfig ?? {}
}

/**
 * 统一初始化 Host SDK。
 * 宿主挂载时使用真实 SDK，独立运行时自动使用 mock SDK。
 */
export function ensureMicroAppSDK() {
    const sdk = getMicroAppHostProps().sdk ?? mockMicroAppSDK

    defineHostSdk(sdk)

    return getHostSdk()
}
