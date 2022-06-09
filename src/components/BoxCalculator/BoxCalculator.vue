<template>

<div class="jumbotron text-center">

    <div v-for="rewardGroup in rewardGroups">
        <div class="card-group">
            <div class="card" v-for="reward in rewardGroup.Rewards" v-tooltip:bottom="getTooltip(reward)">
                <div class="card-body" :style="{'background-color': reward.colour}">            
                    <div class="card-text">
                        <h1>{{displayRewardCount(possibleRewards[reward.name])}}</h1>
                        <h6>{{reward.name}}</h6>
                    </div>
                </div>
            </div>
        </div>

        <br>
    </div>
</div>

<div v-for="itemSet in boxChunks">
    <div class="row mt-2">
        <div :class="boxColumn" v-for="item in itemSet">
        <label>{{item.name}}</label>
        <input type="number" class="form-control" v-model="boxCounts[item.name].count" min="0">
        </div>
    </div>
</div>

<br>
<div class="row">
    <p><i>This list is in the same order as items appear in your inventory. Some items are missing - message me if you know them. The values you enter here are saved in your browser, so you will be able to view them again later.</i></p>
    <p><i>Hover/tap on an item count to see the boxes that contributed towards it.</i></p>
    <div class="col-md-3">
        <div class="form-group">
            <label>Items per row</label>
            <select class="form-control" @input="onEventSelected" v-model="boxesPerRow">
                <option>1</option>
                <option>2</option>
                <option selected>3</option>
                <option>4</option>
            </select>
        </div>
        <div class="form-check">
            <label>Show fractional souls</label>
            <input class="form-check-input" type="checkbox" v-model="showFractionalRewards">
        </div>
    </div>
</div>
    
 
</template>

<script lang="ts">
import { chain, chunk, debounce, sortBy } from "lodash"

export default {
    props: {
        boxRewards: Array,
        boxes: Array,
        storageKey: String
    },
    mounted(){
        // Ideally this would be build time
        let itemNames = (this as any as _this).boxRewards.map(r => r.name);
        let boxRewardItems = (this as any as _this).boxes.flatMap(b => b.items.itemNames);

        boxRewardItems.filter(m => itemNames.indexOf(m) === -1).forEach(element => {
            console.warn("invalid: " + element);
        });
    },
    data() {
        return {
            rewardGroups: chain((this as any as _this).boxRewards)
                .groupBy(r => r.type)
                .map((value, key) => ({Key: key, Rewards: value}))
                .sortBy(e => e.Key)
                .value(),

            possibleRewards: (this as any as _this).loadInitialRewardCount(),
            boxCounts: (this as any as _this).toItemCounter((this as any as _this).boxes),
            boxesPerRow: (this as any as _this).loadState()?.itemsPerRow ?? 3,
            debouncedUpdate: debounce(() => {
                    (this as any as _this).saveState();
                }, 2000),
            
            showFractionalRewards: (this as any as _this).loadState()?.showFractionalRewards ?? false
        };
    },
    watch: {
        // Update the reward counts when the item count is updated.
        boxCounts: {
            handler(newValue: { [key: string]: CountableBox }, oldValue: any) {
                (this as any as _this).updateRewardCount(newValue);
                // Save the items to local storage.
                (this as any as _this).debouncedUpdate();
            },
            // We need to watch the values of the dictionary
            deep: true
        }
    },
    computed: {
        boxColumn() {
            return "col-md-" + (12 / (this as any as _this).boxesPerRow)
        },
        boxChunks() {
            return chunk(
                (this as any as _this).boxes.map(b => (this as any as _this).toCountableItem(b)),
                (this as any as _this).boxesPerRow
            );
        }
    },
    methods: {
        toItemCounter(items: Box[]) : { [key: string]: CountableBox } {
            var savedState = this.loadState();

            // Rather than loading saved state in, populate from config and then
            // update values - this means we don't miss out on new ones, and anything
            // that gets removed (unlikely) won't appear just because it's been saved.
            let itemCounter: { [key: string]: CountableBox } = {};
            items.forEach(item => {
                itemCounter[item.name] = this.toCountableItem(item);
                
                if (savedState !== null && savedState.boxCounts[item.name]) {
                    itemCounter[item.name].count = savedState.boxCounts[item.name].count;
                }
            });

            this.updateRewardCount(itemCounter);

            return itemCounter;
        },
        toCountableItem(item: Box) : CountableBox {
            return {
                name: item.name,
                items: item.items,
                count: 0 // loads from storage
            }
        },
        loadInitialRewardCount() {
            let rewardCount = Object.assign({}, ...(this as any as _this).boxRewards.map((r) => ({[r.name]: 0})));
            let initialItemState = this.loadState()?.boxCounts;

            if (initialItemState){
                Object.entries(initialItemState).forEach(
                ([name, item]) => {
                    item.items.itemNames.forEach(minister => {
                        rewardCount[minister] += item.items.unit * item.count
                    });
                });
            }

            return rewardCount;
        },
        updateRewardCount(itemCount: { [key: string]: CountableBox }) {
            // Reset and recount.
            let newRewards = Object.assign({}, ...(this as any as _this).boxRewards.map((r) => ({[r.name]: 0})));

            Object.entries(itemCount).forEach(
                ([name, item]) => {
                    item.items.itemNames.forEach(minister => {
                        newRewards[minister] += item.items.unit * item.count
                    });
            });

            // Fully wipe the object so things are happily reactive - was having
            // issues in prod builds when only updating values.
            (this as any as _this).possibleRewards = newRewards;
        },
        displayRewardCount(rewards: number) {
            return (this as any as _this).showFractionalRewards
                ? rewards.toFixed(1)
                : Math.floor(rewards);
        },
        saveState() {
            let state: SavedState = {
                itemsPerRow: (this as any as _this).boxesPerRow,
                boxCounts: (this as any as _this).boxCounts,
                showFractionalRewards: (this as any as _this).showFractionalRewards
            };

            window.localStorage.setItem((this as any as _this).storageKey, JSON.stringify(state));
        },
        loadState(): SavedState | null {
            let json = window.localStorage.getItem((this as any as _this).storageKey);

            if (!json) {
                return null;
            }

            return JSON.parse(json);
        },
        getTooltip(minister: Reward) {
            // No tooltip if there are no rewards
            if ((this as any as _this).possibleRewards[minister.name] === 0){
                return "";
            }

            // Clone so we can fiddle with it later
            let items: CountableBox[] = Object.values((this as any as _this).boxCounts)
                .map(i => ({
                    name: i.name,
                    count: i.count,
                    items: i.items,
                }));

            let rewardBoxes = items
                .filter(i => i.count > 0 && i.items.itemNames.indexOf(minister.name) !== -1);

            // The most specific items (i.e. ones that apply to the fewest ministers) are first priority.
            // Put shard boxes after rewards because they look worse.
            let priorityItems = sortBy(rewardBoxes, ["items.itemNames.length", "items.unit"], ["asc", "asc"]);

            // this is so gnarly.
            let tooltipHtml = "<ul>";

            // todo use lodash min
            let longestPad = priorityItems
                .map(i => i.count.toLocaleString())
                .sort((a, b) => b.length - a.length)
                [0].length;

            priorityItems.forEach(item => {
                // Pad to line up item counts
                // Use nonbreaking space so it renders
                
                let decimalPlaces = Number.isInteger(item.count) ? 0 : 1;
                let itemCount = item.count.toFixed(decimalPlaces).toString() + " ";
                tooltipHtml += "<li>" + itemCount.padStart(longestPad + 1, '\xa0') + item.name + "</li>";
            });

            tooltipHtml += "</ul>";

            return tooltipHtml;
        }
    }
}

interface Reward {
    name: string;
    colour: string;
    type: string;
}

interface Box {
    name: string;
    items: {
        unit: number;
        itemNames: string[];
    };
}

interface CountableBox extends Box {
    count: number;
}

interface SavedState {
    itemsPerRow: number;
    boxCounts: { [key: string]: CountableBox };
    showFractionalRewards: boolean;
}

interface _this {
    toItemCounter:(items: Box[]) => { [key: string]: CountableBox };
    toCountableItem:(item: Box) => CountableBox;
    boxCounts: { [key: string]: CountableBox };
    possibleRewards:{ [key: string]: number };

    boxesPerRow: number;
    showFractionalRewards: boolean;

    saveState: () => void;
    loadState: () => SavedState | null;
    loadInitialRewardCount: () => { [key: string]: CountableBox };
    updateRewardCount: (itemCount: { [key: string]: CountableBox }) => void;
    debouncedUpdate: () => void;
//new
     boxRewards: Reward[];
    boxes: Box[];
    storageKey: string;
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