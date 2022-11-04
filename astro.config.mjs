import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import vue from '@astrojs/vue'


export default defineConfig({
	integrations: [ vue(), sitemap() ],
	site: 'https://vivicresearch.ca',
})