declare module '*.vue' {
    import type { DefineComponent } from 'vue'

    const component: DefineComponent<Record<string, never>, Record<string, never>, any>
    export default component
}

declare global {
    interface Window {
        __POWERED_BY_WUJIE__?: boolean
        __WUJIE_MOUNT?: () => void
        __WUJIE_UNMOUNT?: () => void
        $wujie?: {
            props?: Record<string, any>
        }
    }
}

export {}

