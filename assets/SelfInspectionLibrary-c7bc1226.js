import{B as x}from"./BaseLibrary-fa67d690.js";import{d as C,r as h,L as T,k as I,f as c,h as i,i as D,e,m,t as f,_ as E}from"./index-97e706ba.js";const V=C({__name:"SelfInspectionLibrary",setup(L){const _=h();h();const a=T({keyword:"",checkType:"",isExecuted:"",isClosed:""}),n=[{checkNo:"RLZJ-2024005",findings:[],checkType:"航空安全",planTime:"2024-03",checkItems:"航空器运行安全检查",superviseDept:"安全监察部",checkedDept:"飞行部",isExecuted:!0,adjustInfo:"按计划执行",isClosed:!0,remark:""},{checkType:"维修工程",planTime:"2024-03",checkItems:"航线维修质量检查",superviseDept:"质量监察室",checkedDept:"维修工程部",isExecuted:!0,adjustInfo:"因故推迟一周",isClosed:!1,remark:"正在整改"},{checkType:"运行控制",planTime:"2024-03",checkItems:"飞行签派资质检查",superviseDept:"安全监察部",checkedDept:"运行控制部",isExecuted:!1,adjustInfo:"计划月底执行",isClosed:!1,remark:""},{checkType:"客舱安全",planTime:"2024-03",checkItems:"客舱应急设备检查",superviseDept:"客舱安全监察室",checkedDept:"客舱服务部",isExecuted:!0,adjustInfo:"",isClosed:!0,remark:"已完成整改"}],u=h(n),k=()=>{const{keyword:p,checkType:o,isExecuted:s,isClosed:r}=a,l=n.filter(d=>{const t=!p||d.checkItems.toLowerCase().includes(p.toLowerCase())||d.checkType.toLowerCase().includes(p.toLowerCase()),b=!o||d.checkType===o,v=s===""||String(d.isExecuted)===s,w=r===""||String(d.isClosed)===r;return t&&b&&v&&w});u.value=l},y=()=>{a.keyword="",a.checkType="",a.isExecuted="",a.isClosed="",u.value=n};return(p,o)=>{const s=i("el-option"),r=i("el-select"),l=i("el-table-column"),d=i("el-tag");return D(),I(x,{ref_key:"libraryRef",ref:_,data:u.value,onSearch:k,onReset:y},{"extra-search":c(()=>[e(r,{modelValue:a.checkType,"onUpdate:modelValue":o[0]||(o[0]=t=>a.checkType=t),placeholder:"检查专业",clearable:""},{default:c(()=>[e(s,{label:"航空安全",value:"航空安全"}),e(s,{label:"维修工程",value:"维修工程"}),e(s,{label:"运行控制",value:"运行控制"}),e(s,{label:"客舱安全",value:"客舱安全"})]),_:1},8,["modelValue"]),e(r,{modelValue:a.isExecuted,"onUpdate:modelValue":o[1]||(o[1]=t=>a.isExecuted=t),placeholder:"是否执行",clearable:""},{default:c(()=>[e(s,{label:"已执行",value:"true"}),e(s,{label:"未执行",value:"false"})]),_:1},8,["modelValue"]),e(r,{modelValue:a.isClosed,"onUpdate:modelValue":o[2]||(o[2]=t=>a.isClosed=t),placeholder:"是否关闭",clearable:""},{default:c(()=>[e(s,{label:"已关闭",value:"true"}),e(s,{label:"未关闭",value:"false"})]),_:1},8,["modelValue"])]),columns:c(()=>[e(l,{type:"index",label:"序号",width:"60"}),e(l,{prop:"checkType",label:"检查专业",width:"120"}),e(l,{prop:"planTime",label:"计划时间(月)",width:"120"}),e(l,{prop:"checkItems",label:"检查项目","min-width":"200","show-overflow-tooltip":""}),e(l,{prop:"superviseDept",label:"实施监察单位/部门",width:"160"}),e(l,{prop:"checkedDept",label:"被检查单位/部门",width:"160"}),e(l,{prop:"isExecuted",label:"是否执行",width:"100"},{default:c(({row:t})=>[e(d,{type:t.isExecuted?"success":"info"},{default:c(()=>[m(f(t.isExecuted?"已执行":"未执行"),1)]),_:2},1032,["type"])]),_:1}),e(l,{prop:"adjustInfo",label:"调整情况","min-width":"150","show-overflow-tooltip":""}),e(l,{prop:"isClosed",label:"是否关闭",width:"100"},{default:c(({row:t})=>[e(d,{type:t.isClosed?"success":"warning"},{default:c(()=>[m(f(t.isClosed?"已关闭":"未关闭"),1)]),_:2},1032,["type"])]),_:1}),e(l,{prop:"remark",label:"备注","min-width":"150","show-overflow-tooltip":""})]),_:1},8,["data"])}}});const j=E(V,[["__scopeId","data-v-9d43da05"]]);export{j as default};
