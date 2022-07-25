<template>
    <div class="jumbotron text-center">
        <div class="card">
            <div class="card-body">
                <div class="card-text">
                    <h1>{{totalPoints.toLocaleString()}}</h1>
                    <h6>Total points</h6>
                </div>
            </div>
        </div>
        <div class="card-group">
            <div class="card" v-for="source in talentSources">
                <div class="card-body" :style="{'background-color': source.colour}">
                    <div class="card-text">
                        <h2>{{calculatePoints(source).toLocaleString()}}</h2>
                        <h6>{{source.name}}</h6>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row" v-for="sourceChunk in chunk(talentSources, 2)">
        <div class="col-md-3" v-for="source in sourceChunk">
                <label class="form-label mt-1">{{source.name}}</label>
                <input class="form-control" type="number" min="0" v-model="source.used">
        </div>
    </div>
</template>

<script lang="ts">
import talentPoints from "./data/talentPoints.json";
import { chunk, sum, debounce } from "lodash";

const StorageKey = "talentcalculator-state"

export default {
    data() {
        return {
            talentSources: (this as any as _this).toCountableSources(talentPoints.talentSources),
            debouncedUpdate: debounce(() => {
                    (this as any as _this).saveState();
                }, 2000),
        }
    },
    computed: {
        totalPoints() {
            return sum((this as any as _this).talentSources
                .map(s => (this as any as _this).calculatePoints(s))
            );
        }
    },
    watch: {
        totalPoints: {
            handler(newValue: number, oldValue: number) {
                // Save the used values entered
                (this as any as _this).debouncedUpdate();
            },
            deep: true
        }
    },
    methods: {
        toCountableSources(sources: PointSource[]) : CountablePointSource[] {
            let initialState = this.loadState();
            let countables = sources.map(s => this.toCountableSource(s));

            if (initialState !== null){
                countables.forEach(source => {
                    let saved = initialState!.filter(s => s.name == source.name);
                    if(saved.length){
                        source.used = saved[0].used;
                    }
                });
            }
            
            return countables;
        },
        toCountableSource(source: PointSource): CountablePointSource {
            return {
                name: source.name,
                colour: source.colour,
                points: source.points,
                tiers: source.tiers,
                used: 0
            }
        },
        chunk<T>(items: Array<T>, chunkSize: number){
            return chunk(items, chunkSize);
        },
        calculatePoints(source: CountablePointSource) : number {
            // Points are tiered. e.g. 0 - 100 will give 10 points every 20 used
            //                         100 - 300 will give 20 points every 40 used
            // So, we can figure out which tier we have completed and just multiply by the
            // points constant, then see where we are in the final tier to see the last of the points.
            let tiersEntered = source.tiers
                .filter(t => t.from <= source.used);

            // Our current one is the last tier we entered (the highest used req.)
            let currentTier = tiersEntered[tiersEntered.length - 1];

            // We got this many points by reaching current tier.
            let basePoints = currentTier.from * source.points;

            // This is the "end tier", and we can't receive more points.
            if (currentTier.step === -1) {
                return basePoints;
            }

            // How far we are into current tier.
            let tierProgression = source.used - currentTier.from;

            // The value of the steps we've passed in the current tier. Just % step size
            // to see how many are done.
            let completedStepValue = tierProgression - (tierProgression % currentTier.step);
            return basePoints + completedStepValue * source.points;
        },
        saveState() {
            window.localStorage.setItem(StorageKey, JSON.stringify((this as any as _this).talentSources));
        },
        loadState() : CountablePointSource[] | null {
            let json = window.localStorage.getItem(StorageKey);

            if (!json) {
                return null;
            }

            return JSON.parse(json);
        }
    }
}

interface PointSource {
    name: string;
    colour: string;
    points: number;
    tiers: {
        from: number;
        step: number;
    }[];
}

interface CountablePointSource extends PointSource {
    used: number
}

interface _this {
    toCountableSource:(source: PointSource) => CountablePointSource;
    toCountableSources:(sources: PointSource[]) => CountablePointSource[];
    calculatePoints:(source: CountablePointSource) => number;

    saveState: () => void;
    loadState: () => CountablePointSource[] | null;
    debouncedUpdate: () => void;

    talentSources: CountablePointSource[];
}
</script>

<style scoped>
.card-group h2 {
    font-size: 1.75rem !important;
}

</style>