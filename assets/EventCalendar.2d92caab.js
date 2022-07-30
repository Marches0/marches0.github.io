import{D as v,_ as E,S as F,o as c,c as l,a as i,t as m,F as p,f,p as C,j as b,g as D,n as I}from"./index.cb5ba09b.js";const M=[["Curiosity","Palace Green Ware","Sea Fishing"],[null,"Scholar's Debate","Imperial Feast"],["Intimacy","Penglai Island Domination","Jade for Beauty"],["Savvy","Mohist Maze","Palace Cuju"],["Power","Loulan Dominion","Elite Drill"],["Curiosity","Sovereign's Pursuit",null],[null,"Naadam Fair","Imperial Feast"],["Intimacy","Go Match","Alliance Carnival"],["Savvy","CS Siege","Elite Drill"],["Talent","Loulan Siege","Palace Cuju"]],x=[{name:"Sovereign Clash",schedule:[{time:"10:00",description:"opens"},{time:"14:00",description:"stamina reset"},{time:"22:30",description:"closes"}]},{name:"Naadam Fair",schedule:[{time:"10:00",description:"opens"},{time:"22:00",description:"closes"}]},{name:"Imperial Feast",schedule:[{time:"09:00",description:"opens"},{time:"21:00",description:"closes"}]},{name:"Elite Drill",schedule:[{time:"09:00",description:"opens"},{time:"21:00",description:"closes"}]},{name:"Penglai Island Domination",schedule:[{time:"10:00",description:"opens"},{time:"22:00",description:"closes"}]},{name:"Loulan Dominion",schedule:[{time:"10:00",description:"opens"},{time:"21:30",description:"closes"}]},{name:"Loulan Siege",schedule:[{time:"10:00",description:"opens"},{time:"20:10",description:"Palace opens"},{time:"21:30",description:"closes"}]},{name:"Jade for Beauty",schedule:[{time:"09:00",description:"opens"},{time:"21:00",description:"closes"}]},{name:"Intimacy",schedule:[{time:"23:00",description:"ends",day:3}]},{name:"Savvy",schedule:[{time:"23:00",description:"ends",day:3}]},{name:"Talent",schedule:[{time:"23:00",description:"ends",day:3}]},{name:"Go Match",schedule:[{time:"10:00",description:"opens"},{time:"21:30",description:"closes"}]},{name:"Palace Cuju",schedule:[{time:"11:00",description:"opens"},{time:"22:30",description:"closes"}]},{name:"Palace Green Ware",schedule:[{time:"10:00",description:"opens"},{time:"21:30",description:"closes"}]},{name:"Sea Fishing",schedule:[{time:"09:00",description:"opens"},{time:"21:00",description:"closes"}]},{name:"Alliance Carnival",schedule:[{time:"09:00",description:"opens"},{time:"21:00",description:"closes"}]},{name:"Scholar's Debate",schedule:[{time:"10:00",description:"opens"},{time:"21:30",description:"closes"}]},{name:"Mohist Maze",schedule:[{time:"10:00",description:"opens"},{time:"21:30",description:"closes"}]},{name:"CS Siege",schedule:[{time:"10:30",description:"deployment ends",day:1},{time:"11:00",description:"opens"},{time:"22:30",description:"closes"}]},{name:"Sovereign's Pursuit",schedule:[{time:"10:00",description:"opens"},{time:"20:00",description:"Mountain Control opens"},{time:"22:00",description:"closes"}]}];var d={rotation:M,events:x};const G="HH:mm",P=v.utc(2022,5,4).toUTC(60).minus({hours:1});function h(){return v.local().toUTC(60)}function y(e){let t=_(e),o=d.rotation[t.eventSet].filter(s=>s!==null);return d.events.filter(s=>o.indexOf(s.name)!==-1).flatMap(s=>T(s,e)).concat(H(e)).filter(s=>s.day===void 0||s.day===t.dayOfRotation)}function U(){let e=h(),t=_(e);return d.rotation.map((o,n)=>({events:o,isActive:n===t.eventSet,next:e.plus({days:N(t,n,d.rotation.length)*3-(t.dayOfRotation-1)})}))}function _(e){let t=Math.trunc(e.diff(P).shiftTo("days").days);return{eventSet:Math.trunc(t/3)%d.rotation.length,dayOfRotation:t%3+1}}function H(e){let t=[];if(t.push({time:e.plus({days:1}).set({hour:0,minute:0}),description:"Daily reset"}),t.push({time:e.set({hour:20,minute:0}),description:"Kamaitachi"}),e.day<=12){let s=d.events.filter(a=>a.name=="Sovereign Clash")[0];t=t.concat(T(s,e))}t.push({time:e.set({hour:22,minute:0}),description:"Treasure Event closes",day:3});const o=v.utc(2022,6,25).toUTC(60).minus({hours:1});return e.diff(o,["days","minutes"]).days===21&&t.push({time:e.set({hour:21,minute:0}),description:"Hetu Ala opens"}),t}function T(e,t){return e.schedule.map(n=>o(n));function o(n){let s=v.fromFormat(n.time,G,{zone:"UTC+1"});return{time:t.set({hour:s.hour,minute:s.minute}),description:`${e.name} ${n.description}`,day:n.day}}}function N(e,t,o){let n=t-e.eventSet;return n<=0&&(n+=o),n}const R="HH:mm:ss",S="HH:mm",w="MMMM dd",O={data(){return{serverTimeNow:"",upcomingEvents:[],eventRotation:[],dateShortFormat:w}},computed:{upcomingEventsDisplay(){var e=this.upcomingEvents;return e.map(t=>this.toDisplayableEvent(t))}},mounted(){this.updateServerTime(),this.startServerTimeTick(),this.upcomingEvents=this.getUpcomingTimers(),this.eventRotation=U()},methods:{startServerTimeTick(){setInterval(()=>{this.updateServerTime()},1e3)},updateServerTime(){let e=h();this.serverTimeNow=e.toFormat(R),e.second<1&&(this.upcomingEvents=this.getUpcomingTimers())},getUpcomingTimers(){let e=h(),o=y(e).concat(y(e.plus({day:1}))).filter(s=>s.time>e).sort((s,a)=>s.time.toUnixInteger()-a.time.toUnixInteger()),n=[];return o.forEach(s=>{n.every(a=>a.description!==s.description)&&n.push(s)}),n},toDisplayableEvent(e){return{serverTime:e.time.toFormat(S),localTime:e.time.setZone(F.defaultZone).toFormat(S),description:e.description,occursIn:this.toFriendlyDuration(e.time.diff(h(),["hours","minutes"]))}},toFriendlyDuration(e){let t="";return e.hours>0&&(e.hours===1?t+="1 hour":t+=e.hours+" hours"),e.minutes>0&&(t.length&&(t+=", "),e.minutes<=1.1?t+="1 minute":t+=Math.round(e.minutes)+" minutes"),t}}},u=e=>(C("data-v-39ac504f"),e=e(),b(),e),k={class:"jumbotron text-center"},A={class:"display-4 utc-clock"},B=u(()=>i("p",{class:"lead"},"Server Time (UTC + 1)",-1)),j=u(()=>i("h4",null,"Current Timers",-1)),z={class:"table table-striped"},L=u(()=>i("thead",null,[i("tr",null,[i("th",{scope:"col"},"Server Time"),i("th",{scope:"col"},"Your Time"),i("th",{scope:"col"},"Event"),i("th",{scope:"col"},"Occurs in...")])],-1)),W={id:"table-body"},$=u(()=>i("h4",null,"Season Rotation",-1)),J={class:"table table-striped-double"},Z=u(()=>i("thead",null,[i("tr",null,[i("th",{scope:"col"},"Boost Event"),i("th",{scope:"col"},"Event"),i("th",{scope:"col"},"Minigame"),i("th",{scope:"col"},"Next")])],-1)),K={id:"table-body"};function V(e,t,o,n,s,a){return c(),l(p,null,[i("div",k,[i("h1",A,m(s.serverTimeNow),1),B]),j,i("table",z,[L,i("tbody",W,[(c(!0),l(p,null,f(a.upcomingEventsDisplay,r=>(c(),l("tr",{key:r.name,class:D(r.description==="Daily reset"?"daily-reset":"")},[i("td",null,m(r.serverTime),1),i("td",null,m(r.localTime),1),i("td",null,m(r.description),1),i("td",null,m(r.occursIn),1)],2))),128))])]),$,i("table",J,[Z,i("tbody",K,[(c(!0),l(p,null,f(s.eventRotation,r=>(c(),l("tr",{style:I({"font-weight":r.isActive?"bolder":"normal"})},[(c(!0),l(p,null,f(r.events,g=>(c(),l("td",null,m(g),1))),256)),i("td",null,m(r.next.toFormat(s.dateShortFormat)),1)],4))),256))])])],64)}var q=E(O,[["render",V],["__scopeId","data-v-39ac504f"]]);export{q as default};