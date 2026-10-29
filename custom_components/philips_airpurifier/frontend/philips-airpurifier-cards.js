/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var X=globalThis,ee=X.ShadowRoot&&(X.ShadyCSS===void 0||X.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ke=Symbol(),De=new WeakMap,q=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==ke)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(ee&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=De.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&De.set(t,e))}return e}toString(){return this.cssText}},Ne=a=>new q(typeof a=="string"?a:a+"",void 0,ke),V=(a,...e)=>{let t=a.length===1?a[0]:e.reduce((i,r,s)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+a[s+1],a[0]);return new q(t,a,ke)},Be=(a,e)=>{if(ee)a.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let i=document.createElement("style"),r=X.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=t.cssText,a.appendChild(i)}},Se=ee?a=>a:a=>a instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return Ne(t)})(a):a;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var{is:Tt,defineProperty:Mt,getOwnPropertyDescriptor:Pt,getOwnPropertyNames:Rt,getOwnPropertySymbols:Ht,getPrototypeOf:It}=Object,te=globalThis,je=te.trustedTypes,Ot=je?je.emptyScript:"",Ut=te.reactiveElementPolyfillSupport,F=(a,e)=>a,Ee={toAttribute(a,e){switch(e){case Boolean:a=a?Ot:null;break;case Object:case Array:a=a==null?a:JSON.stringify(a)}return a},fromAttribute(a,e){let t=a;switch(e){case Boolean:t=a!==null;break;case Number:t=a===null?null:Number(a);break;case Object:case Array:try{t=JSON.parse(a)}catch{t=null}}return t}},Ve=(a,e)=>!Tt(a,e),qe={attribute:!0,type:String,converter:Ee,reflect:!1,useDefault:!1,hasChanged:Ve};Symbol.metadata??=Symbol("metadata"),te.litPropertyMetadata??=new WeakMap;var k=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=qe){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),r=this.getPropertyDescriptor(e,i,t);r!==void 0&&Mt(this.prototype,e,r)}}static getPropertyDescriptor(e,t,i){let{get:r,set:s}=Pt(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:r,set(n){let d=r?.call(this);s?.call(this,n),this.requestUpdate(e,d,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??qe}static _$Ei(){if(this.hasOwnProperty(F("elementProperties")))return;let e=It(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(F("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(F("properties"))){let t=this.properties,i=[...Rt(t),...Ht(t)];for(let r of i)this.createProperty(r,t[r])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[i,r]of t)this.elementProperties.set(i,r)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let r=this._$Eu(t,i);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let r of i)t.unshift(Se(r))}else e!==void 0&&t.push(Se(e));return t}static _$Eu(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Be(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){let i=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,i);if(r!==void 0&&i.reflect===!0){let s=(i.converter?.toAttribute!==void 0?i.converter:Ee).toAttribute(t,i.type);this._$Em=e,s==null?this.removeAttribute(r):this.setAttribute(r,s),this._$Em=null}}_$AK(e,t){let i=this.constructor,r=i._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let s=i.getPropertyOptions(r),n=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:Ee;this._$Em=r;let d=n.fromAttribute(t,s.type);this[r]=d??this._$Ej?.get(r)??d,this._$Em=null}}requestUpdate(e,t,i,r=!1,s){if(e!==void 0){let n=this.constructor;if(r===!1&&(s=this[e]),i??=n.getPropertyOptions(e),!((i.hasChanged??Ve)(s,t)||i.useDefault&&i.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:r,wrapped:s},n){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),s!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),r===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,s]of this._$Ep)this[r]=s;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[r,s]of i){let{wrapped:n}=s,d=this[r];n!==!0||this._$AL.has(r)||d===void 0||this.C(r,void 0,s,d)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[F("elementProperties")]=new Map,k[F("finalized")]=new Map,Ut?.({ReactiveElement:k}),(te.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var Me=globalThis,Fe=a=>a,ie=Me.trustedTypes,We=ie?ie.createPolicy("lit-html",{createHTML:a=>a}):void 0,Pe="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,Re="?"+S,Lt=`<${Re}>`,H=document,K=()=>H.createComment(""),G=a=>a===null||typeof a!="object"&&typeof a!="function",He=Array.isArray,Qe=a=>He(a)||typeof a?.[Symbol.iterator]=="function",Te=`[ 	
\f\r]`,W=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ke=/-->/g,Ge=/>/g,P=RegExp(`>|${Te}(?:([^\\s"'>=/]+)(${Te}*=${Te}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ze=/'/g,Ye=/"/g,Xe=/^(?:script|style|textarea|title)$/i,Ie=a=>(e,...t)=>({_$litType$:a,strings:e,values:t}),c=Ie(1),f=Ie(2),ti=Ie(3),$=Symbol.for("lit-noChange"),l=Symbol.for("lit-nothing"),Je=new WeakMap,R=H.createTreeWalker(H,129);function et(a,e){if(!He(a)||!a.hasOwnProperty("raw"))throw Error("invalid template strings array");return We!==void 0?We.createHTML(e):e}var tt=(a,e)=>{let t=a.length-1,i=[],r,s=e===2?"<svg>":e===3?"<math>":"",n=W;for(let d=0;d<t;d++){let o=a[d],p,u,h=-1,b=0;for(;b<o.length&&(n.lastIndex=b,u=n.exec(o),u!==null);)b=n.lastIndex,n===W?u[1]==="!--"?n=Ke:u[1]!==void 0?n=Ge:u[2]!==void 0?(Xe.test(u[2])&&(r=RegExp("</"+u[2],"g")),n=P):u[3]!==void 0&&(n=P):n===P?u[0]===">"?(n=r??W,h=-1):u[1]===void 0?h=-2:(h=n.lastIndex-u[2].length,p=u[1],n=u[3]===void 0?P:u[3]==='"'?Ye:Ze):n===Ye||n===Ze?n=P:n===Ke||n===Ge?n=W:(n=P,r=void 0);let y=n===P&&a[d+1].startsWith("/>")?" ":"";s+=n===W?o+Lt:h>=0?(i.push(p),o.slice(0,h)+Pe+o.slice(h)+S+y):o+S+(h===-2?d:y)}return[et(a,s+(a[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},Z=class a{constructor({strings:e,_$litType$:t},i){let r;this.parts=[];let s=0,n=0,d=e.length-1,o=this.parts,[p,u]=tt(e,t);if(this.el=a.createElement(p,i),R.currentNode=this.el.content,t===2||t===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(r=R.nextNode())!==null&&o.length<d;){if(r.nodeType===1){if(r.hasAttributes())for(let h of r.getAttributeNames())if(h.endsWith(Pe)){let b=u[n++],y=r.getAttribute(h).split(S),g=/([.?@])?(.*)/.exec(b);o.push({type:1,index:s,name:g[2],strings:y,ctor:g[1]==="."?ae:g[1]==="?"?se:g[1]==="@"?ne:O}),r.removeAttribute(h)}else h.startsWith(S)&&(o.push({type:6,index:s}),r.removeAttribute(h));if(Xe.test(r.tagName)){let h=r.textContent.split(S),b=h.length-1;if(b>0){r.textContent=ie?ie.emptyScript:"";for(let y=0;y<b;y++)r.append(h[y],K()),R.nextNode(),o.push({type:2,index:++s});r.append(h[b],K())}}}else if(r.nodeType===8)if(r.data===Re)o.push({type:2,index:s});else{let h=-1;for(;(h=r.data.indexOf(S,h+1))!==-1;)o.push({type:7,index:s}),h+=S.length-1}s++}}static createElement(e,t){let i=H.createElement("template");return i.innerHTML=e,i}};function I(a,e,t=a,i){if(e===$)return e;let r=i!==void 0?t._$Co?.[i]:t._$Cl,s=G(e)?void 0:e._$litDirective$;return r?.constructor!==s&&(r?._$AO?.(!1),s===void 0?r=void 0:(r=new s(a),r._$AT(a,t,i)),i!==void 0?(t._$Co??=[])[i]=r:t._$Cl=r),r!==void 0&&(e=I(a,r._$AS(a,e.values),r,i)),e}var re=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,r=(e?.creationScope??H).importNode(t,!0);R.currentNode=r;let s=R.nextNode(),n=0,d=0,o=i[0];for(;o!==void 0;){if(n===o.index){let p;o.type===2?p=new z(s,s.nextSibling,this,e):o.type===1?p=new o.ctor(s,o.name,o.strings,this,e):o.type===6&&(p=new oe(s,this,e)),this._$AV.push(p),o=i[++d]}n!==o?.index&&(s=R.nextNode(),n++)}return R.currentNode=H,r}p(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},z=class a{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,r){this.type=2,this._$AH=l,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=I(this,e,t),G(e)?e===l||e==null||e===""?(this._$AH!==l&&this._$AR(),this._$AH=l):e!==this._$AH&&e!==$&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Qe(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==l&&G(this._$AH)?this._$AA.nextSibling.data=e:this.T(H.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:i}=e,r=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=Z.createElement(et(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(t);else{let s=new re(r,this),n=s.u(this.options);s.p(t),this.T(n),this._$AH=s}}_$AC(e){let t=Je.get(e.strings);return t===void 0&&Je.set(e.strings,t=new Z(e)),t}k(e){He(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,r=0;for(let s of e)r===t.length?t.push(i=new a(this.O(K()),this.O(K()),this,this.options)):i=t[r],i._$AI(s),r++;r<t.length&&(this._$AR(i&&i._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let i=Fe(e).nextSibling;Fe(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},O=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,r,s){this.type=1,this._$AH=l,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=s,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=l}_$AI(e,t=this,i,r){let s=this.strings,n=!1;if(s===void 0)e=I(this,e,t,0),n=!G(e)||e!==this._$AH&&e!==$,n&&(this._$AH=e);else{let d=e,o,p;for(e=s[0],o=0;o<s.length-1;o++)p=I(this,d[i+o],t,o),p===$&&(p=this._$AH[o]),n||=!G(p)||p!==this._$AH[o],p===l?e=l:e!==l&&(e+=(p??"")+s[o+1]),this._$AH[o]=p}n&&!r&&this.j(e)}j(e){e===l?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},ae=class extends O{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===l?void 0:e}},se=class extends O{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==l)}},ne=class extends O{constructor(e,t,i,r,s){super(e,t,i,r,s),this.type=5}_$AI(e,t=this){if((e=I(this,e,t,0)??l)===$)return;let i=this._$AH,r=e===l&&i!==l||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,s=e!==l&&(i===l||r);r&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},oe=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){I(this,e)}},it={M:Pe,P:S,A:Re,C:1,L:tt,R:re,D:Qe,V:I,I:z,H:O,N:se,U:ne,B:ae,F:oe},zt=Me.litHtmlPolyfillSupport;zt?.(Z,z),(Me.litHtmlVersions??=[]).push("3.3.3");var rt=(a,e,t)=>{let i=t?.renderBefore??e,r=i._$litPart$;if(r===void 0){let s=t?.renderBefore??null;i._$litPart$=r=new z(e.insertBefore(K(),s),s,void 0,t??{})}return r._$AI(a),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var Oe=globalThis,A=class extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=rt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return $}};A._$litElement$=!0,A.finalized=!0,Oe.litElementHydrateSupport?.({LitElement:A});var Dt=Oe.litElementPolyfillSupport;Dt?.({LitElement:A});(Oe.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var le="philips_airpurifier",Nt=new Set(["pm25","indoor_allergen_index","gas_level","total_volatile_organic_compounds"]),Bt=new Set(["pre_filter","pre_filter_cleaning","hepa_filter","active_carbon_filter","wick","nanoprotect_filter"]);function ce(a){return[...new Set(Object.values(a.entities??{}).filter(e=>e.platform===le&&e.device_id).map(e=>e.device_id))]}function de(a,e){return e.device_id?e.device_id:e.entity?a.entities?.[e.entity]?.device_id??void 0:ce(a)[0]}function jt(a,e,t){let i=e.entity_id.split(".")[0],r=e.translation_key,s=a.states[e.entity_id]?.attributes.device_class;switch(t){case"fan":case"humidifier":case"light":return i===t;case"pm25":return i==="sensor"&&(r==="pm25"||s==="pm25");case"humidity":return i==="sensor"&&(r==="humidity"||s==="humidity");case"air":return i==="sensor"&&(Nt.has(r??"")||s==="pm25");case"filter":return i==="sensor"&&(Bt.has(r??"")||"Filter Life Remaining"in(a.states[e.entity_id]?.attributes??{}));case"temperature":return i==="sensor"&&(r==="temperature"||s==="temperature");case"water":return i==="sensor"&&r==="water_level";case"target":return i==="number"&&r==="humidity_target";case"lock":return i==="switch"&&r==="child_lock";case"auto_plus":return i==="switch"&&r==="auto_plus";case"lamp":return i==="select"&&r==="lamp_mode";case"timer":return i==="select"&&r==="timer"}}function Y(a,e){let t=a.states[e];return{id:e,state:t,key:a.entities?.[e]?.translation_key,availability:!t||t.state==="unavailable"?"unavailable":t.state==="unknown"?"unknown":"available"}}function T(a,e,t){if(e.entity&&(t==="fan"||t==="humidifier"))return[Y(a,e.entity)];if(t==="air"&&e.sensors?.length)return e.sensors.map(r=>Y(a,r));let i=de(a,e);return i?Object.values(a.entities??{}).filter(r=>r.platform===le&&r.device_id===i&&!r.disabled_by&&jt(a,r,t)).map(r=>Y(a,r.entity_id)):[]}function D(a,e,t){let i=ce(a).find(r=>T(a,{type:e,device_id:r},t).length>0);return i?{device_id:i}:{}}function v(a){if(typeof a!="string"&&typeof a!="number"||a==="")return;let e=Number(a);return Number.isFinite(e)?e:void 0}function N(a){return Array.isArray(a)?a.filter(e=>typeof e=="string"):[]}var pe=V`
  :host {
    display: block;
    container-type: inline-size;
    height: 100%;
    font-family: var(--ha-font-family-body, Roboto, Noto, sans-serif);
    /* Tile-card language: the active state colour while on, neutral while off. */
    --pap-active-color: var(--state-fan-active-color, var(--state-active-color, var(--primary-color)));
    --pap-accent: var(--pap-active-color);
  }
  * {
    box-sizing: border-box;
  }
  ha-card {
    height: 100%;
    overflow: hidden;
    background: var(--ha-card-background, var(--card-background-color));
    color: var(--primary-text-color);
    border-radius: var(--ha-card-border-radius, var(--ha-border-radius-lg, 12px));
  }
  ha-card.is-off {
    --pap-accent: var(--state-inactive-color, var(--secondary-text-color));
  }
  ha-card.is-unavailable {
    --pap-accent: var(--state-unavailable-color, var(--disabled-text-color, var(--secondary-text-color)));
  }
  .body {
    padding: var(--ha-space-5, 20px);
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ha-space-3, 12px);
    margin-block-end: var(--ha-space-4, 16px);
  }
  .heading {
    min-width: 0;
  }
  .header-actions {
    display: flex;
    gap: var(--ha-space-1, 4px);
  }
  h2 {
    margin: 0;
    font-size: var(--ha-font-size-l, 16px);
    font-weight: var(--ha-font-weight-medium, 500);
    line-height: var(--ha-line-height-condensed, 1.2);
    overflow-wrap: anywhere;
  }
  .eyebrow,
  .secondary {
    color: var(--secondary-text-color);
    font-size: var(--ha-font-size-s, 12px);
    line-height: var(--ha-line-height-normal, 1.6);
  }
  .eyebrow {
    margin-block-start: var(--ha-space-1, 4px);
    line-height: var(--ha-line-height-condensed, 1.2);
  }
  button,
  input {
    font: inherit;
    color: inherit;
  }
  button {
    min-height: 48px;
    padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
    border: var(--ha-border-width-sm, 1px) solid var(--ha-color-border-neutral-quiet, var(--divider-color));
    border-radius: var(--ha-border-radius-lg, 12px);
    background: transparent;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background-color var(--ha-animation-duration-fast, 150ms) ease-in-out;
  }
  button:hover:not(:disabled) {
    background: color-mix(in srgb, var(--pap-accent) 12%, transparent);
  }
  button:focus-visible,
  .segment:has(input:focus-visible) {
    outline: 2px solid var(--ha-color-focus, var(--primary-color));
    outline-offset: 2px;
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  button.active,
  button[aria-pressed="true"] {
    color: var(--pap-accent);
    background: color-mix(in srgb, var(--pap-accent) 20%, transparent);
    border-color: transparent;
  }
  .icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    padding: var(--ha-space-3, 12px);
    border-radius: var(--ha-border-radius-circle, 50%);
  }
  .icon-button.plain {
    border: 0;
    color: var(--secondary-text-color);
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
    gap: var(--ha-space-5, 20px);
    margin: 0 calc(-1 * var(--ha-space-5, 20px)) var(--ha-space-5, 20px);
    padding: var(--ha-space-4, 16px) var(--ha-space-5, 20px);
    background: linear-gradient(
      to var(--pap-inline-end, right),
      color-mix(in srgb, var(--pap-accent) 14%, transparent),
      transparent
    );
  }
  :host(:dir(rtl)) {
    --pap-inline-end: left;
  }
  .hero svg {
    flex-shrink: 0;
    width: 64px;
    height: 94px;
    color: var(--pap-accent);
  }
  .value {
    font-size: clamp(var(--ha-font-size-2xl, 24px), 8cqi, var(--ha-font-size-4xl, 32px));
    font-weight: var(--ha-font-weight-medium, 500);
    line-height: var(--ha-line-height-condensed, 1.2);
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }
  .unit {
    color: var(--secondary-text-color);
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-normal, 400);
    white-space: nowrap;
  }
  .state {
    margin-block-start: var(--ha-space-2, 8px);
    color: var(--pap-accent);
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-medium, 500);
  }
  .section {
    margin-block-start: var(--ha-space-4, 16px);
    padding-block-start: var(--ha-space-4, 16px);
    border-block-start: var(--ha-border-width-sm, 1px) solid var(--ha-color-border-neutral-quiet, var(--divider-color));
  }
  .section-title {
    margin-block-end: var(--ha-space-2, 8px);
    padding: 0;
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-medium, 500);
  }
  .filter,
  .row {
    display: flex;
    align-items: center;
    gap: var(--ha-space-3, 12px);
    width: 100%;
    padding: var(--ha-space-2, 8px);
    border: 0;
    text-align: start;
  }
  .row {
    justify-content: space-between;
  }
  .filter-ring {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    transform: rotate(-90deg);
    stroke-width: 4;
    color: var(--pap-accent);
  }
  .filter-ring .track {
    stroke: var(--ha-color-border-neutral-quiet, var(--divider-color));
  }
  .filter-text {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }
  .filter-name {
    font-size: var(--ha-font-size-m, 14px);
  }
  .filter-value {
    font-weight: var(--ha-font-weight-medium, 500);
  }
  /* Mirrors ha-alert: a tinted surface with a leading icon in the tone colour. */
  .alert {
    --pap-alert-color: var(--info-color, var(--ha-color-fill-primary-loud-resting, var(--primary-color)));
    display: flex;
    align-items: flex-start;
    gap: var(--ha-space-2, 8px);
    margin-block-start: var(--ha-space-3, 12px);
    padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
    border-radius: var(--ha-border-radius-sm, 4px);
    background: color-mix(in srgb, var(--pap-alert-color) 12%, transparent);
    color: var(--primary-text-color);
    font-size: var(--ha-font-size-m, 14px);
    line-height: var(--ha-line-height-normal, 1.6);
    overflow-wrap: anywhere;
  }
  header + .alert {
    margin-block-start: 0;
  }
  .alert svg {
    flex: none;
    width: 24px;
    height: 24px;
    fill: var(--pap-alert-color);
    stroke: none;
  }
  .alert.warning {
    --pap-alert-color: var(--warning-color, var(--ha-color-fill-warning-loud-resting, #ffa600));
  }
  .alert.error {
    --pap-alert-color: var(--error-color, var(--ha-color-fill-danger-loud-resting, #db4437));
  }
  .stepper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ha-space-3, 12px);
  }
  .stepper .icon-button {
    color: var(--pap-accent);
    border-color: color-mix(in srgb, var(--pap-accent) 40%, transparent);
  }
  .target {
    font-size: var(--ha-font-size-3xl, 28px);
    font-weight: var(--ha-font-weight-medium, 500);
    font-variant-numeric: tabular-nums;
  }
  /* Segmented switch: native radios keep arrow-key navigation and form semantics. */
  fieldset.segmented {
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
  }
  .segments {
    display: flex;
    gap: var(--ha-space-1, 4px);
    padding: var(--ha-space-1, 4px);
    border-radius: var(--ha-border-radius-pill, 9999px);
    background: var(--ha-color-fill-neutral-quiet-resting, var(--secondary-background-color));
  }
  .segment {
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    min-width: 0;
    min-height: 44px;
    padding-inline: var(--ha-space-2, 8px);
    border-radius: var(--ha-border-radius-pill, 9999px);
    color: var(--secondary-text-color);
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-medium, 500);
    text-align: center;
    cursor: pointer;
  }
  .segment input {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .segment:has(input:checked) {
    background: var(--ha-card-background, var(--card-background-color));
    color: var(--pap-accent);
    box-shadow: var(--ha-box-shadow-s, 0 1px 2px rgb(0 0 0 / 15%));
  }
  .segmented:disabled .segment {
    opacity: 0.5;
    cursor: not-allowed;
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
    border-radius: var(--ha-border-radius-pill, 9999px);
    background: color-mix(in srgb, var(--pap-band, var(--pap-accent)) 20%, transparent);
    color: var(--primary-text-color);
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-medium, 500);
    line-height: var(--ha-line-height-normal, 1.6);
  }
  .pill::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-inline-end: var(--ha-space-2, 8px);
    border-radius: var(--ha-border-radius-circle, 50%);
    background: var(--pap-band, var(--pap-accent));
    vertical-align: middle;
  }
  .hero .pill {
    display: inline-block;
    margin-block-start: var(--ha-space-2, 8px);
    margin-inline-end: var(--ha-space-2, 8px);
  }
  .summary {
    margin: 0 0 var(--ha-space-4, 16px);
    font-size: var(--ha-font-size-l, 16px);
    font-weight: var(--ha-font-weight-medium, 500);
    line-height: var(--ha-line-height-condensed, 1.2);
  }
  .metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(92px, 100%), 1fr));
    gap: var(--ha-space-2, 8px);
  }
  .tile {
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-1, 4px);
    min-width: 0;
    padding: var(--ha-space-3, 12px);
    border: 0;
    border-radius: var(--ha-border-radius-lg, 12px);
    text-align: start;
    background: var(--ha-card-background, var(--card-background-color));
    background-image: linear-gradient(
      color-mix(in srgb, var(--primary-text-color) 4%, transparent),
      color-mix(in srgb, var(--primary-text-color) 4%, transparent)
    );
  }
  .metric-label {
    overflow: hidden;
    color: var(--secondary-text-color);
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-medium, 500);
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .metrics .value {
    font-size: var(--ha-font-size-3xl, 28px);
    white-space: nowrap;
  }
  .meter {
    display: block;
    height: 6px;
    margin-block: var(--ha-space-1, 4px);
    overflow: hidden;
    border-radius: var(--ha-border-radius-pill, 9999px);
    background: color-mix(in srgb, var(--pap-band, var(--pap-accent)) 18%, transparent);
  }
  .meter span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--pap-band, var(--pap-accent));
    transition: width var(--ha-animation-duration-slow, 350ms) ease;
  }
  .trend-button {
    display: block;
    width: 100%;
    margin-block-start: var(--ha-space-4, 16px);
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
    margin-block-end: var(--ha-space-2, 8px);
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
  /* Time runs left to right in every locale, matching the SVG and Home Assistant charts. */
  .trend-axis {
    direction: ltr;
    display: flex;
    justify-content: space-between;
    margin-block-start: var(--ha-space-1, 4px);
  }
  .climate {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(140px, 100%), 1fr));
    gap: var(--ha-space-2, 8px);
    margin-block-start: var(--ha-space-2, 8px);
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
    border-radius: var(--ha-border-radius-circle, 50%);
    color: var(--pap-accent);
    background: color-mix(in srgb, var(--pap-accent) 20%, transparent);
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
    font-size: var(--ha-font-size-l, 16px);
    font-weight: var(--ha-font-weight-medium, 500);
    font-variant-numeric: tabular-nums;
  }
  .controls-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-block-end: var(--ha-space-2, 8px);
  }
  .controls-head .section-title {
    margin: 0;
    color: var(--secondary-text-color);
  }
  .round-row {
    display: flex;
    justify-content: center;
    gap: var(--ha-space-8, 32px);
    margin-block-end: var(--ha-space-4, 16px);
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
    padding: var(--ha-space-4, 16px);
    border-width: var(--ha-border-width-md, 2px);
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
    border-color: transparent;
    color: var(--pap-accent);
    background: color-mix(in srgb, var(--pap-accent) 12%, transparent);
  }
  .mode-button svg {
    width: 28px;
    height: 28px;
  }
  .control-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--ha-space-2, 8px);
    margin-block-start: var(--ha-space-2, 8px);
  }
  .control-tile span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  dialog {
    width: min(420px, calc(100vw - 2 * var(--ha-space-4, 16px)));
    padding: var(--ha-space-6, 24px);
    border: 0;
    border-radius: var(--ha-dialog-border-radius, var(--ha-border-radius-4xl, 28px));
    background: var(--ha-card-background, var(--card-background-color));
    color: var(--primary-text-color);
    box-shadow: var(--ha-box-shadow-l, 0 12px 48px rgb(0 0 0 / 30%));
  }
  dialog[open] {
    animation: pap-sheet-in var(--ha-animation-duration-normal, 250ms) ease-out;
  }
  @keyframes pap-sheet-in {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
  }
  dialog::backdrop {
    background: rgb(0 0 0 / 45%);
  }
  .sheet-close {
    position: absolute;
    top: var(--ha-space-3, 12px);
    inset-inline-start: var(--ha-space-3, 12px);
    border: 0;
    color: var(--secondary-text-color);
  }
  dialog h3 {
    margin: 0 0 var(--ha-space-5, 20px);
    padding-inline: var(--ha-space-12, 48px);
    text-align: center;
    font-size: var(--ha-font-size-xl, 20px);
    font-weight: var(--ha-font-weight-normal, 400);
    line-height: 48px;
  }
  .choices {
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-1, 4px);
    max-height: 50vh;
    overflow-y: auto;
  }
  .choices.compact {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
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
  .choice svg {
    width: 28px;
    height: 28px;
  }
  .choice[aria-checked="true"] {
    background: color-mix(in srgb, var(--pap-accent) 20%, transparent);
  }
  .choice:focus-visible,
  .apply:focus-visible,
  .cancel:focus-visible {
    outline-offset: -2px;
  }
  .sheet-actions {
    display: flex;
    flex-direction: row-reverse;
    gap: var(--ha-space-2, 8px);
    margin-block-start: var(--ha-space-6, 24px);
  }
  .apply,
  .cancel {
    padding-inline: var(--ha-space-6, 24px);
    border: 0;
    border-radius: var(--ha-border-radius-pill, 9999px);
    font-weight: var(--ha-font-weight-medium, 500);
  }
  .apply {
    color: var(--ha-color-on-primary-loud, var(--text-primary-color, #fff));
    background: var(--ha-color-fill-primary-loud-resting, var(--primary-color));
  }
  .apply:hover:not(:disabled) {
    background: var(--ha-color-fill-primary-loud-hover, var(--primary-color));
  }
  .cancel {
    color: var(--primary-color);
  }
  /* Home Assistant shows choice dialogs as bottom sheets on phones. */
  @media (max-width: 870px) {
    dialog {
      width: 100%;
      max-width: none;
      margin: auto 0 0;
      border-end-start-radius: 0;
      border-end-end-radius: 0;
      padding-block-end: calc(var(--ha-space-6, 24px) + env(safe-area-inset-bottom, 0px));
    }
    .sheet-actions {
      flex-direction: column;
    }
  }
  @container (max-width: 360px) {
    .body {
      padding: var(--ha-space-4, 16px);
    }
    .hero {
      gap: var(--ha-space-4, 16px);
      margin-inline: calc(-1 * var(--ha-space-4, 16px));
      padding-inline: var(--ha-space-4, 16px);
    }
    .hero svg {
      width: 48px;
      height: 70px;
    }
    .round-row {
      gap: var(--ha-space-6, 24px);
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
`;var qt={info:"M11 9h2V7h-2m1 13c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m-1 15h2v-6h-2z",warning:"M12 2 1 21h22M12 6l7.53 13H4.47M11 10v4h2v-4m-2 6v2h2v-2",error:"M11 15h2v2h-2zm0-8h2v6h-2zm1-5C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8 8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8"};function _(a,e="info",t="status"){return c`<div class="alert ${e}" role=${t}>
    <svg viewBox="0 0 24 24" aria-hidden="true">${f`<path d=${qt[e]} />`}</svg><span>${a}</span>
  </div>`}var C=class extends A{static{this.styles=pe}static{this.cardType=""}static{this.editorTag=""}static{this.properties={hass:{attribute:!1},config:{attribute:!1},busy:{state:!0},error:{state:!0}}}constructor(){super(),this.config={type:""},this.busy=!1,this.error=""}static getConfigElement(){return document.createElement(this.editorTag)}setConfig(e){let t=this.constructor;if(!e||e.type!==`custom:${t.cardType}`)throw new Error(`Expected custom:${t.cardType}`);for(let[i,r]of Object.entries(e)){if(i.startsWith("show_")&&typeof r!="boolean")throw new Error(`${i} must be a boolean`);if(["entity","device_id","name"].includes(i)&&(typeof r!="string"||!r.trim()))throw new Error(`${i} must be non-empty text`)}if(e.entity&&!e.entity.startsWith(`${this.controlRole}.`))throw new Error(`entity must be a ${this.controlRole} entity`);if(e.sensors&&(!Array.isArray(e.sensors)||e.sensors.some(i=>typeof i!="string"||!i.startsWith("sensor."))))throw new Error("sensors must be a list of sensor entity IDs");this.config={...e,...e.sensors?{sensors:[...e.sensors]}:{}},this.error=""}getCardSize(){return this.controlRole!=="air"?this.controlRole==="fan"?9:7:4+(this.config.show_trend!==!1?3:0)+(this.config.show_climate!==!1?2:0)}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}shouldUpdate(e){if(e.size!==1||!e.has("hass"))return!0;let t=e.get("hass"),i=this.hass;return!t||!i||t.entities!==i.entities||t.devices!==i.devices||t.locale!==i.locale||t.themes!==i.themes?!0:this.related().some(r=>t.states[r.id]!==i.states[r.id])}related(){return this.hass?["fan","humidifier","air","pm25","filter","humidity","temperature","water","target","lock","light","auto_plus","lamp","timer"].flatMap(e=>T(this.hass,this.config,e)):[]}caps(e){return this.hass?T(this.hass,this.config,e):[]}label(e){return e.state?this.hass?.formatEntityName?.(e.state)??String(e.state.attributes.friendly_name??e.key?.replaceAll("_"," ")??e.id):e.key?.replaceAll("_"," ")??e.id}t(e,t){return this.hass?.localize?.(e)||t}value(e){return e.availability!=="available"||!e.state?this.t(`state.default.${e.availability}`,e.availability==="unknown"?"Unknown":"Unavailable"):this.hass?.formatEntityState(e.state)??e.state.state}attributeLabel(e,t,i){let r=e.state&&this.hass?.formatEntityAttributeValue?.(e.state,t,i);return r&&r!==i?r:he(i)}stateClass(e){return!e||e.availability!=="available"?"is-unavailable":e.state?.state==="on"?"is-on":"is-off"}reading(e){let t=this.value(e),i=e.state?.attributes.unit_of_measurement;return e.availability==="available"&&typeof i=="string"&&i&&t.endsWith(i)?c`${t.slice(0,-i.length).trim()}<span class="unit"> ${i}</span>`:t}moreInfo(e){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}async action(e,t,i={}){if(!(!this.hass||this.busy||Y(this.hass,e.id).availability!=="available")){this.busy=!0,this.error="";try{await this.hass.callService(e.id.split(".")[0],t,{...i,entity_id:e.id})}catch(r){this.error=r instanceof Error?r.message:"The device could not complete the action. Please try again."}finally{this.busy=!1}}}heading(e){let t=this.hass&&de(this.hass,this.config),i=t?this.hass?.devices?.[t]:void 0;return c`<div class="heading">
      <h2>${this.config.name??i?.name_by_user??i?.name??"Philips AirPurifier"}</h2>
      <div class="eyebrow">${e}</div>
    </div>`}guard(){if(!this.hass)return _("Connecting to Home Assistant\u2026");let e=de(this.hass,this.config);return!e||!ce(this.hass).includes(e)?_("Select a Philips device in the card editor. The configured device could not be found.","warning"):this.config.entity&&(this.hass.entities?.[this.config.entity]?.device_id!==e||this.hass.entities?.[this.config.entity]?.platform!=="philips_airpurifier")?_("The control entity must belong to the selected Philips device.","warning"):this.config.sensors?.some(t=>{let i=this.hass.entities?.[t];return i?i.device_id!==e||i.platform!=="philips_airpurifier":!!this.hass.states[t]})?_("Air-quality sensors must belong to the selected Philips device.","warning"):l}feedback(){return c`<div aria-live="polite" role="status">
        ${this.busy?c`<span class="secondary">Sending…</span>`:l}
      </div>
      ${this.error?_(this.error,"error","alert"):l}`}};function he(a){let e=a.replaceAll("_"," ");return e.charAt(0).toUpperCase()+e.slice(1)}var ue=()=>c`<svg viewBox="0 0 24 24" aria-hidden="true">${f`<path d="M12 3v9M6.3 5.7a8 8 0 1 0 11.4 0"/>`}</svg>`,at=()=>c`<svg viewBox="0 0 74 108" aria-hidden="true">
    ${f`<rect x="14" y="21" width="46" height="78" rx="14"/><ellipse cx="37" cy="24" rx="22" ry="7"/><path d="M22 43v40m7-40v46m8-46v46m8-46v46m7-46v40M25 12c-6-5 6-5 0-10m12 10c-6-5 6-5 0-10m12 10c-6-5 6-5 0-10"/>`}
  </svg>`,st=()=>c`<svg viewBox="0 0 74 108" aria-hidden="true">
    ${f`<path d="M37 12C32 27 13 46 13 64a24 24 0 0 0 48 0C61 46 42 27 37 12Z"/><path d="M24 64a13 13 0 0 0 13 13"/>`}
  </svg>`,nt=()=>c`<svg viewBox="0 0 24 24" aria-hidden="true">
    ${f`<path d="M12 3.5C10 7 6 10.5 6 14.5a6 6 0 0 0 12 0c0-4-4-7.5-6-11Z"/>`}
  </svg>`,ot=()=>c`<svg viewBox="0 0 24 24" aria-hidden="true">
    ${f`<path d="M10 13.5V5a2 2 0 1 1 4 0v8.5a4 4 0 1 1-4 0ZM12 11v5"/>`}
  </svg>`,lt=a=>c`<svg class="filter-ring" viewBox="0 0 48 48" aria-hidden="true">
    <circle class="track" cx="24" cy="24" r="20" />
    <circle cx="24" cy="24" r="20" pathLength="100" stroke-dasharray="${Math.max(0,Math.min(100,a))} 100" />
  </svg>`,w=a=>c`<svg viewBox="0 0 24 24" aria-hidden="true">${a}</svg>`,ct=a=>w(f`<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d=${a?"M8 11V7.5a4 4 0 0 1 8 0V11":"M8 11V7.5a4 4 0 0 1 7.6-1.8"}/><path d="M12 15v2"/>`),Vt=()=>w(f`<path d="M19.5 12A7.5 7.5 0 1 1 13.5 4.6"/><path d="M13 2.5l1.2 2.3-2.4 1"/><path d="M9 16.5l3-8 3 8M10.1 13.7h3.8"/>`),Ft=()=>w(f`<path d="M19.5 14.5A8 8 0 1 1 9.5 4.5a6.5 6.5 0 0 0 10 10Z"/><path d="M15 5.5h.01M18.5 9h.01"/>`),Wt=()=>w(f`<path d="M3.5 9.5c3-2.5 7-2 8.5 1.5"/><path d="M12 11c1.5 3.5-.5 7-3 8.5"/><path d="M12 11c3.5-1.5 5-5 4.5-8"/>`),Kt=()=>w(f`<path d="M12 12a1.5 1.5 0 1 1 1.5 1.5A3.5 3.5 0 1 1 15.5 10a5.5 5.5 0 1 1-7.8-.8A7.5 7.5 0 1 1 4.5 15"/>`),me=()=>w(f`<path d="M12 12c-.5-4 .5-8.5 3.5-8.5s2 5.5-3.5 8.5Zm0 0c4-.5 8.5.5 8.5 3.5s-5.5 2-8.5-3.5Zm0 0c.5 4-.5 8.5-3.5 8.5s-2-5.5 3.5-8.5Zm0 0c-4 .5-8.5-.5-8.5-3.5s5.5-2 8.5 3.5Z"/>`),dt=()=>w(f`<circle cx="12" cy="13" r="4"/><path d="M10.5 5.5h3v3h-3zM12 19.5V21M4 13H2.5M21.5 13H20M6.3 7.3 5.2 6.2M17.7 7.3l1.1-1.1M6.3 18.7l-1.1 1.1M17.7 18.7l1.1 1.1"/>`),pt=()=>w(f`<path d="M6 17.5h12M12 12V8M8 13l-2-2.5M16 13l2-2.5M5 16H2.5M21.5 16H19"/>`),ht=()=>w(f`<circle cx="12" cy="12" r="9"/><path d="M12 7v5H9"/>`),ut=()=>w(f`<path d="M6 6l12 12M18 6 6 18"/>`),fe=()=>w(f`<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>`);function ve(a){return a.startsWith("auto")||a==="pollution"||a==="gas"||a==="allergen"?Vt():a.includes("sleep")||a==="night"?Ft():a==="turbo"||a==="high"||a==="ventilation"?Kt():a==="medium"||a.startsWith("speed")?Wt():me()}var B={good:"Good",fair:"Fair",poor:"Poor",very_poor:"Very poor"},vt={good:"The air quality is looking good at this moment.",fair:"The air quality is fair. Your purifier is working on it.",poor:"The air quality is poor. Keep the purifier running.",very_poor:"The air quality is very poor. Consider a higher fan speed."},Ue=["good","fair","poor","very_poor"],Le=12,mt={pm25:{label:"PM2.5",hint:"Fine particles",max:100,limits:[Le,35,55]},indoor_allergen_index:{label:"Allergens",hint:"Indoor allergen index",max:12,limits:[3,6,9],suffix:"/12"},gas_level:{label:"Gas",hint:"Gas index",max:4,limits:[1,2,3],prefix:"L"},total_volatile_organic_compounds:{label:"TVOC",hint:"TVOC index"}},ft=["pm25","gas_level","indoor_allergen_index","total_volatile_organic_compounds"];function gt(a){let e=a.availability==="available"?v(a.state?.state):void 0;if(e!==void 0)return e<30?"Dry":e>60?"Humid":"Comfortable"}function bt(a,e){let t=i=>{let r=ft.indexOf(i.key??"");return r===-1?ft.length:r};return t(a)-t(e)}function ge(a){return mt[a.key??""]??(a.state?.attributes.device_class==="pm25"?mt.pm25:void 0)}function U(a){let e=ge(a)?.limits,t=a.availability==="available"?v(a.state?.state):void 0;if(!e||t===void 0)return;let i=e.findIndex(r=>t<=r);return Ue[i===-1?3:i]}function yt(a){return a.reduce((e,t)=>t&&(!e||Ue.indexOf(t)>Ue.indexOf(e))?t:e,void 0)}function xt(a){let e=ge(a)?.max,t=a.availability==="available"?v(a.state?.state):void 0;if(!(!e||t===void 0))return Math.max(.06,Math.min(1,t/e))}var be="auto",ye=class extends C{constructor(){super(...arguments);this.controlRole="fan"}static{this.cardType="philips-airpurifier-purifier-card"}static{this.editorTag="philips-airpurifier-card-editor"}static{this.properties={...C.properties,sheet:{state:!0}}}static getStubConfig(t){return D(t,this.cardType,"fan")}updated(){let t=this.renderRoot.querySelector("dialog");t&&!t.open&&t.showModal()}render(){let t=this.guard(),i=this.caps("fan")[0];if(t!==l||!i)return c`<ha-card
        ><div class="body">
          <header>${this.heading("Purifier")}</header>
          ${t!==l?t:_("This device does not expose a purifier fan.")}
        </div></ha-card
      >`;let s=i.state?.state==="on",n=this.caps("pm25")[0],d=this.config.show_pm25!==!1&&n?U(n):void 0,o=i.availability==="available";return c`<ha-card class=${this.stateClass(i)}
      ><div class="body">
        <header>${this.heading("Purifier")}</header>
        <div class="hero ${d?`band-${d}`:""}">
          ${at()}
          <div>
            ${this.config.show_pm25!==!1&&n?c`<div class="secondary">PM2.5</div>
                    <div class="value">${this.reading(n)}</div>
                    ${d?c`<span class="pill">${B[d]}</span>`:l}`:c`<div class="value">${this.value(i)}</div>`}
            ${o?c`<div class="state">${s?this.modeLabel(i):"Standby"}</div>`:c`<div class="state">
                    ${n&&this.config.show_pm25!==!1?this.value(i):"Check the device connection"}
                  </div>`}
          </div>
        </div>
        ${this.controls(i)} ${this.health()} ${this.feedback()}
      </div>
      ${this.renderSheet()}</ha-card
    >`}controls(t){let i=t.state?.state==="on",r=t.availability!=="available"||this.busy,s=this.caps("lock")[0],n=s?.state?.state==="on",d=N(t.state?.attributes.preset_modes),o=String(t.state?.attributes.preset_mode??""),p=[this.displayTile(),this.speedTile(t),this.selectTile("lamp","Light",pt()),this.selectTile("timer","Timer",ht())].filter(u=>u!==l);return c`<section class="controls" aria-label="Controls">
      <div class="controls-head">
        <span class="section-title">Controls</span>
        <button class="icon-button plain" aria-label="Open purifier details" @click=${()=>this.moreInfo(t.id)}>
          ${fe()}
        </button>
      </div>
      <div class="round-row">
        <div class="round">
          <button
            aria-label=${i?"Turn purifier off":"Turn purifier on"}
            class="icon-button ${i?"active":""}"
            ?disabled=${r}
            @click=${()=>this.action(t,i?"turn_off":"turn_on")}
          >
            ${ue()}
          </button>
          <span aria-hidden="true">Power</span>
        </div>
        ${s?c`<div class="round">
                <button
                  class="icon-button"
                  aria-label="Toggle child lock"
                  aria-pressed=${n}
                  ?disabled=${this.busy||s.availability!=="available"}
                  @click=${()=>this.action(s,n?"turn_off":"turn_on")}
                >
                  ${ct(n)}
                </button>
                <span aria-hidden="true">Child lock</span>
              </div>`:l}
      </div>
      ${this.config.show_presets!==!1&&d.length?c`<button
              class="mode-button ${i&&d.includes(o)?"active":""}"
              aria-haspopup="dialog"
              aria-label=${`Mode: ${i?this.modeLabel(t):"Off"}. Choose a mode`}
              ?disabled=${r}
              @click=${u=>this.open(u,{entity:t.id,title:"Choose a mode",selected:o,choices:d.map(h=>({value:h,label:this.presetLabel(t,h),icon:ve(h)})),apply:h=>this.action(t,"set_preset_mode",{preset_mode:h})})}
            >
              ${ve(o)}<span>${i?this.modeLabel(t):"Choose a mode"}</span>
            </button>`:l}
      ${p.length?c`<div class="control-grid">${p}</div>`:l}
    </section>`}tile(t,i,r,s,n,d,o=!0){return c`<button
      class="control-tile ${d?"active":""}"
      aria-label=${`${i}: ${s}`}
      aria-haspopup=${o?"dialog":l}
      ?disabled=${this.busy||t.availability!=="available"}
      @click=${n}
    >
      ${r}<span>${s}</span>
    </button>`}displayTile(){let t=this.caps("light")[0];if(!t)return l;let i=t.state?.state==="on";return this.tile(t,"Display light",dt(),this.value(t),()=>this.action(t,i?"turn_off":"turn_on"),i,!1)}speedTile(t){let i=t.state?.attributes??{},r=v(i.percentage_step),s=v(i.supported_features)??0;if(this.config.show_speed===!1||!(s&1)||!r||r<=0)return l;let n=v(i.percentage),d=t.state?.state==="on",o=Math.round(100/r),p=d&&n!==void 0&&n>0?String(Math.round(n/r)):be,h=N(i.preset_modes).find(g=>g.startsWith("auto")),b=g=>g===be?"Auto":`Speed ${g}`,y=[...h?[{value:be,label:"Auto",icon:ve("auto")}]:[],...Array.from({length:o},(g,x)=>({value:String(x+1),label:b(String(x+1)),icon:me()}))];return this.tile(t,"Fan speed",me(),t.availability!=="available"?this.value(t):d?b(p):"Off",g=>this.open(g,{entity:t.id,title:"Fan speed",selected:p,choices:y,apply:x=>x===be?this.action(t,"set_preset_mode",{preset_mode:h}):this.action(t,"set_percentage",{percentage:Math.min(100,Number(x)*r)})}),!1)}selectTile(t,i,r){let s=this.caps(t)[0],n=N(s?.state?.attributes.options);if(!s?.state||!n.length)return l;let d=s.state.state;return this.tile(s,i,r,this.value(s),o=>this.open(o,{entity:s.id,title:i==="Timer"?"Set a timer":`Choose ${i.toLowerCase()} mode`,selected:d,choices:n.map(p=>({value:p,label:this.optionLabel(s,p)})),apply:p=>this.action(s,"select_option",{option:p})}),n.indexOf(d)>0)}health(){let t=this.caps("filter");return this.config.show_filter===!1||!t.length?l:c`<div class="section">
      <div class="section-title">Device health</div>
      ${t.map(i=>{let r=i.state?.attributes.unit_of_measurement==="%"?v(i.state.state):void 0;return c`<button
          class="filter"
          aria-label=${`Details for ${this.label(i)}`}
          @click=${()=>this.moreInfo(i.id)}
        >
          ${r!==void 0?lt(r):l}<span class="filter-text"
            ><span class="filter-name">${this.label(i)}</span><span class="filter-value">${this.value(i)}</span
            ><span class="secondary">
              ${i.availability==="available"?String(i.state?.attributes["Replacement Status"]??"Filter life remaining"):"Check the device connection"}</span
            ></span
          >
        </button>`})}
    </div>`}open(t,i){this.opener=t.currentTarget,this.sheet=i}close(){this.renderRoot.querySelector("dialog")?.close(),this.sheet=void 0,this.updateComplete.then(()=>this.opener?.focus())}renderSheet(){let t=this.sheet;return t?c`<dialog
      aria-labelledby="sheet-title"
      @close=${()=>this.sheet=void 0}
      @cancel=${()=>this.close()}
    >
      <button
        class="icon-button sheet-close"
        aria-label=${this.t("ui.common.close","Close")}
        @click=${()=>this.close()}
      >
        ${ut()}
      </button>
      <h3 id="sheet-title">${t.title}</h3>
      <div
        class="choices ${t.choices.length>6&&t.choices.every(i=>!i.icon)?"compact":""}"
        role="radiogroup"
        aria-labelledby="sheet-title"
        @keydown=${i=>this.moveChoice(i,t)}
      >
        ${t.choices.map((i,r)=>c`<button
              class="choice"
              role="radio"
              aria-checked=${i.value===t.selected}
              tabindex=${i.value===t.selected||r===0&&!t.choices.some(s=>s.value===t.selected)?0:-1}
              ?autofocus=${i.value===t.selected}
              @click=${()=>this.sheet={...t,selected:i.value}}
            >
              ${i.icon??l}<span>${i.label}</span>
            </button>`)}
      </div>
      <div class="sheet-actions">
        <button
          class="apply"
          ?disabled=${this.busy||this.hass?.states[t.entity]?.state==="unavailable"||!this.hass?.states[t.entity]||!t.choices.some(i=>i.value===t.selected)}
          @click=${async()=>{this.close(),await t.apply(t.selected)}}
        >
          Apply
        </button>
        <button class="cancel" @click=${()=>this.close()}>${this.t("ui.common.cancel","Cancel")}</button>
      </div>
    </dialog>`:l}moveChoice(t,i){let r={ArrowDown:1,ArrowRight:1,ArrowUp:-1,ArrowLeft:-1}[t.key];if(!r||!i.choices.length)return;t.preventDefault();let s=/Left|Right/.test(t.key)&&getComputedStyle(this).direction==="rtl",n=i.choices.findIndex(p=>p.value===i.selected),d=i.choices.length,o=(n+(s?-r:r)+d)%d;this.sheet={...i,selected:i.choices[o].value},this.updateComplete.then(()=>this.renderRoot.querySelectorAll(".choice")[o]?.focus())}presetLabel(t,i){if(i==="auto"&&this.caps("auto_plus")[0]?.state?.state==="on")return"Auto+";let r=t.state&&this.hass?.formatEntityAttributeValue?.(t.state,"preset_mode",i);return r&&r!==i?r:he(i)}modeLabel(t){let i=t.state?.attributes.preset_mode;return typeof i=="string"&&i?this.presetLabel(t,i):"Manual"}optionLabel(t,i){let r=t.state&&this.hass?.formatEntityState(t.state,i);return r&&r!==i?r:he(i)}};var ze=24;async function $t(a,e,t=Date.now()){return a.callWS?((await a.callWS({type:"recorder/statistics_during_period",start_time:new Date(t-ze*36e5).toISOString(),statistic_ids:[e],period:"hour",types:["mean","min","max"]}))?.[e]??[]).flatMap(r=>{let s=typeof r.start=="number"?r.start:Date.parse(r.start),n=v(r.mean);return!Number.isFinite(s)||n===void 0?[]:[{t:s,mean:n,min:v(r.min)??n,max:v(r.max)??n}]}):[]}var xe=300,J=96;function $e(a){return a.map(([e,t],i)=>{if(i===0)return`M${e.toFixed(1)},${t.toFixed(1)}`;let[r,s]=a[i-1],n=(e-r)/2;return`C${(r+n).toFixed(1)},${s.toFixed(1)} ${(e-n).toFixed(1)},${t.toFixed(1)} ${e.toFixed(1)},${t.toFixed(1)}`}).join("")}function _t(a,e,t,i){if(a.length<2)return l;let r=a[0].t,s=Math.max(1,a[a.length-1].t-r),n=Math.max(...a.map(m=>m.max),t??0)*1.1||1,d=m=>(m-r)/s*xe,o=m=>J-Math.max(0,m)/n*J,p=a.map(m=>[d(m.t),o(m.mean)]),u=a.map(m=>[d(m.t),o(m.max)]),h=a.map(m=>[d(m.t),o(m.min)]).reverse(),b=`${$e(u)}L${$e(h).slice(1)}Z`,y=`${$e(p)}L${xe},${J}L0,${J}Z`,g=new Intl.DateTimeFormat(i,{hour:"numeric",minute:"2-digit"}),x=Math.max(...a.map(m=>m.max)),j=a.reduce((m,Q)=>m+Q.mean,0)/a.length,M=new Intl.NumberFormat(i,{maximumFractionDigits:1});return c`<figure class="trend">
    <figcaption>
      <span class="metric-label">PM2.5 · last ${ze} hours</span>
      <span class="secondary">Avg ${M.format(j)} · Peak ${M.format(x)} ${e}</span>
    </figcaption>
    <svg
      viewBox="0 0 ${xe} ${J}"
      preserveAspectRatio="none"
      role="img"
      aria-label=${`PM2.5 over the last ${ze} hours, average ${M.format(j)}, peak ${M.format(x)} ${e}`}
    >
      ${f`<defs><linearGradient id="pap-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity="0.28"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs>
      <path class="trend-range" d=${b}/>
      <path class="trend-area" d=${y} fill="url(#pap-fill)"/>
      ${t!==void 0&&t<n?f`<line class="trend-threshold" x1="0" x2=${xe} y1=${o(t)} y2=${o(t)}/>`:l}
      <path class="trend-line" d=${$e(p)}/>
      <path class="trend-dot" d=${`M${d(a[a.length-1].t)},${o(a[a.length-1].mean)}h0`}/>`}
    </svg>
    <div class="trend-axis secondary"><span>${g.format(r)}</span><span>Now</span></div>
  </figure>`}var wt=9e5,_e=class extends C{constructor(){super();this.controlRole="air";this.trendKey="";this.trendAt=0;this.trend=[]}static{this.cardType="philips-airpurifier-air-quality-card"}static{this.editorTag="philips-airpurifier-card-editor"}static{this.properties={...C.properties,trend:{state:!0}}}connectedCallback(){super.connectedCallback(),this.refreshTimer=setInterval(()=>{this.trendAt=0,this.requestUpdate()},wt)}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this.refreshTimer)}static getStubConfig(t){return D(t,this.cardType,"air")}willUpdate(t){super.willUpdate(t);let i=this.config.show_trend!==!1&&this.hass?this.caps("pm25")[0]:void 0;if(!i||!this.hass){this.trendKey="",this.trend.length&&(this.trend=[]);return}this.trendKey===i.id&&Date.now()-this.trendAt<wt||(this.trendKey=i.id,this.trendAt=Date.now(),$t(this.hass,i.id).then(r=>{this.trendKey===i.id&&(this.trend=r)},()=>{this.trendKey===i.id&&(this.trend=[])}))}render(){let t=this.guard(),i=this.config.sensors?.length?this.caps("air"):this.caps("air").sort(bt),r=yt(i.map(U));return c`<ha-card class=${r?`band-${r}`:""}
      ><div class="body">
        <header>
          ${this.heading("Air quality")}${r&&t===l?c`<span class="pill">${B[r]}</span>`:l}
        </header>
        ${t!==l?t:i.length?c`${r?c`<p class="summary">${vt[r]}</p>`:l}
                  <div class="metrics">${i.map(s=>this.tile(s))}</div>
                  ${this.renderTrend()} ${this.renderClimate()}`:_("This device does not expose air-quality sensors.")}
      </div></ha-card
    >`}renderClimate(){if(this.config.show_climate===!1)return l;let t=this.caps("humidity")[0],i=this.caps("temperature")[0];if(!t&&!i)return l;let r=(s,n,d,o)=>c`<button
        class="climate-item"
        aria-label=${`Details for ${this.label(s)}`}
        @click=${()=>this.moreInfo(s.id)}
      >
        <span class="climate-icon">${d}</span>
        <span class="climate-text">
          <span class="secondary">${n}</span>
          <span class="climate-value">${this.reading(s)}</span>
          ${o?c`<span class="secondary">${o}</span>`:l}
        </span>
      </button>`;return c`<div class="climate">
      ${t?r(t,"Humidity",nt(),gt(t)):l}
      ${i?r(i,"Temperature",ot()):l}
    </div>`}renderTrend(){let t=this.config.show_trend!==!1?this.caps("pm25")[0]:void 0;if(!t||this.trend.length<2)return l;let i=String(t.state?.attributes.unit_of_measurement??"");return c`<button
      class="trend-button ${U(t)?`band-${U(t)}`:""}"
      aria-label="Open PM2.5 history"
      @click=${()=>this.moreInfo(t.id)}
    >
      ${_t(this.trend,i,Le,this.hass?.locale?.language)}
    </button>`}tile(t){let i=ge(t),r=U(t),s=xt(t),n=v(t.state?.state),d=t.availability==="available"&&n!==void 0&&(i?.prefix||i?.suffix);return c`<button
      class="tile ${r?`band-${r}`:""}"
      aria-label=${`Details for ${this.label(t)}${r?`, ${B[r]}`:""}`}
      @click=${()=>this.moreInfo(t.id)}
    >
      <span class="metric-label">${i?.label??this.label(t)}</span>
      <span class="value"
        >${d?c`${i.prefix??""}${n}${i.suffix?c`<span class="unit"> ${i.suffix}</span>`:l}`:t.availability!=="available"?"\u2014":this.reading(t)}</span
      >
      ${s!==void 0?c`<span class="meter" aria-hidden="true"><span style="width:${(s*100).toFixed(1)}%"></span></span>`:l}
      <span class="secondary"
        >${t.availability!=="available"?this.value(t):r?B[r]:i?.hint??"Sensor reading"}</span
      >
    </button>`}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var L={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},At=a=>(...e)=>({_$litDirective$:a,values:e}),we=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var{I:qi}=it;var Ct=a=>a.strings===void 0;var Gt={},kt=(a,e=Gt)=>a._$AH=e;/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var St=At(class extends we{constructor(a){if(super(a),a.type!==L.PROPERTY&&a.type!==L.ATTRIBUTE&&a.type!==L.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!Ct(a))throw Error("`live` bindings can only contain a single expression")}render(a){return a}update(a,[e]){if(e===$||e===l)return e;let t=a.element,i=a.name;if(a.type===L.PROPERTY){if(e===t[i])return $}else if(a.type===L.BOOLEAN_ATTRIBUTE){if(!!e===t.hasAttribute(i))return $}else if(a.type===L.ATTRIBUTE&&t.getAttribute(i)===e+"")return $;return kt(a),e}});var Ae=class extends C{constructor(){super(...arguments);this.controlRole="humidifier"}static{this.cardType="philips-airpurifier-humidity-card"}static{this.editorTag="philips-airpurifier-card-editor"}static{this.styles=[pe,V`
      :host {
        --pap-active-color: var(
          --state-humidifier-on-color,
          var(--state-humidifier-active-color, var(--primary-color))
        );
      }
    `]}static getStubConfig(t){return D(t,this.cardType,"humidifier")}render(){let t=this.guard(),i=this.caps("humidifier")[0];if(t!==l||!i)return c`<ha-card
        ><div class="body">
          <header>${this.heading("Humidity")}</header>
          ${t!==l?t:_("This device does not expose a humidifier.")}
        </div></ha-card
      >`;let r=i.state,s=r?.attributes??{},n=r?.state==="on",d=i.availability!=="available"||this.busy,o=v(s.humidity),p=v(s.min_humidity),u=v(s.max_humidity),h=v(s.target_humidity_step)??v(this.caps("target")[0]?.state?.attributes.step),b=v(s.current_humidity),y=N(s.available_modes),g=this.caps("water")[0],x=o!==void 0&&p!==void 0&&u!==void 0&&p<u&&h!==void 0&&h>0,j=E=>new Intl.NumberFormat(this.hass?.locale?.language).format(E),M=this.t("state.default.unknown","Unknown"),m=i.availability==="available",Q=E=>x?Math.min(u,Math.max(p,Number((p+Math.round((o-p)/h+E)*h).toFixed(6)))):void 0;return c`<ha-card class=${this.stateClass(i)}
      ><div class="body">
        <header>
          ${this.heading("Humidity")}
          <div class="header-actions">
            <button
              class="icon-button plain"
              aria-label="Open humidifier details"
              @click=${()=>this.moreInfo(i.id)}
            >
              ${fe()}
            </button>
            <button
              class="icon-button ${n?"active":""}"
              aria-label=${n?"Turn humidifier off":"Turn humidifier on"}
              ?disabled=${d}
              @click=${()=>this.action(i,n?"turn_off":"turn_on")}
            >
              ${ue()}
            </button>
          </div>
        </header>
        <div class="hero">
          ${st()}
          <div>
            <div class="secondary">Current humidity</div>
            <div class="value">
              ${m?b!==void 0?c`${j(b)}<span class="unit"> %</span>`:M:this.value(i)}
            </div>
            <div class="state">
              ${m?typeof s.action=="string"&&s.action?this.attributeLabel(i,"action",s.action):this.value(i):"Check the device connection"}
            </div>
          </div>
        </div>
        ${this.config.show_target_control!==!1?c`<div class="section-title" id="target-title">Target humidity</div>
                <div class="stepper" role="group" aria-labelledby="target-title">
                  <button
                    class="icon-button"
                    aria-label="Decrease target humidity"
                    ?disabled=${d||!x||o<=p}
                    @click=${()=>this.action(i,"set_humidity",{humidity:Q(-1)})}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg></button
                  ><output class="target" aria-live="polite"
                    >${o!==void 0?c`${j(o)}<span class="unit"> %</span>`:M}</output
                  ><button
                    class="icon-button"
                    aria-label="Increase target humidity"
                    ?disabled=${d||!x||o>=u}
                    @click=${()=>this.action(i,"set_humidity",{humidity:Q(1)})}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5v14" /></svg>
                  </button>
                </div>
                ${m&&!x?_("Target controls need the device\u2019s humidity bounds and step."):l}`:l}
        ${this.config.show_mode!==!1&&y.length?c`<div class="section">
                <fieldset class="segmented" ?disabled=${d}>
                  <legend class="section-title">Mode</legend>
                  <div class="segments">
                    ${y.map(E=>c`<label class="segment"
                          ><input
                            type="radio"
                            name="mode"
                            .value=${E}
                            .checked=${St(n&&s.mode===E)}
                            @change=${()=>this.action(i,"set_mode",{mode:E})}
                          /><span>${this.attributeLabel(i,"mode",E)}</span></label
                        >`)}
                  </div>
                </fieldset>
              </div>`:l}
        ${this.config.show_water_level!==!1&&g?c`<div class="section">
                <button class="row" aria-label="Water level details" @click=${()=>this.moreInfo(g.id)}>
                  <span>Water level</span><strong>${this.value(g)}</strong>
                </button>
              </div>`:l}
        ${this.feedback()}
      </div></ha-card
    >`}};var Et={purifier:["show_presets","show_speed","show_filter","show_pm25"],"air-quality":["show_trend","show_climate"],humidity:["show_target_control","show_mode","show_water_level"]},Ce=class extends A{static{this.properties={hass:{attribute:!1},config:{state:!0}}}setConfig(e){this.config={...e}}render(){if(!this.hass||!this.config)return c``;let e=this.config.type.includes("air-quality")?"air-quality":this.config.type.includes("humidity")?"humidity":"purifier",t=[{name:"device_id",required:!0,selector:{device:{filter:[{integration:"philips_airpurifier"}]}}},{name:"name",selector:{text:{}}}],i=e==="air-quality"?"air":e==="humidity"?"humidifier":"fan",r=this.config.device_id?{include_entities:T(this.hass,{type:this.config.type,device_id:this.config.device_id},i).map(s=>s.id)}:{};return e==="air-quality"?t.push({name:"sensors",selector:{entity:{multiple:!0,...r,filter:[{domain:"sensor",integration:"philips_airpurifier"}]}}}):t.push({name:"entity",selector:{entity:{...r,filter:[{domain:i,integration:"philips_airpurifier"}]}}}),t.push({name:"display",type:"expandable",flatten:!0,expanded:!0,schema:(Et[e]??[]).map(s=>({name:s,selector:{boolean:{}}}))}),c`<ha-form
      .hass=${this.hass}
      .data=${{...Object.fromEntries((Et[e]??[]).map(s=>[s,!0])),...this.config}}
      .schema=${t}
      .computeLabel=${s=>({display:"Display options",device_id:"Device",entity:"Control entity (optional override)",name:"Name (optional)",sensors:"Air-quality sensors (optional, ordered)"})[s.name]??{show_presets:"Show mode controls",show_speed:"Show fan speed",show_filter:"Show filter health",show_pm25:"Show PM2.5",show_target_control:"Show target controls",show_mode:"Show modes",show_water_level:"Show water level",show_trend:"Show 24-hour PM2.5 trend",show_climate:"Show humidity and temperature"}[s.name]??s.name.replaceAll("_"," ")}
      @value-changed=${this.changed}
    ></ha-form>`}changed(e){e.stopPropagation();let t={...e.detail.value,type:this.config.type};t.device_id!==this.config?.device_id&&(delete t.entity,delete t.sensors);for(let i of["name","entity","device_id"])t[i]||delete t[i];this.config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}};var Zt=[["philips-airpurifier-purifier-card",ye],["philips-airpurifier-air-quality-card",_e],["philips-airpurifier-humidity-card",Ae],["philips-airpurifier-card-editor",Ce]];function Yt(){for(let[a,e]of Zt)customElements.get(a)||customElements.define(a,e);window.customCards??=[];for(let[a,e,t,i]of[["purifier","Philips Purifier","fan","Power, modes, air quality and filter health."],["air-quality","Philips Air Quality","air","Your device\u2019s particle, allergen and gas readings."],["humidity","Philips Humidity","humidifier","Humidity, target controls and water level."]]){let r=`philips-airpurifier-${a}-card`;window.customCards.some(s=>s.type===r)||window.customCards.push({type:r,name:e,description:i,preview:!0,documentationURL:"https://github.com/tinkerologie/ha-philips-airpurifier#dashboard-cards",getEntitySuggestion(s,n){let d=s.entities?.[n];if(d?.platform!==le||!d.device_id)return null;let o={type:`custom:${r}`,device_id:d.device_id};return T(s,o,t).some(p=>p.id===n)?{config:o}:null}})}}Yt();export{Yt as registerCards};
