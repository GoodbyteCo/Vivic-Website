<template>
    <h2> Our Work </h2>
    <div class="select">
    <select v-model="selected">
        <option value="All Work" selected >All Work</option>
        <template v-for="option in options" :value="option.value">
            <option >
            {{ option.label }}
            </option>
        </template>
    </select>
  </div>
    <div>
        <template v-for="work in works" :key="work.title">
            <template v-if="work.topic === selected || selected === 'All Work'">
                <div class="card">
                    <div class="title">
                        <h2>{{work.title}}</h2>

                        <p>{{work.topic}}</p>
                    </div>
                    <p>{{work.astro.source}}</p>
                    <a :href="work.pdf">More</a>
                    
                </div>
            </template>
        </template>
    </div>
</template>

<script lang="ts">

import { defineComponent, PropType, ref, Ref } from 'vue'
import { toTitleCase } from '../utils/stringUtils'

type WorkData = {
    title: string
    pdf: string
    work: number
    topic: string
    date: string,
    astro: {
        headers: string[], 
        source: string,   
        html: string      
      },
    url: string
}

export default defineComponent({
    props: {
        works: {
            type: Array as PropType<WorkData[]>,
            required: true
        }
    },
    setup(props) {
        const selected: Ref<string> = ref("All Work")
        const options = 
        props.works
            .map(work => 
                ({ 
                    value: work.topic,
                    label: toTitleCase(work.topic)
                })
            )
            .filter((option, index, self) => 
                self.findIndex(t => t.value === option.value) === index
            )
            
        return {
            selected,
            options,
            }
    }
})

</script>

<style scoped>
.card {
    border: 10px solid;
    border-image-slice: 1;
    border-width: 5px;
    border-image-source: linear-gradient(to right, #fcd5e1, #fff, #def8f8);
    margin: 50px 0;
    padding: 10px 30px;

}

.title{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    row-gap: 15px;
}

.title p{
    font-size: 12pt;
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
  font-family: main;
  font-size: inherit;
  cursor: inherit;
  line-height: inherit;
  outline: none;
}

select::-ms-expand {
  display: none;
}

.select {
  width: 100%;
  min-width: 15ch;
  max-width: 30ch;
  border: 1px solid #777;
  border-radius: 0.25em;
  padding: 0.25em 0.5em;
  font-size: 1.25rem;
  cursor: pointer;
  line-height: 1.1;
  background-color: #fff;
  background-image: linear-gradient(to top, #f9f9f9, #fff 33%);
}
</style>