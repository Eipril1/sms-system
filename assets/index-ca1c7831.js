import{d as F,r as u,c as I,b as s,e,f as l,h as o,i as P,v as Q,Q as j,t as v,m as i,_ as q}from"./index-97e706ba.js";const z={class:"safety-production-container"},A={class:"folder-tree"},G={class:"custom-tree-node"},H={class:"content-area"},J={class:"search-area"},K={class:"tabs-area"},L={class:"tab-content"},M=F({__name:"index",setup(O){const h=[{id:"1",label:"航空安全",children:[{id:"1-1",label:"维修安全"},{id:"1-2",label:"维修实施"},{id:"1-3",label:"维修管理"},{id:"1-4",label:"车辆管理"},{id:"1-5",label:"航材管理"},{id:"1-6",label:"生产管理"},{id:"1-7",label:"飞行标准"},{id:"1-8",label:"飞行实施"},{id:"1-9",label:"飞行管理"},{id:"1-10",label:"运行控制"},{id:"1-11",label:"签派放行"}]}],y={children:"children",label:"label"},c=u({name:"",department:""}),m=u("checklist"),k=u([{name:"1月份管理检查计划",department:"运行部",createTime:"2025-01-15",planDate:"2025/01/15-2025/01/20",status:"待处理"}]),V=n=>({待处理:"warning",进行中:"primary",已完成:"success"})[n]||"",x=n=>{console.log("选中节点:",n)},g=()=>{console.log("搜索条件:",c.value)},C=n=>{console.log("查看:",n)},w=n=>{console.log("编辑:",n)};return(n,t)=>{const D=o("el-icon"),N=o("el-tree"),T=o("el-input"),_=o("el-form-item"),p=o("el-option"),B=o("el-select"),r=o("el-button"),S=o("el-form"),d=o("el-table-column"),U=o("el-tag"),E=o("el-table"),b=o("el-tab-pane"),$=o("el-tabs");return P(),I("div",z,[s("div",A,[e(N,{data:h,props:y,"node-key":"id","default-expanded-keys":["1"],onNodeClick:x},{default:l(({node:a,data:f})=>[s("div",G,[e(D,null,{default:l(()=>[e(Q(j))]),_:1}),s("span",null,v(a.label),1)])]),_:1})]),s("div",H,[s("div",J,[e(S,{inline:!0,model:c.value},{default:l(()=>[e(_,{label:"过程名称"},{default:l(()=>[e(T,{modelValue:c.value.name,"onUpdate:modelValue":t[0]||(t[0]=a=>c.value.name=a),placeholder:"请输入名称",clearable:""},null,8,["modelValue"])]),_:1}),e(_,{label:"适用部门"},{default:l(()=>[e(B,{modelValue:c.value.department,"onUpdate:modelValue":t[1]||(t[1]=a=>c.value.department=a),placeholder:"请选择",clearable:""},{default:l(()=>[e(p,{label:"运行部",value:"operation"}),e(p,{label:"维修部",value:"maintenance"}),e(p,{label:"安全部",value:"safety"})]),_:1},8,["modelValue"])]),_:1}),e(_,null,{default:l(()=>[e(r,{type:"primary",onClick:g},{default:l(()=>t[3]||(t[3]=[i("查询")])),_:1})]),_:1})]),_:1},8,["model"])]),s("div",K,[e($,{modelValue:m.value,"onUpdate:modelValue":t[2]||(t[2]=a=>m.value=a)},{default:l(()=>[e(b,{label:"关联检查单",name:"checklist"},{default:l(()=>[s("div",L,[e(E,{data:k.value,border:""},{default:l(()=>[e(d,{type:"index",label:"序号",width:"60"}),e(d,{prop:"name",label:"检查单名称","min-width":"200"}),e(d,{prop:"department",label:"适用部门",width:"120"}),e(d,{prop:"createTime",label:"制定日期",width:"180"}),e(d,{prop:"planDate",label:"计划完成日期",width:"180"}),e(d,{prop:"status",label:"处理状态",width:"100"},{default:l(({row:a})=>[e(U,{type:V(a.status)},{default:l(()=>[i(v(a.status),1)]),_:2},1032,["type"])]),_:1}),e(d,{label:"操作",width:"150",fixed:"right"},{default:l(({row:a})=>[e(r,{link:"",type:"primary",onClick:f=>C(a)},{default:l(()=>t[4]||(t[4]=[i("查看")])),_:2},1032,["onClick"]),e(r,{link:"",type:"primary",onClick:f=>w(a)},{default:l(()=>t[5]||(t[5]=[i("编辑")])),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data"])])]),_:1}),e(b,{label:"关联整改计划",name:"improvement"})]),_:1},8,["modelValue"])])])])}}});const W=q(M,[["__scopeId","data-v-c548f64d"]]);export{W as default};
