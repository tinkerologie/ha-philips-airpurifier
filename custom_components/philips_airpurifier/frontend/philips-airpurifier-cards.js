/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var Z=globalThis,G=Z.ShadowRoot&&(Z.ShadyCSS===void 0||Z.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ht=Symbol(),Mt=new WeakMap,N=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==ht)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(G&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=Mt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Mt.set(e,t))}return t}toString(){return this.cssText}},Tt=s=>new N(typeof s=="string"?s:s+"",void 0,ht),ut=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((i,r,a)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+s[a+1],s[0]);return new N(e,s,ht)},Pt=(s,t)=>{if(G)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let i=document.createElement("style"),r=Z.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=e.cssText,s.appendChild(i)}},mt=G?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return Tt(e)})(s):s;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var{is:be,defineProperty:ye,getOwnPropertyDescriptor:xe,getOwnPropertyNames:$e,getOwnPropertySymbols:_e,getPrototypeOf:we}=Object,Y=globalThis,Rt=Y.trustedTypes,Ae=Rt?Rt.emptyScript:"",Ce=Y.reactiveElementPolyfillSupport,D=(s,t)=>s,ft={toAttribute(s,t){switch(t){case Boolean:s=s?Ae:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},Ot=(s,t)=>!be(s,t),Ht={attribute:!0,type:String,converter:ft,reflect:!1,useDefault:!1,hasChanged:Ot};Symbol.metadata??=Symbol("metadata"),Y.litPropertyMetadata??=new WeakMap;var A=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ht){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),r=this.getPropertyDescriptor(t,i,e);r!==void 0&&ye(this.prototype,t,r)}}static getPropertyDescriptor(t,e,i){let{get:r,set:a}=xe(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:r,set(n){let d=r?.call(this);a?.call(this,n),this.requestUpdate(t,d,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ht}static _$Ei(){if(this.hasOwnProperty(D("elementProperties")))return;let t=we(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(D("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(D("properties"))){let e=this.properties,i=[...$e(e),..._e(e)];for(let r of i)this.createProperty(r,e[r])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,r]of e)this.elementProperties.set(i,r)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let r=this._$Eu(e,i);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let r of i)e.unshift(mt(r))}else t!==void 0&&e.push(mt(t));return e}static _$Eu(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Pt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){let i=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,i);if(r!==void 0&&i.reflect===!0){let a=(i.converter?.toAttribute!==void 0?i.converter:ft).toAttribute(e,i.type);this._$Em=t,a==null?this.removeAttribute(r):this.setAttribute(r,a),this._$Em=null}}_$AK(t,e){let i=this.constructor,r=i._$Eh.get(t);if(r!==void 0&&this._$Em!==r){let a=i.getPropertyOptions(r),n=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:ft;this._$Em=r;let d=n.fromAttribute(e,a.type);this[r]=d??this._$Ej?.get(r)??d,this._$Em=null}}requestUpdate(t,e,i,r=!1,a){if(t!==void 0){let n=this.constructor;if(r===!1&&(a=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??Ot)(a,e)||i.useDefault&&i.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:r,wrapped:a},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),a!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,a]of this._$Ep)this[r]=a;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[r,a]of i){let{wrapped:n}=a,d=this[r];n!==!0||this._$AL.has(r)||d===void 0||this.C(r,void 0,a,d)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[D("elementProperties")]=new Map,A[D("finalized")]=new Map,Ce?.({ReactiveElement:A}),(Y.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var _t=globalThis,It=s=>s,J=_t.trustedTypes,zt=J?J.createPolicy("lit-html",{createHTML:s=>s}):void 0,qt="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,jt="?"+C,ke=`<${jt}>`,T=document,q=()=>T.createComment(""),j=s=>s===null||typeof s!="object"&&typeof s!="function",wt=Array.isArray,Se=s=>wt(s)||typeof s?.[Symbol.iterator]=="function",gt=`[ 	
\f\r]`,B=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ut=/-->/g,Lt=/>/g,E=RegExp(`>|${gt}(?:([^\\s"'>=/]+)(${gt}*=${gt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Nt=/'/g,Dt=/"/g,Ft=/^(?:script|style|textarea|title)$/i,At=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),o=At(1),g=At(2),Fe=At(3),P=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),Bt=new WeakMap,M=T.createTreeWalker(T,129);function Vt(s,t){if(!wt(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return zt!==void 0?zt.createHTML(t):t}var Ee=(s,t)=>{let e=s.length-1,i=[],r,a=t===2?"<svg>":t===3?"<math>":"",n=B;for(let d=0;d<e;d++){let l=s[d],p,u,h=-1,b=0;for(;b<l.length&&(n.lastIndex=b,u=n.exec(l),u!==null);)b=n.lastIndex,n===B?u[1]==="!--"?n=Ut:u[1]!==void 0?n=Lt:u[2]!==void 0?(Ft.test(u[2])&&(r=RegExp("</"+u[2],"g")),n=E):u[3]!==void 0&&(n=E):n===E?u[0]===">"?(n=r??B,h=-1):u[1]===void 0?h=-2:(h=n.lastIndex-u[2].length,p=u[1],n=u[3]===void 0?E:u[3]==='"'?Dt:Nt):n===Dt||n===Nt?n=E:n===Ut||n===Lt?n=B:(n=E,r=void 0);let y=n===E&&s[d+1].startsWith("/>")?" ":"";a+=n===B?l+ke:h>=0?(i.push(p),l.slice(0,h)+qt+l.slice(h)+C+y):l+C+(h===-2?d:y)}return[Vt(s,a+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},F=class s{constructor({strings:t,_$litType$:e},i){let r;this.parts=[];let a=0,n=0,d=t.length-1,l=this.parts,[p,u]=Ee(t,e);if(this.el=s.createElement(p,i),M.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(r=M.nextNode())!==null&&l.length<d;){if(r.nodeType===1){if(r.hasAttributes())for(let h of r.getAttributeNames())if(h.endsWith(qt)){let b=u[n++],y=r.getAttribute(h).split(C),v=/([.?@])?(.*)/.exec(b);l.push({type:1,index:a,name:v[2],strings:y,ctor:v[1]==="."?bt:v[1]==="?"?yt:v[1]==="@"?xt:O}),r.removeAttribute(h)}else h.startsWith(C)&&(l.push({type:6,index:a}),r.removeAttribute(h));if(Ft.test(r.tagName)){let h=r.textContent.split(C),b=h.length-1;if(b>0){r.textContent=J?J.emptyScript:"";for(let y=0;y<b;y++)r.append(h[y],q()),M.nextNode(),l.push({type:2,index:++a});r.append(h[b],q())}}}else if(r.nodeType===8)if(r.data===jt)l.push({type:2,index:a});else{let h=-1;for(;(h=r.data.indexOf(C,h+1))!==-1;)l.push({type:7,index:a}),h+=C.length-1}a++}}static createElement(t,e){let i=T.createElement("template");return i.innerHTML=t,i}};function H(s,t,e=s,i){if(t===P)return t;let r=i!==void 0?e._$Co?.[i]:e._$Cl,a=j(t)?void 0:t._$litDirective$;return r?.constructor!==a&&(r?._$AO?.(!1),a===void 0?r=void 0:(r=new a(s),r._$AT(s,e,i)),i!==void 0?(e._$Co??=[])[i]=r:e._$Cl=r),r!==void 0&&(t=H(s,r._$AS(s,t.values),r,i)),t}var vt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:i}=this._$AD,r=(t?.creationScope??T).importNode(e,!0);M.currentNode=r;let a=M.nextNode(),n=0,d=0,l=i[0];for(;l!==void 0;){if(n===l.index){let p;l.type===2?p=new V(a,a.nextSibling,this,t):l.type===1?p=new l.ctor(a,l.name,l.strings,this,t):l.type===6&&(p=new $t(a,this,t)),this._$AV.push(p),l=i[++d]}n!==l?.index&&(a=M.nextNode(),n++)}return M.currentNode=T,r}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},V=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,r){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=H(this,t,e),j(t)?t===c||t==null||t===""?(this._$AH!==c&&this._$AR(),this._$AH=c):t!==this._$AH&&t!==P&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Se(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==c&&j(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:i}=t,r=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=F.createElement(Vt(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(e);else{let a=new vt(r,this),n=a.u(this.options);a.p(e),this.T(n),this._$AH=a}}_$AC(t){let e=Bt.get(t.strings);return e===void 0&&Bt.set(t.strings,e=new F(t)),e}k(t){wt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,r=0;for(let a of t)r===e.length?e.push(i=new s(this.O(q()),this.O(q()),this,this.options)):i=e[r],i._$AI(a),r++;r<e.length&&(this._$AR(i&&i._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let i=It(t).nextSibling;It(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},O=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,r,a){this.type=1,this._$AH=c,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=a,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=c}_$AI(t,e=this,i,r){let a=this.strings,n=!1;if(a===void 0)t=H(this,t,e,0),n=!j(t)||t!==this._$AH&&t!==P,n&&(this._$AH=t);else{let d=t,l,p;for(t=a[0],l=0;l<a.length-1;l++)p=H(this,d[i+l],e,l),p===P&&(p=this._$AH[l]),n||=!j(p)||p!==this._$AH[l],p===c?t=c:t!==c&&(t+=(p??"")+a[l+1]),this._$AH[l]=p}n&&!r&&this.j(t)}j(t){t===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},bt=class extends O{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===c?void 0:t}},yt=class extends O{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==c)}},xt=class extends O{constructor(t,e,i,r,a){super(t,e,i,r,a),this.type=5}_$AI(t,e=this){if((t=H(this,t,e,0)??c)===P)return;let i=this._$AH,r=t===c&&i!==c||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,a=t!==c&&(i===c||r);r&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},$t=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){H(this,t)}};var Me=_t.litHtmlPolyfillSupport;Me?.(F,V),(_t.litHtmlVersions??=[]).push("3.3.3");var Wt=(s,t,e)=>{let i=e?.renderBefore??t,r=i._$litPart$;if(r===void 0){let a=e?.renderBefore??null;i._$litPart$=r=new V(t.insertBefore(q(),a),a,void 0,e??{})}return r._$AI(s),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var Ct=globalThis,_=class extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Wt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return P}};_._$litElement$=!0,_.finalized=!0,Ct.litElementHydrateSupport?.({LitElement:_});var Te=Ct.litElementPolyfillSupport;Te?.({LitElement:_});(Ct.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var Q="philips_airpurifier",Pe=new Set(["pm25","indoor_allergen_index","gas_level","total_volatile_organic_compounds"]),Re=new Set(["pre_filter","pre_filter_cleaning","hepa_filter","active_carbon_filter","wick","nanoprotect_filter"]);function X(s){return[...new Set(Object.values(s.entities??{}).filter(t=>t.platform===Q&&t.device_id).map(t=>t.device_id))]}function tt(s,t){return t.device_id?t.device_id:t.entity?s.entities?.[t.entity]?.device_id??void 0:X(s)[0]}function He(s,t,e){let i=t.entity_id.split(".")[0],r=t.translation_key,a=s.states[t.entity_id]?.attributes.device_class;switch(e){case"fan":case"humidifier":case"light":return i===e;case"pm25":return i==="sensor"&&(r==="pm25"||a==="pm25");case"humidity":return i==="sensor"&&(r==="humidity"||a==="humidity");case"air":return i==="sensor"&&(Pe.has(r??"")||a==="pm25");case"filter":return i==="sensor"&&(Re.has(r??"")||"Filter Life Remaining"in(s.states[t.entity_id]?.attributes??{}));case"temperature":return i==="sensor"&&(r==="temperature"||a==="temperature");case"water":return i==="sensor"&&r==="water_level";case"target":return i==="number"&&r==="humidity_target";case"lock":return i==="switch"&&r==="child_lock";case"auto_plus":return i==="switch"&&r==="auto_plus";case"lamp":return i==="select"&&r==="lamp_mode";case"timer":return i==="select"&&r==="timer"}}function W(s,t){let e=s.states[t];return{id:t,state:e,key:s.entities?.[t]?.translation_key,availability:!e||e.state==="unavailable"?"unavailable":e.state==="unknown"?"unknown":"available"}}function k(s,t,e){if(t.entity&&(e==="fan"||e==="humidifier"))return[W(s,t.entity)];if(e==="air"&&t.sensors?.length)return t.sensors.map(r=>W(s,r));let i=tt(s,t);return i?Object.values(s.entities??{}).filter(r=>r.platform===Q&&r.device_id===i&&!r.disabled_by&&He(s,r,e)).map(r=>W(s,r.entity_id)):[]}function I(s,t,e){let i=X(s).find(r=>k(s,{type:t,device_id:r},e).length>0);return i?{device_id:i}:{}}function f(s){if(typeof s!="string"&&typeof s!="number"||s==="")return;let t=Number(s);return Number.isFinite(t)?t:void 0}function z(s){return Array.isArray(s)?s.filter(t=>typeof t=="string"):[]}var Kt=ut`
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
    min-height: 48px;
    border: 1px solid var(--ha-color-border-neutral-quiet, var(--divider-color));
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
    outline: 3px solid var(--ha-color-focus, var(--primary-color));
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
    border-top: 1px solid var(--ha-color-border-neutral-quiet, var(--divider-color));
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
    appearance: none;
    background: transparent;
  }
  input[type="range"]::-webkit-slider-runnable-track {
    height: 8px;
    border-radius: var(--ha-border-radius-pill, 999px);
    background: color-mix(in srgb, var(--pap-accent) 20%, transparent);
  }
  input[type="range"]::-moz-range-track {
    height: 8px;
    border-radius: var(--ha-border-radius-pill, 999px);
    background: color-mix(in srgb, var(--pap-accent) 20%, transparent);
  }
  input[type="range"]::-moz-range-progress {
    height: 8px;
    border-radius: var(--ha-border-radius-pill, 999px);
    background: var(--pap-accent);
  }
  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    margin-top: -6px;
    border-radius: 50%;
    border: 0;
    background: var(--pap-accent);
  }
  input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 0;
    background: var(--pap-accent);
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
    stroke: var(--ha-color-border-neutral-quiet, var(--divider-color));
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
  .band-good {
    --pap-band: var(--pap-good-color, var(--ha-color-fill-success-loud-resting, var(--green-color, #4caf50)));
  }
  .band-fair {
    --pap-band: var(--pap-fair-color, var(--amber-color, #ffc107));
  }
  .band-poor {
    --pap-band: var(--pap-poor-color, var(--ha-color-fill-warning-loud-resting, var(--orange-color, #ff9800)));
  }
  .band-very_poor {
    --pap-band: var(--pap-very-poor-color, var(--ha-color-fill-danger-loud-resting, var(--red-color, #f44336)));
  }
  ha-card[class*="band-"] .body {
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--pap-band) 16%, transparent),
      transparent var(--pap-band-fade, 70%)
    );
  }
  .pill {
    flex-shrink: 0;
    padding: var(--ha-space-1, 4px) var(--ha-space-3, 12px);
    border-radius: var(--ha-border-radius-pill, 999px);
    background: color-mix(in srgb, var(--pap-band, var(--pap-accent)) 20%, transparent);
    color: var(--primary-text-color);
    font-size: var(--ha-font-size-s, 0.8rem);
    font-weight: var(--ha-font-weight-medium, 500);
    line-height: 1.5;
  }
  .pill::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-inline-end: var(--ha-space-2, 8px);
    border-radius: 50%;
    background: var(--pap-band, var(--pap-accent));
    vertical-align: middle;
  }
  .summary {
    margin: calc(-1 * var(--ha-space-2, 8px)) 0 var(--ha-space-5, 20px);
    font-size: var(--ha-font-size-l, 1.1rem);
    font-weight: var(--ha-font-weight-medium, 500);
    line-height: var(--ha-line-height-condensed, 1.3);
  }
  .metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(92px, 100%), 1fr));
    gap: var(--ha-space-2, 8px);
  }
  .metrics .tile {
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-1, 4px);
    padding: var(--ha-space-3, 12px);
    border-radius: var(--ha-border-radius-lg, 12px);
    background: var(--ha-card-background, var(--card-background-color));
    background-image: linear-gradient(
      color-mix(in srgb, var(--primary-text-color) 4%, transparent),
      color-mix(in srgb, var(--primary-text-color) 4%, transparent)
    );
  }
  .metric-label {
    font-size: var(--ha-font-size-m, 0.875rem);
    font-weight: var(--ha-font-weight-medium, 500);
    color: var(--secondary-text-color);
  }
  .metrics .value {
    margin: 0;
    font-size: var(--ha-font-size-3xl, 1.75rem);
    white-space: nowrap;
  }
  .metric-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .meter {
    display: block;
    height: 6px;
    margin-block: var(--ha-space-1, 4px);
    border-radius: var(--ha-border-radius-pill, 999px);
    background: color-mix(in srgb, var(--pap-band, var(--pap-accent)) 18%, transparent);
    overflow: hidden;
  }
  .meter span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--pap-band, var(--pap-accent));
    transition: width var(--ha-animation-duration-slow, 0.35s) ease;
  }
  .hero .pill {
    display: inline-block;
    margin: var(--ha-space-2, 8px) var(--ha-space-2, 8px) 0 0;
  }
  .trend-button {
    display: block;
    width: 100%;
    margin-top: var(--ha-space-4, 16px);
    padding: var(--ha-space-3, 12px);
    border: 0;
    border-radius: var(--ha-border-radius-lg, 12px);
    text-align: start;
    background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    color: var(--pap-band, var(--pap-accent));
  }
  .trend {
    margin: 0;
  }
  .trend figcaption {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--ha-space-1, 4px) var(--ha-space-3, 12px);
    margin-bottom: var(--ha-space-2, 8px);
  }
  .trend svg {
    display: block;
    width: 100%;
    height: 96px;
    overflow: visible;
    stroke: none;
  }
  .trend-range {
    fill: currentColor;
    fill-opacity: 0.12;
  }
  .trend-line {
    fill: none;
    stroke: currentColor;
    stroke-width: 2.5;
    vector-effect: non-scaling-stroke;
  }
  .trend-dot {
    stroke: currentColor;
    stroke-width: 9;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
  }
  .trend-threshold {
    stroke: var(--secondary-text-color);
    stroke-opacity: 0.5;
    stroke-width: 1;
    stroke-dasharray: 4 4;
    vector-effect: non-scaling-stroke;
  }
  .trend-axis {
    display: flex;
    justify-content: space-between;
    margin-top: var(--ha-space-1, 4px);
  }
  .climate {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(140px, 100%), 1fr));
    gap: var(--ha-space-2, 8px);
    margin-top: var(--ha-space-2, 8px);
  }
  .climate-item {
    display: flex;
    align-items: center;
    gap: var(--ha-space-3, 12px);
    padding: var(--ha-space-3, 12px);
    border: 0;
    border-radius: var(--ha-border-radius-lg, 12px);
    text-align: start;
    background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
  }
  .climate-icon {
    display: inline-flex;
    padding: var(--ha-space-2, 8px);
    border-radius: 50%;
    color: var(--pap-accent);
    background: color-mix(in srgb, var(--pap-accent) 14%, transparent);
  }
  .climate-icon svg {
    width: 20px;
    height: 20px;
  }
  .climate-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .climate-value {
    font-size: var(--ha-font-size-l, 1.1rem);
    font-weight: var(--ha-font-weight-medium, 500);
    font-variant-numeric: tabular-nums;
  }
  .controls-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--ha-space-2, 8px);
  }
  .controls-head .section-title {
    margin: 0;
    color: var(--secondary-text-color);
  }
  .icon-button.plain {
    border: 0;
    color: var(--pap-accent);
  }
  .round-row {
    display: flex;
    justify-content: center;
    gap: var(--ha-space-8, 32px);
    margin-bottom: var(--ha-space-5, 20px);
  }
  .round {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ha-space-2, 8px);
    font-size: var(--ha-font-size-m, 14px);
  }
  .round .icon-button {
    width: 64px;
    height: 64px;
    padding: 18px;
    border-width: 2px;
  }
  .round .icon-button svg {
    width: 28px;
    height: 28px;
  }
  .mode-button,
  .control-tile {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--ha-space-3, 12px);
    width: 100%;
    min-height: 56px;
    border-radius: var(--ha-border-radius-xl, 16px);
    font-size: var(--ha-font-size-l, 16px);
    font-weight: var(--ha-font-weight-medium, 500);
  }
  .mode-button {
    min-height: 64px;
    border-color: transparent;
    color: var(--pap-accent);
    background: color-mix(in srgb, var(--pap-accent) 12%, transparent);
    font-size: var(--ha-font-size-xl, 20px);
  }
  .mode-button svg {
    width: 30px;
    height: 30px;
  }
  .control-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--ha-space-3, 12px);
    margin-top: var(--ha-space-3, 12px);
  }
  .control-tile {
    border-width: 2px;
  }
  .control-tile[aria-pressed="true"] {
    border-color: transparent;
  }
  dialog {
    width: min(420px, calc(100vw - 32px));
    box-sizing: border-box;
    padding: var(--ha-space-6, 24px);
    border: 0;
    border-radius: var(--ha-border-radius-3xl, 28px);
    background: var(--ha-card-background, var(--card-background-color));
    color: var(--primary-text-color);
    box-shadow: var(--ha-box-shadow-l, 0 12px 48px rgb(0 0 0 / 30%));
  }
  dialog[open] {
    animation: pap-sheet-in var(--ha-animation-duration-normal, 0.25s) ease-out;
  }
  @keyframes pap-sheet-in {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
  }
  .sheet-close {
    position: absolute;
    top: var(--ha-space-3, 12px);
    inset-inline-start: var(--ha-space-3, 12px);
    border: 0;
    color: var(--secondary-text-color);
  }
  .sheet-actions {
    display: flex;
    flex-direction: row-reverse;
    gap: var(--ha-space-2, 8px);
    margin-top: var(--ha-space-6, 24px);
  }
  .sheet-actions .apply,
  .sheet-actions .cancel {
    width: auto;
    margin: 0;
    padding-inline: var(--ha-space-6, 24px);
  }
  /* Home Assistant shows choice dialogs as bottom sheets on phones. */
  @media (max-width: 870px) {
    dialog {
      width: 100%;
      max-width: none;
      margin: auto 0 0;
      border-end-start-radius: 0;
      border-end-end-radius: 0;
      padding-bottom: calc(var(--ha-space-6, 24px) + env(safe-area-inset-bottom, 0px));
    }
    .sheet-actions {
      flex-direction: column;
    }
    .sheet-actions .apply,
    .sheet-actions .cancel {
      width: 100%;
    }
  }
  dialog::backdrop {
    background: rgb(0 0 0 / 45%);
  }
  dialog h3 {
    margin: 0 0 var(--ha-space-5, 20px);
    text-align: center;
    font-size: var(--ha-font-size-xl, 20px);
    font-weight: var(--ha-font-weight-bold, 600);
  }
  .choices {
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-1, 4px);
    max-height: 50vh;
    overflow-y: auto;
  }
  .choice {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--ha-space-4, 16px);
    min-height: 56px;
    border: 0;
    border-radius: var(--ha-border-radius-xl, 16px);
    color: var(--pap-accent);
    font-size: var(--ha-font-size-l, 16px);
    font-weight: var(--ha-font-weight-medium, 500);
  }
  .choices.compact {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .choices:focus-visible {
    outline: none;
  }
  .choice svg {
    width: 28px;
    height: 28px;
  }
  .choice:focus-visible,
  .apply:focus-visible,
  .cancel:focus-visible {
    outline-offset: -3px;
  }
  .choice[aria-checked="true"] {
    background: color-mix(in srgb, var(--pap-accent) 12%, transparent);
  }
  .apply,
  .cancel {
    display: block;
    width: 100%;
    margin-top: var(--ha-space-4, 16px);
    border: 0;
    border-radius: var(--ha-border-radius-pill, 9999px);
    font-weight: var(--ha-font-weight-medium, 500);
  }
  .apply {
    min-height: 48px;
    color: var(--ha-color-on-primary-loud, var(--text-primary-color, #fff));
    background: var(--ha-color-fill-primary-loud-resting, var(--primary-color));
  }
  .apply:hover {
    background: var(--ha-color-fill-primary-loud-hover, var(--primary-color));
  }
  .cancel {
    color: var(--pap-accent);
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
`;var w=class extends _{static{this.styles=Kt}static{this.cardType=""}static{this.editorTag=""}static{this.properties={hass:{attribute:!1},config:{attribute:!1},busy:{state:!0},error:{state:!0}}}constructor(){super(),this.config={type:""},this.busy=!1,this.error=""}static getConfigElement(){return document.createElement(this.editorTag)}setConfig(t){let e=this.constructor;if(!t||t.type!==`custom:${e.cardType}`)throw new Error(`Expected custom:${e.cardType}`);for(let[i,r]of Object.entries(t)){if(i.startsWith("show_")&&typeof r!="boolean")throw new Error(`${i} must be a boolean`);if(["entity","device_id","name"].includes(i)&&(typeof r!="string"||!r.trim()))throw new Error(`${i} must be non-empty text`)}if(t.entity&&!t.entity.startsWith(`${this.controlRole}.`))throw new Error(`entity must be a ${this.controlRole} entity`);if(t.sensors&&(!Array.isArray(t.sensors)||t.sensors.some(i=>typeof i!="string"||!i.startsWith("sensor."))))throw new Error("sensors must be a list of sensor entity IDs");this.config={...t,...t.sensors?{sensors:[...t.sensors]}:{}},this.error=""}getCardSize(){return this.controlRole==="air"?3:6}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}shouldUpdate(t){if(t.size!==1||!t.has("hass"))return!0;let e=t.get("hass"),i=this.hass;return!e||!i||e.entities!==i.entities||e.devices!==i.devices||e.locale!==i.locale||e.themes!==i.themes?!0:this.related().some(r=>e.states[r.id]!==i.states[r.id])}related(){return this.hass?["fan","humidifier","air","pm25","filter","humidity","temperature","water","target","lock","light","auto_plus","lamp","timer"].flatMap(t=>k(this.hass,this.config,t)):[]}caps(t){return this.hass?k(this.hass,this.config,t):[]}label(t){return t.state?this.hass?.formatEntityName?.(t.state)??String(t.state.attributes.friendly_name??t.key?.replaceAll("_"," ")??t.id):t.key?.replaceAll("_"," ")??t.id}value(t){return t.availability!=="available"||!t.state?this.hass?.localize?.(`state.default.${t.availability}`)||(t.availability==="unknown"?"Unknown":"Unavailable"):this.hass?.formatEntityState(t.state)??t.state.state}reading(t){let e=this.value(t),i=t.state?.attributes.unit_of_measurement;return t.availability==="available"&&typeof i=="string"&&i&&e.endsWith(i)?o`${e.slice(0,-i.length).trim()}<span class="unit"> ${i}</span>`:e}moreInfo(t){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0}))}async action(t,e,i={}){if(!(!this.hass||this.busy||W(this.hass,t.id).availability!=="available")){this.busy=!0,this.error="";try{await this.hass.callService(t.id.split(".")[0],e,{...i,entity_id:t.id})}catch(r){this.error=r instanceof Error?r.message:"The device could not complete the action. Please try again."}finally{this.busy=!1}}}heading(t){let e=this.hass&&tt(this.hass,this.config),i=e?this.hass?.devices?.[e]:void 0;return o`<div>
      <div class="eyebrow">${t}</div>
      <h2>${this.config.name??i?.name_by_user??i?.name??"Philips AirPurifier"}</h2>
    </div>`}guard(){if(!this.hass)return o`<div class="notice">Connecting to Home Assistant…</div>`;let t=tt(this.hass,this.config);return!t||!X(this.hass).includes(t)?o`<div class="notice">
        Select a Philips device in the card editor. The configured device could not be found.
      </div>`:this.config.entity&&(this.hass.entities?.[this.config.entity]?.device_id!==t||this.hass.entities?.[this.config.entity]?.platform!=="philips_airpurifier")?o`<div class="notice">The control entity must belong to the selected Philips device.</div>`:this.config.sensors?.some(e=>{let i=this.hass.entities?.[e];return i?i.device_id!==t||i.platform!=="philips_airpurifier":!!this.hass.states[e]})?o`<div class="notice">Air-quality sensors must belong to the selected Philips device.</div>`:c}feedback(){return o`<div aria-live="polite" role="status">
        ${this.busy?o`<span class="secondary">Sending…</span>`:c}
      </div>
      ${this.error?o`<div class="error" role="alert">${this.error}</div>`:c}`}};var et=()=>o`<svg viewBox="0 0 24 24" aria-hidden="true">${g`<path d="M12 3v9M6.3 5.7a8 8 0 1 0 11.4 0"/>`}</svg>`,Zt=()=>o`<svg viewBox="0 0 74 108" aria-hidden="true">
    ${g`<rect x="14" y="21" width="46" height="78" rx="14"/><ellipse cx="37" cy="24" rx="22" ry="7"/><path d="M22 43v40m7-40v46m8-46v46m8-46v46m7-46v40M25 12c-6-5 6-5 0-10m12 10c-6-5 6-5 0-10m12 10c-6-5 6-5 0-10"/>`}
  </svg>`,Gt=()=>o`<svg viewBox="0 0 74 108" aria-hidden="true">
    ${g`<path d="M37 12C32 27 13 46 13 64a24 24 0 0 0 48 0C61 46 42 27 37 12Z"/><path d="M24 64a13 13 0 0 0 13 13"/>`}
  </svg>`,Yt=()=>o`<svg viewBox="0 0 24 24" aria-hidden="true">
    ${g`<path d="M12 3.5C10 7 6 10.5 6 14.5a6 6 0 0 0 12 0c0-4-4-7.5-6-11Z"/>`}
  </svg>`,Jt=()=>o`<svg viewBox="0 0 24 24" aria-hidden="true">
    ${g`<path d="M10 13.5V5a2 2 0 1 1 4 0v8.5a4 4 0 1 1-4 0ZM12 11v5"/>`}
  </svg>`,Qt=s=>o`<svg class="filter-ring" viewBox="0 0 48 48" aria-hidden="true">
    <circle class="track" cx="24" cy="24" r="20" />
    <circle cx="24" cy="24" r="20" pathLength="100" stroke-dasharray="${Math.max(0,Math.min(100,s))} 100" />
  </svg>`,$=s=>o`<svg viewBox="0 0 24 24" aria-hidden="true">${s}</svg>`,Xt=s=>$(g`<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d=${s?"M8 11V7.5a4 4 0 0 1 8 0V11":"M8 11V7.5a4 4 0 0 1 7.6-1.8"}/><path d="M12 15v2"/>`),Oe=()=>$(g`<path d="M19.5 12A7.5 7.5 0 1 1 13.5 4.6"/><path d="M13 2.5l1.2 2.3-2.4 1"/><path d="M9 16.5l3-8 3 8M10.1 13.7h3.8"/>`),Ie=()=>$(g`<path d="M19.5 14.5A8 8 0 1 1 9.5 4.5a6.5 6.5 0 0 0 10 10Z"/><path d="M15 5.5h.01M18.5 9h.01"/>`),ze=()=>$(g`<path d="M3.5 9.5c3-2.5 7-2 8.5 1.5"/><path d="M12 11c1.5 3.5-.5 7-3 8.5"/><path d="M12 11c3.5-1.5 5-5 4.5-8"/>`),Ue=()=>$(g`<path d="M12 12a1.5 1.5 0 1 1 1.5 1.5A3.5 3.5 0 1 1 15.5 10a5.5 5.5 0 1 1-7.8-.8A7.5 7.5 0 1 1 4.5 15"/>`),it=()=>$(g`<path d="M12 12c-.5-4 .5-8.5 3.5-8.5s2 5.5-3.5 8.5Zm0 0c4-.5 8.5.5 8.5 3.5s-5.5 2-8.5-3.5Zm0 0c.5 4-.5 8.5-3.5 8.5s-2-5.5 3.5-8.5Zm0 0c-4 .5-8.5-.5-8.5-3.5s5.5-2 8.5 3.5Z"/>`),te=()=>$(g`<circle cx="12" cy="13" r="4"/><path d="M10.5 5.5h3v3h-3zM12 19.5V21M4 13H2.5M21.5 13H20M6.3 7.3 5.2 6.2M17.7 7.3l1.1-1.1M6.3 18.7l-1.1 1.1M17.7 18.7l1.1 1.1"/>`),ee=()=>$(g`<path d="M6 17.5h12M12 12V8M8 13l-2-2.5M16 13l2-2.5M5 16H2.5M21.5 16H19"/>`),ie=()=>$(g`<circle cx="12" cy="12" r="9"/><path d="M12 7v5H9"/>`),re=()=>$(g`<path d="M6 6l12 12M18 6 6 18"/>`),se=()=>$(g`<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>`);function rt(s){return s.startsWith("auto")||s==="pollution"||s==="gas"||s==="allergen"?Oe():s.includes("sleep")||s==="night"?Ie():s==="turbo"||s==="high"||s==="ventilation"?Ue():s==="medium"||s.startsWith("speed")?ze():it()}var U={good:"Good",fair:"Fair",poor:"Poor",very_poor:"Very poor"},oe={good:"The air quality is looking good at this moment.",fair:"The air quality is fair. Your purifier is working on it.",poor:"The air quality is poor. Keep the purifier running.",very_poor:"The air quality is very poor. Consider a higher fan speed."},kt=["good","fair","poor","very_poor"],St=12,ae={pm25:{label:"PM2.5",hint:"Fine particles",max:100,limits:[St,35,55]},indoor_allergen_index:{label:"Allergens",hint:"Indoor allergen index",max:12,limits:[3,6,9],suffix:"/12"},gas_level:{label:"Gas",hint:"Gas index",max:4,limits:[1,2,3],prefix:"L"},total_volatile_organic_compounds:{label:"TVOC",hint:"TVOC index"}},ne=["pm25","gas_level","indoor_allergen_index","total_volatile_organic_compounds"];function le(s){let t=s.availability==="available"?f(s.state?.state):void 0;if(t!==void 0)return t<30?"Dry":t>60?"Humid":"Comfortable"}function ce(s,t){let e=i=>{let r=ne.indexOf(i.key??"");return r===-1?ne.length:r};return e(s)-e(t)}function st(s){return ae[s.key??""]??(s.state?.attributes.device_class==="pm25"?ae.pm25:void 0)}function R(s){let t=st(s)?.limits,e=s.availability==="available"?f(s.state?.state):void 0;if(!t||e===void 0)return;let i=t.findIndex(r=>e<=r);return kt[i===-1?3:i]}function de(s){return s.reduce((t,e)=>e&&(!t||kt.indexOf(e)>kt.indexOf(t))?e:t,void 0)}function pe(s){let t=st(s)?.max,e=s.availability==="available"?f(s.state?.state):void 0;if(!(!t||e===void 0))return Math.max(.06,Math.min(1,e/t))}var at="auto",nt=class extends w{constructor(){super(...arguments);this.controlRole="fan"}static{this.cardType="philips-airpurifier-purifier-card"}static{this.editorTag="philips-airpurifier-card-editor"}static{this.properties={...w.properties,sheet:{state:!0}}}static getStubConfig(e){return I(e,this.cardType,"fan")}updated(){let e=this.renderRoot.querySelector("dialog");e&&!e.open&&e.showModal()}render(){let e=this.guard(),i=this.caps("fan")[0];if(e!==c||!i)return o`<ha-card
        ><div class="body">
          ${this.heading("Purifier")}${e!==c?e:o`<div class="notice">This device does not expose a purifier fan.</div>`}
        </div></ha-card
      >`;let a=i.state?.state==="on",n=this.caps("pm25")[0],d=this.config.show_pm25!==!1&&n?R(n):void 0;return o`<ha-card
      ><div class="body">
        <header>${this.heading("Purifier")}</header>
        <div class="hero ${d?`band-${d}`:""}">
          ${Zt()}
          <div>
            ${this.config.show_pm25!==!1&&n?o`<div class="secondary">PM2.5</div>
                    <div class="value">${this.reading(n)}</div>
                    ${d?o`<span class="pill">${U[d]}</span>`:c}`:o`<div class="value">
                    ${i.availability==="available"?a?"On":"Off":this.value(i)}
                  </div>`}
            <div class="state">
              ${i.availability!=="available"?this.value(i):a?this.modeLabel(i):"Standby"}
            </div>
          </div>
        </div>
        ${this.controls(i)} ${this.health()} ${this.feedback()}
      </div>
      ${this.renderSheet()}</ha-card
    >`}controls(e){let i=e.state?.state==="on",r=e.availability!=="available"||this.busy,a=this.caps("lock")[0],n=a?.state?.state==="on",d=z(e.state?.attributes.preset_modes),l=String(e.state?.attributes.preset_mode??""),p=[this.displayTile(),this.speedTile(e),this.selectTile("lamp","Light",ee()),this.selectTile("timer","Timer",ie())].filter(u=>u!==c);return o`<section class="controls" aria-label="Controls">
      <div class="controls-head">
        <span class="section-title">Controls</span>
        <button class="icon-button plain" aria-label="Open purifier details" @click=${()=>this.moreInfo(e.id)}>
          ${se()}
        </button>
      </div>
      <div class="round-row">
        <div class="round">
          <button
            class="icon-button"
            aria-label=${i?"Turn purifier off":"Turn purifier on"}
            aria-pressed=${i}
            ?disabled=${r}
            @click=${()=>this.action(e,i?"turn_off":"turn_on")}
          >
            ${et()}
          </button>
          <span>Power</span>
        </div>
        ${a?o`<div class="round">
                <button
                  class="icon-button"
                  aria-label="Toggle child lock"
                  aria-pressed=${n}
                  ?disabled=${this.busy||a.availability!=="available"}
                  @click=${()=>this.action(a,n?"turn_off":"turn_on")}
                >
                  ${Xt(n)}
                </button>
                <span>Child lock</span>
              </div>`:c}
      </div>
      ${this.config.show_presets!==!1&&d.length?o`<button
              class="mode-button"
              aria-haspopup="dialog"
              aria-pressed=${i&&d.includes(l)}
              aria-label=${`Mode: ${i?this.modeLabel(e):"Off"}. Choose a mode`}
              ?disabled=${r}
              @click=${u=>this.open(u,{entity:e.id,title:"Choose a mode",selected:l,choices:d.map(h=>({value:h,label:this.presetLabel(e,h),icon:rt(h)})),apply:h=>this.action(e,"set_preset_mode",{preset_mode:h})})}
            >
              ${rt(l)}<span>${i?this.modeLabel(e):"Choose a mode"}</span>
            </button>`:c}
      ${p.length?o`<div class="control-grid">${p}</div>`:c}
    </section>`}tile(e,i,r,a,n,d){return o`<button
      class="control-tile"
      aria-label=${`${i}: ${a}`}
      aria-pressed=${d}
      ?disabled=${this.busy||e.availability!=="available"}
      @click=${n}
    >
      ${r}<span>${a}</span>
    </button>`}displayTile(){let e=this.caps("light")[0];if(!e)return c;let i=e.state?.state==="on";return this.tile(e,"Display light",te(),e.availability==="available"?i?"On":"Off":this.value(e),()=>this.action(e,i?"turn_off":"turn_on"),i)}speedTile(e){let i=e.state?.attributes??{},r=f(i.percentage_step),a=f(i.supported_features)??0;if(this.config.show_speed===!1||!(a&1)||!r||r<=0)return c;let n=f(i.percentage),d=e.state?.state==="on",l=Math.round(100/r),p=d&&n!==void 0&&n>0?String(Math.round(n/r)):at,h=z(i.preset_modes).find(v=>v.startsWith("auto")),b=v=>v===at?"Auto":`Speed ${v}`,y=[...h?[{value:at,label:"Auto",icon:rt("auto")}]:[],...Array.from({length:l},(v,x)=>({value:String(x+1),label:b(String(x+1)),icon:it()}))];return this.tile(e,"Fan speed",it(),e.availability!=="available"?this.value(e):d?b(p):"Off",v=>this.open(v,{entity:e.id,title:"Fan speed",selected:p,choices:y,apply:x=>x===at?this.action(e,"set_preset_mode",{preset_mode:h}):this.action(e,"set_percentage",{percentage:Math.min(100,Number(x)*r)})}),!1)}selectTile(e,i,r){let a=this.caps(e)[0],n=z(a?.state?.attributes.options);if(!a?.state||!n.length)return c;let d=a.state.state;return this.tile(a,i,r,this.value(a),l=>this.open(l,{entity:a.id,title:i==="Timer"?"Set a timer":`Choose ${i.toLowerCase()} mode`,selected:d,choices:n.map(p=>({value:p,label:this.optionLabel(a,p)})),apply:p=>this.action(a,"select_option",{option:p})}),n.indexOf(d)>0)}health(){let e=this.caps("filter");return this.config.show_filter===!1||!e.length?c:o`<div class="section">
      <div class="section-title">Device health</div>
      ${e.map(i=>{let r=i.state?.attributes.unit_of_measurement==="%"?f(i.state.state):void 0;return o`<button
          class="filter"
          aria-label=${`Details for ${this.label(i)}`}
          @click=${()=>this.moreInfo(i.id)}
        >
          ${r!==void 0?Qt(r):c}<span class="filter-text"
            ><span class="filter-name">${this.label(i)}</span><span class="filter-value">${this.value(i)}</span
            ><span class="secondary">
              ·
              ${i.availability==="available"?String(i.state?.attributes["Replacement Status"]??"Filter life remaining"):"Check device connection"}</span
            ></span
          >
        </button>`})}
    </div>`}open(e,i){this.opener=e.currentTarget,this.sheet=i}close(){this.renderRoot.querySelector("dialog")?.close(),this.sheet=void 0,this.updateComplete.then(()=>this.opener?.focus())}renderSheet(){let e=this.sheet;return e?o`<dialog
      aria-labelledby="sheet-title"
      @close=${()=>this.sheet=void 0}
      @cancel=${()=>this.close()}
    >
      <button class="icon-button sheet-close" aria-label="Close" @click=${()=>this.close()}>${re()}</button>
      <h3 id="sheet-title">${e.title}</h3>
      <div
        class="choices ${e.choices.length>6&&e.choices.every(i=>!i.icon)?"compact":""}"
        role="radiogroup"
        aria-labelledby="sheet-title"
      >
        ${e.choices.map(i=>o`<button
              class="choice"
              role="radio"
              aria-checked=${i.value===e.selected}
              ?autofocus=${i.value===e.selected}
              @click=${()=>this.sheet={...e,selected:i.value}}
            >
              ${i.icon??c}<span>${i.label}</span>
            </button>`)}
      </div>
      <div class="sheet-actions">
        <button
          class="apply"
          ?disabled=${this.busy||this.hass?.states[e.entity]?.state==="unavailable"||!this.hass?.states[e.entity]||!e.choices.some(i=>i.value===e.selected)}
          @click=${async()=>{this.close(),await e.apply(e.selected)}}
        >
          Apply
        </button>
        <button class="cancel" @click=${()=>this.close()}>Cancel</button>
      </div>
    </dialog>`:c}presetLabel(e,i){if(i==="auto"&&this.caps("auto_plus")[0]?.state?.state==="on")return"Auto+";let r=e.state&&this.hass?.formatEntityAttributeValue?.(e.state,"preset_mode",i);return r&&r!==i?r:he(i)}modeLabel(e){let i=e.state?.attributes.preset_mode;return typeof i=="string"&&i?this.presetLabel(e,i):"Manual"}optionLabel(e,i){let r=e.state&&this.hass?.formatEntityState(e.state,i);return r&&r!==i?r:he(i)}};function he(s){let t=s.replaceAll("_"," ");return t.charAt(0).toUpperCase()+t.slice(1)}var Et=24;async function ue(s,t,e=Date.now()){return s.callWS?((await s.callWS({type:"recorder/statistics_during_period",start_time:new Date(e-Et*36e5).toISOString(),statistic_ids:[t],period:"hour",types:["mean","min","max"]}))?.[t]??[]).flatMap(r=>{let a=typeof r.start=="number"?r.start:Date.parse(r.start),n=f(r.mean);return!Number.isFinite(a)||n===void 0?[]:[{t:a,mean:n,min:f(r.min)??n,max:f(r.max)??n}]}):[]}var ot=300,K=96;function lt(s){return s.map(([t,e],i)=>{if(i===0)return`M${t.toFixed(1)},${e.toFixed(1)}`;let[r,a]=s[i-1],n=(t-r)/2;return`C${(r+n).toFixed(1)},${a.toFixed(1)} ${(t-n).toFixed(1)},${e.toFixed(1)} ${t.toFixed(1)},${e.toFixed(1)}`}).join("")}function me(s,t,e,i){if(s.length<2)return c;let r=s[0].t,a=Math.max(1,s[s.length-1].t-r),n=Math.max(...s.map(m=>m.max),e??0)*1.1||1,d=m=>(m-r)/a*ot,l=m=>K-Math.max(0,m)/n*K,p=s.map(m=>[d(m.t),l(m.mean)]),u=s.map(m=>[d(m.t),l(m.max)]),h=s.map(m=>[d(m.t),l(m.min)]).reverse(),b=`${lt(u)}L${lt(h).slice(1)}Z`,y=`${lt(p)}L${ot},${K}L0,${K}Z`,v=new Intl.DateTimeFormat(i,{hour:"numeric",minute:"2-digit"}),x=Math.max(...s.map(m=>m.max)),L=s.reduce((m,ve)=>m+ve.mean,0)/s.length,S=new Intl.NumberFormat(i,{maximumFractionDigits:1});return o`<figure class="trend">
    <figcaption>
      <span class="metric-label">PM2.5 · last ${Et} hours</span>
      <span class="secondary">Avg ${S.format(L)} · Peak ${S.format(x)} ${t}</span>
    </figcaption>
    <svg
      viewBox="0 0 ${ot} ${K}"
      preserveAspectRatio="none"
      role="img"
      aria-label=${`PM2.5 over the last ${Et} hours, average ${S.format(L)}, peak ${S.format(x)} ${t}`}
    >
      ${g`<defs><linearGradient id="pap-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity="0.28"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs>
      <path class="trend-range" d=${b}/>
      <path class="trend-area" d=${y} fill="url(#pap-fill)"/>
      ${e!==void 0&&e<n?g`<line class="trend-threshold" x1="0" x2=${ot} y1=${l(e)} y2=${l(e)}/>`:c}
      <path class="trend-line" d=${lt(p)}/>
      <path class="trend-dot" d=${`M${d(s[s.length-1].t)},${l(s[s.length-1].mean)}h0`}/>`}
    </svg>
    <div class="trend-axis secondary"><span>${v.format(r)}</span><span>Now</span></div>
  </figure>`}var fe=9e5,ct=class extends w{constructor(){super();this.controlRole="air";this.trendKey="";this.trendAt=0;this.trend=[]}static{this.cardType="philips-airpurifier-air-quality-card"}static{this.editorTag="philips-airpurifier-card-editor"}static{this.properties={...w.properties,trend:{state:!0}}}connectedCallback(){super.connectedCallback(),this.refreshTimer=setInterval(()=>{this.trendAt=0,this.requestUpdate()},fe)}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this.refreshTimer)}static getStubConfig(e){return I(e,this.cardType,"air")}updated(e){super.updated(e);let i=this.config.show_trend!==!1&&this.hass?this.caps("pm25")[0]:void 0;if(!i||!this.hass){this.trendKey="",this.trend.length&&(this.trend=[]);return}this.trendKey===i.id&&Date.now()-this.trendAt<fe||(this.trendKey=i.id,this.trendAt=Date.now(),ue(this.hass,i.id).then(r=>{this.trendKey===i.id&&(this.trend=r)},()=>{this.trendKey===i.id&&(this.trend=[])}))}render(){let e=this.guard(),i=this.config.sensors?.length?this.caps("air"):this.caps("air").sort(ce),r=de(i.map(R));return o`<ha-card class=${r?`band-${r}`:""}
      ><div class="body">
        <header>
          ${this.heading("Air quality")}${r&&e===c?o`<span class="pill">${U[r]}</span>`:c}
        </header>
        ${e!==c?e:i.length?o`${r?o`<p class="summary">${oe[r]}</p>`:c}
                  <div class="metrics">${i.map(a=>this.tile(a))}</div>
                  ${this.renderTrend()} ${this.renderClimate()}`:o`<div class="notice">This device does not expose air-quality sensors.</div>`}
      </div></ha-card
    >`}renderClimate(){if(this.config.show_climate===!1)return c;let e=this.caps("humidity")[0],i=this.caps("temperature")[0];if(!e&&!i)return c;let r=(a,n,d,l)=>o`<button
        class="climate-item"
        aria-label=${`Details for ${this.label(a)}`}
        @click=${()=>this.moreInfo(a.id)}
      >
        <span class="climate-icon">${d}</span>
        <span class="climate-text">
          <span class="secondary">${n}</span>
          <span class="climate-value">${this.reading(a)}</span>
          ${l?o`<span class="secondary">${l}</span>`:c}
        </span>
      </button>`;return o`<div class="climate">
      ${e?r(e,"Humidity",Yt(),le(e)):c}
      ${i?r(i,"Temperature",Jt()):c}
    </div>`}renderTrend(){let e=this.config.show_trend!==!1?this.caps("pm25")[0]:void 0;if(!e||this.trend.length<2)return c;let i=String(e.state?.attributes.unit_of_measurement??"");return o`<button
      class="trend-button ${R(e)?`band-${R(e)}`:""}"
      aria-label="Open PM2.5 history"
      @click=${()=>this.moreInfo(e.id)}
    >
      ${me(this.trend,i,St,this.hass?.locale?.language)}
    </button>`}tile(e){let i=st(e),r=R(e),a=pe(e),n=f(e.state?.state),d=e.availability==="available"&&n!==void 0&&(i?.prefix||i?.suffix);return o`<button
      class="tile ${r?`band-${r}`:""}"
      aria-label=${`Details for ${this.label(e)}${r?`, ${U[r]}`:""}`}
      @click=${()=>this.moreInfo(e.id)}
    >
      <span class="metric-label">${i?.label??this.label(e)}</span>
      <span class="value"
        >${d?o`${i.prefix??""}${n}${i.suffix?o`<span class="unit"> ${i.suffix}</span>`:c}`:e.availability!=="available"?"\u2014":this.reading(e)}</span
      >
      ${a!==void 0?o`<span class="meter" aria-hidden="true"><span style="width:${(a*100).toFixed(1)}%"></span></span>`:c}
      <span class="secondary"
        >${e.availability!=="available"?this.value(e):r?U[r]:i?.hint??"Sensor reading"}</span
      >
    </button>`}};var dt=class extends w{constructor(){super(...arguments);this.controlRole="humidifier"}static{this.cardType="philips-airpurifier-humidity-card"}static{this.editorTag="philips-airpurifier-card-editor"}static getStubConfig(e){return I(e,this.cardType,"humidifier")}render(){let e=this.guard(),i=this.caps("humidifier")[0];if(e!==c||!i)return o`<ha-card
        ><div class="body">
          ${this.heading("Humidity")}${e!==c?e:o`<div class="notice">This device does not expose a humidifier.</div>`}
        </div></ha-card
      >`;let r=i.state,a=r?.attributes??{},n=r?.state==="on",d=i.availability!=="available"||this.busy,l=f(a.humidity),p=f(a.min_humidity),u=f(a.max_humidity),h=f(a.target_humidity_step)??f(this.caps("target")[0]?.state?.attributes.step),b=f(a.current_humidity),y=z(a.available_modes),v=this.caps("water")[0],x=l!==void 0&&p!==void 0&&u!==void 0&&p<u&&h!==void 0&&h>0,L=m=>new Intl.NumberFormat(this.hass?.locale?.language).format(m),S=m=>x?Math.min(u,Math.max(p,Number((p+Math.round((l-p)/h+m)*h).toFixed(6)))):void 0;return o`<ha-card
      ><div class="body">
        <header>
          ${this.heading("Humidity")}<button
            class="icon-button"
            aria-label=${n?"Turn humidifier off":"Turn humidifier on"}
            aria-pressed=${n}
            ?disabled=${d}
            @click=${()=>this.action(i,n?"turn_off":"turn_on")}
          >
            ${et()}
          </button>
        </header>
        <div class="hero">
          ${Gt()}
          <div>
            <div class="secondary">Current humidity</div>
            <div class="value">
              ${i.availability!=="available"?this.value(i):b!==void 0?o`${L(b)}<span class="unit"> %</span>`:"Unknown"}
            </div>
            <div class="state mode">
              ${i.availability!=="available"?this.value(i):String(a.action??(n?"On":"Off")).replaceAll("_"," ")}
            </div>
          </div>
        </div>
        ${this.config.show_target_control!==!1?o`<div class="section-title">Target humidity</div>
                <div class="stepper">
                  <button
                    aria-label="Decrease target humidity"
                    ?disabled=${d||!x||l<=p}
                    @click=${()=>this.action(i,"set_humidity",{humidity:S(-1)})}
                  >
                    −</button
                  ><span class="target">${l!==void 0?`${L(l)}%`:"Unknown"}</span
                  ><button
                    aria-label="Increase target humidity"
                    ?disabled=${d||!x||l>=u}
                    @click=${()=>this.action(i,"set_humidity",{humidity:S(1)})}
                  >
                    +
                  </button>
                </div>
                ${x?c:o`<div class="secondary">Target controls need the device’s humidity bounds and step.</div>`}`:c}
        ${this.config.show_mode!==!1&&y.length?o`<div class="section">
                <div class="section-title">Mode</div>
                <div class="chips">
                  ${y.map(m=>o`<button class="mode" aria-label=${`Set mode ${m.replaceAll("_"," ")}`} aria-pressed=${a.mode===m&&n} ?disabled=${d} @click=${()=>this.action(i,"set_mode",{mode:m})}>${m.replaceAll("_"," ")}</button>`)}
                </div>
              </div>`:c}
        ${this.config.show_water_level!==!1&&v?o`<div class="section">
                <button class="filter" aria-label="Water level details" @click=${()=>this.moreInfo(v.id)}>
                  <span>Water level</span><strong>${this.value(v)}</strong>
                </button>
              </div>`:c}
        <div class="section actions">
          <button aria-label="Open humidifier details" @click=${()=>this.moreInfo(i.id)}>
            Device details ↗
          </button>
        </div>
        ${this.feedback()}
      </div></ha-card
    >`}};var ge={purifier:["show_presets","show_speed","show_filter","show_pm25"],"air-quality":["show_trend","show_climate"],humidity:["show_target_control","show_mode","show_water_level"]},pt=class extends _{static{this.properties={hass:{attribute:!1},config:{state:!0}}}setConfig(t){this.config={...t}}render(){if(!this.hass||!this.config)return o``;let t=this.config.type.includes("air-quality")?"air-quality":this.config.type.includes("humidity")?"humidity":"purifier",e=[{name:"device_id",required:!0,selector:{device:{filter:[{integration:"philips_airpurifier"}]}}},{name:"name",selector:{text:{}}}],i=t==="air-quality"?"air":t==="humidity"?"humidifier":"fan",r=this.config.device_id?{include_entities:k(this.hass,{type:this.config.type,device_id:this.config.device_id},i).map(a=>a.id)}:{};t==="air-quality"?e.push({name:"sensors",selector:{entity:{multiple:!0,...r,filter:[{domain:"sensor",integration:"philips_airpurifier"}]}}}):e.push({name:"entity",selector:{entity:{...r,filter:[{domain:i,integration:"philips_airpurifier"}]}}});for(let a of ge[t]??[])e.push({name:a,selector:{boolean:{}}});return o`<ha-form
      .hass=${this.hass}
      .data=${{...Object.fromEntries((ge[t]??[]).map(a=>[a,!0])),...this.config}}
      .schema=${e}
      .computeLabel=${a=>({device_id:"Device",entity:"Control entity (optional override)",name:"Name (optional)",sensors:"Air-quality sensors (optional, ordered)"})[a.name]??{show_presets:"Show mode controls",show_speed:"Show fan speed",show_filter:"Show filter health",show_pm25:"Show PM2.5",show_target_control:"Show target controls",show_mode:"Show modes",show_water_level:"Show water level",show_trend:"Show 24-hour PM2.5 trend",show_climate:"Show humidity and temperature"}[a.name]??a.name.replaceAll("_"," ")}
      @value-changed=${this.changed}
    ></ha-form>`}changed(t){t.stopPropagation();let e={...t.detail.value,type:this.config.type};e.device_id!==this.config?.device_id&&(delete e.entity,delete e.sensors);for(let i of["name","entity","device_id"])e[i]||delete e[i];this.config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}};var Le=[["philips-airpurifier-purifier-card",nt],["philips-airpurifier-air-quality-card",ct],["philips-airpurifier-humidity-card",dt],["philips-airpurifier-card-editor",pt]];function Ne(){for(let[s,t]of Le)customElements.get(s)||customElements.define(s,t);window.customCards??=[];for(let[s,t,e,i]of[["purifier","Philips Purifier","fan","Power, modes, air quality and filter health."],["air-quality","Philips Air Quality","air","Your device\u2019s particle, allergen and gas readings."],["humidity","Philips Humidity","humidifier","Humidity, target controls and water level."]]){let r=`philips-airpurifier-${s}-card`;window.customCards.some(a=>a.type===r)||window.customCards.push({type:r,name:t,description:i,preview:!0,documentationURL:"https://github.com/tinkerologie/ha-philips-airpurifier#dashboard-cards",getEntitySuggestion(a,n){let d=a.entities?.[n];if(d?.platform!==Q||!d.device_id)return null;let l={type:`custom:${r}`,device_id:d.device_id};return k(a,l,e).some(p=>p.id===n)?{config:l}:null}})}}Ne();export{Ne as registerCards};
