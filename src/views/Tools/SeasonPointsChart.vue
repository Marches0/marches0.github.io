<template>
    <!-- <canvas id="event-efficiency-chart"></canvas> -->
    <Line v-if="seasonEvent"
        :chart-options="chartOptions"
        :chart-data="chartData!"
        chart-id="chartId"
        dataset-id-key="datasetIdKey"
        style="height: 50vh; max-height:50vh; max-width:100%;"
    />
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import type { PropType } from 'vue'

import type { SeasonEvent } from '@/types/SeasonEvent'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'
import {hexToRGB} from "@/helpers/ColourHelper";
import annotationPlugin from 'chartjs-plugin-annotation';

// tree-shaking it seems
ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, annotationPlugin);

export default defineComponent({
    components: { Line },
    props: {
        seasonEvent: Object as PropType<SeasonEvent>,
        currencyUsed: Number,
        lastTierIndex: Number
    },
    mounted(){
        //this.addPlugin();
        //ChartJS.plugins
    },
    methods: {
        
    },
    computed: {
        chartOptions() {
            if (this.seasonEvent === undefined){
                return;
            }

            var anno = {};
            if(this.lastTierIndex !== undefined) {
                // Off by one. 
                let xPos = this.lastTierIndex - 1;

                anno = {
                    lastTierLine: {
                            type: 'line',
                            xMin: xPos,
                            xMax: xPos,
                            borderColor: 'rgb(0, 0, 0, 0.25)',
                            borderDash: [30, 15],
                            borderWidth: 2,
                            label: {
                                content: this.currencyUsed?.toLocaleString(),
                                backgroundColor: 'rgb(0, 0, 0, 0.25)',
                                enabled: true
                            }
                        }
                };
            }

            return {
                scales: {
                    x: {
                        title:{
                            display: true,
                            text: this.seasonEvent.seasonCurrency
                        },
                        grid: {
                        display: false
                        }
                    },
                    y: {
                        title:{
                            display: true,
                            text: "Total Season Points per " + this.seasonEvent.seasonCurrency
                        },
                        grid: {
                        display: false
                        }
                    }
                },
                // There's a bindable prop for plugins,
                // but I couldn't get it working.
                plugins: {
                    annotation: {
                        annotations: anno
                    }
                },
                maintainAspectRatio: false,
                responsive: true
            }
        },
        chartData() {
            if (this.seasonEvent === undefined){
                return;
            }

            let data: DataPoint[] = [];
            let totalScore = 0;

            this.seasonEvent.seasonPoints.forEach(tier => {
                // [0] = currency for this tier
                // [1] = season points for this tier
                if (tier[0] !== 0){
                totalScore += tier[1];

                data.push({
                    x: tier[0],
                    y: totalScore / tier[0]
                });
                }
            });

            return {
                labels: data.map(d => d.x.toLocaleString()),
                datasets: [{
                    label: "Efficiency",
                    data: data,
                    fill: false,
                    borderColor: hexToRGB(this.seasonEvent.colour, 0.5),
                    tension: 0.001
                }]
            };
        }
    },
})

interface DataPoint{
    x: number;
    y: number;
}

</script>