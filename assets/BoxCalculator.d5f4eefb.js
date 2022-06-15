import{l as h}from"./lodash.65b4c225.js";import{_ as x,e as v,o as d,c,a as t,F as m,f as p,w as b,n as R,t as w,g as f,v as C,h as g,i as y}from"./index.efccefa3.js";const S={props:{boxRewards:Array,boxes:Array,storageKey:String},mounted(){let e=this.boxRewards.map(o=>o.name);this.boxes.flatMap(o=>o.items.itemNames).filter(o=>e.indexOf(o)===-1).forEach(o=>{console.warn("invalid: "+o)})},data(){var e,n,o,a;return{rewardGroups:h.exports.chain(this.boxRewards).groupBy(s=>s.type).map((s,i)=>({Key:i,Rewards:s})).sortBy(s=>s.Key).value(),possibleRewards:this.loadInitialRewardCount(),boxCounts:this.toItemCounter(this.boxes),boxesPerRow:(n=(e=this.loadState())==null?void 0:e.itemsPerRow)!=null?n:3,debouncedUpdate:h.exports.debounce(()=>{this.saveState()},2e3),showFractionalRewards:(a=(o=this.loadState())==null?void 0:o.showFractionalRewards)!=null?a:!1}},watch:{boxCounts:{handler(e,n){this.updateRewardCount(e),this.debouncedUpdate()},deep:!0}},computed:{boxColumn(){return"col-md-"+12/this.boxesPerRow},boxChunks(){return h.exports.chunk(this.boxes.map(e=>this.toCountableItem(e)),this.boxesPerRow)}},methods:{toItemCounter(e){var n=this.loadState();let o={};return e.forEach(a=>{o[a.name]=this.toCountableItem(a),n!==null&&n.boxCounts[a.name]&&(o[a.name].count=n.boxCounts[a.name].count)}),this.updateRewardCount(o),o},toCountableItem(e){return{name:e.name,items:e.items,count:0}},loadInitialRewardCount(){var o;let e=Object.assign({},...this.boxRewards.map(a=>({[a.name]:0}))),n=(o=this.loadState())==null?void 0:o.boxCounts;return n&&Object.entries(n).forEach(([a,s])=>{s.items.itemNames.forEach(i=>{e[i]+=s.items.unit*s.count})}),e},updateRewardCount(e){let n=Object.assign({},...this.boxRewards.map(o=>({[o.name]:0})));Object.entries(e).forEach(([o,a])=>{a.items.itemNames.forEach(s=>{n[s]+=a.items.unit*a.count})}),this.possibleRewards=n},displayRewardCount(e){return this.showFractionalRewards?e.toFixed(1):Math.floor(e)},saveState(){let e={itemsPerRow:this.boxesPerRow,boxCounts:this.boxCounts,showFractionalRewards:this.showFractionalRewards};window.localStorage.setItem(this.storageKey,JSON.stringify(e))},loadState(){let e=window.localStorage.getItem(this.storageKey);return e?JSON.parse(e):null},getTooltip(e){if(this.possibleRewards[e.name]===0)return"";let o=Object.values(this.boxCounts).map(l=>({name:l.name,count:l.count,items:l.items})).filter(l=>l.count>0&&l.items.itemNames.indexOf(e.name)!==-1),a=h.exports.sortBy(o,["items.itemNames.length","items.unit"],["asc","asc"]),s="<ul>",i=a.map(l=>l.count.toLocaleString()).sort((l,r)=>r.length-l.length)[0].length;return a.forEach(l=>{let r=Number.isInteger(l.count)?0:1,u=l.count.toFixed(r).toString()+" ";s+="<li>"+u.padStart(i+1,"\xA0")+l.name+"</li>"}),s+="</ul>",s}}},I={class:"jumbotron text-center"},k={class:"card-group"},F={class:"card"},B={class:"card-text"},E=t("br",null,null,-1),N={class:"row mt-2"},P=["onUpdate:modelValue"],O=t("br",null,null,-1),j={class:"row"},U=t("p",null,[t("i",null,"This list is in the same order as items appear in your inventory. Some items are missing - message me if you know them. The values you enter here are saved in your browser, so you will be able to view them again later.")],-1),V=t("p",null,[t("i",null,"Hover/tap on an item count to see the boxes that contributed towards it.")],-1),K={class:"col-md-3"},M={class:"form-group"},T=t("label",null,"Items per row",-1),A=t("option",null,"1",-1),D=t("option",null,"2",-1),z=t("option",{selected:""},"3",-1),G=t("option",null,"4",-1),H=[A,D,z,G],J={class:"form-check"},L=t("label",null,"Show fractional souls",-1);function q(e,n,o,a,s,i){const l=v("tooltip");return d(),c(m,null,[t("div",I,[(d(!0),c(m,null,p(s.rewardGroups,r=>(d(),c("div",null,[t("div",k,[(d(!0),c(m,null,p(r.Rewards,u=>b((d(),c("div",F,[t("div",{class:"card-body",style:R({"background-color":u.colour})},[t("div",B,[t("h1",null,w(i.displayRewardCount(s.possibleRewards[u.name])),1),t("h6",null,w(u.name),1)])],4)])),[[l,i.getTooltip(u),"bottom"]])),256))]),E]))),256))]),(d(!0),c(m,null,p(i.boxChunks,r=>(d(),c("div",null,[t("div",N,[(d(!0),c(m,null,p(r,u=>(d(),c("div",{class:f(i.boxColumn)},[t("label",null,w(u.name),1),b(t("input",{type:"number",class:"form-control","onUpdate:modelValue":_=>s.boxCounts[u.name].count=_,min:"0"},null,8,P),[[C,s.boxCounts[u.name].count]])],2))),256))])]))),256)),O,t("div",j,[U,V,t("div",K,[t("div",M,[T,b(t("select",{class:"form-control",onInput:n[0]||(n[0]=(...r)=>e.onEventSelected&&e.onEventSelected(...r)),"onUpdate:modelValue":n[1]||(n[1]=r=>s.boxesPerRow=r)},H,544),[[g,s.boxesPerRow]])]),t("div",J,[L,b(t("input",{class:"form-check-input",type:"checkbox","onUpdate:modelValue":n[2]||(n[2]=r=>s.showFractionalRewards=r)},null,512),[[y,s.showFractionalRewards]])])])])],64)}var X=x(S,[["render",q]]);export{X as B};