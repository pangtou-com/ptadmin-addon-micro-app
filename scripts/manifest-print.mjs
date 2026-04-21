import { parseFrontendManifest } from './frontend-manifest.mjs'
import { syncManifestFiles } from './project-manifest.mjs'

const { frontendManifest } = syncManifestFiles()
const manifest = parseFrontendManifest(frontendManifest)

console.log(JSON.stringify(manifest, null, 2))
