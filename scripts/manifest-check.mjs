import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseFrontendManifest } from './frontend-manifest.mjs'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(currentDir, '..')

function readJSON(relativePath) {
    const filePath = path.join(projectRoot, relativePath)
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function fail(message) {
    console.error(`[manifest:check] ${message}`)
    process.exit(1)
}

function main() {
    const packageJSON = readJSON('package.json')
    const manifest = parseFrontendManifest(readJSON('frontend.json'))

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

    console.log(`[manifest:check] ok: ${manifest.code}@${manifest.version} (${manifest.runtime})`)
}

main()
