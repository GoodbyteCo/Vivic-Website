import vue from '@astrojs/vue'
// @ts-check
export default /** @type {import('astro').AstroUserConfig} */ ({
	integrations: [vue(),],
	buildOptions: {
		site: 'https://vivicresearch.ca',
		sitemap: true,
	},
});