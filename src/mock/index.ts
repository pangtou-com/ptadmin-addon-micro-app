import type { HostSdk } from '@pangtou/host-sdk'
import { defineHostSdk } from '@pangtou/host-sdk'
import type { FrontendManifest } from '@pangtou/shared'

/**
 * 独立开发时使用的默认 frontend manifest。
 * 结构和正式接入宿主时的 frontend.json 保持一致，方便对照修改。
 */
export const mockMicroAppManifest: FrontendManifest = {
    id: 'your-micro-app',
    code: 'your-micro-app',
    name: '示例微应用',
    version: '0.1.0',
    enabled: true,
    kind: 'micro-app',
    runtime: 'wujie',
    routeBase: '/your-micro-app',
    meta: {
        icon: 'Monitor',
        description: '用于演示 Pangtou 微应用插件脚手架的最小实现。',
        order: 100,
        develop: true,
        preload: false,
    },
    entry: {
        wujie: {
            name: 'your_micro_app',
            url: 'http://localhost:5182/',
            alive: true,
            degrade: false,
            sync: true,
        },
    },
    capabilities: {
        routes: false,
        pages: false,
        widgets: false,
        settings: false,
    },
    compatibility: {
        console: '>=0.1.0',
    },
}

/**
 * 独立预览时的 mock 宿主。
 * 目标不是完整还原 console，而是保证微应用可以验证自己的 UI 和 SDK 接线。
 */
export const mockMicroAppSDK: HostSdk = defineHostSdk({
    auth: {
        getToken: () => 'micro-app-dev-token',
        getUser: () => ({ id: 1, username: 'micro-dev', nickname: '微应用开发用户' }),
        hasRole: () => true,
        hasPermission: () => true,
    },
    request: {
        raw: async <T>(config: Record<string, any>) => config as T,
        get: async <T>(url: string, params?: Record<string, any>) => ({ code: 0, url, params }) as T,
        post: async <T>(url: string, data?: Record<string, any>) => ({ code: 0, url, data }) as T,
        put: async <T>(url: string, data?: Record<string, any>) => ({ code: 0, url, data }) as T,
        delete: async <T>(url: string, data?: Record<string, any>) => ({ code: 0, url, data }) as T,
    },
    ui: {
        success: (message: string) => console.log('[micro-app-dev:success]', message),
        error: (message: string) => console.error('[micro-app-dev:error]', message),
        warning: (message: string) => console.warn('[micro-app-dev:warning]', message),
        info: (message: string) => console.info('[micro-app-dev:info]', message),
        alert: async ({ title, message }: {
            title?: string
            message: string
        }) => {
            window.alert([title, message].filter(Boolean).join('\n'))
        },
        confirm: async ({ title, message }: {
            title?: string
            message: string
        }) => {
            const accepted = window.confirm([title, message].filter(Boolean).join('\n'))

            if (!accepted) {
                throw new Error('cancelled')
            }
        },
    },
    router: {
        push: (path: string, query?: Record<string, any>) => console.log('[micro-app-dev:router.push]', path, query),
        replace: (path: string, query?: Record<string, any>) => console.log('[micro-app-dev:router.replace]', path, query),
        back: () => console.log('[micro-app-dev:router.back]'),
    },
    tabs: {
        open: (tab: { title: string; path: string }) => console.log('[micro-app-dev:tabs.open]', tab),
        close: (path: string) => console.log('[micro-app-dev:tabs.close]', path),
        refresh: (path?: string) => console.log('[micro-app-dev:tabs.refresh]', path ?? 'current'),
    },
    runtime: {
        getBaseURL: () => '/mock-api',
        getUploadURL: () => '/mock-api/upload',
        getRequestMode: () => 'mock',
        getRouteMode: () => 'static',
        getLayoutMode: () => 'left',
        isDark: () => false,
        getThemeTokens: () => ({
            '--ptadmin-theme-color': '#0f766e',
        }),
        getModuleConfig: (moduleKey: string) => moduleKey === mockMicroAppManifest.code
            ? {
                preview: true,
            }
            : null,
    },
})
