import { parseFrontendManifest } from './frontend-manifest.mjs'
import { syncManifestFiles } from './project-manifest.mjs'

function fail(message) {
    console.error(`[manifest:check] ${message}`)
    process.exit(1)
}

function main() {
    const { manifest: pluginManifest, frontendManifest, packageJSON } = syncManifestFiles()
    const manifest = parseFrontendManifest(frontendManifest)

    if (manifest.kind !== 'micro-app') {
        fail(`Expected frontend kind "micro-app", received "${manifest.kind}".`)
    }

    if (manifest.runtime !== 'wujie') {
        fail(`Micro app template expects runtime "wujie", received "${manifest.runtime}".`)
    }

    if (manifest.capabilities.routes || manifest.capabilities.pages || manifest.capabilities.widgets) {
        fail('Micro app frontend manifest should not expose module capabilities.')
    }

    if (typeof packageJSON.version !== 'string' || packageJSON.version.trim() === '') {
        fail('package.json version is required.')
    }

    if (manifest.version !== packageJSON.version) {
        fail(`frontend.json version "${manifest.version}" must match package.json version "${packageJSON.version}".`)
    }

    if (manifest.code !== pluginManifest.code || manifest.name !== pluginManifest.name) {
        fail('frontend.json shared fields must stay aligned with manifest.json.')
    }

    console.log(`[manifest:check] ok: ${manifest.code}@${manifest.version} (${manifest.runtime})`)
}

main()
