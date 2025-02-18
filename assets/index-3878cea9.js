import{d as X,r as n,c as Y,e as l,f as o,b as N,h as s,i as Z,m as d,t as U,z as g,E as z,_ as ee}from"./index-97e706ba.js";const le={class:"roles-container"},te={class:"pagination"},oe={class:"dialog-footer"},ae={class:"dialog-footer"},ne=X({__name:"index",setup(se){const p=n({roleName:"",status:""}),b=n(1),y=n(10),B=n(100),$=n([{roleCode:"ADMIN",roleName:"系统管理员",description:"系统管理员，拥有所有权限",status:"1",createTime:"2024-01-01 12:00:00"},{roleCode:"USER",roleName:"普通用户",description:"普通用户，拥有基本权限",status:"1",createTime:"2024-01-01 12:00:00"}]),c=n(!1),v=n(""),k=n(),u=n({roleName:"",roleCode:"",description:""}),E={roleName:[{required:!0,message:"请输入角色名称",trigger:"blur"}],roleCode:[{required:!0,message:"请输入角色编码",trigger:"blur"}]},f=n(!1),C=n(),w=n([]),K=n([{id:1,label:"系统管理",children:[{id:11,label:"用户管理"},{id:12,label:"角色管理"},{id:13,label:"菜单管理"}]},{id:2,label:"业务管理",children:[{id:21,label:"业务功能1"},{id:22,label:"业务功能2"}]}]),P={children:"children",label:"label"},V=()=>{console.log("搜索条件:",p.value)},R=()=>{v.value="新增角色",u.value={roleName:"",roleCode:"",description:""},c.value=!0},D=a=>{v.value="编辑角色",u.value={...a},c.value=!0},M=a=>{console.log("设置权限:",a),w.value=[11,21],f.value=!0},q=()=>{if(!C.value)return;const{checkedKeys:a,halfCheckedKeys:e}=C.value.getCheckedKeys(!0);console.log("选中的权限:",a,e),f.value=!1,g.success("权限设置成功")},A=a=>{const e=a.status==="1"?"禁用":"启用";z.confirm(`确认${e}该角色?`,"提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{console.log("切换状态:",a),g.success(`${e}成功`)})},I=a=>{z.confirm("确认删除该角色?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{console.log("删除:",a),g.success("删除成功")})},j=async()=>{k.value&&await k.value.validate(a=>{a&&(console.log("提交表单:",u.value),c.value=!1,g.success(v.value==="新增角色"?"新增成功":"编辑成功"))})},F=a=>{y.value=a,V()},G=a=>{b.value=a,V()};return(a,e)=>{const _=s("el-input"),m=s("el-form-item"),x=s("el-option"),H=s("el-select"),r=s("el-button"),T=s("el-form"),J=s("el-card"),i=s("el-table-column"),L=s("el-tag"),O=s("el-table"),Q=s("el-pagination"),S=s("el-dialog"),W=s("el-tree");return Z(),Y("div",le,[l(J,{class:"search-card"},{default:o(()=>[l(T,{inline:!0,model:p.value},{default:o(()=>[l(m,{label:"角色名称"},{default:o(()=>[l(_,{modelValue:p.value.roleName,"onUpdate:modelValue":e[0]||(e[0]=t=>p.value.roleName=t),placeholder:"请输入角色名称",clearable:""},null,8,["modelValue"])]),_:1}),l(m,{label:"状态"},{default:o(()=>[l(H,{modelValue:p.value.status,"onUpdate:modelValue":e[1]||(e[1]=t=>p.value.status=t),placeholder:"请选择",clearable:""},{default:o(()=>[l(x,{label:"全部",value:""}),l(x,{label:"启用",value:"1"}),l(x,{label:"禁用",value:"0"})]),_:1},8,["modelValue"])]),_:1}),l(m,null,{default:o(()=>[l(r,{type:"primary",onClick:V},{default:o(()=>e[11]||(e[11]=[d("查询")])),_:1}),l(r,{type:"success",onClick:R},{default:o(()=>e[12]||(e[12]=[d("新增角色")])),_:1})]),_:1})]),_:1},8,["model"])]),_:1}),l(O,{data:$.value,border:"",style:{width:"100%"}},{default:o(()=>[l(i,{type:"index",label:"序号",width:"60",align:"center"}),l(i,{prop:"roleCode",label:"角色编码",width:"120"}),l(i,{prop:"roleName",label:"角色名称",width:"150"}),l(i,{prop:"description",label:"角色描述","min-width":"200","show-overflow-tooltip":""}),l(i,{prop:"status",label:"状态",width:"100"},{default:o(({row:t})=>[l(L,{type:t.status==="1"?"success":"danger"},{default:o(()=>[d(U(t.status==="1"?"启用":"禁用"),1)]),_:2},1032,["type"])]),_:1}),l(i,{prop:"createTime",label:"创建时间",width:"180"}),l(i,{label:"操作",width:"250",fixed:"right"},{default:o(({row:t})=>[l(r,{link:"",type:"primary",onClick:h=>D(t)},{default:o(()=>e[13]||(e[13]=[d("编辑")])),_:2},1032,["onClick"]),l(r,{link:"",type:"primary",onClick:h=>M(t)},{default:o(()=>e[14]||(e[14]=[d("权限设置")])),_:2},1032,["onClick"]),l(r,{link:"",type:t.status==="1"?"danger":"success",onClick:h=>A(t)},{default:o(()=>[d(U(t.status==="1"?"禁用":"启用"),1)]),_:2},1032,["type","onClick"]),l(r,{link:"",type:"danger",onClick:h=>I(t)},{default:o(()=>e[15]||(e[15]=[d("删除")])),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data"]),N("div",te,[l(Q,{"current-page":b.value,"onUpdate:currentPage":e[2]||(e[2]=t=>b.value=t),"page-size":y.value,"onUpdate:pageSize":e[3]||(e[3]=t=>y.value=t),"page-sizes":[10,20,30,50],layout:"total, sizes, prev, pager, next, jumper",total:B.value,onSizeChange:F,onCurrentChange:G},null,8,["current-page","page-size","total"])]),l(S,{title:v.value,modelValue:c.value,"onUpdate:modelValue":e[8]||(e[8]=t=>c.value=t),width:"500px","close-on-click-modal":!1},{footer:o(()=>[N("span",oe,[l(r,{onClick:e[7]||(e[7]=t=>c.value=!1)},{default:o(()=>e[16]||(e[16]=[d("取消")])),_:1}),l(r,{type:"primary",onClick:j},{default:o(()=>e[17]||(e[17]=[d("确定")])),_:1})])]),default:o(()=>[l(T,{ref_key:"formRef",ref:k,model:u.value,rules:E,"label-width":"80px"},{default:o(()=>[l(m,{label:"角色名称",prop:"roleName"},{default:o(()=>[l(_,{modelValue:u.value.roleName,"onUpdate:modelValue":e[4]||(e[4]=t=>u.value.roleName=t),placeholder:"请输入角色名称"},null,8,["modelValue"])]),_:1}),l(m,{label:"角色编码",prop:"roleCode"},{default:o(()=>[l(_,{modelValue:u.value.roleCode,"onUpdate:modelValue":e[5]||(e[5]=t=>u.value.roleCode=t),placeholder:"请输入角色编码"},null,8,["modelValue"])]),_:1}),l(m,{label:"角色描述",prop:"description"},{default:o(()=>[l(_,{modelValue:u.value.description,"onUpdate:modelValue":e[6]||(e[6]=t=>u.value.description=t),type:"textarea",rows:3,placeholder:"请输入角色描述"},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1},8,["title","modelValue"]),l(S,{title:"权限设置",modelValue:f.value,"onUpdate:modelValue":e[10]||(e[10]=t=>f.value=t),width:"600px","close-on-click-modal":!1},{footer:o(()=>[N("span",ae,[l(r,{onClick:e[9]||(e[9]=t=>f.value=!1)},{default:o(()=>e[18]||(e[18]=[d("取消")])),_:1}),l(r,{type:"primary",onClick:q},{default:o(()=>e[19]||(e[19]=[d("确定")])),_:1})])]),default:o(()=>[l(W,{ref_key:"treeRef",ref:C,data:K.value,"show-checkbox":"","node-key":"id",props:P,"default-checked-keys":w.value},null,8,["data","default-checked-keys"])]),_:1},8,["modelValue"])])}}});const ue=ee(ne,[["__scopeId","data-v-9e1a4e17"]]);export{ue as default};
