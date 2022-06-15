import{B as o}from"./BoxCalculator.d5f4eefb.js";import{_ as a,r as t,o as u,d as m}from"./index.efccefa3.js";import"./lodash.65b4c225.js";const s=[{name:"Fu Hao",colour:"#F9DC9E",type:"superHeroine"},{name:"Zhongli Chun",colour:"#A76DA8",type:"superHeroine"},{name:"Mi Yue",colour:"#5CB76C",type:"superHeroine"},{name:"Xiao Chuo",colour:"#4E94C0",type:"superHeroine"},{name:"Sikong Ying",colour:"#D4F3F0",type:"superHeroine"},{name:"Gu Danyang",colour:"#FE8BA2",type:"superHeroine"},{name:"Qi Xiaodie",colour:"#BEABF9",type:"superHeroine"},{name:"Lang Longwu",colour:"#EE9906",type:"starDeity"},{name:"Mu Gushi",colour:"#9387E8",type:"starDeity"},{name:"Shen Zhe",colour:"#98C4FB",type:"starDeity"},{name:"Chang Ming",colour:"#E7807E",type:"starDeity"},{name:"Arslan",colour:"#ACE7E7",type:"starDeity"},{name:"Yan Jin",colour:"#F2937D",type:"starDeity"}],r=[{name:"Superheroine Soul Selection Gift Box",items:{unit:1,itemNames:["Gu Danyang","Sikong Ying","Xiao Chuo","Zhongli Chun","Fu Hao","Mi Yue"]}},{name:"Recruitment Selection Box",items:{unit:1,itemNames:["Gu Danyang","Sikong Ying","Zhongli Chun","Fu Hao","Mi Yue"]}},{name:"Star Deity Soul Selection Gift Box",items:{unit:1,itemNames:["Shen Zhe","Chang Ming","Lang Longwu","Mu Gushi","Arslan","Yan Jin"]}},{name:"Fantasy Man Gift Box",items:{unit:1,itemNames:["Shen Zhe","Chang Ming","Lang Longwu","Mu Gushi","Arslan","Yan Jin"]}},{name:"Superheroine Selection Gift Box I",items:{unit:1,itemNames:["Gu Danyang","Sikong Ying","Qi Xiaodie","Xiao Chuo","Zhongli Chun","Fu Hao","Mi Yue"]}},{name:"Superheroine Soul Selection Gift Box II",items:{unit:1,itemNames:["Gu Danyang","Sikong Ying","Qi Xiaodie"]}},{name:"Superheroine Soul Shard Selection Gift Box II",items:{unit:.1,itemNames:["Gu Danyang","Sikong Ying","Qi Xiaodie"]}},{name:"Fu Hao Soul",items:{unit:1,itemNames:["Fu Hao"]}},{name:"Zhongli Chun Soul",items:{unit:1,itemNames:["Zhongli Chun"]}},{name:"Mi Yue Soul",items:{unit:1,itemNames:["Mi Yue"]}},{name:"Xiao Chuo Soul",items:{unit:1,itemNames:["Xiao Chuo"]}},{name:"Gu Danyang Soul",items:{unit:1,itemNames:["Gu Danyang"]}},{name:"Superheroine Soul",items:{unit:1,itemNames:["Qi Xiaodie","Gu Danyang","Sikong Ying","Xiao Chuo","Zhongli Chun","Fu Hao","Mi Yue"]}},{name:"Sikong Ying Soul",items:{unit:1,itemNames:["Sikong Ying"]}},{name:"Qi Xiaodie Soul",items:{unit:1,itemNames:["Qi Xiaodie"]}},{name:"Shen Zhe Soul",items:{unit:1,itemNames:["Shen Zhe"]}},{name:"Chang Ming Soul",items:{unit:1,itemNames:["Chang Ming"]}},{name:"Mu Gushi Soul",items:{unit:1,itemNames:["Mu Gushi"]}},{name:"Arslan Soul",items:{unit:1,itemNames:["Arslan"]}},{name:"Yan Jin Soul",items:{unit:1,itemNames:["Yan Jin"]}},{name:"Lang Longwu Soul",items:{unit:1,itemNames:["Lang Longwu"]}},{name:"Recruitment Optional Gift Box",items:{unit:1,itemNames:["Zhongli Chun","Fu Hao","Mi Yue"]}},{name:"Recruitment Selection Pack I",items:{unit:1,itemNames:["Zhongli Chun","Fu Hao","Mi Yue","Chang Ming"]}},{name:"Recruitment Selection Pack II",items:{unit:1,itemNames:["Sikong Ying","Shen Zhe"]}},{name:"Recruitment Selection Pack III",items:{unit:1,itemNames:["Gu Danyang","Mu Gushi"]}},{name:"Recruitment Selection Pack IV",items:{unit:1,itemNames:["Arslan","Qi Xiaodie"]}},{name:"Recruitment Selection Pack VI",items:{unit:1,itemNames:["Qi Xiaodie","Gu Danyang","Sikong Ying","Xiao Chuo","Zhongli Chun","Fu Hao","Mi Yue"]}},{name:"Recruitment Shard Selection Pack VI",items:{unit:.1,itemNames:["Qi Xiaodie","Gu Danyang","Sikong Ying","Xiao Chuo","Zhongli Chun","Fu Hao","Mi Yue"]}},{name:"Immortal Recruitment Gift Box I",items:{unit:1,itemNames:["Zhongli Chun","Fu Hao","Mi Yue","Chang Ming"]}},{name:"Immortal Recruitment Gift Box II",items:{unit:1,itemNames:["Sikong Ying","Shen Zhe"]}},{name:"Immortal Recruitment Gift Box IV",items:{unit:1,itemNames:["Arslan","Qi Xiaodie"]}},{name:"Immortal Recruitment Shard Gift Box I",items:{unit:.1,itemNames:["Zhongli Chun","Fu Hao","Mi Yue","Chang Ming"]}},{name:"Immortal Recruitment Shard Gift Box II",items:{unit:.1,itemNames:["Sikong Ying","Shen Zhe"]}},{name:"Immortal Recruitment Shard Gift Box IV",items:{unit:.1,itemNames:["Arslan","Qi Xiaodie"]}},{name:"Superheroine Soul Gift Box (1)",items:{unit:1,itemNames:["Zhongli Chun","Fu Hao","Mi Yue"]}},{name:"Superheroine Soul Gift Box (2)",items:{unit:1,itemNames:["Xiao Chuo","Zhongli Chun","Fu Hao","Mi Yue"]}},{name:"Superheroine Soul Shard Gift Box (1)",items:{unit:.1,itemNames:["Zhongli Chun","Fu Hao","Mi Yue"]}},{name:"Superheroine Soul Shard Gift Box (2)",items:{unit:.1,itemNames:["Xiao Chuo","Zhongli Chun","Fu Hao","Mi Yue"]}},{name:"Superheroine Soul Gift Box III",items:{unit:1,itemNames:["Qi Xiaodie","Gu Danyang","Sikong Ying","Xiao Chuo","Zhongli Chun","Fu Hao","Mi Yue"]}},{name:"Superheroine Soul Shard Gift Box III",items:{unit:.1,itemNames:["Qi Xiaodie","Gu Danyang","Sikong Ying","Xiao Chuo","Zhongli Chun","Fu Hao","Mi Yue"]}},{name:"Superheroine Soul Gift Box",items:{unit:1,itemNames:["Qi Xiaodie","Gu Danyang","Sikong Ying","Xiao Chuo","Zhongli Chun","Fu Hao","Mi Yue"]}},{name:"Superheroine Soul Shard Gift Box",items:{unit:.1,itemNames:["Qi Xiaodie","Gu Danyang","Sikong Ying","Xiao Chuo","Zhongli Chun","Fu Hao","Mi Yue"]}}];var i={itemNames:s,items:r};const l={components:{BoxCalculator:o},mounted(){window.localStorage.removeItem("ministersoulcalculator-state")},data(){return{boxes:i.items,boxItems:i.itemNames}}};function h(g,S,c,C,e,p){const n=t("BoxCalculator");return u(),m(n,{boxRewards:e.boxItems,boxes:e.boxes,"storage-key":"boxcalculator-ministersouls"},null,8,["boxRewards","boxes"])}var y=a(l,[["render",h]]);export{y as default};