<template>

<div class="jumbotron text-center">
    <div class="card-group">
        <div class="card" v-for="minister in starDeities" v-tooltip:bottom="getTooltip(minister)">
            <div class="card-body" :style="{'background-color': minister.colour}">            
                <div class="card-text">
                    <h1>{{displaySoulCount(possibleSouls[minister.name])}}</h1>
                    <h6>{{minister.name}}</h6>
                </div>
            </div>
        </div>
    </div>
    <br>
    <div class="card-group">
        <div class="card" v-for="minister in superHeroines" v-tooltip:bottom="getTooltip(minister)">
            <div class="card-body" :style="{'background-color': minister.colour}">            
                <div class="card-text">
                    <h1>{{displaySoulCount(possibleSouls[minister.name])}}</h1>
                    <h6>{{minister.name}}</h6>
                </div>
            </div>
        </div>
    </div>
</div>

<div v-for="itemSet in soulItemsChunks">
    <div class="row mt-2">
        <div :class="soulItemColumn" v-for="item in itemSet">
        <label>{{item.name}}</label>
        <input type="number" class="form-control" v-model="soulItemCounts[item.name].count" min="0">
        </div>
    </div>
</div>

<br>
<div class="row">
    <p><i>This list is in the same order as items appear in your inventory. Some items are missing - message me if you know them. The values you enter here are saved in your browser, so you will be able to view them again later.</i></p>
    <p><i>Hover/tap on a minister's soul count to see the items that contributed towards it.</i></p>
    <p><i>If this isn't proof that souls have gotten out of hand, I don't know what is.</i></p>
    <div class="col-md-3">
        <div class="form-group">
            <label>Items per row</label>
            <select class="form-control" @input="onEventSelected" v-model="soulItemsPerRow">
                <option>1</option>
                <option>2</option>
                <option selected>3</option>
                <option>4</option>
            </select>
        </div>
        <div class="form-check">
            <label>Show fractional souls</label>
            <input class="form-check-input" type="checkbox" v-model="showFractionalSouls">
        </div>
    </div>
</div>
    
 
</template>

<script lang="ts">
import souls from "./data/ministerSouls.json";
import { chunk, debounce, min, sortBy } from "lodash"

const StorageKey = "ministersoulcalculator-state"

export default {
    data() {
        return {
            superHeroines: souls.ministers
                .filter(m => m.type === "superHeroine"),
            starDeities: souls.ministers
                .filter(m => m.type === "starDeity"),

            possibleSouls: (this as any as _this).loadInitialSoulCount(),
            soulItemCounts: (this as any as _this).toItemCounter(souls.items),
            soulItemsPerRow: (this as any as _this).loadState()?.itemsPerRow ?? 3,
            debouncedUpdate: debounce(() => {
                    (this as any as _this).saveState();
                }, 2000),
            
            showFractionalSouls: (this as any as _this).loadState()?.showFractionalSouls ?? false
        };
    },
    watch: {
        // Update the soul counts when the item count is updated.
        soulItemCounts: {
            handler(newValue: { [key: string]: CountableItem }, oldValue: any) {
                (this as any as _this).updateSoulCount(newValue);
                // Save the items to local storage.
                (this as any as _this).debouncedUpdate();
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
                (this as any as _this).soulItemsPerRow
            );
        }
    },
    methods: {
        toItemCounter(items: Item[]) : { [key: string]: CountableItem } {
            var savedState = this.loadState();

            // Rather than loading saved state in, populate from config and then
            // update values - this means we don't miss out on new ones, and anything
            // that gets removed (unlikely) won't appear just because it's been saved.
            let itemCounter: { [key: string]: CountableItem } = {};
            items.forEach(item => {
                itemCounter[item.name] = this.toCountableItem(item);
                
                if (savedState !== null && savedState.soulItemCounts[item.name]) {
                    itemCounter[item.name].count = savedState.soulItemCounts[item.name].count;
                }
            });

            this.updateSoulCount(itemCounter);

            return itemCounter;
        },
        toCountableItem(item: Item) : CountableItem {
            return {
                name: item.name,
                souls: item.souls,
                count: 0 // loads from storage
            }
        },
        loadInitialSoulCount() {
            let soulCount = Object.assign({}, ...souls.ministers.map((m) => ({[m.name]: 0})));
            let initialItemState = this.loadState()?.soulItemCounts;

            if (initialItemState){
                Object.entries(initialItemState).forEach(
                ([name, item]) => {
                    item.souls.ministers.forEach(minister => {
                        soulCount[minister] += item.souls.unit * item.count
                    });
                });
            }

            return soulCount;
        },
        updateSoulCount(itemCount: { [key: string]: CountableItem }) {
            // Reset and recount.
            let newSouls = Object.assign({}, ...souls.ministers.map((m) => ({[m.name]: 0})));

            Object.entries(itemCount).forEach(
                ([name, item]) => {
                    item.souls.ministers.forEach(minister => {
                        newSouls[minister] += item.souls.unit * item.count
                    });
            });

            // Fully wipe the object so things are happily reactive - was having
            // issues in prod builds when only updating values.
            (this as any as _this).possibleSouls = newSouls;
        },
        displaySoulCount(souls: number) {
            return (this as any as _this).showFractionalSouls
                ? souls.toFixed(1)
                : Math.floor(souls);
        },
        saveState() {
            let state: SavedState = {
                itemsPerRow: (this as any as _this).soulItemsPerRow,
                soulItemCounts: (this as any as _this).soulItemCounts,
                showFractionalSouls: (this as any as _this).showFractionalSouls
            };

            window.localStorage.setItem(StorageKey, JSON.stringify(state));
        },
        loadState(): SavedState | null {
            let json = window.localStorage.getItem(StorageKey);

            if (!json) {
                return null;
            }

            return JSON.parse(json);
        },
        getTooltip(minister: Minister) {
            // No tooltip if there are no souls
            if ((this as any as _this).possibleSouls[minister.name] === 0){
                return "";
            }

            // Clone so we can fiddle with it later
            let items: CountableItem[] = Object.values((this as any as _this).soulItemCounts)
                .map(i => ({
                    name: i.name,
                    count: i.count,
                    souls: i.souls,
                }));

            let ministerSoulItems = items
                .filter(i => i.count > 0 && i.souls.ministers.indexOf(minister.name) !== -1);

            // Add soul shards as a seperate entry, so we don't have
            // 123.4 souls making things unaligned
            let soul = ministerSoulItems.filter(s => s.name === `${minister.name} Soul`);
            if(soul.length && !Number.isInteger(soul[0].count)) {
                let fullSouls = Math.floor(soul[0].count);
                let fractionalSouls = soul[0].count - fullSouls;

                soul[0].count = fullSouls;
                ministerSoulItems.push({
                    name: `${minister.name} Soul Shard`,
                    count: fractionalSouls * 10,
                    souls: soul[0].souls
                })
            }

            // The most specific items (i.e. ones that apply to the fewest ministers) are first priority.
            // Put shard boxes after souls because they look worse.
            let priorityItems = sortBy(ministerSoulItems, ["souls.ministers.length", "souls.unit"], ["asc", "asc"]);

            // this is so gnarly.
            let tooltipHtml = "<ul>";

            let longestPad = priorityItems
                .map(i => i.count.toLocaleString())
                .sort((a, b) => b.length - a.length)
                [0].length;

            priorityItems.forEach(item => {
                // Pad to line up item counts
                // Use nonbreaking space so it renders
                let itemCount = item.count.toFixed(0).toString() + " ";
                tooltipHtml += "<li>" + itemCount.padStart(longestPad + 1, '\xa0') + item.name + "</li>";
            });

            tooltipHtml += "</ul>";

            return tooltipHtml;
        }
    }
}

interface Minister {
    name: string;
    colour: string;
    type: string;
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

interface SavedState {
    itemsPerRow: number;
    soulItemCounts: { [key: string]: CountableItem };
    showFractionalSouls: boolean;
}

interface _this {
    toItemCounter:(items: Item[]) => { [key: string]: CountableItem };
    toCountableItem:(item: Item) => CountableItem;
    soulItemCounts: { [key: string]: CountableItem };
    possibleSouls:{ [key: string]: number };

    soulItemsPerRow: number;
    showFractionalSouls: boolean;

    saveState: () => void;
    loadState: () => SavedState | null;
    loadInitialSoulCount: () => { [key: string]: CountableItem };
    updateSoulCount: (itemCount: { [key: string]: CountableItem }) => void;
    debouncedUpdate: () => void;
}

</script>
<style>
/* Scoped styles don't work with tooltips */
.tooltip ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    text-align: left;
    max-width: none;
    text-size-adjust: 200%;
    font-size: larger;
    /* Fullwidth so the item numbers line up */
    font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
}

.tooltip-inner{
    max-width: none;
}
</style>