import type { HostSdk } from '@pangtou/host-sdk'
import type { FrontendManifest } from '@pangtou/shared'

/**
 * 宿主通过 wujie props 透传给微应用的上下文。
 * 微应用只和这层协议打交道，不直接依赖宿主内部实现。
 */
export interface MicroAppHostProps {
    manifest?: FrontendManifest
    sdk?: HostSdk
    basePath?: string
    runtimeConfig?: Record<string, unknown>
}
