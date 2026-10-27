/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var z=globalThis,L=z.ShadowRoot&&(z.ShadyCSS===void 0||z.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,X=Symbol(),gt=new WeakMap,R=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==X)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(L&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=gt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&gt.set(e,t))}return t}toString(){return this.cssText}},vt=r=>new R(typeof r=="string"?r:r+"",void 0,X),tt=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((i,s,n)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[n+1],r[0]);return new R(e,r,X)},yt=(r,t)=>{if(L)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let i=document.createElement("style"),s=z.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,r.appendChild(i)}},et=L?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return vt(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var{is:zt,defineProperty:Lt,getOwnPropertyDescriptor:jt,getOwnPropertyNames:qt,getOwnPropertySymbols:Bt,getPrototypeOf:Wt}=Object,j=globalThis,bt=j.trustedTypes,Vt=bt?bt.emptyScript:"",Ft=j.reactiveElementPolyfillSupport,H=(r,t)=>r,it={toAttribute(r,t){switch(t){case Boolean:r=r?Vt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},_t=(r,t)=>!zt(r,t),$t={attribute:!0,type:String,converter:it,reflect:!1,useDefault:!1,hasChanged:_t};Symbol.metadata??=Symbol("metadata"),j.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$t){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Lt(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){let{get:s,set:n}=jt(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){let h=s?.call(this);n?.call(this,o),this.requestUpdate(t,h,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$t}static _$Ei(){if(this.hasOwnProperty(H("elementProperties")))return;let t=Wt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(H("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(H("properties"))){let e=this.properties,i=[...qt(e),...Bt(e)];for(let s of i)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let s of i)e.unshift(et(s))}else t!==void 0&&e.push(et(t));return e}static _$Eu(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return yt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){let i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){let n=(i.converter?.toAttribute!==void 0?i.converter:it).toAttribute(e,i.type);this._$Em=t,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){let i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let n=i.getPropertyOptions(s),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:it;this._$Em=s;let h=o.fromAttribute(e,n.type);this[s]=h??this._$Ej?.get(s)??h,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(t!==void 0){let o=this.constructor;if(s===!1&&(n=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??_t)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,n]of i){let{wrapped:o}=n,h=this[s];o!==!0||this._$AL.has(s)||h===void 0||this.C(s,void 0,n,h)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[H("elementProperties")]=new Map,y[H("finalized")]=new Map,Ft?.({ReactiveElement:y}),(j.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var dt=globalThis,xt=r=>r,q=dt.trustedTypes,At=q?q.createPolicy("lit-html",{createHTML:r=>r}):void 0,Pt="$lit$",_=`lit$${Math.random().toFixed(9).slice(2)}$`,Tt="?"+_,Kt=`<${Tt}>`,S=document,O=()=>S.createComment(""),U=r=>r===null||typeof r!="object"&&typeof r!="function",ct=Array.isArray,Gt=r=>ct(r)||typeof r?.[Symbol.iterator]=="function",st=`[ 	
\f\r]`,M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,wt=/-->/g,Ct=/>/g,w=RegExp(`>|${st}(?:([^\\s"'>=/]+)(${st}*=${st}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),St=/'/g,Et=/"/g,Rt=/^(?:script|style|textarea|title)$/i,ht=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),l=ht(1),B=ht(2),ae=ht(3),E=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),kt=new WeakMap,C=S.createTreeWalker(S,129);function Ht(r,t){if(!ct(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return At!==void 0?At.createHTML(t):t}var Jt=(r,t)=>{let e=r.length-1,i=[],s,n=t===2?"<svg>":t===3?"<math>":"",o=M;for(let h=0;h<e;h++){let a=r[h],p,f,c=-1,u=0;for(;u<a.length&&(o.lastIndex=u,f=o.exec(a),f!==null);)u=o.lastIndex,o===M?f[1]==="!--"?o=wt:f[1]!==void 0?o=Ct:f[2]!==void 0?(Rt.test(f[2])&&(s=RegExp("</"+f[2],"g")),o=w):f[3]!==void 0&&(o=w):o===w?f[0]===">"?(o=s??M,c=-1):f[1]===void 0?c=-2:(c=o.lastIndex-f[2].length,p=f[1],o=f[3]===void 0?w:f[3]==='"'?Et:St):o===Et||o===St?o=w:o===wt||o===Ct?o=M:(o=w,s=void 0);let m=o===w&&r[h+1].startsWith("/>")?" ":"";n+=o===M?a+Kt:c>=0?(i.push(p),a.slice(0,c)+Pt+a.slice(c)+_+m):a+_+(c===-2?h:m)}return[Ht(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},N=class r{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0,h=t.length-1,a=this.parts,[p,f]=Jt(t,e);if(this.el=r.createElement(p,i),C.currentNode=this.el.content,e===2||e===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(s=C.nextNode())!==null&&a.length<h;){if(s.nodeType===1){if(s.hasAttributes())for(let c of s.getAttributeNames())if(c.endsWith(Pt)){let u=f[o++],m=s.getAttribute(c).split(_),b=/([.?@])?(.*)/.exec(u);a.push({type:1,index:n,name:b[2],strings:m,ctor:b[1]==="."?nt:b[1]==="?"?ot:b[1]==="@"?at:P}),s.removeAttribute(c)}else c.startsWith(_)&&(a.push({type:6,index:n}),s.removeAttribute(c));if(Rt.test(s.tagName)){let c=s.textContent.split(_),u=c.length-1;if(u>0){s.textContent=q?q.emptyScript:"";for(let m=0;m<u;m++)s.append(c[m],O()),C.nextNode(),a.push({type:2,index:++n});s.append(c[u],O())}}}else if(s.nodeType===8)if(s.data===Tt)a.push({type:2,index:n});else{let c=-1;for(;(c=s.data.indexOf(_,c+1))!==-1;)a.push({type:7,index:n}),c+=_.length-1}n++}}static createElement(t,e){let i=S.createElement("template");return i.innerHTML=t,i}};function k(r,t,e=r,i){if(t===E)return t;let s=i!==void 0?e._$Co?.[i]:e._$Cl,n=U(t)?void 0:t._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(r),s._$AT(r,e,i)),i!==void 0?(e._$Co??=[])[i]=s:e._$Cl=s),s!==void 0&&(t=k(r,s._$AS(r,t.values),s,i)),t}var rt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??S).importNode(e,!0);C.currentNode=s;let n=C.nextNode(),o=0,h=0,a=i[0];for(;a!==void 0;){if(o===a.index){let p;a.type===2?p=new I(n,n.nextSibling,this,t):a.type===1?p=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(p=new lt(n,this,t)),this._$AV.push(p),a=i[++h]}o!==a?.index&&(n=C.nextNode(),o++)}return C.currentNode=S,s}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},I=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=k(this,t,e),U(t)?t===d||t==null||t===""?(this._$AH!==d&&this._$AR(),this._$AH=d):t!==this._$AH&&t!==E&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Gt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==d&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(S.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=N.createElement(Ht(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{let n=new rt(s,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=kt.get(t.strings);return e===void 0&&kt.set(t.strings,e=new N(t)),e}k(t){ct(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,s=0;for(let n of t)s===e.length?e.push(i=new r(this.O(O()),this.O(O()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let i=xt(t).nextSibling;xt(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},P=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=d,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=d}_$AI(t,e=this,i,s){let n=this.strings,o=!1;if(n===void 0)t=k(this,t,e,0),o=!U(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else{let h=t,a,p;for(t=n[0],a=0;a<n.length-1;a++)p=k(this,h[i+a],e,a),p===E&&(p=this._$AH[a]),o||=!U(p)||p!==this._$AH[a],p===d?t=d:t!==d&&(t+=(p??"")+n[a+1]),this._$AH[a]=p}o&&!s&&this.j(t)}j(t){t===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},nt=class extends P{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===d?void 0:t}},ot=class extends P{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==d)}},at=class extends P{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=k(this,t,e,0)??d)===E)return;let i=this._$AH,s=t===d&&i!==d||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==d&&(i===d||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},lt=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){k(this,t)}};var Zt=dt.litHtmlPolyfillSupport;Zt?.(N,I),(dt.litHtmlVersions??=[]).push("3.3.3");var Mt=(r,t,e)=>{let i=e?.renderBefore??t,s=i._$litPart$;if(s===void 0){let n=e?.renderBefore??null;i._$litPart$=s=new I(t.insertBefore(O(),n),n,void 0,e??{})}return s._$AI(r),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var pt=globalThis,v=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Mt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return E}};v._$litElement$=!0,v.finalized=!0,pt.litElementHydrateSupport?.({LitElement:v});var Qt=pt.litElementPolyfillSupport;Qt?.({LitElement:v});(pt.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var W="philips_airpurifier",Yt=new Set(["pm25","indoor_allergen_index","gas_level","total_volatile_organic_compounds"]),Xt=new Set(["pre_filter","pre_filter_cleaning","hepa_filter","active_carbon_filter","wick","nanoprotect_filter"]);function V(r){return[...new Set(Object.values(r.entities??{}).filter(t=>t.platform===W&&t.device_id).map(t=>t.device_id))]}function F(r,t){return t.device_id?t.device_id:t.entity?r.entities?.[t.entity]?.device_id??void 0:V(r)[0]}function te(r,t,e){let i=t.entity_id.split(".")[0],s=t.translation_key,n=r.states[t.entity_id]?.attributes.device_class;switch(e){case"fan":case"humidifier":case"light":return i===e;case"pm25":return i==="sensor"&&(s==="pm25"||n==="pm25");case"humidity":return i==="sensor"&&(s==="humidity"||n==="humidity");case"air":return i==="sensor"&&(Yt.has(s??"")||n==="pm25");case"filter":return i==="sensor"&&(Xt.has(s??"")||"Filter Life Remaining"in(r.states[t.entity_id]?.attributes??{}));case"water":return i==="sensor"&&s==="water_level";case"target":return i==="number"&&s==="humidity_target";case"lock":return i==="switch"&&s==="child_lock"}}function ut(r,t){let e=r.states[t];return{id:t,state:e,key:r.entities?.[t]?.translation_key,availability:!e||e.state==="unavailable"?"unavailable":e.state==="unknown"?"unknown":"available"}}function x(r,t,e){if(t.entity&&(e==="fan"||e==="humidifier"))return[ut(r,t.entity)];if(e==="air"&&t.sensors?.length)return t.sensors.map(s=>ut(r,s));let i=F(r,t);return i?Object.values(r.entities??{}).filter(s=>s.platform===W&&s.device_id===i&&!s.disabled_by&&te(r,s,e)).map(s=>ut(r,s.entity_id)):[]}function T(r,t,e){let i=V(r).find(s=>x(r,{type:t,device_id:s},e).length>0);return i?{device_id:i}:{}}function g(r){if(typeof r!="string"&&typeof r!="number"||r==="")return;let t=Number(r);return Number.isFinite(t)?t:void 0}function K(r){return Array.isArray(r)?r.filter(t=>typeof t=="string"):[]}var Ot=tt`
  :host {
    display: block;
    container-type: inline-size;
    height: 100%;
    --pap-accent: var(--state-fan-active-color, var(--primary-color));
  }
  ha-card {
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    background: var(--ha-card-background, var(--card-background-color));
    color: var(--primary-text-color);
    border-radius: var(--ha-card-border-radius, 16px);
  }
  .body {
    padding: 20px;
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 20px;
  }
  h2 {
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 1.35;
    margin: 0;
    overflow-wrap: anywhere;
  }
  .eyebrow,
  .secondary {
    color: var(--secondary-text-color);
    font-size: 0.8rem;
    line-height: 1.5;
  }
  .eyebrow {
    margin-bottom: 4px;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }
  button,
  select,
  input {
    font: inherit;
    color: inherit;
  }
  button {
    min-height: 44px;
    border: 1px solid var(--divider-color);
    border-radius: 12px;
    background: transparent;
    padding: 10px 14px;
    cursor: pointer;
  }
  button:hover:not(:disabled) {
    background: color-mix(in srgb, var(--pap-accent) 12%, transparent);
  }
  button:focus-visible,
  input:focus-visible,
  select:focus-visible {
    outline: 3px solid var(--primary-color);
    outline-offset: 3px;
  }
  button:disabled,
  input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  button[aria-pressed="true"],
  .primary {
    color: var(--pap-accent);
    background: color-mix(in srgb, var(--pap-accent) 14%, transparent);
    border-color: transparent;
  }
  .icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    padding: 12px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  svg {
    width: 24px;
    height: 24px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .hero {
    display: flex;
    align-items: center;
    gap: 22px;
    padding: 20px;
    margin: 0 -20px 20px;
    background: linear-gradient(120deg, color-mix(in srgb, var(--pap-accent) 14%, transparent), transparent);
  }
  .hero svg {
    width: 74px;
    height: 108px;
    flex-shrink: 0;
    color: var(--pap-accent);
  }
  .value {
    font-size: clamp(2rem, 8cqi, 3rem);
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
  }
  .unit {
    color: var(--secondary-text-color);
    font-size: 0.85rem;
    font-weight: 400;
    letter-spacing: normal;
  }
  .state {
    display: inline-block;
    margin-top: 8px;
    font-size: 0.8rem;
    color: var(--pap-accent);
  }
  .chips,
  .actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .chips button {
    flex: 1 0 auto;
  }
  .section {
    border-top: 1px solid var(--divider-color);
    margin-top: 18px;
    padding-top: 18px;
  }
  .section-title {
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 10px;
  }
  label {
    display: block;
    font-size: 0.85rem;
    margin-bottom: 6px;
  }
  input[type="range"] {
    width: 100%;
    min-height: 44px;
    margin: 0;
    accent-color: var(--pap-accent);
    cursor: pointer;
  }
  .tiles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(135px, 100%), 1fr));
    gap: 12px;
  }
  .tile {
    text-align: start;
    padding: 16px;
    min-width: 0;
    border-radius: 14px;
    background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    border: 0;
  }
  .tile .value {
    font-size: 1.9rem;
    margin: 8px 0;
    overflow-wrap: anywhere;
  }
  .tile .secondary {
    display: block;
  }
  .filter {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    text-align: start;
    border: 0;
    padding: 8px 0;
  }
  .filter-ring {
    width: 54px;
    height: 54px;
    flex-shrink: 0;
    transform: rotate(-90deg);
    stroke-width: 4;
    color: var(--pap-accent);
  }
  .filter-ring .track {
    stroke: var(--divider-color);
  }
  .filter-text {
    flex: 1;
    min-width: 0;
  }
  .filter-name {
    display: block;
    font-size: 0.85rem;
  }
  .filter-value {
    font-weight: 600;
  }
  .notice {
    padding: 16px;
    border-radius: 12px;
    background: color-mix(in srgb, var(--primary-text-color) 5%, transparent);
    color: var(--secondary-text-color);
    line-height: 1.5;
  }
  .error {
    color: var(--error-color);
    margin-top: 12px;
    font-size: 0.85rem;
  }
  .stepper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .target {
    font-size: 1.8rem;
    font-weight: 500;
  }
  .mode {
    text-transform: capitalize;
  }
  @container (max-width: 360px) {
    .body {
      padding: 16px;
    }
    .hero {
      margin-inline: -16px;
      padding: 16px;
      gap: 16px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;var A=class extends v{static{this.styles=Ot}static{this.cardType=""}static{this.editorTag=""}static{this.properties={hass:{attribute:!1},config:{attribute:!1},busy:{state:!0},error:{state:!0}}}constructor(){super(),this.config={type:""},this.busy=!1,this.error=""}static getConfigElement(){return document.createElement(this.editorTag)}setConfig(t){let e=this.constructor;if(!t||t.type!==`custom:${e.cardType}`)throw new Error(`Expected custom:${e.cardType}`);for(let[i,s]of Object.entries(t)){if(i.startsWith("show_")&&typeof s!="boolean")throw new Error(`${i} must be a boolean`);if(["entity","device_id","name"].includes(i)&&(typeof s!="string"||!s.trim()))throw new Error(`${i} must be non-empty text`)}if(t.entity&&!t.entity.startsWith(`${this.controlRole}.`))throw new Error(`entity must be a ${this.controlRole} entity`);if(t.sensors&&(!Array.isArray(t.sensors)||t.sensors.some(i=>typeof i!="string"||!i.startsWith("sensor."))))throw new Error("sensors must be a list of sensor entity IDs");this.config={...t,...t.sensors?{sensors:[...t.sensors]}:{}},this.error=""}getCardSize(){return this.controlRole==="air"?3:6}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}shouldUpdate(t){if(t.size!==1||!t.has("hass"))return!0;let e=t.get("hass"),i=this.hass;return!e||!i||e.entities!==i.entities||e.devices!==i.devices||e.locale!==i.locale||e.themes!==i.themes?!0:this.related().some(s=>e.states[s.id]!==i.states[s.id])}related(){return this.hass?["fan","humidifier","air","filter","humidity","water","target","lock","light"].flatMap(t=>x(this.hass,this.config,t)):[]}caps(t){return this.hass?x(this.hass,this.config,t):[]}label(t){return t.state?this.hass?.formatEntityName?.(t.state)??String(t.state.attributes.friendly_name??t.key?.replaceAll("_"," ")??t.id):t.key?.replaceAll("_"," ")??t.id}value(t){return t.availability!=="available"||!t.state?this.hass?.localize?.(`state.default.${t.availability}`)||(t.availability==="unknown"?"Unknown":"Unavailable"):this.hass?.formatEntityState(t.state)??t.state.state}reading(t){let e=this.value(t),i=t.state?.attributes.unit_of_measurement;return t.availability==="available"&&typeof i=="string"&&i&&e.endsWith(i)?l`${e.slice(0,-i.length).trim()}<span class="unit"> ${i}</span>`:e}moreInfo(t){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0}))}async action(t,e,i={}){if(!(!this.hass||this.busy||t.availability!=="available")){this.busy=!0,this.error="";try{await this.hass.callService(t.id.split(".")[0],e,{...i,entity_id:t.id})}catch(s){this.error=s instanceof Error?s.message:"The device could not complete the action. Please try again."}finally{this.busy=!1}}}heading(t){let e=this.hass&&F(this.hass,this.config),i=e?this.hass?.devices?.[e]:void 0;return l`<div>
      <div class="eyebrow">${t}</div>
      <h2>${this.config.name??i?.name_by_user??i?.name??"Philips AirPurifier"}</h2>
    </div>`}guard(){if(!this.hass)return l`<div class="notice">Connecting to Home Assistant…</div>`;let t=F(this.hass,this.config);return!t||!V(this.hass).includes(t)?l`<div class="notice">
        Select a Philips device in the card editor. The configured device could not be found.
      </div>`:this.config.entity&&(this.hass.entities?.[this.config.entity]?.device_id!==t||this.hass.entities?.[this.config.entity]?.platform!=="philips_airpurifier")?l`<div class="notice">The control entity must belong to the selected Philips device.</div>`:this.config.sensors?.some(e=>{let i=this.hass.entities?.[e];return i?i.device_id!==t||i.platform!=="philips_airpurifier":!!this.hass.states[e]})?l`<div class="notice">Air-quality sensors must belong to the selected Philips device.</div>`:d}feedback(){return l`<div aria-live="polite" role="status">
        ${this.busy?l`<span class="secondary">Sending…</span>`:d}
      </div>
      ${this.error?l`<div class="error" role="alert">${this.error}</div>`:d}`}};var G=()=>l`<svg viewBox="0 0 24 24" aria-hidden="true">${B`<path d="M12 3v9M6.3 5.7a8 8 0 1 0 11.4 0"/>`}</svg>`,Ut=()=>l`<svg viewBox="0 0 74 108" aria-hidden="true">
    ${B`<rect x="14" y="21" width="46" height="78" rx="14"/><ellipse cx="37" cy="24" rx="22" ry="7"/><path d="M22 43v40m7-40v46m8-46v46m8-46v46m7-46v40M25 12c-6-5 6-5 0-10m12 10c-6-5 6-5 0-10m12 10c-6-5 6-5 0-10"/>`}
  </svg>`,Nt=()=>l`<svg viewBox="0 0 74 108" aria-hidden="true">
    ${B`<path d="M37 12C32 27 13 46 13 64a24 24 0 0 0 48 0C61 46 42 27 37 12Z"/><path d="M24 64a13 13 0 0 0 13 13"/>`}
  </svg>`,It=r=>l`<svg class="filter-ring" viewBox="0 0 48 48" aria-hidden="true">
    <circle class="track" cx="24" cy="24" r="20" />
    <circle cx="24" cy="24" r="20" pathLength="100" stroke-dasharray="${Math.max(0,Math.min(100,r))} 100" />
  </svg>`;var J=class extends A{constructor(){super(...arguments);this.controlRole="fan"}static{this.cardType="philips-airpurifier-purifier-card"}static{this.editorTag="philips-airpurifier-card-editor"}static getStubConfig(e){return T(e,this.cardType,"fan")}render(){let e=this.guard(),i=this.caps("fan")[0];if(e!==d||!i)return l`<ha-card
        ><div class="body">
          ${this.heading("Purifier")}${e!==d?e:l`<div class="notice">This device does not expose a purifier fan.</div>`}
        </div></ha-card
      >`;let s=i.state,n=i.availability!=="available"||this.busy,o=s?.state==="on",h=K(s?.attributes.preset_modes),a=g(s?.attributes.supported_features)??0,p=g(s?.attributes.percentage),f=g(s?.attributes.percentage_step),c=this.caps("pm25")[0];return l`<ha-card
      ><div class="body">
        <header>
          ${this.heading("Purifier")}<button
            class="icon-button"
            aria-label=${o?"Turn purifier off":"Turn purifier on"}
            aria-pressed=${o}
            ?disabled=${n}
            @click=${()=>this.action(i,o?"turn_off":"turn_on")}
          >
            ${G()}
          </button>
        </header>
        <div class="hero">
          ${Ut()}
          <div>
            ${this.config.show_pm25!==!1&&c?l`<div class="secondary">PM2.5</div>
                    <div class="value">${this.reading(c)}</div>`:l`<div class="value">
                    ${i.availability==="available"?o?"On":"Off":this.value(i)}
                  </div>`}
            <div class="state">
              ${i.availability!=="available"?this.value(i):o?String(s?.attributes.preset_mode??"Purifying").replaceAll("_"," "):"Standby"}
            </div>
          </div>
        </div>
        ${this.config.show_presets!==!1&&h.length?l`<div class="section-title">Mode</div>
                <div class="chips">
                  ${h.map(u=>l`<button class="mode" aria-label=${`Set mode ${u.replaceAll("_"," ")}`} aria-pressed=${s?.attributes.preset_mode===u&&o} ?disabled=${n} @click=${()=>this.action(i,"set_preset_mode",{preset_mode:u})}>${u.replaceAll("_"," ")}</button>`)}
                </div>`:d}
        ${this.config.show_speed!==!1&&a&1&&f&&f>0?l`<div class="section"><label for="speed">Fan speed · ${p===void 0?"Automatic":`${p}%`}</label><input id="speed" aria-label="Fan speed" type="range" min="0" max="100" step=${f} .value=${String(p??0)} ?disabled=${n} @change=${u=>this.action(i,"set_percentage",{percentage:Number(u.target.value)})} /></div>`:d}
        ${this.auxiliary()}
        ${this.config.show_filter!==!1&&this.caps("filter").length?l`<div class="section">
                <div class="section-title">Device health</div>
                ${this.caps("filter").map(u=>{let m=u.state?.attributes.unit_of_measurement==="%"?g(u.state.state):void 0;return l`<button
                    class="filter"
                    aria-label=${`Details for ${this.label(u)}`}
                    @click=${()=>this.moreInfo(u.id)}
                  >
                    ${m!==void 0?It(m):d}<span class="filter-text"
                      ><span class="filter-name">${this.label(u)}</span
                      ><span class="filter-value">${this.value(u)}</span
                      ><span class="secondary">
                        ·
                        ${u.availability==="available"?String(u.state?.attributes["Replacement Status"]??"Filter life remaining"):"Check device connection"}</span
                      ></span
                    >
                  </button>`})}
              </div>`:d}
        <div class="section actions">
          <button aria-label="Open purifier details" @click=${()=>this.moreInfo(i.id)}>Device details ↗</button>
        </div>
        ${this.feedback()}
      </div></ha-card
    >`}auxiliary(){let e=this.caps("lock")[0],i=this.caps("light")[0];return!e&&!i?d:l`<div class="section actions">
      ${[e,i].map(s=>s?l`<button aria-label=${s===e?"Toggle child lock":"Toggle display light"} aria-pressed=${s.state?.state==="on"} ?disabled=${this.busy||s.availability!=="available"} @click=${()=>this.action(s,s.state?.state==="on"?"turn_off":"turn_on")}>${s===e?"Child lock":"Display"} · ${s.availability==="available"?s.state?.state==="on"?"On":"Off":this.value(s)}</button>`:d)}
    </div>`}};var Z=class extends A{constructor(){super(...arguments);this.controlRole="air"}static{this.cardType="philips-airpurifier-air-quality-card"}static{this.editorTag="philips-airpurifier-card-editor"}static getStubConfig(e){return T(e,this.cardType,"air")}render(){let e=this.guard(),i=this.caps("air");return l`<ha-card
      ><div class="body">
        <header>${this.heading("Air quality")}</header>
        ${e!==d?e:i.length?l`<div class="tiles">
                  ${i.map(s=>l`<button
                        class="tile"
                        aria-label=${`Details for ${this.label(s)}`}
                        @click=${()=>this.moreInfo(s.id)}
                      >
                        <span class="secondary">${this.label(s)}</span>
                        <div class="value">${this.reading(s)}</div>
                        <span class="secondary"
                          >${s.key==="indoor_allergen_index"?"Allergen index \xB7 1\u201312":s.key==="total_volatile_organic_compounds"?"TVOC index":s.key==="gas_level"?"Gas index":s.key==="pm25"||s.state?.attributes.device_class==="pm25"?"Fine particles":"Sensor reading"}</span
                        >
                      </button>`)}
                </div>`:l`<div class="notice">This device does not expose air-quality sensors.</div>`}
      </div></ha-card
    >`}};var Q=class extends A{constructor(){super(...arguments);this.controlRole="humidifier"}static{this.cardType="philips-airpurifier-humidity-card"}static{this.editorTag="philips-airpurifier-card-editor"}static getStubConfig(e){return T(e,this.cardType,"humidifier")}render(){let e=this.guard(),i=this.caps("humidifier")[0];if(e!==d||!i)return l`<ha-card
        ><div class="body">
          ${this.heading("Humidity")}${e!==d?e:l`<div class="notice">This device does not expose a humidifier.</div>`}
        </div></ha-card
      >`;let s=i.state,n=s?.attributes??{},o=s?.state==="on",h=i.availability!=="available"||this.busy,a=g(n.humidity),p=g(n.min_humidity),f=g(n.max_humidity),c=g(n.target_humidity_step)??g(this.caps("target")[0]?.state?.attributes.step),u=g(n.current_humidity),m=K(n.available_modes),b=this.caps("water")[0],D=a!==void 0&&p!==void 0&&f!==void 0&&p<f&&c!==void 0&&c>0,ft=$=>new Intl.NumberFormat(this.hass?.locale?.language).format($),mt=$=>D?Math.min(f,Math.max(p,Number((p+Math.round((a-p)/c+$)*c).toFixed(6)))):void 0;return l`<ha-card
      ><div class="body">
        <header>
          ${this.heading("Humidity")}<button
            class="icon-button"
            aria-label=${o?"Turn humidifier off":"Turn humidifier on"}
            aria-pressed=${o}
            ?disabled=${h}
            @click=${()=>this.action(i,o?"turn_off":"turn_on")}
          >
            ${G()}
          </button>
        </header>
        <div class="hero">
          ${Nt()}
          <div>
            <div class="secondary">Current humidity</div>
            <div class="value">
              ${i.availability!=="available"?this.value(i):u!==void 0?l`${ft(u)}<span class="unit"> %</span>`:"Unknown"}
            </div>
            <div class="state mode">
              ${i.availability!=="available"?this.value(i):String(n.action??(o?"On":"Off")).replaceAll("_"," ")}
            </div>
          </div>
        </div>
        ${this.config.show_target_control!==!1?l`<div class="section-title">Target humidity</div>
                <div class="stepper">
                  <button
                    aria-label="Decrease target humidity"
                    ?disabled=${h||!D||a<=p}
                    @click=${()=>this.action(i,"set_humidity",{humidity:mt(-1)})}
                  >
                    −</button
                  ><span class="target">${a!==void 0?`${ft(a)}%`:"Unknown"}</span
                  ><button
                    aria-label="Increase target humidity"
                    ?disabled=${h||!D||a>=f}
                    @click=${()=>this.action(i,"set_humidity",{humidity:mt(1)})}
                  >
                    +
                  </button>
                </div>
                ${D?d:l`<div class="secondary">Target controls need the device’s humidity bounds and step.</div>`}`:d}
        ${this.config.show_mode!==!1&&m.length?l`<div class="section">
                <div class="section-title">Mode</div>
                <div class="chips">
                  ${m.map($=>l`<button class="mode" aria-label=${`Set mode ${$.replaceAll("_"," ")}`} aria-pressed=${n.mode===$&&o} ?disabled=${h} @click=${()=>this.action(i,"set_mode",{mode:$})}>${$.replaceAll("_"," ")}</button>`)}
                </div>
              </div>`:d}
        ${this.config.show_water_level!==!1&&b?l`<div class="section">
                <button class="filter" aria-label="Water level details" @click=${()=>this.moreInfo(b.id)}>
                  <span>Water level</span><strong>${this.value(b)}</strong>
                </button>
              </div>`:d}
        <div class="section actions">
          <button aria-label="Open humidifier details" @click=${()=>this.moreInfo(i.id)}>
            Device details ↗
          </button>
        </div>
        ${this.feedback()}
      </div></ha-card
    >`}};var Dt={purifier:["show_presets","show_speed","show_filter","show_pm25"],"air-quality":[],humidity:["show_target_control","show_mode","show_water_level"]},Y=class extends v{static{this.properties={hass:{attribute:!1},config:{state:!0}}}setConfig(t){this.config={...t}}render(){if(!this.hass||!this.config)return l``;let t=this.config.type.includes("air-quality")?"air-quality":this.config.type.includes("humidity")?"humidity":"purifier",e=[{name:"device_id",required:!0,selector:{device:{filter:[{integration:"philips_airpurifier"}]}}},{name:"name",selector:{text:{}}}],i=t==="air-quality"?"air":t==="humidity"?"humidifier":"fan",s=this.config.device_id?{include_entities:x(this.hass,{type:this.config.type,device_id:this.config.device_id},i).map(n=>n.id)}:{};t==="air-quality"?e.push({name:"sensors",selector:{entity:{multiple:!0,...s,filter:[{domain:"sensor",integration:"philips_airpurifier"}]}}}):e.push({name:"entity",selector:{entity:{...s,filter:[{domain:i,integration:"philips_airpurifier"}]}}});for(let n of Dt[t]??[])e.push({name:n,selector:{boolean:{}}});return l`<ha-form
      .hass=${this.hass}
      .data=${{...Object.fromEntries((Dt[t]??[]).map(n=>[n,!0])),...this.config}}
      .schema=${e}
      .computeLabel=${n=>({device_id:"Device",entity:"Control entity (optional override)",name:"Name (optional)",sensors:"Air-quality sensors (optional, ordered)"})[n.name]??{show_presets:"Show mode controls",show_speed:"Show fan speed",show_filter:"Show filter health",show_pm25:"Show PM2.5",show_target_control:"Show target controls",show_mode:"Show modes",show_water_level:"Show water level"}[n.name]??n.name.replaceAll("_"," ")}
      @value-changed=${this.changed}
    ></ha-form>`}changed(t){t.stopPropagation();let e={...t.detail.value,type:this.config.type};e.device_id!==this.config?.device_id&&(delete e.entity,delete e.sensors);for(let i of["name","entity","device_id"])e[i]||delete e[i];this.config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}};var ee=[["philips-airpurifier-purifier-card",J],["philips-airpurifier-air-quality-card",Z],["philips-airpurifier-humidity-card",Q],["philips-airpurifier-card-editor",Y]];function ie(){for(let[r,t]of ee)customElements.get(r)||customElements.define(r,t);window.customCards??=[];for(let[r,t,e,i]of[["purifier","Philips Purifier","fan","Power, modes, air quality and filter health."],["air-quality","Philips Air Quality","air","Your device\u2019s particle, allergen and gas readings."],["humidity","Philips Humidity","humidifier","Humidity, target controls and water level."]]){let s=`philips-airpurifier-${r}-card`;window.customCards.some(n=>n.type===s)||window.customCards.push({type:s,name:t,description:i,preview:!0,documentationURL:"https://github.com/tinkerologie/ha-philips-airpurifier#dashboard-cards",getEntitySuggestion(n,o){let h=n.entities?.[o];if(h?.platform!==W||!h.device_id)return null;let a={type:`custom:${s}`,device_id:h.device_id};return x(n,a,e).some(p=>p.id===o)?{config:a}:null}})}}ie();export{ie as registerCards};
