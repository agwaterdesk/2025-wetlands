#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const projectConfig = require('../project.config.json');

const ROOT_PATH = join(__dirname, '..');
const DIST_PATH = join(ROOT_PATH, 'dist');
const OUTPUT_PATH = join(ROOT_PATH, 'ghost-embed.html');

const DEFAULT_CDN_BASE_URL = (projectConfig.build?.cdnBaseUrl || '').replace(/\/?$/, '/');
const EMBED_CONTAINER_ID = projectConfig.build?.embedContainerId || 'proj-container';

export function pinCdnBaseUrl(baseUrl, gitRef) {
	const normalized = baseUrl.replace(/\/?$/, '/');
	if (!gitRef) return normalized;
	return normalized.replace(/@[^/]+(?=\/)/, `@${gitRef}`);
}

export function extractFileInfo(htmlContent) {
	const jsMatch = htmlContent.match(/src="\.\/assets\/([^"]+\.js)"/);
	const cssMatch = htmlContent.match(/href="\.\/assets\/([^"]+\.css)"/);

	return {
		jsFile: jsMatch?.[1] ?? null,
		cssFile: cssMatch?.[1] ?? null
	};
}

export function distAssetPaths(info, distPath = DIST_PATH) {
	const paths = [];
	if (info.cssFile) paths.push(join(distPath, 'assets', info.cssFile));
	if (info.jsFile) paths.push(join(distPath, 'assets', info.jsFile));
	return paths;
}

export function assertDistAssets(info, distPath = DIST_PATH) {
	const missing = distAssetPaths(info, distPath).filter((path) => !existsSync(path));

	if (missing.length) {
		const lines = missing.map((path) => `   - ${relative(ROOT_PATH, path)}`).join('\n');
		throw new Error(`dist/ is missing assets referenced by the embed:\n${lines}`);
	}
}

function containerAttributes() {
	const layout = projectConfig.layout || {};
	const { mode, maxWidthPx, horizontalPadding = '0' } = layout;
	const styles = ['width:100%', 'box-sizing:border-box', `padding-inline:${horizontalPadding}`];
	if (mode === 'column' && maxWidthPx) {
		styles.push(`max-width:${maxWidthPx}px`, 'margin-inline:0');
	}
	return `id="${EMBED_CONTAINER_ID}" style="${styles.join(';')}"`;
}

const EMBED_STYLES = `<style>
.full-bleed {
	width: 100vw;
	margin-left: calc(50% - 50vw);
	margin-right: calc(50% - 50vw);
}
#${EMBED_CONTAINER_ID} {
	isolation: isolate;
}
</style>`;

export function generateEmbedHTML(info, cdnBaseUrl = DEFAULT_CDN_BASE_URL) {
	const { jsFile, cssFile } = info;
	const baseUrl = cdnBaseUrl.replace(/\/?$/, '/');

	return `<!-- Ghost embed bundle (see project.config.json → build) -->
<!--
1. npm run build:embed
2. Publish docs/ to GitHub (make github) so jsDelivr can serve assets
3. Paste this block into a Ghost HTML card

CDN base: ${baseUrl}
-->

${EMBED_STYLES}

<link rel="stylesheet" crossorigin href="${baseUrl}assets/${cssFile}">

<div class="full-bleed">
<div ${containerAttributes()}>
	<p>Loading…</p>
</div>
</div>

<script>
(function () {
	const script = document.createElement("script");
	script.type = "module";
	script.crossOrigin = "anonymous";
	script.src = ${JSON.stringify(baseUrl + 'assets/' + jsFile)};
	script.addEventListener("error", () => {
		console.error("Svelte app failed to load from CDN");
		const container = document.getElementById(${JSON.stringify(EMBED_CONTAINER_ID)});
		if (container) {
			container.innerHTML = "<p>Error loading story. If assets load in the browser but not here, your site may block external scripts (CSP). Allow https://cdn.jsdelivr.net in script-src.</p>";
		}
	});
	document.head.appendChild(script);
})();
</script>`;
}

export function runGenerateEmbed({
	distPath = DIST_PATH,
	outputPath = OUTPUT_PATH,
	cdnBaseUrl = DEFAULT_CDN_BASE_URL,
	quiet = false
} = {}) {
	if (!cdnBaseUrl) {
		throw new Error('Missing build.cdnBaseUrl in project.config.json');
	}

	const indexHtmlPath = join(distPath, 'index.html');

	if (!existsSync(indexHtmlPath)) {
		throw new Error('dist/index.html not found. Run "npm run build" first.');
	}

	const htmlContent = readFileSync(indexHtmlPath, 'utf-8');
	const fileInfo = extractFileInfo(htmlContent);

	if (!fileInfo.cssFile || !fileInfo.jsFile) {
		throw new Error('Could not extract embed asset paths from dist/index.html');
	}

	assertDistAssets(fileInfo, distPath);

	const embedHTML = generateEmbedHTML(fileInfo, cdnBaseUrl);
	writeFileSync(outputPath, embedHTML);

	if (!quiet) {
		console.log('✅ ghost-embed.html written');
		console.log(`   CDN: ${cdnBaseUrl.replace(/\/?$/, '/')}`);
		console.log(`   Container: #${EMBED_CONTAINER_ID}`);
		console.log(`   JS: assets/${fileInfo.jsFile}`);
		console.log(`   CSS: assets/${fileInfo.cssFile}`);
	}

	return fileInfo;
}

function main() {
	const gitRef = process.argv.find((arg) => arg.startsWith('--ref='))?.slice(6);
	const cdnBaseUrl = pinCdnBaseUrl(DEFAULT_CDN_BASE_URL, gitRef);

	console.log('🔍 Checking for dist/index.html...');

	try {
		runGenerateEmbed({ cdnBaseUrl });
		console.log('📦 Publish docs/ (make github), then paste ghost-embed.html into a Ghost HTML card.');
		if (!gitRef) {
			console.log('💡 Tip: pin assets with --ref=<tag-or-sha>, e.g. node tasks/generate-embed.js --ref=abc1234');
		}
	} catch (error) {
		console.error(`❌ ${error.message}`);
		process.exit(1);
	}
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
	main();
}
