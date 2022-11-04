<template>
	<div class="work-header">
		<h2>Our Work</h2>
		<div class="select">
			<select v-model="selected">
				<option value="All Work" selected>All Work</option>
				<option v-for="option in options" :value="option.value">
					{{ option.label }}
				</option>
			</select>
		</div>
	</div>
	<div>
		<template v-for="work in workSorted" :key="work.title">
			<template v-if="(work.topic.toLowerCase() === selected.toLowerCase()) || (selected === 'All Work')">
				<a class="card" :href="(work.externalLink) ? work.pdf : work.url">
					<div class="title">
						<h2>
							{{work.title}}&nbsp;&nbsp;<span class="topic">{{work.topic}}</span>
						</h2>
						<h3><span class="date">{{toDateFormat(work.date)}}</span></h3>
					</div>
					<p>
						{{work.source}}
					</p>
				</a>
			</template>
		</template>
	</div>
</template>

<script lang="ts">
	import { defineComponent, PropType, ref, Ref, onMounted, watch, computed } from 'vue'
	import { toTitleCase } from '../utils/stringUtils'

	type WorkData = {
		title: string
		pdf: string
		topic: string
		date: Date,
		source: string,     
		url: string
		externalLink: boolean
	}

	export default defineComponent({
		props: {
			works: {
				type: Array as PropType<WorkData[]>,
				required: true
			}
		},
		setup(props) {
			const selected: Ref<string> = ref("")
			const workSorted = props.works
				.sort((a, b) => a.date.getTime() - b.date.getTime())
				.reverse()

			const options = props.works
				.map(work => ({ value: work.topic, label: toTitleCase(work.topic) }))
				.filter((option, index, self) => (self.findIndex(t => t.value === option.value) === index))

			onMounted(() => {
				const urlParams = new URLSearchParams(window.location.search);
				const selectedFromUrl = urlParams.get("topic") ?? ""
				selected.value = toTitleCase(selectedFromUrl) || "All Work"
			})

			watch(selected, (currentSelected) => {
				if(currentSelected != "All Work") {
					window.history.replaceState(null, null, `/work?topic=${currentSelected.toLowerCase()}`)
				}
				else {
					window.history.replaceState(null ,null, `/work`)
				}
			})

			const toDateFormat = (date: Date) => {
				return date.toLocaleString('en-US', {year: 'numeric', month: "long"})
			}

				
			return {
				selected,
				options,
				workSorted,
				toDateFormat
			}
		}
	})
</script>

<style scoped>
	.card {
		display: block;
		border: 10px solid;
		border-image-slice: 1;
		border-width: 8px;
		border-image-source: linear-gradient(to right, #fcd5e1, #fff, #def8f8);
		margin: 50px 0;
		padding: 10px 30px;
		color: var(--white);
		text-decoration: none;
	}

	.card p {
		line-height: 1.6;
		margin-bottom: 23px;
	}

	h2 {
		font-size: 30px;
	}

	.topic {
		display: inline-block;
		font-size: 0.5em;
		background: linear-gradient(to right, #fcd5e1, #fff, #def8f8);
		color: var(--dark);
		line-height: 1;
		letter-spacing: 0.03em;
		text-transform: uppercase;
		padding: 0.3em 1ch 0.25em;
		border-radius: 100px;
		transform: translateY(-3px);
	}

	.date {
		font-weight: normal;

	}

	.title {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		row-gap: 15px;
	}

	.title h2 {
		margin-bottom: 0;
	}

	.title h3 {
		margin-top: 0;
	}

	.work-header {
		display: flex;
		align-content: center;
		justify-content: space-between;
	}

	select,
	select::before,
	select::after {
		box-sizing: border-box;
	}

	select {
		appearance: none;
		background-color: transparent;
		border: none;
		padding: 0 1em 0 0;
		margin: 0;
		width: 100%;
		font-family: var(--mainfont);
		font-size: inherit;
		cursor: inherit;
		line-height: inherit;
		outline: none;
		color: #fff;
		transform: translateY(2px);
	}

	select::-ms-expand {
		display: none;
	}

	.select {
		display: grid;
		grid-template-areas: "select";
		align-items: center;
		justify-self: end;
		position: relative;
		min-width: 11ch;
		max-width: 19ch;
		max-height: 25px;
		border-radius: 2px;
		padding: 0.25em 0.5em;
		font-size: 1.25rem;
		cursor: pointer;
		line-height: 1.1;
		background-color: rgba(255, 255, 255, 0.2);
		margin-block-start: 0.83em;
		margin-block-end: 0.83em
	}

	.select::after {
		content: "";
		justify-self: end;
		width: 0.8em;
		height: 0.5em;
		background-color: var(--secondary);
		clip-path: polygon(100% 0%, 0 0%, 50% 100%);
	}

	.select select, .select::after {
		grid-area: select;
	}

	.select:focus-within {
		box-shadow: 0 0 0 4px var(--secondary);
	}

	.card:hover, .card:focus {
		color: var(--secondary);
		border-image-source: unset;
		border: 8px solid var(--secondary);
	}

	.card:hover .date, .card:focus .date {
		color: var(--secondary)
	}

	.card:hover .topic, .card:focus .topic{
		background: var(--secondary);
	}

	@media screen and (max-width: 485px) {
		.work-header {
			flex-direction: column;
		}
	}
</style>
