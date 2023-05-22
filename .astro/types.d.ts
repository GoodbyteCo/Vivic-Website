declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof AnyEntryMap> = AnyEntryMap[C][keyof AnyEntryMap[C]];

	// TODO: Remove this when having this fallback is no longer relevant. 2.3? 3.0? - erika, 2023-04-04
	/**
	 * @deprecated
	 * `astro:content` no longer provide `image()`.
	 *
	 * Please use it through `schema`, like such:
	 * ```ts
	 * import { defineCollection, z } from "astro:content";
	 *
	 * defineCollection({
	 *   schema: ({ image }) =>
	 *     z.object({
	 *       image: image(),
	 *     }),
	 * });
	 * ```
	 */
	export const image: never;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<
				import('astro/zod').AnyZodObject,
				import('astro/zod').AnyZodObject
		  >;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"services": {
"econmic-reasearch.md": {
	id: "econmic-reasearch.md";
  slug: "econmic-reasearch";
  body: string;
  collection: "services";
  data: any
} & { render(): Render[".md"] };
"policy-design.md": {
	id: "policy-design.md";
  slug: "policy-design";
  body: string;
  collection: "services";
  data: any
} & { render(): Render[".md"] };
};
"work": {
"alternative-municipal-budget-for-the-city-of-ottawa-2021.md": {
	id: "alternative-municipal-budget-for-the-city-of-ottawa-2021.md";
  slug: "alternative-municipal-budget-for-the-city-of-ottawa-2021";
  body: string;
  collection: "work";
  data: any
} & { render(): Render[".md"] };
"alternative-municipal-budget-for-the-city-of-ottawa-2022.md": {
	id: "alternative-municipal-budget-for-the-city-of-ottawa-2022.md";
  slug: "alternative-municipal-budget-for-the-city-of-ottawa-2022";
  body: string;
  collection: "work";
  data: any
} & { render(): Render[".md"] };
"check-and-balance.md": {
	id: "check-and-balance.md";
  slug: "check-and-balance";
  body: string;
  collection: "work";
  data: any
} & { render(): Render[".md"] };
"employment-impacts-of-spending-what-it-takes.md": {
	id: "employment-impacts-of-spending-what-it-takes.md";
  slug: "employment-impacts-of-spending-what-it-takes";
  body: string;
  collection: "work";
  data: any
} & { render(): Render[".md"] };
"employment-insurance-in-canada.md": {
	id: "employment-insurance-in-canada.md";
  slug: "employment-insurance-in-canada";
  body: string;
  collection: "work";
  data: any
} & { render(): Render[".md"] };
"how-to-reduce-the-depth-of-single-adult-povertyin-canada.md": {
	id: "how-to-reduce-the-depth-of-single-adult-povertyin-canada.md";
  slug: "how-to-reduce-the-depth-of-single-adult-povertyin-canada";
  body: string;
  collection: "work";
  data: any
} & { render(): Render[".md"] };
"key-performance-indicator-roadmap.md": {
	id: "key-performance-indicator-roadmap.md";
  slug: "key-performance-indicator-roadmap";
  body: string;
  collection: "work";
  data: any
} & { render(): Render[".md"] };
"labour-markets-and-the-competition-act.md": {
	id: "labour-markets-and-the-competition-act.md";
  slug: "labour-markets-and-the-competition-act";
  body: string;
  collection: "work";
  data: any
} & { render(): Render[".md"] };
"labour-shortages-monopsony-power-and-their-role-in-our-current-labour-markets.md": {
	id: "labour-shortages-monopsony-power-and-their-role-in-our-current-labour-markets.md";
  slug: "labour-shortages-monopsony-power-and-their-role-in-our-current-labour-markets";
  body: string;
  collection: "work";
  data: any
} & { render(): Render[".md"] };
"making-ontario-a-safer-place-to-work.md": {
	id: "making-ontario-a-safer-place-to-work.md";
  slug: "making-ontario-a-safer-place-to-work";
  body: string;
  collection: "work";
  data: any
} & { render(): Render[".md"] };
"monopoly-and-the-covid-recovery.md": {
	id: "monopoly-and-the-covid-recovery.md";
  slug: "monopoly-and-the-covid-recovery";
  body: string;
  collection: "work";
  data: any
} & { render(): Render[".md"] };
"no-one-left-behind.md": {
	id: "no-one-left-behind.md";
  slug: "no-one-left-behind";
  body: string;
  collection: "work";
  data: any
} & { render(): Render[".md"] };
"non-police-mental-health-crisis-response-for-the-city-of-ottawa.md": {
	id: "non-police-mental-health-crisis-response-for-the-city-of-ottawa.md";
  slug: "non-police-mental-health-crisis-response-for-the-city-of-ottawa";
  body: string;
  collection: "work";
  data: any
} & { render(): Render[".md"] };
"playing-the-long-game-keeping-newfoundland-and-labradors-economy-diverse-and-sustainable.md": {
	id: "playing-the-long-game-keeping-newfoundland-and-labradors-economy-diverse-and-sustainable.md";
  slug: "playing-the-long-game-keeping-newfoundland-and-labradors-economy-diverse-and-sustainable";
  body: string;
  collection: "work";
  data: any
} & { render(): Render[".md"] };
"reforming-the-competition-act.md": {
	id: "reforming-the-competition-act.md";
  slug: "reforming-the-competition-act";
  body: string;
  collection: "work";
  data: any
} & { render(): Render[".md"] };
"seven-reasons-why-privatization-of-public-services-is-the-wrong-answer.md": {
	id: "seven-reasons-why-privatization-of-public-services-is-the-wrong-answer.md";
  slug: "seven-reasons-why-privatization-of-public-services-is-the-wrong-answer";
  body: string;
  collection: "work";
  data: any
} & { render(): Render[".md"] };
"study-of-competition-issues-in-data-driven-markets-in-canada.md": {
	id: "study-of-competition-issues-in-data-driven-markets-in-canada.md";
  slug: "study-of-competition-issues-in-data-driven-markets-in-canada";
  body: string;
  collection: "work";
  data: any
} & { render(): Render[".md"] };
"towards-equitable-post-secondary-education-in-canada.md": {
	id: "towards-equitable-post-secondary-education-in-canada.md";
  slug: "towards-equitable-post-secondary-education-in-canada";
  body: string;
  collection: "work";
  data: any
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = never;
}
