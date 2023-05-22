import { z, defineCollection } from 'astro:content'
import { toDate } from '../utils/dateUtils'

const workCollection = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		topic: z.enum([
			'Municipal', 'Provincial', 'Federal',
		]),
		date: z.union([ z.date(), z.string().transform((str) => toDate(str)) ]),
		externalLink: z.boolean(),
		pdf: z.union([
			z.string().endsWith('.pdf'), z.string().url(), z.array(z.object({ title: z.string(), link: z.string().endsWith('.pdf') })), 
		]),
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



