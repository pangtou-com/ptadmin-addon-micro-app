import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseFrontendManifest } from './frontend-manifest.mjs'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(currentDir, '..')

const manifest = parseFrontendManifest(
    JSON.parse(fs.readFileSync(path.join(projectRoot, 'frontend.json'), 'utf-8')),
)

console.log(JSON.stringify(manifest, null, 2))
