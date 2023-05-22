import { z, defineCollection } from 'astro:content'

const workCollection = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		topic: z.enum([
			'Municipal', 'Provincial', 'Federal',
		]),
		date: z.string().transform((str) => new Date(str)),
		externalLink: z.boolean(),
		pdf: z.union([ z.string().endsWith('.pdf'), z.string().url() ]),
	}),
})

const services = defineCollection({
	type: 'data',
	schema: z.object({
		title: z.string(),
		order: z.number(),
		description: z.string(),
	}),
})

export const collections = {
	'work': workCollection,
	'services': services,
}



