<template>

<div class="jumbotron text-center">
    <div class="card-group">
        <div class="card" v-for="minister in superHeroines">
            <div class="card-body" :style="{'background-color': minister.colour}">            
                <div class="card-text">
                    <h1>{{possibleSouls[minister.name].toFixed(1)}}</h1>
                    {{minister.name}}
                </div>
            </div>
        </div>
    </div>
    <br>
    <div class="card-group">
        <div class="card" v-for="minister in starDeities">
            <div class="card-body" :style="{'background-color': minister.colour}">            
                <div class="card-text">
                    <h1>{{possibleSouls[minister.name].toFixed(1)}}</h1>
                    {{minister.name}}
                </div>
            </div>
        </div>
    </div>
</div>

<div v-for="itemSet in soulItemsChunks">
    <div class="row mt-2">
        <div :class="soulItemColumn" v-for="item in itemSet">
        <label>{{item.name}}</label>
        <input type="number" class="form-control" v-model="soulItemCounts[item.name].count">
        </div>
    </div>
</div>

<br>
<div class="form-group">
    <p><i>This list is in the same order as items appear in your inventory. Some items are missing - message me if you know them. The values you enter here are saved in your browser, so you will be able to view them again later.</i></p>
    <label>Items per row</label>
    <select class="form-control" @input="onEventSelected" v-model="soulItemsPerRow">
        <option>1</option>
        <option>2</option>
        <option selected>3</option>
        <option>4</option>
    </select>
    
</div>
 
</template>

<script lang="ts">
import souls from "./data/ministerSouls.json";
import { chunk } from "lodash"

export default {
    data() {
        return {
            superHeroines: souls.ministers
                .filter(m => m.type === "superHeroine")
                .map(sh => (this as any as _this).toCountableMinister(sh)),
            starDeities: souls.ministers
                .filter(m => m.type === "starDeity")
                .map(sh => (this as any as _this).toCountableMinister(sh)),
            soulItems: souls.items
                .map(i => (this as any as _this).toCountableItem(i)),
            soulItemCounts: (this as any as _this).toItemCounter(souls.items),
            possibleSouls: Object.assign({}, ...souls.ministers.map((m) => ({[m.name]: 0}))),
            soulItemsPerRow: 3
        };
    },
    watch: {
        // Update the soul counts when the item count is updated.
        soulItemCounts: {
            handler(newValue: { [key: string]: CountableItem }, oldValue: any) {
                // Reset and recount.
                (this as any as _this).possibleSouls = Object.assign({}, ...souls.ministers.map((m) => ({[m.name]: 0})));

                Object.entries(newValue).forEach(
                    ([name, item]) => {
                        item.souls.ministers.forEach(minister => {
                            (this as any as _this).possibleSouls[minister] += item.souls.unit * item.count
                        });
                });
            },
            // We need to watch the values of the dictionary
            deep: true
        }
    },
    computed: {
        soulItemColumn() {
            return "col-md-" + (12 / (this as any as _this).soulItemsPerRow)
        },
        soulItemsChunks() {
            return chunk(
                souls.items.map(i => (this as any as _this).toCountableItem(i)),
                (this as any as _this).soulItemsPerRow);
        }
    },
    methods: {
        toCountableMinister(minister: Minister) : CountableMinister {
            return {
                name: minister.name,
                colour: minister.colour,
                type: minister.type,
                souls: 0
            }
        },
        toItemCounter(items: Item[]) : { [key: string]: CountableItem } {
            let itemCounter: { [key: string]: CountableItem } = {};
            items.forEach(item => {
                itemCounter[item.name] = this.toCountableItem(item);
            });
            return itemCounter;
        },
        toCountableItem(item: Item) : CountableItem {
            return {
                name: item.name,
                souls: item.souls,
                count: 0 // loads from storage
            }
        }
    }
}

interface Minister {
    name: string;
    colour: string;
    type: string;
}

interface CountableMinister extends Minister {
    souls: number;
}

interface Item {
    name: string;
    souls: {
        unit: number;
        ministers: string[];
    };
}

interface CountableItem extends Item {
    count: number;
}

interface _this{
    toCountableMinister:(minister: Minister) => CountableMinister;
    toItemCounter:(items: Item[]) => { [key: string]: CountableItem };
    toCountableItem:(item: Item) => CountableItem;
    soulItemCounts: { [key: string]: CountableItem };
    possibleSouls:{ [key: string]: number };
    soulItemsPerRow: number;
}

</script>