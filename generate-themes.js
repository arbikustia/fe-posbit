import fs from 'fs';
import path from 'path';
import { themeColors } from './src/lib/registry/themes.js';

const generateThemeCSS = (themes) => {
	return themes
		.map((theme) => {
			const { name, cssVars } = theme;
			const vars = Object.entries(cssVars)
				.map(([key, value]) => `    --${key}: ${value};`)
				.join('\n');

			return `  .theme-${name} {
${vars}
  }`;
		})
		.join('\n\n');
};

const cssContent = generateThemeCSS(themeColors);
const outputPath = path.join('static', 'registry', 'themes.css');
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, { recursive: true });
}
fs.writeFileSync(outputPath, cssContent, 'utf8');

console.log(`✅ Theme CSS generated at ${outputPath}`);
