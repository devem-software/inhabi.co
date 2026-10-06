import { createHooks } from "hookable";
import { computed, createSSRApp, createTextVNode, createVNode, defineComponent, isRef, mergeProps, onMounted, onUnmounted, reactive, ref, resolveComponent, resolveDirective, toDisplayString, toValue, unref, useSSRContext, watch, withCtx } from "vue";
import { createMemoryHistory, createRouter, useRoute } from "vue-router";
import { createHead, useHead } from "@vueuse/head";
import { ssrGetDirectiveProps, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderAttr, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderStyle } from "vue/server-renderer";
//#region node_modules/vite-ssg/node_modules/unhead/dist/shared/unhead.AvDFlk_u.mjs
var DupeableTags = /* @__PURE__ */ new Set([
	"link",
	"style",
	"script",
	"noscript"
]);
var TagsWithInnerContent = /* @__PURE__ */ new Set([
	"title",
	"titleTemplate",
	"script",
	"style",
	"noscript"
]);
var HasElementTags = /* @__PURE__ */ new Set([
	"base",
	"meta",
	"link",
	"style",
	"script",
	"noscript"
]);
var ValidHeadTags = /* @__PURE__ */ new Set([
	"title",
	"base",
	"htmlAttrs",
	"bodyAttrs",
	"meta",
	"link",
	"style",
	"script",
	"noscript"
]);
var UniqueTags = /* @__PURE__ */ new Set([
	"base",
	"title",
	"titleTemplate",
	"bodyAttrs",
	"htmlAttrs",
	"templateParams"
]);
var TagConfigKeys = /* @__PURE__ */ new Set([
	"key",
	"tagPosition",
	"tagPriority",
	"tagDuplicateStrategy",
	"innerHTML",
	"textContent",
	"processTemplateParams"
]);
var UsesMergeStrategy = /* @__PURE__ */ new Set([
	"templateParams",
	"htmlAttrs",
	"bodyAttrs"
]);
var MetaTagsArrayable = /* @__PURE__ */ new Set([
	"theme-color",
	"google-site-verification",
	"og",
	"article",
	"book",
	"profile",
	"twitter",
	"author"
]);
var hasContent = (value) => typeof value === "number" ? Number.isFinite(value) : value;
//#endregion
//#region node_modules/vite-ssg/node_modules/unhead/dist/shared/unhead.ChXiQvI8.mjs
// @__NO_SIDE_EFFECTS__
function isUnsafeKey(key) {
	return key === "__proto__" || key === "constructor" || key === "prototype";
}
var sortTags = (a, b) => a._w === b._w ? a._p - b._p : a._w - b._w;
var TAG_WEIGHTS = {
	base: -10,
	title: 10
};
var TAG_ALIASES = {
	critical: -8,
	high: -1,
	low: 2
};
var WEIGHT_MAP = {
	meta: {
		"content-security-policy": -30,
		"charset": -20,
		"viewport": -15
	},
	link: {
		"preconnect": 20,
		"stylesheet": 60,
		"preload": 70,
		"modulepreload": 70,
		"prefetch": 90,
		"dns-prefetch": 90,
		"prerender": 90
	},
	script: {
		async: 30,
		defer: 80,
		sync: 50
	},
	style: {
		imported: 40,
		sync: 60
	}
};
var ImportStyleRe = /@import/;
var isTruthy = (val) => val === "" || val === true;
function tagWeight(head, tag) {
	if (typeof tag.tagPriority === "number") return tag.tagPriority;
	let weight = 100;
	const offset = TAG_ALIASES[tag.tagPriority] || 0;
	const weightMap = head.resolvedOptions.disableCapoSorting ? {
		link: {},
		script: {},
		style: {}
	} : WEIGHT_MAP;
	if (tag.tag in TAG_WEIGHTS) weight = TAG_WEIGHTS[tag.tag];
	else if (tag.tag === "meta") {
		const metaType = tag.props["http-equiv"] === "content-security-policy" ? "content-security-policy" : tag.props.charset ? "charset" : tag.props.name === "viewport" ? "viewport" : null;
		if (metaType) weight = WEIGHT_MAP.meta[metaType];
	} else if (tag.tag === "link" && tag.props.rel) weight = weightMap.link[tag.props.rel];
	else if (tag.tag === "script") {
		const type = String(tag.props.type);
		if (isTruthy(tag.props.async)) weight = weightMap.script.async;
		else if (tag.props.src && !isTruthy(tag.props.defer) && !isTruthy(tag.props.async) && type !== "module" && !type.endsWith("json") || tag.innerHTML && !type.endsWith("json")) weight = weightMap.script.sync;
		else if (isTruthy(tag.props.defer) && tag.props.src && !isTruthy(tag.props.async) || type === "module") weight = weightMap.script.defer;
	} else if (tag.tag === "style") weight = tag.innerHTML && ImportStyleRe.test(tag.innerHTML) ? weightMap.style.imported : weightMap.style.sync;
	return (weight || 100) + offset;
}
//#endregion
//#region node_modules/vite-ssg/node_modules/unhead/dist/shared/unhead.J7R8psSN.mjs
var allowedMetaProperties = [
	"name",
	"property",
	"http-equiv"
];
var StandardSingleMetaTags = /* @__PURE__ */ new Set([
	"viewport",
	"description",
	"keywords",
	"robots"
]);
function isMetaArrayDupeKey(v) {
	const i = v.indexOf(":");
	if (i === -1) return false;
	const j = v.indexOf(":", i + 1);
	const namespace = v.slice(i + 1, j === -1 ? v.length : j);
	if (namespace === "twitter") return v === "meta:twitter:image" || v.startsWith("meta:twitter:image:");
	return MetaTagsArrayable.has(namespace);
}
function dedupeKey(tag) {
	const { props, tag: name } = tag;
	if (UniqueTags.has(name)) return name;
	if (name === "link" && props.rel === "canonical") return "canonical";
	if (name === "link" && props.rel === "alternate") {
		if (props.hreflang) return `alternate:${props.hreflang}`;
		if (props.type) return `alternate:${props.type}:${props.href || ""}`;
	}
	if (props.charset) return "charset";
	if (tag.tag === "meta") {
		for (const n of allowedMetaProperties) if (props[n] !== void 0) {
			const propValue = props[n];
			const isStructured = propValue && typeof propValue === "string" && propValue.includes(":");
			const isStandardSingle = propValue && StandardSingleMetaTags.has(propValue);
			return `${name}:${propValue}${!(isStructured || isStandardSingle) && tag.key ? `:key:${tag.key}` : ""}`;
		}
	}
	if (tag.key) return `${name}:key:${tag.key}`;
	if (props.id) return `${name}:id:${props.id}`;
	if (name === "link" && props.rel === "alternate") return `alternate:${props.href || ""}`;
	if (TagsWithInnerContent.has(name)) {
		const v = tag.textContent || tag.innerHTML;
		if (v) return `${name}:content:${v}`;
	}
}
function hashTag(tag) {
	const dedupe = tag._h || tag._d;
	if (dedupe) return dedupe;
	const inner = tag.textContent || tag.innerHTML;
	if (inner) return inner;
	const keys = Object.keys(tag.props).sort();
	return `${tag.tag}:${keys.map((k) => `${k}:${String(tag.props[k])}`).join(",")}`;
}
function walkResolver(val, resolve, key) {
	if (typeof val === "function") {
		if (!key || key !== "titleTemplate" && !(key[0] === "o" && key[1] === "n")) val = val();
	}
	const v = resolve ? resolve(key, val) : val;
	if (Array.isArray(v)) {
		let out;
		for (let i = 0; i < v.length; i++) {
			const resolved = walkResolver(v[i], resolve);
			if (out) out[i] = resolved;
			else if (resolved !== v[i]) {
				out = v.slice(0, i);
				out[i] = resolved;
			}
		}
		return out || v;
	}
	if (v?.constructor === Object) {
		let next;
		for (const k in v) {
			const unsafe = /* @__PURE__ */ isUnsafeKey(k);
			const resolved = unsafe ? void 0 : walkResolver(v[k], resolve, k);
			if (!next && (unsafe || k === "_resolver" || resolved !== v[k])) {
				next = {};
				for (const previousKey in v) {
					if (previousKey === k) break;
					next[previousKey] = v[previousKey];
				}
			}
			if (next && !unsafe) next[k] = resolved;
		}
		return next || v;
	}
	return v;
}
var INVALID_ATTR_NAME_RE = /[\s"'<>/=\x00-\x1F\x7F]/;
function normalizeStyleClassProps(key, value) {
	const store = key === "style" ? /* @__PURE__ */ new Map() : /* @__PURE__ */ new Set();
	function processValue(rawValue) {
		if (rawValue == null || rawValue === void 0) return;
		const value2 = String(rawValue).trim();
		if (!value2) return;
		if (key === "style") {
			const [k, ...v] = value2.split(":").map((s) => s ? s.trim() : "");
			if (k && v.length) store.set(k, v.join(":"));
		} else value2.split(" ").filter(Boolean).forEach((c) => store.add(c));
	}
	if (typeof value === "string") key === "style" ? value.split(";").forEach(processValue) : processValue(value);
	else if (Array.isArray(value)) value.forEach((item) => processValue(item));
	else if (value && typeof value === "object") Object.entries(value).forEach(([k, v]) => {
		if (v && v !== "false") key === "style" ? store.set(String(k).trim(), String(v)) : processValue(k);
	});
	return store;
}
function normalizeProps(tag, input) {
	tag.props = tag.props || {};
	if (!input) return tag;
	if (tag.tag === "templateParams") {
		tag.props = input;
		return tag;
	}
	const isHtmlTag = HasElementTags.has(tag.tag) || tag.tag === "htmlAttrs" || tag.tag === "bodyAttrs";
	for (const prop of Object.keys(input)) {
		if (/* @__PURE__ */ isUnsafeKey(prop)) continue;
		const isDataKey = prop.startsWith("data-");
		const isHtmlAttr = isHtmlTag && !TagConfigKeys.has(prop);
		const key = isHtmlAttr && !isDataKey ? prop.toLowerCase() : prop;
		if (isHtmlAttr && (!key || INVALID_ATTR_NAME_RE.test(key))) continue;
		const value = input[prop];
		if (value === null) {
			tag.props[key] = null;
			continue;
		}
		if (prop === "class" || prop === "style") {
			tag.props[prop] = normalizeStyleClassProps(prop, value);
			continue;
		}
		if (TagConfigKeys.has(prop)) {
			if ((prop === "textContent" || prop === "innerHTML") && typeof value === "object") {
				let type = input.type;
				if (!input.type) type = "application/json";
				if (!type?.endsWith("json") && type !== "speculationrules") continue;
				input.type = type;
				tag.props.type = type;
				tag[prop] = JSON.stringify(value);
			} else tag[prop] = value;
			continue;
		}
		const strValue = String(value);
		const isMetaContentKey = tag.tag === "meta" && key === "content";
		if (strValue === "true" || strValue === "") tag.props[key] = isDataKey || isMetaContentKey ? strValue : true;
		else if (!value && isDataKey && strValue === "false") tag.props[key] = "false";
		else if (value !== void 0) tag.props[key] = value;
	}
	return tag;
}
function normalizeTag(tagName, _input) {
	const tag = normalizeProps({
		tag: tagName,
		props: {}
	}, typeof _input === "object" && typeof _input !== "function" ? _input : { [tagName === "script" || tagName === "noscript" || tagName === "style" ? "innerHTML" : "textContent"]: _input });
	if (tag.key && DupeableTags.has(tag.tag)) tag.props["data-hid"] = tag._h = tag.key;
	if (tag.tag === "script" && typeof tag.innerHTML === "object") {
		tag.innerHTML = JSON.stringify(tag.innerHTML);
		tag.props.type = tag.props.type || "application/json";
	}
	return Array.isArray(tag.props.content) ? tag.props.content.map((v) => ({
		...tag,
		props: {
			...tag.props,
			content: v
		}
	})) : tag;
}
function normalizeEntryToTags(input, propResolvers) {
	if (!input) return [];
	if (typeof input === "function") input = input();
	const resolvers = (key, val) => {
		for (let i = 0; i < propResolvers.length; i++) val = propResolvers[i](key, val);
		return val;
	};
	input = resolvers(void 0, input);
	const tags = [];
	input = walkResolver(input, resolvers);
	Object.entries(input || {}).forEach(([key, value]) => {
		if (value === void 0) return;
		for (const v of Array.isArray(value) ? value : [value]) tags.push(normalizeTag(key, v));
	});
	return tags.flat();
}
//#endregion
//#region node_modules/vite-ssg/node_modules/unhead/dist/shared/unhead.BrXkGDAU.mjs
function registerPlugin(head, p) {
	const plugin = typeof p === "function" ? p(head) : p;
	const key = plugin.key || String(head.plugins.size + 1);
	if (!head.plugins.get(key)) {
		head.plugins.set(key, plugin);
		head.hooks.addHooks(plugin.hooks || {});
	}
}
// @__NO_SIDE_EFFECTS__
function createUnhead(resolvedOptions = {}) {
	const hooks = createHooks();
	hooks.addHooks(resolvedOptions.hooks || {});
	const ssr = !resolvedOptions.document;
	const entries = /* @__PURE__ */ new Map();
	const plugins = /* @__PURE__ */ new Map();
	const normalizeQueue = /* @__PURE__ */ new Set();
	const head = {
		_entryCount: 1,
		plugins,
		dirty: false,
		resolvedOptions,
		hooks,
		ssr,
		entries,
		headEntries() {
			return [...entries.values()];
		},
		use: (p) => registerPlugin(head, p),
		push(input, _options) {
			const options = { ..._options || {} };
			delete options.head;
			const _i = options._index ?? head._entryCount++;
			const inst = {
				_i,
				input,
				options
			};
			const _ = {
				_poll(rm = false) {
					head.dirty = true;
					!rm && normalizeQueue.add(_i);
					hooks.callHook("entries:updated", head);
				},
				dispose() {
					if (entries.delete(_i)) head.invalidate();
				},
				patch(input2) {
					if (!options.mode || options.mode === "server" && ssr || options.mode === "client" && !ssr) {
						inst.input = input2;
						entries.set(_i, inst);
						_._poll();
					}
				}
			};
			_.patch(input);
			return _;
		},
		async resolveTags() {
			const ctx = {
				tagMap: /* @__PURE__ */ new Map(),
				tags: [],
				entries: [...head.entries.values()]
			};
			await hooks.callHook("entries:resolve", ctx);
			while (normalizeQueue.size) {
				const i = normalizeQueue.values().next().value;
				normalizeQueue.delete(i);
				const e = entries.get(i);
				if (e) {
					const normalizeCtx = {
						tags: normalizeEntryToTags(e.input, resolvedOptions.propResolvers || []).map((t) => Object.assign(t, e.options)),
						entry: e
					};
					await hooks.callHook("entries:normalize", normalizeCtx);
					e._tags = normalizeCtx.tags.map((t, i2) => {
						t._w = tagWeight(head, t);
						t._p = (e._i << 10) + i2;
						t._d = dedupeKey(t);
						if (!t._d) t._h = hashTag(t);
						return t;
					});
				}
			}
			let hasFlatMeta = false;
			ctx.entries.flatMap((e) => (e._tags || []).map((t) => ({
				...t,
				props: { ...t.props }
			}))).sort(sortTags).reduce((acc, next) => {
				const k = next._d || next._h;
				if (!acc.has(k)) return acc.set(k, next);
				const prev = acc.get(k);
				if ((next?.tagDuplicateStrategy || (UsesMergeStrategy.has(next.tag) ? "merge" : null) || (next.key && next.key === prev.key ? "merge" : null)) === "merge") {
					const newProps = { ...prev.props };
					Object.entries(next.props).forEach(([p, v]) => newProps[p] = p === "style" ? new Map([...prev.props.style || /* @__PURE__ */ new Map(), ...v]) : p === "class" ? /* @__PURE__ */ new Set([...prev.props.class || /* @__PURE__ */ new Set(), ...v]) : v);
					acc.set(k, {
						...next,
						props: newProps
					});
				} else if (next._p >> 10 === prev._p >> 10 && next.tag === "meta" && isMetaArrayDupeKey(k)) {
					acc.set(k, Object.assign([...Array.isArray(prev) ? prev : [prev], next], next));
					hasFlatMeta = true;
				} else if (next._w === prev._w ? next._p > prev._p : next?._w < prev?._w) acc.set(k, next);
				return acc;
			}, ctx.tagMap);
			const title = ctx.tagMap.get("title");
			const titleTemplate = ctx.tagMap.get("titleTemplate");
			head._title = title?.textContent;
			if (titleTemplate) {
				const titleTemplateFn = titleTemplate?.textContent;
				head._titleTemplate = titleTemplateFn;
				if (titleTemplateFn) {
					let newTitle = typeof titleTemplateFn === "function" ? titleTemplateFn(title?.textContent) : titleTemplateFn;
					if (typeof newTitle === "string" && !head.plugins.has("template-params")) newTitle = newTitle.replace("%s", title?.textContent || "");
					if (title) newTitle === null ? ctx.tagMap.delete("title") : ctx.tagMap.set("title", {
						...title,
						textContent: newTitle
					});
					else {
						titleTemplate.tag = "title";
						titleTemplate.textContent = newTitle;
					}
				}
			}
			ctx.tags = Array.from(ctx.tagMap.values());
			if (hasFlatMeta) ctx.tags = ctx.tags.flat().sort(sortTags);
			await hooks.callHook("tags:beforeResolve", ctx);
			await hooks.callHook("tags:resolve", ctx);
			await hooks.callHook("tags:afterResolve", ctx);
			const finalTags = [];
			for (const t of ctx.tags) {
				const { innerHTML, tag, props } = t;
				if (!ValidHeadTags.has(tag)) continue;
				if (Object.keys(props).length === 0 && !hasContent(t.innerHTML) && !hasContent(t.textContent)) continue;
				if (tag === "meta") {
					if (!hasContent(props.content) && !props["http-equiv"] && !props.charset) continue;
				}
				if (tag === "script" && innerHTML) {
					if (String(props.type).endsWith("json")) t.innerHTML = (typeof innerHTML === "string" ? innerHTML : JSON.stringify(innerHTML)).replace(/</g, "\\u003C");
					else if (typeof innerHTML === "string") t.innerHTML = innerHTML.replace(new RegExp(`</${tag}`, "g"), `<\\/${tag}`);
					t._d = dedupeKey(t);
				}
				finalTags.push(t);
			}
			return finalTags;
		},
		invalidate() {
			for (const entry of entries.values()) normalizeQueue.add(entry._i);
			head.dirty = true;
			hooks.callHook("entries:updated", head);
		}
	};
	(resolvedOptions?.plugins || []).forEach((p) => registerPlugin(head, p));
	head.hooks.callHook("init", head);
	resolvedOptions.init?.forEach((e) => e && head.push(e));
	return head;
}
//#endregion
//#region node_modules/vite-ssg/node_modules/@unhead/vue/dist/shared/vue.N9zWjxoK.mjs
var VueResolver = (_, value) => {
	return isRef(value) ? toValue(value) : value;
};
//#endregion
//#region node_modules/vite-ssg/node_modules/@unhead/vue/dist/shared/vue.Cd6dkybA.mjs
var headSymbol = "usehead";
// @__NO_SIDE_EFFECTS__
function vueInstall(head) {
	return { install(app) {
		app.config.globalProperties.$unhead = head;
		app.config.globalProperties.$head = head;
		app.provide(headSymbol, head);
	} }.install;
}
//#endregion
//#region node_modules/vite-ssg/node_modules/unhead/dist/server.mjs
// @__NO_SIDE_EFFECTS__
function createHead$2(options = {}) {
	const unhead = /* @__PURE__ */ createUnhead({
		...options,
		document: false,
		propResolvers: [...options.propResolvers || [], (k, v) => {
			if (k && k.startsWith("on") && typeof v === "function") return `this.dataset.${k}fired = true`;
			return v;
		}],
		init: [options.disableDefaults ? void 0 : {
			htmlAttrs: { lang: "en" },
			meta: [{ charset: "utf-8" }, {
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			}]
		}, ...options.init || []]
	});
	unhead._ssrPayload = {};
	unhead.use({
		key: "server",
		hooks: { "tags:resolve": function(ctx) {
			const title = ctx.tagMap.get("title");
			const titleTemplate = ctx.tagMap.get("titleTemplate");
			let payload = {
				title: title?.mode === "server" ? unhead._title : void 0,
				titleTemplate: titleTemplate?.mode === "server" ? unhead._titleTemplate : void 0
			};
			if (Object.keys(unhead._ssrPayload || {}).length > 0) payload = {
				...unhead._ssrPayload,
				...payload
			};
			if (Object.values(payload).some(Boolean)) ctx.tags.push({
				tag: "script",
				innerHTML: JSON.stringify(payload),
				props: {
					id: "unhead:payload",
					type: "application/json"
				}
			});
		} }
	});
	return unhead;
}
//#endregion
//#region node_modules/vite-ssg/node_modules/@unhead/vue/dist/server.mjs
// @__NO_SIDE_EFFECTS__
function createHead$1(options = {}) {
	const head = /* @__PURE__ */ createHead$2({
		...options,
		propResolvers: [VueResolver]
	});
	head.install = /* @__PURE__ */ vueInstall(head);
	return head;
}
//#endregion
//#region node_modules/vite-ssg/dist/shared/vite-ssg.ETIvV-80.mjs
var ClientOnly = defineComponent({ setup(props, { slots }) {
	const mounted = ref(false);
	onMounted(() => mounted.value = true);
	return () => {
		if (!mounted.value) return slots.placeholder && slots.placeholder({});
		return slots.default && slots.default({});
	};
} });
//#endregion
//#region node_modules/vite-ssg/dist/index.mjs
function ViteSSG(App, routerOptions, fn, options) {
	const { transformState, registerComponents = true, useHead = true, rootContainer = "#app" } = options ?? {};
	async function createApp$1(routePath) {
		const app = createSSRApp(App);
		let head;
		if (useHead) app.use(head = /* @__PURE__ */ createHead$1());
		const router = createRouter({
			history: createMemoryHistory(routerOptions.base),
			...routerOptions
		});
		const { routes } = routerOptions;
		if (registerComponents) app.component("ClientOnly", ClientOnly);
		const appRenderCallbacks = [];
		const onSSRAppRendered = (cb) => appRenderCallbacks.push(cb);
		const triggerOnSSRAppRendered = () => {
			return Promise.all(appRenderCallbacks.map((cb) => cb()));
		};
		const context = {
			app,
			head,
			isClient: false,
			router,
			routes,
			onSSRAppRendered,
			triggerOnSSRAppRendered,
			initialState: {},
			transformState,
			routePath
		};
		await fn?.(context);
		app.use(router);
		let entryRoutePath;
		let isFirstRoute = true;
		router.beforeEach((to, from, next) => {
			if (isFirstRoute || entryRoutePath && entryRoutePath === to.path) {
				isFirstRoute = false;
				entryRoutePath = to.path;
				to.meta.state = context.initialState;
			}
			next();
		});
		{
			const route = context.routePath ?? "/";
			router.push(route);
			await router.isReady();
			context.initialState = router.currentRoute.value.meta.state || {};
		}
		const initialState = context.initialState;
		return {
			...context,
			initialState
		};
	}
	return createApp$1;
}
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region src/App.vue
var _sfc_main$20 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
	const _component_router_view = resolveComponent("router-view");
	_push(ssrRenderComponent(_component_router_view, _attrs, null, _parent));
}
var _sfc_setup$20 = _sfc_main$20.setup;
_sfc_main$20.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/App.vue");
	return _sfc_setup$20 ? _sfc_setup$20(props, ctx) : void 0;
};
var App_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$20, [["ssrRender", _sfc_ssrRender]]);
//#endregion
//#region src/img/bano_industrial_balance.png?url
var bano_industrial_balance_default = "/assets/balance-BHBQo1lj.png";
//#endregion
//#region src/img/bano_industrial_integral.png?url
var bano_industrial_integral_default = "/assets/integral-CeYKCEDV.png";
//#endregion
//#region src/img/bano_industrial_vital.png?url
var bano_industrial_vital_default = "/assets/vital-BgGlKiC3.png";
//#endregion
//#region src/img/bano_social_industrial_balance.png?url
var bano_social_industrial_balance_default = "/assets/bano_social_industrial_balance-Dt4gmADh.png";
//#endregion
//#region src/img/bano_social_industrial_integral.png?url
var bano_social_industrial_integral_default = "/assets/bano_social_industrial_integral-cRLy2KiU.png";
//#endregion
//#region src/img/bano_social_industrial_vital.png?url
var bano_social_industrial_vital_default = "/assets/bano_social_industrial_vital-CMhNWyR0.png";
//#endregion
//#region src/img/combos/industrial/bano/balance.png?url
var balance_default$5 = "/assets/balance-BHBQo1lj.png";
//#endregion
//#region src/img/combos/industrial/bano/integral.png?url
var integral_default$6 = "/assets/integral-CeYKCEDV.png";
//#endregion
//#region src/img/combos/industrial/bano/vital.png?url
var vital_default$5 = "/assets/vital-BgGlKiC3.png";
//#endregion
//#region src/img/combos/industrial/cocina/balance.png?url
var balance_default$4 = "/assets/balance-BWvSBq6r.png";
//#endregion
//#region src/img/combos/industrial/cocina/integral.png?url
var integral_default$5 = "/assets/integral-B5vjHams.png";
//#endregion
//#region src/img/combos/industrial/cocina/vital.png?url
var vital_default$4 = "/assets/vital-Cf9HNf3M.png";
//#endregion
//#region src/img/combos/minimal/bano/balance.png?url
var balance_default$3 = "/assets/balance-DRUnO41a.png";
//#endregion
//#region src/img/combos/minimal/bano/integral.png?url
var integral_default$4 = "/assets/integral-DgvF9BNY.png";
//#endregion
//#region src/img/combos/minimal/bano/vital.png?url
var vital_default$3 = "/assets/vital-_-sfdOIz.png";
//#endregion
//#region src/img/combos/minimal/cocina/balance.png?url
var balance_default$2 = "/assets/balance-T0chMdD2.png";
//#endregion
//#region src/img/combos/minimal/cocina/integral.png?url
var integral_default$3 = "/assets/integral-FjM37Gp6.png";
//#endregion
//#region src/img/combos/minimal/cocina/vital.png?url
var vital_default$2 = "/assets/vital-BnSU7I8U.png";
//#endregion
//#region src/img/combos/natural/bano/balance.png?url
var balance_default$1 = "/assets/balance-hWdh677G.png";
//#endregion
//#region src/img/combos/natural/bano/integral.png?url
var integral_default$2 = "/assets/integral-C8bQ8QiW.png";
//#endregion
//#region src/img/combos/natural/bano/vital.png?url
var vital_default$1 = "/assets/vital-CbtL_x93.png";
//#endregion
//#region src/img/combos/natural/cocina/balance.png?url
var balance_default = "/assets/balance-CzM8GgHK.png";
//#endregion
//#region src/img/combos/natural/cocina/integral.png?url
var integral_default$1 = "/assets/integral-CLSl3F0n.png";
//#endregion
//#region src/img/combos/natural/cocina/vital.png?url
var vital_default = "/assets/vital-WVc_LV1R.png";
//#endregion
//#region src/img/front/inst_01.jpg?url
var inst_01_default = "/assets/inst_01-xzm5rmgS.jpg";
//#endregion
//#region src/img/front/inst_02.jpg?url
var inst_02_default = "/assets/inst_02-DJm1zgEP.jpg";
//#endregion
//#region src/img/front/inst_03.jpg?url
var inst_03_default = "/assets/inst_03-Bnd-pZlL.jpg";
//#endregion
//#region src/img/front/loc_01.jpg?url
var loc_01_default = "/assets/loc_01-j7XcvOEm.jpg";
//#endregion
//#region src/img/front/loc_02.jpg?url
var loc_02_default = "/assets/loc_02-aDcQYvCX.jpg";
//#endregion
//#region src/img/front/loc_03.jpg?url
var loc_03_default = "/assets/loc_03-DXlCpIy-.jpg";
//#endregion
//#region src/img/front/viv_01.jpg?url
var viv_01_default = "/assets/viv_01-CN8iSXZg.jpg";
//#endregion
//#region src/img/front/viv_02.jpg?url
var viv_02_default = "/assets/viv_02-BQOm9lp9.jpg";
//#endregion
//#region src/img/front/viv_03.jpg?url
var viv_03_default = "/assets/viv_03-BvpPOKbj.jpg";
//#endregion
//#region src/img/logos/cafam.png?url
var cafam_default = "/assets/cafam-8elOoVS-.png";
//#endregion
//#region src/img/logos/carnes_piamontesa.png?url
var carnes_piamontesa_default = "/assets/carnes_piamontesa-CCuyyJo6.png";
//#endregion
//#region src/img/logos/embajada_francia.png?url
var embajada_francia_default = "/assets/embajada_francia-BbimGtEF.png";
//#endregion
//#region src/img/logos/lala.png?url
var lala_default = "/assets/lala-DUPvBLoU.png";
//#endregion
//#region src/img/logos/liftit.png?url
var liftit_default = "/assets/liftit-BM0Uar3x.png";
//#endregion
//#region src/img/logos/mascoagro.png?url
var mascoagro_default = "/assets/mascoagro-Bio8hkJE.png";
//#endregion
//#region src/img/logos/movar.png?url
var movar_default = "/assets/movar-BghbRf86.png";
//#endregion
//#region src/img/logos/nativas.png?url
var nativas_default = "/assets/nativas-BcRmBq66.png";
//#endregion
//#region src/img/logos/piamontesa.png?url
var piamontesa_default = "/assets/piamontesa-CEhfLSmw.png";
//#endregion
//#region src/img/logos/platzi.png?url
var platzi_default = "/assets/platzi-D-xZ0q1J.png";
//#endregion
//#region src/img/logos/suarez.png?url
var suarez_default = "/assets/suarez-a666fR0o.png";
//#endregion
//#region src/img/logos/techo.png?url
var techo_default = "/assets/techo-BGV4mAVL.png";
//#endregion
//#region src/img/logos/universidad_libre.png?url
var universidad_libre_default = "/assets/universidad_libre-D4yzxrB6.png";
//#endregion
//#region src/img/logos/vid_construcciones.png?url
var vid_construcciones_default = "/assets/vid_construcciones-D-v4KFFG.png";
//#endregion
//#region src/img/proyectos/comercial.jpg?url
var comercial_default = "/assets/comercial-CwabVG8c.jpg";
//#endregion
//#region src/img/proyectos/institucional.jpg?url
var institucional_default = "/assets/institucional-bpOW9hen.jpg";
//#endregion
//#region src/img/proyectos/vivienda.png?url
var vivienda_default = "/assets/vivienda-2DFDRCRx.png";
//#endregion
//#region src/img/r01-5.jpg?url
var r01_5_default = "/assets/r01-5-Fmc4vj4W.jpg";
//#endregion
//#region src/img/r02-11.jpg?url
var r02_11_default = "/assets/r02-11-C6cjuG3I.jpg";
//#endregion
//#region src/img/r02-equipo.png?url
var r02_equipo_default$1 = "/assets/r02-equipo-B8-Vv1Ds.png";
//#endregion
//#region src/img/r03-35.jpg?url
var r03_35_default = "/assets/r03-35-BLh5KKJv.jpg";
//#endregion
//#region src/img/r04-38.jpg?url
var r04_38_default = "/assets/r04-38-DsxjYBK4.jpg";
//#endregion
//#region src/img/r05-42.jpg?url
var r05_42_default = "/assets/r05-42-BVwGruyo.jpg";
//#endregion
//#region src/img/r09-52.jpg?url
var r09_52_default = "/assets/r09-52-CYA5ZnDx.jpg";
//#endregion
//#region src/img/r10-57.jpg?url
var r10_57_default$1 = "/assets/r10-57-qtBo0Nxd.jpg";
//#endregion
//#region src/img/r11-62.jpg?url
var r11_62_default = "/assets/r11-62-B8Ny_tSs.jpg";
//#endregion
//#region src/img/r14-74.jpg?url
var r14_74_default = "/assets/r14-74-BoEj6CO_.jpg";
//#endregion
//#region src/img/r15-77.jpg?url
var r15_77_default = "/assets/r15-77-D1jEdi9f.jpg";
//#endregion
//#region src/img/r16-78.jpg?url
var r16_78_default = "/assets/r16-78-CwHuCkHq.jpg";
//#endregion
//#region src/img/r17-81.jpg?url
var r17_81_default = "/assets/r17-81-Bha3FBYb.jpg";
//#endregion
//#region src/img/r18-84.jpg?url
var r18_84_default = "/assets/r18-84-BpkYE3ok.jpg";
//#endregion
//#region src/img/r19-85.jpg?url
var r19_85_default = "/assets/r19-85-Boj2Xgd3.jpg";
//#endregion
//#region src/img/r20-88.jpg?url
var r20_88_default = "/assets/r20-88-Bdex73cy.jpg";
//#endregion
//#region src/img/r21-91.jpg?url
var r21_91_default = "/assets/r21-91-DP8yJnXQ.jpg";
//#endregion
//#region src/img/r22-92.jpg?url
var r22_92_default = "/assets/r22-92-CAKkAkKl.jpg";
//#endregion
//#region src/img/r23-97.jpg?url
var r23_97_default = "/assets/r23-97-NwA_C9Ht.jpg";
//#endregion
//#region src/img/r24-102.jpg?url
var r24_102_default = "/assets/r24-102-Chss1Fx1.jpg";
//#endregion
//#region src/img/r25-103.jpg?url
var r25_103_default = "/assets/r25-103-C4Wu_J0j.jpg";
//#endregion
//#region src/img/r26-106.jpg?url
var r26_106_default = "/assets/r26-106-CQm33oX0.jpg";
//#endregion
//#region src/img/r27-109.jpg?url
var r27_109_default = "/assets/r27-109-DwjTAJUE.jpg";
//#endregion
//#region src/img/r28-110.jpg?url
var r28_110_default = "/assets/r28-110-DVHyASVR.jpg";
//#endregion
//#region src/img/r29-113.jpg?url
var r29_113_default = "/assets/r29-113-Dnkm15jE.jpg";
//#endregion
//#region src/img/r30-116.jpg?url
var r30_116_default = "/assets/r30-116-BE1jjGKp.jpg";
//#endregion
//#region src/img/r31-117.jpg?url
var r31_117_default = "/assets/r31-117-LZI5k2eK.jpg";
//#endregion
//#region src/img/r32-122.jpg?url
var r32_122_default = "/assets/r32-122-BjttX5Zy.jpg";
//#endregion
//#region src/img/r33-125.jpg?url
var r33_125_default = "/assets/r33-125-ltdK3osP.jpg";
//#endregion
//#region src/img/r34-126.jpg?url
var r34_126_default = "/assets/r34-126-B5aswAfW.jpg";
//#endregion
//#region src/img/r35-129.jpg?url
var r35_129_default = "/assets/r35-129-Dx8PxP47.jpg";
//#endregion
//#region src/img/r36-132.jpg?url
var r36_132_default = "/assets/r36-132-Ck4HUZ2n.jpg";
//#endregion
//#region src/img/r37-133.jpg?url
var r37_133_default = "/assets/r37-133-6YqTqCcq.jpg";
//#endregion
//#region src/img/r38-136.jpg?url
var r38_136_default = "/assets/r38-136-Bws6VICr.jpg";
//#endregion
//#region src/img/r39-139.jpg?url
var r39_139_default = "/assets/r39-139-B_9U2H9T.jpg";
//#endregion
//#region src/img/r40-140.jpg?url
var r40_140_default = "/assets/r40-140-CvZ1X-8N.jpg";
//#endregion
//#region src/img/r43-149.jpg?url
var r43_149_default = "/assets/r43-149-A_8tWT81.jpg";
//#endregion
//#region src/img/r44-157.jpg?url
var r44_157_default = "/assets/r44-157-DLlhbX0e.jpg";
//#endregion
//#region src/img/r45-160.jpg?url
var r45_160_default = "/assets/r45-160-DqAXhlY_.jpg";
//#endregion
//#region src/img/r46-161.jpg?url
var r46_161_default = "/assets/r46-161-Bv2S6Prh.jpg";
//#endregion
//#region src/img/r47-162.jpg?url
var r47_162_default = "/assets/r47-162-DoAqc-nA.jpg";
//#endregion
//#region src/img/servicio_construccion.jpg?url
var servicio_construccion_default = "/assets/r47-162-DoAqc-nA.jpg";
//#endregion
//#region src/img/servicio_consultoria.jpg?url
var servicio_consultoria_default = "/assets/r02-equipo-B8-Vv1Ds.png";
//#endregion
//#region src/img/servicio_diseno.jpg?url
var servicio_diseno_default = "/assets/r11-62-B8Ny_tSs.jpg";
//#endregion
//#region src/img/servicio_remodelacion.jpg?url
var servicio_remodelacion_default = "/assets/r44-157-DLlhbX0e.jpg";
//#endregion
//#region src/img/servicios/construccion.png?url
var construccion_default = "/assets/construccion-BeuEPmoh.png";
//#endregion
//#region src/img/servicios/consultoria.jpg?url
var consultoria_default = "/assets/r02-equipo-B8-Vv1Ds.png";
//#endregion
//#region src/img/servicios/diseno.jpg?url
var diseno_default = "/assets/diseno-DGVOWxJS.jpg";
//#endregion
//#region src/img/servicios/integral.jpg?url
var integral_default = "/assets/r44-157-DLlhbX0e.jpg";
//#endregion
//#region src/img/servicios/remodelacion.png?url
var remodelacion_default = "/assets/remodelacion-CBsWHCXB.png";
var en_default$1 = { servicios: [
	{
		"id": "diseno",
		"n": "01",
		"img": "diseno",
		"title": "DESIGN",
		"kw": "CONCEPT · IDENTITY · SPACE",
		"d": "We translate the way you live into a unique project — in-person or remote. We explore materials, light, and proportion to create spaces that feel as good as they look.",
		"list": [
			"Architectural design",
			"Interior design",
			"Custom furniture",
			"3D visualization",
			"International remote design"
		]
	},
	{
		"id": "remodelacion",
		"n": "02",
		"img": "remodelacion",
		"title": "SHELL & CORE REMODELING",
		"kw": "STRUCTURE · EFFICIENCY · 60 DAYS",
		"d": "We transform the space from scratch: floors, walls, ceilings, and finishes, within a maximum timeframe of 60 days. One single team, one single budget, one single person accountable from start to finish.",
		"list": [
			"Floors and walls",
			"Installations",
			"Finishes",
			"Delivery in 60 days"
		]
	},
	{
		"id": "integral",
		"n": "03",
		"img": "integral",
		"title": "FULL RENOVATION",
		"kw": "TRANSFORMATION · DETAIL · TRUST",
		"d": "We renovate already built spaces with the exact same rigor as a custom design project from scratch: kitchens, bathrooms, custom furniture, and high-level finishes.",
		"list": [
			"Kitchens & bathrooms",
			"Custom furniture",
			"High-level finishes",
			"Guidance at every stage"
		]
	},
	{
		"id": "construccion",
		"n": "04",
		"img": "construccion",
		"title": "DESIGN & CONSTRUCTION",
		"kw": "INTEGRAL · PRECISION · ONE SINGLE PERSON ACCOUNTABLE",
		"d": "We design and build the same project from start to finish, under a prior evaluation of scope and budget.",
		"list": [
			"Comprehensive projects",
			"Construction under our own design",
			"Prior feasibility evaluation"
		]
	}
] };
var es_default$1 = { servicios: [
	{
		"id": "diseno",
		"n": "01",
		"img": "diseno",
		"title": "DISEÑO",
		"kw": "CONCEPTO · IDENTIDAD · ESPACIO",
		"d": "Traducimos tu forma de habitar en un proyecto único — presencial o remoto. Exploramos materiales, luz y proporción para crear espacios que se sienten tan bien como se ven.",
		"list": [
			"Diseño arquitectónico",
			"Diseño de interiores",
			"Mobiliario a medida",
			"Visualización 3D",
			"Diseño remoto internacional"
		]
	},
	{
		"id": "remodelacion",
		"n": "02",
		"img": "remodelacion",
		"title": "REMODELACIÓN DE OBRA GRIS",
		"kw": "ESTRUCTURA · EFICIENCIA · 60 DÍAS",
		"d": "Transformamos el espacio desde cero: pisos, paredes, techos y acabados, en un plazo máximo de 60 días. Un solo equipo, un solo presupuesto, un solo responsable de principio a fin.",
		"list": [
			"Pisos y paredes",
			"Instalaciones",
			"Acabados",
			"Entrega en 60 días"
		]
	},
	{
		"id": "integral",
		"n": "03",
		"img": "integral",
		"title": "REMODELACIÓN INTEGRAL",
		"kw": "TRANSFORMACIÓN · DETALLE · CONFIANZA",
		"d": "Renovamos espacios ya construidos con el mismo rigor de un proyecto de diseño desde cero: cocinas, baños, mobiliario a medida y acabados de alto nivel.",
		"list": [
			"Cocinas y baños",
			"Mobiliario a medida",
			"Acabados de alto nivel",
			"Acompañamiento en cada etapa"
		]
	},
	{
		"id": "construccion",
		"n": "04",
		"img": "construccion",
		"title": "DISEÑO Y CONSTRUCCIÓN",
		"kw": "INTEGRAL · PRECISIÓN · UN SOLO RESPONSABLE",
		"d": "Diseñamos y construimos el mismo proyecto, de principio a fin, bajo evaluación previa de alcance y presupuesto.",
		"list": [
			"Proyectos integrales",
			"Obra bajo nuestro propio diseño",
			"Evaluación previa de viabilidad"
		]
	}
] };
//#endregion
//#region src/composables/useInhabiStore.js
Promise.resolve().then(() => /* @__PURE__ */ Object.freeze({ __proto__: null }));
var WA = "573227276453";
var siteUrl = "https://devem-software.github.io/inhabi.co/";
var IMG_MODULES = /* #__PURE__ */ Object.assign({
	"../img/bano_industrial_balance.png": bano_industrial_balance_default,
	"../img/bano_industrial_integral.png": bano_industrial_integral_default,
	"../img/bano_industrial_vital.png": bano_industrial_vital_default,
	"../img/bano_social_industrial_balance.png": bano_social_industrial_balance_default,
	"../img/bano_social_industrial_integral.png": bano_social_industrial_integral_default,
	"../img/bano_social_industrial_vital.png": bano_social_industrial_vital_default,
	"../img/combos/industrial/bano/balance.png": balance_default$5,
	"../img/combos/industrial/bano/integral.png": integral_default$6,
	"../img/combos/industrial/bano/vital.png": vital_default$5,
	"../img/combos/industrial/cocina/balance.png": balance_default$4,
	"../img/combos/industrial/cocina/integral.png": integral_default$5,
	"../img/combos/industrial/cocina/vital.png": vital_default$4,
	"../img/combos/minimal/bano/balance.png": balance_default$3,
	"../img/combos/minimal/bano/integral.png": integral_default$4,
	"../img/combos/minimal/bano/vital.png": vital_default$3,
	"../img/combos/minimal/cocina/balance.png": balance_default$2,
	"../img/combos/minimal/cocina/integral.png": integral_default$3,
	"../img/combos/minimal/cocina/vital.png": vital_default$2,
	"../img/combos/natural/bano/balance.png": balance_default$1,
	"../img/combos/natural/bano/integral.png": integral_default$2,
	"../img/combos/natural/bano/vital.png": vital_default$1,
	"../img/combos/natural/cocina/balance.png": balance_default,
	"../img/combos/natural/cocina/integral.png": integral_default$1,
	"../img/combos/natural/cocina/vital.png": vital_default,
	"../img/front/inst_01.jpg": inst_01_default,
	"../img/front/inst_02.jpg": inst_02_default,
	"../img/front/inst_03.jpg": inst_03_default,
	"../img/front/loc_01.jpg": loc_01_default,
	"../img/front/loc_02.jpg": loc_02_default,
	"../img/front/loc_03.jpg": loc_03_default,
	"../img/front/viv_01.jpg": viv_01_default,
	"../img/front/viv_02.jpg": viv_02_default,
	"../img/front/viv_03.jpg": viv_03_default,
	"../img/logos/cafam.png": cafam_default,
	"../img/logos/carnes_piamontesa.png": carnes_piamontesa_default,
	"../img/logos/embajada_francia.png": embajada_francia_default,
	"../img/logos/lala.png": lala_default,
	"../img/logos/liftit.png": liftit_default,
	"../img/logos/mascoagro.png": mascoagro_default,
	"../img/logos/movar.png": movar_default,
	"../img/logos/nativas.png": nativas_default,
	"../img/logos/piamontesa.png": piamontesa_default,
	"../img/logos/platzi.png": platzi_default,
	"../img/logos/suarez.png": suarez_default,
	"../img/logos/techo.png": techo_default,
	"../img/logos/universidad_libre.png": universidad_libre_default,
	"../img/logos/vid_construcciones.png": vid_construcciones_default,
	"../img/proyectos/comercial.jpg": comercial_default,
	"../img/proyectos/institucional.jpg": institucional_default,
	"../img/proyectos/vivienda.png": vivienda_default,
	"../img/r01-5.jpg": r01_5_default,
	"../img/r02-11.jpg": r02_11_default,
	"../img/r02-equipo.png": r02_equipo_default$1,
	"../img/r03-35.jpg": r03_35_default,
	"../img/r04-38.jpg": r04_38_default,
	"../img/r05-42.jpg": r05_42_default,
	"../img/r09-52.jpg": r09_52_default,
	"../img/r10-57.jpg": r10_57_default$1,
	"../img/r11-62.jpg": r11_62_default,
	"../img/r14-74.jpg": r14_74_default,
	"../img/r15-77.jpg": r15_77_default,
	"../img/r16-78.jpg": r16_78_default,
	"../img/r17-81.jpg": r17_81_default,
	"../img/r18-84.jpg": r18_84_default,
	"../img/r19-85.jpg": r19_85_default,
	"../img/r20-88.jpg": r20_88_default,
	"../img/r21-91.jpg": r21_91_default,
	"../img/r22-92.jpg": r22_92_default,
	"../img/r23-97.jpg": r23_97_default,
	"../img/r24-102.jpg": r24_102_default,
	"../img/r25-103.jpg": r25_103_default,
	"../img/r26-106.jpg": r26_106_default,
	"../img/r27-109.jpg": r27_109_default,
	"../img/r28-110.jpg": r28_110_default,
	"../img/r29-113.jpg": r29_113_default,
	"../img/r30-116.jpg": r30_116_default,
	"../img/r31-117.jpg": r31_117_default,
	"../img/r32-122.jpg": r32_122_default,
	"../img/r33-125.jpg": r33_125_default,
	"../img/r34-126.jpg": r34_126_default,
	"../img/r35-129.jpg": r35_129_default,
	"../img/r36-132.jpg": r36_132_default,
	"../img/r37-133.jpg": r37_133_default,
	"../img/r38-136.jpg": r38_136_default,
	"../img/r39-139.jpg": r39_139_default,
	"../img/r40-140.jpg": r40_140_default,
	"../img/r43-149.jpg": r43_149_default,
	"../img/r44-157.jpg": r44_157_default,
	"../img/r45-160.jpg": r45_160_default,
	"../img/r46-161.jpg": r46_161_default,
	"../img/r47-162.jpg": r47_162_default,
	"../img/servicio_construccion.jpg": servicio_construccion_default,
	"../img/servicio_consultoria.jpg": servicio_consultoria_default,
	"../img/servicio_diseno.jpg": servicio_diseno_default,
	"../img/servicio_remodelacion.jpg": servicio_remodelacion_default,
	"../img/servicios/construccion.png": construccion_default,
	"../img/servicios/consultoria.jpg": consultoria_default,
	"../img/servicios/diseno.jpg": diseno_default,
	"../img/servicios/integral.jpg": integral_default,
	"../img/servicios/remodelacion.png": remodelacion_default
});
var SERVICIOS_MODULES = /* #__PURE__ */ Object.assign({
	"/src/data/servicios/en.json": en_default$1,
	"/src/data/servicios/es.json": es_default$1
});
function resolve(modules, prefix, name) {
	const basePath = `${prefix}/${name}`;
	if (/\.[a-z0-9]+$/i.test(name)) {
		if (modules[basePath]) return modules[basePath];
		const altKey = Object.keys(modules).find((k) => k.endsWith(name));
		if (altKey) return modules[altKey];
	}
	for (const ext of [
		"jpg",
		"jpeg",
		"png",
		"webp",
		"avif",
		"svg"
	]) {
		const key = `${basePath}.${ext}`;
		if (modules[key]) return modules[key];
		const altKey = Object.keys(modules).find((k) => k.endsWith(`${name}.${ext}`));
		if (altKey) return modules[altKey];
	}
	console.warn(`[inhabi] recurso no encontrado: ${name} (buscado en ${basePath})`);
	return "";
}
/** Imagen dentro de src/img/  →  IMG('r44-157') o IMG('r02-equipo.png') */
var IMG = (name) => {
	const resolved = resolve(IMG_MODULES, "../img", name);
	console.log(resolved);
	return resolved;
};
var FRONT_IMAGES = [
	"viv_01",
	"viv_02",
	"viv_03",
	"inst_01",
	"inst_02",
	"inst_03",
	"loc_01",
	"loc_02",
	"loc_03"
];
var R = {
	industrial: {
		vital: ["r17-81", "bano_industrial_vital"],
		balance: ["r14-74", "bano_industrial_balance"],
		integral: ["r20-88", "bano_industrial_integral"]
	},
	minimal: {
		vital: ["r26-106", "r28-110"],
		balance: ["r23-97", "r25-103"],
		integral: ["r29-113", "r31-117"]
	},
	natural: {
		vital: ["r35-129", "r37-133"],
		balance: ["r32-122", "r34-126"],
		integral: ["r38-136", "r40-140"]
	}
};
var TIPO_PROYECTO = {
	es: {
		vivienda: {
			id: "vivienda",
			label: "Vivienda",
			description: "Calidez, comodidad"
		},
		comercial: {
			id: "comercial",
			label: "Comercial",
			description: "Proyeccion, ambiente"
		},
		institucional: {
			id: "institucional",
			label: "Institucional",
			description: "Elegancia, profesionalismo"
		}
	},
	en: {
		vivienda: {
			id: "vivienda",
			label: "Residential",
			description: "Residential project"
		},
		comercial: {
			id: "comercial",
			label: "Commercial",
			description: "Commercial project"
		},
		institucional: {
			id: "institucional",
			label: "Institutional",
			description: "Institutional project"
		}
	}
};
var COMBOS = [
	{
		id: "vital",
		n: "01",
		img: "r04-38",
		es: {
			name: "Vital",
			kw: "Práctico · Estructurado · Evolucionado",
			d: "Mantiene el sello de diseño elevando la experiencia con mobiliario más amplio, más compartimentos y mejor organización diaria."
		},
		en: {
			name: "Vital",
			kw: "Practical · Structured · Evolved",
			d: "Keeps our design signature while elevating the experience with larger furniture, more storage and better everyday organisation."
		}
	},
	{
		id: "balance",
		n: "02",
		img: "r03-35",
		es: {
			name: "Balance",
			kw: "Accesible · Esencial · Eficiente",
			d: "La prueba de que el alto diseño es accesible: una propuesta funcional y compacta que aprovecha cada metro cuadrado con estilo impecable."
		},
		en: {
			name: "Balance",
			kw: "Accessible · Essential · Efficient",
			d: "Proof that high design can be accessible: a compact, functional proposal that makes the most of every square metre with impeccable style."
		}
	},
	{
		id: "integral",
		n: "03",
		img: "r05-42",
		es: {
			name: "Integral",
			kw: "Sofisticación · Imponente · Distinción",
			d: "La experiencia más completa y sofisticada: mobiliario de gran escala, áreas sociales integradas y almacenamiento superior en todo el hogar."
		},
		en: {
			name: "Integral",
			kw: "Sophistication · Presence · Distinction",
			d: "The most complete, sophisticated experience: large-scale furniture, integrated social areas and superior storage throughout the home."
		}
	}
];
var STYLES = [
	{
		id: "natural",
		n: "01",
		mb: "r09-52",
		es: {
			name: "Natural",
			kw: "Vitalidad · Calidez · Regeneración",
			d: "Un refugio acogedor que trae la vitalidad del exterior hacia adentro mediante texturas orgánicas y elementos vivos. Restaura tu energía diaria y resalta la calidez de tu verdadera identidad.",
			fit: "Si te identificas con la luz, la calidez de los materiales orgánicos y los espacios que recargan el espíritu, este estilo es para ti."
		},
		en: {
			name: "Natural",
			kw: "Vitality · Warmth · Renewal",
			d: "A welcoming refuge that brings the vitality of the outdoors inside through organic textures and living elements. It restores your daily energy and highlights the warmth of who you are.",
			fit: "If you connect with light, the warmth of organic materials and spaces that recharge the spirit, this style is for you."
		},
		hs: [
			[
				22,
				22,
				"Grifería negra mate",
				"Matte black faucet"
			],
			[
				50,
				16,
				"Lámpara cerámica",
				"Ceramic pendant"
			],
			[
				42,
				52,
				"Enchape verde acanalado",
				"Fluted sage tile"
			],
			[
				10,
				50,
				"Rejilla en ratán",
				"Rattan cane"
			],
			[
				77,
				26,
				"Espejo ovalado",
				"Oval mirror"
			],
			[
				46,
				87,
				"Lavamanos en piedra",
				"Stone basin"
			],
			[
				86,
				78,
				"Vegetación viva",
				"Living greenery"
			]
		]
	},
	{
		id: "minimal",
		n: "02",
		mb: "r11-62",
		es: {
			name: "Minimal",
			kw: "Claridad · Armonía · Calma",
			d: "Espacios limpios y armónicos que eliminan las distracciones visuales para conectar con lo esencial. Su diseño fluido equilibra la energía del hogar y crea un entorno de paz absoluta.",
			fit: "Si te identificas con la sensación de respirar profundo, el orden impecable y la elegancia de lo simple, este estilo es para ti."
		},
		en: {
			name: "Minimal",
			kw: "Clarity · Harmony · Calm",
			d: "Clean, harmonious spaces that remove visual noise to connect with the essential. Its fluid design balances the home’s energy and creates an environment of absolute peace.",
			fit: "If you connect with deep breaths, impeccable order and the elegance of simplicity, this style is for you."
		},
		hs: [
			[
				15,
				30,
				"Roble claro",
				"Light oak"
			],
			[
				36,
				24,
				"Mármol blanco",
				"White marble"
			],
			[
				51,
				14,
				"Lámpara negra",
				"Black pendant"
			],
			[
				51,
				33,
				"Grifería negra",
				"Black fixtures"
			],
			[
				60,
				56,
				"Espiga en porcelanato",
				"Herringbone tile"
			],
			[
				88,
				28,
				"Espejo retroiluminado",
				"Backlit mirror"
			],
			[
				15,
				68,
				"Tabla en madera",
				"Wood board"
			]
		]
	},
	{
		id: "industrial",
		n: "03",
		mb: "r10-57",
		es: {
			name: "Industrial",
			kw: "Carácter · Fortaleza · Autenticidad",
			d: "Una propuesta sofisticada que celebra la fuerza y textura de la arquitectura expuesta. Estructuras sólidas y una distribución equilibrada de la luz proyectan un ambiente auténtico.",
			fit: "Si te identificas con los tonos sobrios, la personalidad urbana y los entornos con carácter audaz y libre, este estilo es para ti."
		},
		en: {
			name: "Industrial",
			kw: "Character · Strength · Authenticity",
			d: "A sophisticated proposal that celebrates the strength and texture of exposed architecture. Solid structures and balanced light create an authentic atmosphere.",
			fit: "If you connect with sober tones, urban personality and bold, free-spirited spaces, this style is for you."
		},
		hs: [
			[
				9,
				30,
				"Malla metálica",
				"Woven metal"
			],
			[
				32,
				40,
				"Nogal",
				"Walnut veneer"
			],
			[
				50,
				14,
				"Lámpara industrial",
				"Industrial pendant"
			],
			[
				70,
				34,
				"Granito negro",
				"Black granite"
			],
			[
				48,
				51,
				"Mosaico 3D",
				"3D mosaic"
			],
			[
				28,
				68,
				"Subway blanco",
				"White subway tile"
			],
			[
				91,
				57,
				"Grifería negra",
				"Black faucet"
			]
		]
	}
];
var LOGOS = [
	"cafam",
	"carnes_piamontesa",
	"lala",
	"mascoagro",
	"movar",
	"nativas",
	"piamontesa",
	"platzi",
	"suarez",
	"techo",
	"universidad_libre",
	"vid_construcciones",
	"embajada_francia",
	"liftit"
];
var T = {
	es: {
		nav: {
			combos: "Combos",
			estilos: "Estilos",
			config: "Configurador",
			proyectos: "Proyectos",
			cotizar: "Cotizar",
			agendar: "Agendar",
			estudio: "Nosotros",
			servicios: "Servicios",
			inicio: "Inicio"
		},
		hero: {
			eyebrow: "Arquitectura e interiorismo · Bogotá",
			h1a: "Espacios que se",
			h1b: "habitan con emoción.",
			sub: "Diseñamos soluciones exclusivas, innovadoras y de alta calidad, centradas en quien las habita. Tu remodelación, completamente ejecutada en menos de 60 días.",
			cta1: "Diseña tu espacio",
			cta2: "Solicitar cotización"
		},
		steps: [
			["Elige", "Tu combo"],
			["Escoge", "Tu estilo"],
			["Recibe", "En 60 días"]
		],
		estudio: {
			eyebrow: "Acerca de la empresa",
			title: "Que tu presupuesto se invierta en diseño, confort y bienestar.",
			p1: "Somos un equipo de profesionales especializado en el desarrollo de proyectos arquitectónicos y de interiorismo. Nos enfocamos en crear espacios que transmiten emociones, promoviendo el bienestar y el equilibrio.",
			p2: "Nuestra pasión se refleja en cada proyecto: soluciones exclusivas, innovadoras y de alta calidad, totalmente centradas en las necesidades de quien los habita."
		},
		servicios: {
			eyebrow: "Servicios",
			title: "Lo que hacemos",
			sub: "Cuatro líneas de trabajo, un mismo estándar de diseño y ejecución.",
			cta: "Cotizar este servicio"
		},
		combos: {
			eyebrow: "Elige",
			title: "Tres tipos de remodelación según tu presupuesto.",
			sub: "Cada combo define la escala del mobiliario, el almacenamiento y el alcance de la intervención.",
			cta: "Ver en el configurador"
		},
		estilos: {
			eyebrow: "Escoge",
			title: "El estilo, los colores y los acabados que más te gusten.",
			mat: "Materiales del moodboard",
			cta: "Aplicar este estilo"
		},
		config: {
			eyebrow: "Diseños aplicados en tu proyecto",
			title: "Combina tu combo con tu estilo.",
			sub: "Así se vería cada combinación en tu vivienda. Cambia el combo, el estilo o el espacio y mira el render al instante.",
			comboL: "Combo",
			styleL: "Estilo",
			rooms: ["Cocina", "Baño"],
			yourSel: "Tu selección",
			note: "Llevamos esta combinación directo a tu solicitud de cotización.",
			cta: "Cotizar esta combinación"
		},
		cmp: {
			eyebrow: "Mismo espacio, dos estilos",
			title: "Desliza para ver cómo cambia el carácter del hogar.",
			tabs: ["Cocina", "Baño"]
		},
		recibe: {
			eyebrow: "Recibe",
			days: "días",
			p: "Recibe tu vivienda completamente remodelada, con todos los estándares de calidad y supervisada por nuestro equipo de profesionales, en un periodo máximo de 60 días."
		},
		proy: {
			eyebrow: "Nuestro proyectos",
			title: "Arquitectura que genera valor.",
			p: "Diseño interior, arquitectura y ejecución técnica integrados para crear espacios funcionales, estéticos y altamente competitivos.",
			ver: "Ver",
			inter: "Nuestro trabajo",
			resena: "Reseña"
		},
		cot: {
			eyebrow: "Cotiza tu proyecto",
			title: "Cuéntanos sobre tu espacio.",
			sub: "Cada proyecto se cotiza según el metraje, el alcance, la ubicación y los acabados. Completa los datos y te enviamos una propuesta a la medida.",
			tipoL: "Tipo de inmueble",
			tipos: [
				"Apartamento",
				"Casa",
				"Oficina",
				"Local comercial",
				"VIS"
			],
			configEsp: "Configuración de espacios",
			m2L: "Área aproximada",
			espL: "Espacios a intervenir",
			disL: "Escoje el diseño",
			datL: "Datos de contacto",
			esp: [
				"Cocina",
				"Habitaciones",
				"Baños",
				"Lavanderia",
				"Sala",
				"Comedor"
			],
			nameL: "Nombre",
			telL: "Teléfono",
			cityL: "Ciudad / barrio",
			msgL: "Cuéntanos más (opcional)",
			sumT: "Resumen de tu solicitud",
			kTipo: "Inmueble",
			kArea: "Área",
			kCombo: "Combo",
			kEstilo: "Estilo",
			kEsp: "Espacios",
			kPlazo: "Plazo de ejecución",
			plazoA: "Hasta 60 días",
			plazoB: "Cronograma a medida",
			none: "Por definir",
			send: "Enviar solicitud",
			wa: "Enviar por WhatsApp",
			thanksT: "Recibimos tu solicitud.",
			thanks: "Te contactaremos en menos de 24 horas hábiles para agendar la visita técnica."
		},
		ag: {
			eyebrow: "Agenda una cita",
			title: "Visitemos tu espacio.",
			sub: "Elige una visita técnica en tu inmueble o una videollamada con nuestro equipo de diseño.",
			modes: ["Visita al inmueble", "Videollamada"],
			dayL: "Elige el día",
			timeL: "Elige la hora",
			pick: "Elige día y hora",
			confirm: "Confirmar",
			okT: "Cita solicitada.",
			okWa: "Confirmar por WhatsApp"
		},
		foot: {
			eyebrow: "¡Trabajemos juntos!",
			tag: "Arquitectura · Interiorismo · Remodelación"
		},
		hola: "Hola Inhabi, quiero información sobre sus remodelaciones."
	},
	en: {
		nav: {
			combos: "Packages",
			estilos: "Styles",
			config: "Configurator",
			proyectos: "Projects",
			cotizar: "Quote",
			agendar: "Book",
			estudio: "About us",
			servicios: "Services",
			inicio: "Home"
		},
		hero: {
			eyebrow: "Architecture & interior design · Bogotá",
			h1a: "Spaces designed",
			h1b: "to be felt.",
			sub: "We design exclusive, innovative, high-quality solutions centred on the people who live in them. Your renovation, fully delivered in under 60 days.",
			cta1: "Design your space",
			cta2: "Request a quote"
		},
		steps: [
			["Select", "Your package"],
			["Choose", "Your style"],
			["Receive", "In 60 days"]
		],
		estudio: {
			eyebrow: "About the studio",
			title: "Your budget, invested in design, comfort and wellbeing.",
			p1: "We are a team of professionals specialised in architecture and interior design projects. We focus on creating spaces that convey emotion, promoting wellbeing and balance.",
			p2: "Our passion shows in every project: exclusive, innovative, high-quality solutions, fully centred on the needs of those who inhabit them."
		},
		servicios: {
			eyebrow: "Services",
			title: "Lo que hacemos",
			sub: "Cuatro líneas de trabajo, un mismo estándar de diseño y ejecución.",
			cta: "Cotizar este servicio"
		},
		combos: {
			eyebrow: "Select",
			title: "Three renovation packages for your budget.",
			sub: "Each package defines furniture scale, storage and the scope of the intervention.",
			cta: "See it in the configurator"
		},
		estilos: {
			eyebrow: "Choose",
			title: "The style, colours and finishes you love most.",
			mat: "Moodboard materials",
			cta: "Apply this style"
		},
		config: {
			eyebrow: "Designs applied to your project",
			title: "Pair your package with your style.",
			sub: "See how each combination would look in your home. Switch package, style or room and the render updates instantly.",
			comboL: "Package",
			styleL: "Style",
			rooms: ["Kitchen", "Bath"],
			yourSel: "Your selection",
			note: "We carry this combination straight into your quote request.",
			cta: "Quote this combination"
		},
		cmp: {
			eyebrow: "Same space, two styles",
			title: "Drag to see how the character of the home changes.",
			tabs: ["Kitchen", "Bath"]
		},
		recibe: {
			eyebrow: "Receive",
			days: "days",
			p: "Receive your home fully renovated to every quality standard, supervised by our team of professionals, within a maximum of 60 days."
		},
		proy: {
			eyebrow: "Our projects",
			title: "Architecture that creates value.",
			p: "Interior design, architecture and technical execution integrated to create functional, beautiful and highly competitive spaces.",
			ver: "View",
			inter: "Our work",
			resena: "Project review"
		},
		cot: {
			eyebrow: "Get a quote",
			title: "Tell us about your space.",
			sub: "Every project is quoted by area, scope, location and finishes. Fill in the details and we’ll send a tailored proposal.",
			tipoL: "Property type",
			tipos: [
				"Apartment",
				"House",
				"Office",
				"Retail"
			],
			m2L: "Approximate area",
			configEsp: "Configuration of spaces",
			espL: "Spaces to renovate",
			disL: "Select your design",
			datL: "Contact data",
			esp: [
				"Kitchen",
				"Bedrooms",
				"Bathrooms",
				"Laundry",
				"Living room",
				"Dining room"
			],
			nameL: "Name",
			telL: "Phone",
			cityL: "City / area",
			msgL: "Tell us more (optional)",
			sumT: "Request summary",
			kTipo: "Property",
			kArea: "Area",
			kCombo: "Package",
			kEstilo: "Style",
			kEsp: "Spaces",
			kPlazo: "Delivery time",
			plazoA: "Up to 60 days",
			plazoB: "Custom schedule",
			none: "To be defined",
			send: "Send request",
			wa: "Send via WhatsApp",
			thanksT: "Request received.",
			thanks: "We’ll contact you within 24 business hours to schedule the site visit."
		},
		ag: {
			eyebrow: "Book a meeting",
			title: "Let’s visit your space.",
			sub: "Choose an on-site technical visit or a video call with our design team.",
			modes: ["On-site visit", "Video call"],
			dayL: "Pick a day",
			timeL: "Pick a time",
			pick: "Select day and time",
			confirm: "Confirm",
			okT: "Meeting requested.",
			okWa: "Confirm on WhatsApp"
		},
		foot: {
			eyebrow: "Let’s work together",
			tag: "Architecture · Interiors · Renovation"
		},
		hola: "Hi Inhabi, I’d like information about your renovations."
	}
};
var HERO_B = [
	["r38-136", "Integral · Natural"],
	["r40-140", "Integral · Natural"],
	["r20-88", "Integral · Industrial"]
];
var store = reactive({
	lang: "es",
	combo: "vital",
	style: "natural",
	room: 0,
	hot: -1,
	heroI: 0,
	cmp: 50,
	cmpRoom: 0,
	dragging: false,
	q: {
		tipo: 0,
		m2: 35,
		esp: [0, 1],
		nombre: "",
		apellido: "",
		tel: "",
		email: "",
		ciudad: "",
		msg: ""
	},
	sent: false,
	mode: 0,
	day: -1,
	slot: -1,
	booked: false
});
var t = computed(() => T[store.lang]);
var currentCombo = computed(() => COMBOS.find((c) => c.id === store.combo));
var currentStyle = computed(() => STYLES.find((x) => x.id === store.style));
var currentImgs = computed(() => R[store.style][store.combo]);
computed(() => `${currentCombo.value[store.lang].name} · ${currentStyle.value[store.lang].name}`);
var currentServicios = computed(() => {
	return SERVICIOS_MODULES[`/src/data/servicios/${store.lang || "es"}.json`]?.servicios ?? [];
});
var currentTipo = computed(() => TIPO_PROYECTO[store.lang]);
//#endregion
//#region src/components/LogoComponent.vue
var _sfc_main$19 = {
	__name: "LogoComponent",
	__ssrInlineRender: true,
	props: {
		color: {
			type: String,
			default: "#E6E1D6"
		},
		colorIcon: { type: String },
		colorText: { type: String },
		icon: {
			type: Boolean,
			default: false
		},
		text: {
			type: Boolean,
			default: false
		}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<svg${ssrRenderAttrs(mergeProps({
				version: "1.1",
				viewBox: "0 0 575 105",
				xmlns: "http://www.w3.org/2000/svg",
				class: "logo"
			}, _attrs))}><g transform="matrix(.64898 0 0 .64397 2.055e-6 8.4e-8)">`);
			if (__props.icon) _push(`<g${ssrRenderAttr("fill", props.colorIcon || props.color)} class="logo__icon"><path class="cls-2" d="m67.69 162.85-67.21 0.2v-2.16c2.04-1.66 4.23-3.18 6.58-4.54 19.95-11.6 44.46-8.29 60.64 6.5z"></path><path class="cls-6" d="m126.61 146.42c3.06 5.27 5.6 10.7 7.68 16.23l-40.4 0.12c-19.09-30.51-58.81-42.39-91.53-26.96l-1.96 0.93-0.12-39.15c47.49-15.04 100.56 4.51 126.32 48.83z"></path><path class="cls-8" d="M 0.08,28.95 0,1.6 102.46,1.3 c 21.48,7.45 41.37,18.19 59.08,31.76 l 0.15,49.32 C 120.56,37.4 59.2,17.46 0.08,28.95 Z"></path><path class="cls-12" d="m150.25 162.6c-2.65-8.12-6.16-16.08-10.63-23.75-15.33-26.37-39.74-46.03-68.75-55.39l9.34-35.28 0.32 0.1c32.81 10.22 61.11 30.57 81.22 58l0.17 56.29-11.68 0.03z"></path><path class="cls-5" d="m67.08 44.72 0.13 0.03-9.34 35.28c-19.27-3.98-38.98-3.26-57.63 1.87l-0.11-37.48c21.88-4.6 44.66-4.58 66.96 0.3z"></path></g>`);
			else _push(`<!---->`);
			if (__props.text) _push(`<g${ssrRenderAttr("fill", props.colorText || props.color)} class="logo__text"><path class="cls-3" d="m252.32 0c-5.11 0-9.33 1.64-12.66 4.9-3.33 3.27-4.99 7.46-4.99 12.57s1.66 9.48 4.99 12.74c3.33 3.27 7.55 4.9 12.66 4.9s9.33-1.63 12.66-4.9c3.32-3.27 4.99-7.51 4.99-12.74s-1.67-9.3-4.99-12.57c-3.33-3.27-7.55-4.9-12.66-4.9z"></path><rect class="cls-7" x="235.39" y="46.35" width="33.87" height="96.61"></rect><polygon class="cls-10" points="292.28 18.18 292.28 142.96 326.86 142.96 326.86 76.46 381.94 142.96 410.99 142.96 410.99 18.18 376.42 18.18 376.42 84.68 321.34 18.18"></polygon><polygon class="cls-9" points="518.18 142.96 553.47 142.96 553.47 18.18 518.18 18.18 518.18 65.06 470.05 65.06 470.05 18.18 434.76 18.18 434.76 142.96 470.05 142.96 470.05 94.3 518.18 94.3"></polygon><path class="cls-11" d="m616.75 18.18-55.08 124.78h36.01l9.73-24.24h52.91l9.73 24.24h36.72l-55.26-124.78zm1.1 74.51 16.01-39.9 16.01 39.9z"></path><path class="cls-4" d="m812.9 78.7c-0.74-0.3-1.51-0.59-2.28-0.86 4.95-2.65 8.9-6.04 11.82-10.19 3.39-4.81 5.08-10.43 5.08-16.84 0-9.74-4.04-17.62-12.12-23.62s-20.32-9-36.72-9h-63.81v124.78h67.38c16.76 0 29.5-3 38.24-9 8.73-6 13.1-14.41 13.1-25.22 0-7.25-1.81-13.4-5.44-18.45s-8.71-8.91-15.24-11.59zm-38.86-35.03c5.94 0 10.4 0.98 13.37 2.94s4.46 4.96 4.46 9-1.49 7.07-4.46 9.09-7.43 3.03-13.37 3.03h-24.24v-24.06zm19.16 70.68c-3.15 2.08-7.75 3.12-13.81 3.12h-29.59v-25.31h29.59c6.06 0 10.66 1.04 13.81 3.12s4.72 5.26 4.72 9.54-1.58 7.46-4.72 9.54z"></path><rect class="cls-1" x="850.72" y="18.18" width="35.29" height="124.78"></rect></g>`);
			else _push(`<!---->`);
			_push(`</g></svg>`);
		};
	}
};
var _sfc_setup$19 = _sfc_main$19.setup;
_sfc_main$19.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/LogoComponent.vue");
	return _sfc_setup$19 ? _sfc_setup$19(props, ctx) : void 0;
};
//#endregion
//#region src/components/IntroLoader.vue
var _sfc_main$18 = {
	__name: "IntroLoader",
	__ssrInlineRender: true,
	emits: ["done"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		let timer;
		const skip = () => {
			clearTimeout(timer);
			cleanup();
			emit("done");
		};
		const cleanup = () => {
			window.removeEventListener("wheel", skip);
			window.removeEventListener("keydown", skip);
			window.removeEventListener("touchstart", skip);
		};
		onMounted(() => {
			timer = setTimeout(() => emit("done"), 4e3);
			window.addEventListener("wheel", skip, { passive: true });
			window.addEventListener("keydown", skip);
			window.addEventListener("touchstart", skip, { passive: true });
		});
		onUnmounted(() => {
			clearTimeout(timer);
			cleanup();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				"aria-hidden": "true",
				class: "intro-root"
			}, _attrs))} data-v-8a67040c><div class="panel panel-left" data-v-8a67040c></div><div class="panel panel-right" data-v-8a67040c></div><div class="center" data-v-8a67040c><div class="inner" data-v-8a67040c><div class="logo-wrap" data-v-8a67040c>`);
			_push(ssrRenderComponent(_sfc_main$19, {
				class: "animated-logo",
				icon: "",
				text: ""
			}, null, _parent));
			_push(`</div><div class="caption" data-v-8a67040c>${ssrInterpolate(unref(store).lang === "en" ? "Architecture · Interiors" : "Arquitectura · Interiorismo")}</div></div></div></div>`);
		};
	}
};
var _sfc_setup$18 = _sfc_main$18.setup;
_sfc_main$18.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/IntroLoader.vue");
	return _sfc_setup$18 ? _sfc_setup$18(props, ctx) : void 0;
};
var IntroLoader_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$18, [["__scopeId", "data-v-8a67040c"]]);
//#endregion
//#region src/components/AppNav.vue
var _sfc_main$17 = {
	__name: "AppNav",
	__ssrInlineRender: true,
	props: { scrolled: Boolean },
	setup(__props) {
		const props = __props;
		const menuOpen = ref(false);
		const activeDesktopDropdown = ref(null);
		const activeMobileSub = ref(null);
		function closeMenu() {
			menuOpen.value = false;
			activeDesktopDropdown.value = null;
			activeMobileSub.value = null;
		}
		function onKeydown(e) {
			if (e.key === "Escape") closeMenu();
		}
		watch(menuOpen, (open) => {
			document.body.style.overflow = open ? "hidden" : "";
			if (open) window.addEventListener("keydown", onKeydown);
			else window.removeEventListener("keydown", onKeydown);
		});
		onUnmounted(() => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", onKeydown);
		});
		const listServicesItems = computed(() => {
			return currentServicios.value.map((s) => ({
				href: `#${s.id}`,
				label: s.title
			}));
		});
		const navStyle = computed(() => ({
			background: props.scrolled || menuOpen.value ? "rgba(18,17,14,.88)" : "transparent",
			backdropFilter: props.scrolled || menuOpen.value ? "blur(12px)" : "none"
		}));
		const links = computed(() => [
			{
				href: "#proyectos",
				label: t.value.nav.proyectos
			},
			{
				href: "#servicios",
				label: t.value.nav.servicios,
				children: listServicesItems.value
			},
			{
				href: "#estudio",
				label: t.value.nav.estudio
			}
		]);
		function langStyle(lang) {
			const active = store.lang === lang;
			return {
				background: active ? "#f3f0e9" : "transparent",
				color: active ? "#12110e" : "#f3f0e9"
			};
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_router_link = resolveComponent("router-link");
			_push(`<!--[--><nav class="nav" style="${ssrRenderStyle(navStyle.value)}" data-v-d87a2f8b><a href="#top" class="brand" data-v-d87a2f8b>`);
			_push(ssrRenderComponent(_sfc_main$19, {
				class: "brand-logo",
				icon: "",
				text: ""
			}, null, _parent));
			_push(`</a><div class="nav-links" data-v-d87a2f8b><!--[-->`);
			ssrRenderList(links.value, (l, index) => {
				_push(`<!--[-->`);
				if (l.children) {
					_push(`<div class="nav-item-dropdown" data-v-d87a2f8b><a${ssrRenderAttr("href", l.href)} class="nav-dropdown-toggle" data-v-d87a2f8b>${ssrInterpolate(l.label)} <span class="${ssrRenderClass([{ "is-rotated": activeDesktopDropdown.value === index }, "arrow"])}" data-v-d87a2f8b>▾</span></a>`);
					if (activeDesktopDropdown.value === index) {
						_push(`<div class="dropdown-menu" data-v-d87a2f8b><!--[-->`);
						ssrRenderList(l.children, (sub) => {
							_push(`<a${ssrRenderAttr("href", sub.href)} data-v-d87a2f8b>${ssrInterpolate(sub.label)}</a>`);
						});
						_push(`<!--]--></div>`);
					} else _push(`<!---->`);
					_push(`</div>`);
				} else _push(`<a${ssrRenderAttr("href", l.href)} data-v-d87a2f8b>${ssrInterpolate(l.label)}</a>`);
				_push(`<!--]-->`);
			});
			_push(`<!--]--><div class="lang-switch" data-v-d87a2f8b><button class="lang-btn" style="${ssrRenderStyle(langStyle("es"))}" data-v-d87a2f8b>ES</button><button class="lang-btn" style="${ssrRenderStyle(langStyle("en"))}" data-v-d87a2f8b>EN</button></div>`);
			_push(ssrRenderComponent(_component_router_link, {
				to: "/cotiza",
				class: "nav-cta",
				onClick: closeMenu
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`${ssrInterpolate(unref(t).nav.cotizar)}`);
					else return [createTextVNode(toDisplayString(unref(t).nav.cotizar), 1)];
				}),
				_: 1
			}, _parent));
			_push(`</div><button class="${ssrRenderClass([{ "is-open": menuOpen.value }, "burger"])}"${ssrRenderAttr("aria-expanded", menuOpen.value)} aria-label="Abrir menú" data-v-d87a2f8b><span data-v-d87a2f8b></span><span data-v-d87a2f8b></span><span data-v-d87a2f8b></span></button></nav>`);
			if (menuOpen.value) {
				_push(`<div class="mobile-menu" role="dialog" aria-modal="true" data-v-d87a2f8b><div class="mobile-menu-inner" data-v-d87a2f8b><nav class="mobile-links" data-v-d87a2f8b><!--[-->`);
				ssrRenderList(links.value, (l, i) => {
					_push(`<!--[-->`);
					if (l.children) {
						_push(`<div class="mobile-item-group" data-v-d87a2f8b><button class="mobile-link mobile-dropdown-btn" data-v-d87a2f8b><span class="mobile-num" data-v-d87a2f8b>0${ssrInterpolate(i + 1)}</span><span class="mobile-label" data-v-d87a2f8b>${ssrInterpolate(l.label)}</span><span class="${ssrRenderClass([{ "is-rotated": activeMobileSub.value === i }, "mobile-arrow"])}" data-v-d87a2f8b>▾</span></button><div class="mobile-sublinks" style="${ssrRenderStyle(activeMobileSub.value === i ? null : { display: "none" })}" data-v-d87a2f8b><!--[-->`);
						ssrRenderList(l.children, (sub) => {
							_push(`<a${ssrRenderAttr("href", sub.href)} class="mobile-sublink" data-v-d87a2f8b> — ${ssrInterpolate(sub.label)}</a>`);
						});
						_push(`<!--]--></div></div>`);
					} else _push(`<a${ssrRenderAttr("href", l.href)} class="mobile-link" data-v-d87a2f8b><span class="mobile-num" data-v-d87a2f8b>0${ssrInterpolate(i + 1)}</span><span class="mobile-label" data-v-d87a2f8b>${ssrInterpolate(l.label)}</span><span class="mobile-arrow" data-v-d87a2f8b>→</span></a>`);
					_push(`<!--]-->`);
				});
				_push(`<!--]--></nav><div class="mobile-foot" data-v-d87a2f8b><div class="lang-switch" data-v-d87a2f8b><button class="lang-btn" style="${ssrRenderStyle(langStyle("es"))}" data-v-d87a2f8b>ES</button><button class="lang-btn" style="${ssrRenderStyle(langStyle("en"))}" data-v-d87a2f8b>EN</button></div>`);
				_push(ssrRenderComponent(_component_router_link, {
					to: "/cotiza",
					class: "nav-cta",
					onClick: closeMenu
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`${ssrInterpolate(unref(t).nav.cotizar)}`);
						else return [createTextVNode(toDisplayString(unref(t).nav.cotizar), 1)];
					}),
					_: 1
				}, _parent));
				_push(`</div></div></div>`);
			} else _push(`<!---->`);
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$17 = _sfc_main$17.setup;
_sfc_main$17.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/AppNav.vue");
	return _sfc_setup$17 ? _sfc_setup$17(props, ctx) : void 0;
};
var AppNav_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$17, [["__scopeId", "data-v-d87a2f8b"]]);
//#endregion
//#region src/components/MarqueeSection.vue
var _sfc_main$16 = {
	__name: "MarqueeSection",
	__ssrInlineRender: true,
	props: {
		images: {
			type: Array,
			default: () => []
		},
		duration: {
			type: Number,
			default: 35
		},
		gap: {
			type: Number,
			default: 64
		},
		itemWidth: {
			type: Number,
			default: 120
		},
		itemHeight: {
			type: Number,
			default: 50
		},
		altPrefix: {
			type: String,
			default: "Cliente"
		},
		repeat: {
			type: Number,
			default: 2
		},
		pauseOnHover: {
			type: Boolean,
			default: true
		},
		/** Si es false, la marquesina se anima incluso con prefers-reduced-motion */
		respectReducedMotion: {
			type: Boolean,
			default: true
		}
	},
	setup(__props) {
		const props = __props;
		const items = computed(() => props.images.map((item, i) => {
			const isObj = item && typeof item === "object";
			const raw = isObj ? item.src : item;
			const alt = isObj && item.alt || `${props.altPrefix} ${i + 1}`;
			return {
				src: raw ? IMG(`/logos/${raw}`) : "",
				alt
			};
		}));
		const loop = computed(() => {
			const out = [];
			for (let r = 0; r < props.repeat; r++) for (let i = 0; i < items.value.length; i++) out.push({
				...items.value[i],
				_copy: r > 0,
				_key: `${r}-${i}`
			});
			return out;
		});
		const rootStyle = computed(() => ({
			"--marquee-gap": `${props.gap}px`,
			"--marquee-item-w": `${props.itemWidth}px`,
			"--marquee-item-h": `${props.itemHeight}px`,
			"--marquee-duration": `${props.duration}s`
		}));
		return (_ctx, _push, _parent, _attrs) => {
			if (items.value.length) {
				_push(`<div${ssrRenderAttrs(mergeProps({
					class: "marquee-section",
					style: rootStyle.value
				}, _attrs))} data-v-cc2ffb90><div class="marquee-title" data-v-cc2ffb90>Ellos ha depositado su confianza en nosotros</div><div class="${ssrRenderClass([{ "is-accessible": "" }, "marquee"])}" role="region" aria-label="Logos de clientes" data-v-cc2ffb90><div class="marquee-track" data-v-cc2ffb90><!--[-->`);
				ssrRenderList(loop.value, (item) => {
					_push(`<div class="marquee-item"${ssrRenderAttr("aria-hidden", item._copy ? "true" : void 0)} data-v-cc2ffb90><img${ssrRenderAttr("src", item.src)}${ssrRenderAttr("alt", item.alt)} loading="lazy" draggable="false" data-v-cc2ffb90></div>`);
				});
				_push(`<!--]--></div></div></div>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup$16 = _sfc_main$16.setup;
_sfc_main$16.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/MarqueeSection.vue");
	return _sfc_setup$16 ? _sfc_setup$16(props, ctx) : void 0;
};
var MarqueeSection_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$16, [["__scopeId", "data-v-cc2ffb90"]]);
//#endregion
//#region src/components/HeroCinematic.vue
var _sfc_main$15 = {
	__name: "HeroCinematic",
	__ssrInlineRender: true,
	props: {
		delay: String,
		introOn: Boolean
	},
	setup(__props) {
		const props = __props;
		const images = computed(() => {
			return FRONT_IMAGES[Math.floor(Math.random() * FRONT_IMAGES.length)];
		});
		computed(() => t.value.steps.map((x, i) => ({
			n: "0" + (i + 1),
			k: x[0],
			v: x[1]
		})));
		const kbDelay = computed(() => props.introOn ? "2.4s" : "0s");
		return (_ctx, _push, _parent, _attrs) => {
			const _directive_parallax = resolveDirective("parallax");
			_push(`<header${ssrRenderAttrs(mergeProps({
				id: "top",
				"data-screen-label": "Hero A",
				class: "hero-a"
			}, _attrs))} data-v-dbc74da2><div${ssrRenderAttrs(mergeProps({ class: "hero-a-bg" }, ssrGetDirectiveProps(_ctx, _directive_parallax, .25)))} data-v-dbc74da2><img${ssrRenderAttr("src", unref(IMG)(`front/${images.value}`))} alt="" class="hero-a-img" style="${ssrRenderStyle({ animationDelay: kbDelay.value })}" data-v-dbc74da2></div><div class="hero-a-overlay" data-v-dbc74da2></div><div class="hero-a-content" style="${ssrRenderStyle({ animationDelay: __props.delay })}" data-v-dbc74da2><div class="eyebrow" data-v-dbc74da2>${ssrInterpolate(unref(t).hero.eyebrow)}</div><h1 class="hero-a-title" data-v-dbc74da2>${ssrInterpolate(unref(t).hero.h1a)} <em style="${ssrRenderStyle({
				"color": "#cdd2c0",
				"text-shadow": "0 0 2px #4d493f"
			})}" data-v-dbc74da2>${ssrInterpolate(unref(t).hero.h1b)}</em></h1><div class="hero-a-row" data-v-dbc74da2><p class="hero-a-sub" data-v-dbc74da2>${ssrInterpolate(unref(t).hero.sub)}</p></div></div></header>`);
		};
	}
};
var _sfc_setup$15 = _sfc_main$15.setup;
_sfc_main$15.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/HeroCinematic.vue");
	return _sfc_setup$15 ? _sfc_setup$15(props, ctx) : void 0;
};
var HeroCinematic_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$15, [["__scopeId", "data-v-dbc74da2"]]);
//#endregion
//#region src/components/HeroEditorial.vue
var _sfc_main$14 = {
	__name: "HeroEditorial",
	__ssrInlineRender: true,
	props: { delay: String },
	setup(__props) {
		const steps = computed(() => t.value.steps.map((x, i) => ({
			n: "0" + (i + 1),
			k: x[0],
			v: x[1]
		})));
		let timer;
		onMounted(() => {
			timer = setInterval(() => {
				store.heroI = (store.heroI + 1) % HERO_B.length;
			}, 5200);
		});
		onUnmounted(() => clearInterval(timer));
		const slides = computed(() => HERO_B.map((x, i) => ({
			src: IMG(x[0]),
			op: i === store.heroI ? 1 : 0,
			sc: i === store.heroI ? 1 : 1.08,
			bar: i === store.heroI ? "#f3f0e9" : "rgba(243,240,233,.35)",
			go: () => store.heroI = i
		})));
		const caption = computed(() => HERO_B[store.heroI][1]);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<header${ssrRenderAttrs(mergeProps({
				id: "top",
				"data-screen-label": "Hero B",
				class: "hero-b"
			}, _attrs))} data-v-d2eb9f6a><div class="hero-b-left" data-v-d2eb9f6a><div class="hero-b-top" style="${ssrRenderStyle({ animationDelay: __props.delay })}" data-v-d2eb9f6a><div class="eyebrow" data-v-d2eb9f6a>${ssrInterpolate(unref(t).hero.eyebrow)}</div><h1 class="hero-b-title" data-v-d2eb9f6a>${ssrInterpolate(unref(t).hero.h1a)} <em style="${ssrRenderStyle({ "color": "#cdd2c0" })}" data-v-d2eb9f6a>${ssrInterpolate(unref(t).hero.h1b)}</em></h1><p class="hero-b-sub" data-v-d2eb9f6a>${ssrInterpolate(unref(t).hero.sub)}</p><div style="${ssrRenderStyle({
				"display": "flex",
				"gap": "12px",
				"flex-wrap": "wrap"
			})}" data-v-d2eb9f6a><a href="#configurador" class="btn-light" data-v-d2eb9f6a>${ssrInterpolate(unref(t).hero.cta1)}</a><a href="#cotizar" class="btn-outline" data-v-d2eb9f6a>${ssrInterpolate(unref(t).hero.cta2)}</a></div></div><div class="hero-b-steps" data-v-d2eb9f6a><!--[-->`);
			ssrRenderList(steps.value, (s) => {
				_push(`<div class="hero-b-step" data-v-d2eb9f6a><span class="hero-b-num" data-v-d2eb9f6a>${ssrInterpolate(s.n)}</span><span class="hero-b-k" data-v-d2eb9f6a>${ssrInterpolate(s.k)}</span><span class="hero-b-v" data-v-d2eb9f6a>${ssrInterpolate(s.v)}</span></div>`);
			});
			_push(`<!--]--></div></div><div class="hero-b-right" data-v-d2eb9f6a><!--[-->`);
			ssrRenderList(slides.value, (s, i) => {
				_push(`<img${ssrRenderAttr("src", s.src)} alt="" class="hero-b-img" style="${ssrRenderStyle({
					opacity: s.op,
					transform: `scale(${s.sc})`
				})}" data-v-d2eb9f6a>`);
			});
			_push(`<!--]--><div class="hero-b-cap-row" data-v-d2eb9f6a><span class="hero-b-cap" data-v-d2eb9f6a>${ssrInterpolate(caption.value)}</span><div style="${ssrRenderStyle({
				"display": "flex",
				"gap": "6px"
			})}" data-v-d2eb9f6a><!--[-->`);
			ssrRenderList(slides.value, (s, i) => {
				_push(`<button aria-label="slide" class="hero-b-bar" style="${ssrRenderStyle({ background: s.bar })}" data-v-d2eb9f6a></button>`);
			});
			_push(`<!--]--></div></div></div></header>`);
		};
	}
};
var _sfc_setup$14 = _sfc_main$14.setup;
_sfc_main$14.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/HeroEditorial.vue");
	return _sfc_setup$14 ? _sfc_setup$14(props, ctx) : void 0;
};
//#endregion
//#region src/img/r02-equipo.png
var r02_equipo_default = "/assets/r02-equipo-B8-Vv1Ds.png";
//#endregion
//#region src/components/EstudioSection.vue
var _sfc_main$13 = {
	__name: "EstudioSection",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _directive_parallax = resolveDirective("parallax");
			const _directive_reveal = resolveDirective("reveal");
			let _temp0;
			_push(`<section${ssrRenderAttrs(mergeProps({
				id: "estudio",
				"data-screen-label": "Estudio",
				class: "sec"
			}, _attrs))} data-v-d075b7ea><div${ssrRenderAttrs(mergeProps({ class: "wrap" }, ssrGetDirectiveProps(_ctx, _directive_reveal)))} data-v-d075b7ea><div class="col-text" data-v-d075b7ea><div class="eyebrow" data-v-d075b7ea>${ssrInterpolate(unref(t).estudio.eyebrow)}</div><h2 class="title" data-v-d075b7ea>${ssrInterpolate(unref(t).estudio.title)}</h2><p class="p" data-v-d075b7ea>${ssrInterpolate(unref(t).estudio.p1)}</p><p class="p" data-v-d075b7ea>${ssrInterpolate(unref(t).estudio.p2)}</p></div><div class="photo" data-v-d075b7ea><img${ssrRenderAttrs(_temp0 = mergeProps({
				src: r02_equipo_default,
				alt: "Equipo Inhabi en obra"
			}, ssrGetDirectiveProps(_ctx, _directive_parallax, -.08)))} data-v-d075b7ea>${"textContent" in _temp0 ? ssrInterpolate(_temp0.textContent) : _temp0.innerHTML ?? ""}</div></div></section>`);
		};
	}
};
var _sfc_setup$13 = _sfc_main$13.setup;
_sfc_main$13.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/EstudioSection.vue");
	return _sfc_setup$13 ? _sfc_setup$13(props, ctx) : void 0;
};
var EstudioSection_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$13, [["__scopeId", "data-v-d075b7ea"]]);
//#endregion
//#region src/components/HeroCard.vue
var _sfc_main$12 = {
	__name: "HeroCard",
	__ssrInlineRender: true,
	props: {
		image: {
			type: String,
			required: true
		},
		title: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		tag: {
			type: String,
			default: ""
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<article${ssrRenderAttrs(mergeProps({ class: "inhabi-card" }, _attrs))} data-v-66b62e51><div class="inhabi-card__media" data-v-66b62e51><img${ssrRenderAttr("src", unref(IMG)(__props.image))}${ssrRenderAttr("alt", __props.title)} loading="lazy" data-v-66b62e51></div>`);
			if (__props.tag) _push(`<span class="inhabi-card__tag" data-v-66b62e51>${ssrInterpolate(__props.tag)}</span>`);
			else _push(`<!---->`);
			_push(`<div class="inhabi-card__content" data-v-66b62e51><h3 class="inhabi-card__title" data-v-66b62e51>${ssrInterpolate(__props.title)}</h3><p class="inhabi-card__desc" data-v-66b62e51>${ssrInterpolate(__props.description)}</p></div></article>`);
		};
	}
};
var _sfc_setup$12 = _sfc_main$12.setup;
_sfc_main$12.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/HeroCard.vue");
	return _sfc_setup$12 ? _sfc_setup$12(props, ctx) : void 0;
};
var HeroCard_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$12, [["__scopeId", "data-v-66b62e51"]]);
//#endregion
//#region src/components/ProyectosSection.vue
var _sfc_main$11 = {
	__name: "ProyectosSection",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_router_link = resolveComponent("router-link");
			_push(`<section${ssrRenderAttrs(mergeProps({
				id: "proyectos",
				class: "sec"
			}, _attrs))} data-v-a589f6a0><div class="container" data-v-a589f6a0><div class="head" data-v-a589f6a0><p class="eyebrow" data-v-a589f6a0>${ssrInterpolate(unref(t).nav.proyectos)}</p><h2 class="title" data-v-a589f6a0>${ssrInterpolate(unref(t).proy.eyebrow)}</h2></div><div class="grid-cuadrado mt-48" data-v-a589f6a0><!--[-->`);
			ssrRenderList(unref(currentTipo), (p, index) => {
				_push(ssrRenderComponent(_component_router_link, {
					key: index,
					to: `/proyectos/${index}`,
					class: "project-link-wrapper"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(ssrRenderComponent(HeroCard_default, {
							image: p.id,
							title: p.label,
							description: p.description
						}, null, _parent, _scopeId));
						else return [createVNode(HeroCard_default, {
							image: p.id,
							title: p.label,
							description: p.description
						}, null, 8, [
							"image",
							"title",
							"description"
						])];
					}),
					_: 2
				}, _parent));
			});
			_push(`<!--]--></div></div></section>`);
		};
	}
};
var _sfc_setup$11 = _sfc_main$11.setup;
_sfc_main$11.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ProyectosSection.vue");
	return _sfc_setup$11 ? _sfc_setup$11(props, ctx) : void 0;
};
var ProyectosSection_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$11, [["__scopeId", "data-v-a589f6a0"]]);
//#endregion
//#region src/components/ServiciosSection.vue
var _sfc_main$10 = {
	__name: "ServiciosSection",
	__ssrInlineRender: true,
	setup(__props) {
		const serviciosList = computed(() => {
			return currentServicios.value;
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				id: "servicios",
				class: "sec"
			}, _attrs))} data-v-88ded26a><div class="wrap" data-v-88ded26a><header class="head" data-rv data-v-88ded26a><div class="head-left" data-v-88ded26a><div class="eyebrow" data-v-88ded26a>${ssrInterpolate(unref(t).servicios.eyebrow)}</div><h2 class="title" data-v-88ded26a>${ssrInterpolate(unref(t).servicios.title)}</h2></div></header><div class="servicios__grid" data-v-88ded26a><!--[-->`);
			ssrRenderList(serviciosList.value, (s) => {
				_push(`<article class="card servicio-card"${ssrRenderAttr("id", s.id)} data-v-88ded26a><div class="card__media servicio-card__media" data-v-88ded26a><img${ssrRenderAttr("src", unref(IMG)(`/servicios/${s.img}`))}${ssrRenderAttr("alt", s.title)} loading="lazy" data-v-88ded26a><span class="servicio-card__num" data-v-88ded26a>${ssrInterpolate(s.n)}</span></div><div class="card__body servicio-card__body" data-v-88ded26a><div class="servicio-card__head" data-v-88ded26a><h3 class="card__title" data-v-88ded26a>${ssrInterpolate(s.title)}</h3></div><span class="card__kw" data-v-88ded26a>${ssrInterpolate(s.kw)}</span><p class="card__desc" data-v-88ded26a>${ssrInterpolate(s.d)}</p><ul class="servicio-card__list" data-v-88ded26a><!--[-->`);
				ssrRenderList(s.list, (item) => {
					_push(`<li data-v-88ded26a><span class="servicio-card__dot" aria-hidden="true" data-v-88ded26a></span> ${ssrInterpolate(item)}</li>`);
				});
				_push(`<!--]--></ul></div></article>`);
			});
			_push(`<!--]--></div></div></section>`);
		};
	}
};
var _sfc_setup$10 = _sfc_main$10.setup;
_sfc_main$10.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ServiciosSection.vue");
	return _sfc_setup$10 ? _sfc_setup$10(props, ctx) : void 0;
};
var ServiciosSection_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$10, [["__scopeId", "data-v-88ded26a"]]);
//#endregion
//#region src/img/r10-57.jpg
var r10_57_default = "/assets/r10-57-qtBo0Nxd.jpg";
//#endregion
//#region src/components/AppFooter.vue
var _sfc_main$9 = {
	__name: "AppFooter",
	__ssrInlineRender: true,
	setup(__props) {
		const waHello = computed(() => `https://wa.me/${WA}?text=${encodeURIComponent(t.value.hola)}`);
		return (_ctx, _push, _parent, _attrs) => {
			const _directive_parallax = resolveDirective("parallax");
			let _temp0;
			_push(`<footer${ssrRenderAttrs(mergeProps({
				"data-screen-label": "Contacto",
				class: "footer"
			}, _attrs))} data-v-8cbf9e9d><img${ssrRenderAttrs(_temp0 = mergeProps({
				src: r10_57_default,
				alt: "",
				class: "bg"
			}, ssrGetDirectiveProps(_ctx, _directive_parallax, .12)))} data-v-8cbf9e9d>${"textContent" in _temp0 ? ssrInterpolate(_temp0.textContent) : _temp0.innerHTML ?? ""}<div class="wrap" data-v-8cbf9e9d><a${ssrRenderAttr("href", waHello.value)} target="_blank" rel="noopener" class="hero-link" data-v-8cbf9e9d><span class="eyebrow" data-v-8cbf9e9d>${ssrInterpolate(unref(t).foot.eyebrow)}</span><span class="big" data-v-8cbf9e9d> Let’s work <em style="${ssrRenderStyle({ "color": "#cdd2c0" })}" data-v-8cbf9e9d>together</em></span></a><div class="info" data-v-8cbf9e9d><div class="info-col" data-v-8cbf9e9d>`);
			_push(ssrRenderComponent(_sfc_main$19, {
				class: "logo",
				icon: "",
				text: ""
			}, null, _parent));
			_push(`<span style="${ssrRenderStyle({ "color": "#a8a597" })}" data-v-8cbf9e9d>INHABI S.A.S. · Bogotá – Colombia</span></div><div class="info-col" data-v-8cbf9e9d><span class="tag" data-v-8cbf9e9d>WhatsApp</span><a${ssrRenderAttr("href", waHello.value)} target="_blank" rel="noopener" data-v-8cbf9e9d>+57 322 727 6453</a></div><div class="info-col" data-v-8cbf9e9d><span class="tag" data-v-8cbf9e9d>Email</span><a href="mailto:Inhabi.arquitectura@gmail.com" data-v-8cbf9e9d>Inhabi.arquitectura@gmail.com</a></div><div class="info-col" data-v-8cbf9e9d><span class="tag" data-v-8cbf9e9d>Instagram</span><a href="https://instagram.com/inhabi.co" target="_blank" rel="noopener" data-v-8cbf9e9d>@inhabi.co</a></div></div><div class="bottom" data-v-8cbf9e9d><span data-v-8cbf9e9d>© 2026 Inhabi.co</span><span data-v-8cbf9e9d>${ssrInterpolate(unref(t).foot.tag)}</span></div></div></footer>`);
		};
	}
};
var _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/AppFooter.vue");
	return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
var AppFooter_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$9, [["__scopeId", "data-v-8cbf9e9d"]]);
//#endregion
//#region src/data/dataSeo.js
var seo = {
	title: "Inhabi | Arquitectura, interiorismo y remodelación en Bogotá",
	meta: [
		{
			name: "description",
			content: "Diseñamos y ejecutamos proyectos de arquitectura, interiorismo y remodelación en Bogotá. Soluciones integrales, diseño personalizado y ejecución técnica."
		},
		{
			name: "robots",
			content: "index, follow"
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			property: "og:title",
			content: "Inhabi | Arquitectura e interiorismo"
		},
		{
			property: "og:description",
			content: "Transformamos espacios con arquitectura, diseño interior y remodelación integral."
		},
		{
			property: "og:url",
			content: siteUrl
		},
		{
			property: "og:image",
			content: `${siteUrl}inhabi-social.jpg`
		},
		{
			property: "og:image:secure_url",
			content: `${siteUrl}inhabi-social.jpg`
		},
		{
			property: "og:image:type",
			content: "image/jpeg"
		},
		{
			property: "og:image:width",
			content: "1200"
		},
		{
			property: "og:image:height",
			content: "630"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "twitter:title",
			content: "Inhabi | Arquitectura e interiorismo"
		},
		{
			name: "twitter:description",
			content: "Transformamos espacios con arquitectura, diseño interior y remodelación integral."
		},
		{
			name: "twitter:image",
			content: `${siteUrl}inhabi-social.jpg`
		}
	],
	link: [{
		rel: "canonical",
		href: siteUrl
	}],
	script: [{
		type: "application/ld+json",
		innerHTML: JSON.stringify({
			"@context": "https://schema.org",
			"@type": "GeneralContractor",
			name: "Inhabi",
			url: siteUrl,
			image: `${siteUrl}inhabi-social.jpg`,
			description: "Arquitectura, interiorismo y remodelación integral en Bogotá, Colombia.",
			address: {
				"@type": "PostalAddress",
				addressLocality: "Bogotá",
				addressRegion: "Bogotá D.C.",
				addressCountry: "CO"
			},
			areaServed: {
				"@type": "City",
				name: "Bogotá"
			}
		})
	}]
};
//#endregion
//#region src/views/HomeView.vue
var _sfc_main$8 = {
	__name: "HomeView",
	__ssrInlineRender: true,
	setup(__props) {
		const wantIntro = true;
		const showIntro = ref(wantIntro);
		const introOn = computed(() => wantIntro);
		const heroDelay = computed(() => showIntro.value ? "2.65s" : "0s");
		const scrolled = ref(false);
		const onScroll = () => {
			scrolled.value = window.scrollY > 60;
		};
		onMounted(() => {
			window.addEventListener("scroll", onScroll, { passive: true });
			onScroll();
		});
		onUnmounted(() => window.removeEventListener("scroll", onScroll));
		const waHello = computed(() => `https://wa.me/${WA}?text=${encodeURIComponent(T[store.lang].hola)}`);
		useHead(seo);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ style: {
				"background": "#12110e",
				"color": "#f3f0e9",
				"min-height": "100vh",
				"overflow-x": "clip"
			} }, _attrs))}>`);
			if (showIntro.value) _push(ssrRenderComponent(IntroLoader_default, { onDone: ($event) => showIntro.value = false }, null, _parent));
			else _push(`<!---->`);
			_push(ssrRenderComponent(AppNav_default, { scrolled: scrolled.value }, null, _parent));
			_push(ssrRenderComponent(HeroCinematic_default, {
				delay: heroDelay.value,
				"intro-on": introOn.value
			}, null, _parent));
			_push(ssrRenderComponent(MarqueeSection_default, {
				images: unref(LOGOS),
				duration: 300,
				repeat: 10,
				gap: 16
			}, null, _parent));
			_push(ssrRenderComponent(ProyectosSection_default, null, null, _parent));
			_push(ssrRenderComponent(ServiciosSection_default, null, null, _parent));
			_push(ssrRenderComponent(EstudioSection_default, null, null, _parent));
			_push(ssrRenderComponent(AppFooter_default, null, null, _parent));
			_push(`<a${ssrRenderAttr("href", waHello.value)} target="_blank" rel="noopener" aria-label="WhatsApp" class="wa-float">WhatsApp</a></div>`);
		};
	}
};
var _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/HomeView.vue");
	return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
//#endregion
//#region src/components/CotizadorSection.vue
var _sfc_main$7 = {
	__name: "CotizadorSection",
	__ssrInlineRender: true,
	setup(__props) {
		const step = ref(1);
		const q = computed(() => store.q);
		var as = [];
		const spaceLabels = computed(() => t.value.cot.esp);
		console.log(spaceLabels.value);
		const spaceCounts = ref([
			1,
			2,
			1,
			1,
			1,
			0
		]);
		const espLabelsSelected = computed(() => {
			const selected = [];
			spaceCounts.value.forEach((count, i) => {
				if (count > 0) selected.push(`${count} ${spaceLabels.value[i]}`);
			});
			return selected.join(", ") || "Ninguno";
		});
		const comboOpts = computed(() => COMBOS.map((c) => {
			const active = c.id === store.combo;
			return {
				n: c.n,
				name: c[store.lang].name,
				style: active ? {
					background: "#12110e",
					color: "#f3f0e9",
					borderColor: "#12110e"
				} : {
					background: "transparent",
					color: "#12110e",
					borderColor: "rgba(18,17,14,.25)"
				},
				pick: () => store.combo = c.id
			};
		}));
		const styleOpts = computed(() => STYLES.map((x) => {
			const active = x.id === store.style;
			return {
				name: x[store.lang].name,
				img: IMG(x.mb),
				style: active ? {
					background: "#12110e",
					color: "#f3f0e9",
					borderColor: "#12110e"
				} : {
					background: "transparent",
					color: "#12110e",
					borderColor: "rgba(18,17,14,.25)"
				},
				pick: () => store.style = x.id
			};
		}));
		const roomOpts = computed(() => currentImgs.value.map((r, i) => ({
			label: t.value.config.rooms[i],
			active: i === store.room,
			pick: () => store.room = i
		})));
		console.log(roomOpts.value);
		const currentRoomImg = computed(() => IMG(currentImgs.value[store.room]));
		const summary = computed(() => [
			{
				k: "Área",
				v: q.value.m2 + " m²"
			},
			{
				k: "Espacios",
				v: espLabelsSelected.value
			},
			{
				k: "Combo",
				v: currentCombo.value[store.lang].name
			},
			{
				k: "Estilo",
				v: currentStyle.value[store.lang].name
			}
		]);
		const summarySpaces = computed(() => {
			return espLabelsSelected.value.split(", ");
		});
		const quoteMsg = computed(() => {
			return `Hola Inhabi, estoy interesad@ en remodelar mi apartamento:

*INFORMACIÓN DEL APARTAMENTO*
_Área:_ *${q.value.m2}*m²

_Espacios:_
${espLabelsSelected.value.split(", ").map((s) => {
				as = s.split(" ");
				return `- *${as[0]}* ${as[1]}`;
			}).join("\n")}

*PAQUETE*
_Combo:_ *${currentCombo.value[store.lang].name}*
_Estilo:_ *${currentStyle.value[store.lang].name}*

*INFORMACIÓN DEL CLIENTE*
_Nombre:_ ${q.value.nombre || "-"}
_Apellido:_ ${q.value.apellido || "-"}
_Teléfono:_ ${q.value.tel || "-"}
_Email:_ ${q.value.email || "-"}
_Ciudad:_ ${q.value.ciudad || "-"}
_Dirección:_ ${q.value.direccion || "-"}`;
		});
		const waQuote = computed(() => `https://wa.me/${WA}?text=${encodeURIComponent(quoteMsg.value)}`);
		return (_ctx, _push, _parent, _attrs) => {
			const _directive_reveal = resolveDirective("reveal");
			_push(`<section${ssrRenderAttrs(mergeProps({
				id: "cotizador-pasos",
				class: "sec"
			}, _attrs))} data-v-e3edb116><div class="wrap" data-v-e3edb116><div class="layout" data-v-e3edb116><div class="form-col" data-v-e3edb116><div${ssrRenderAttrs(mergeProps({ class: "head" }, ssrGetDirectiveProps(_ctx, _directive_reveal)))} data-v-e3edb116><div class="head-left" data-v-e3edb116><h2 class="title" data-v-e3edb116>`);
			if (step.value === 1) _push(`<span data-v-e3edb116>${ssrInterpolate(unref(t).cot.espL)}</span>`);
			else _push(`<!---->`);
			if (step.value === 2) _push(`<span data-v-e3edb116>${ssrInterpolate(unref(t).cot.disL)}</span>`);
			else _push(`<!---->`);
			if (step.value === 3) _push(`<span data-v-e3edb116>${ssrInterpolate(unref(t).cot.datL)}</span>`);
			else _push(`<!---->`);
			_push(`</h2></div></div>`);
			if (step.value === 1) {
				_push(`<div class="step-content anim-fade" data-v-e3edb116><div class="group" data-v-e3edb116><div class="slider-head" data-v-e3edb116><span class="label" data-v-e3edb116>${ssrInterpolate(unref(t).cot.m2L)}</span><span class="slider-value" data-v-e3edb116>${ssrInterpolate(q.value.m2)} m²</span></div><input type="range" min="10" max="70" step="1"${ssrRenderAttr("value", q.value.m2)} class="range" data-v-e3edb116></div><div class="group mt-32" data-v-e3edb116><span class="label" data-v-e3edb116>${ssrInterpolate(unref(t).cot.espL)}</span><div class="counter-grid" data-v-e3edb116><!--[-->`);
				ssrRenderList(spaceLabels.value, (label, i) => {
					_push(`<div class="${ssrRenderClass([{ "is-active": spaceCounts.value[i] > 0 }, "counter-chip"])}" data-v-e3edb116><span class="counter-name" data-v-e3edb116>${ssrInterpolate(label)}</span><div class="counter-ctrls" data-v-e3edb116><button data-v-e3edb116>-</button><span data-v-e3edb116>${ssrInterpolate(spaceCounts.value[i])}</span><button data-v-e3edb116>+</button></div></div>`);
				});
				_push(`<!--]--></div></div></div>`);
			} else _push(`<!---->`);
			if (step.value === 2) {
				_push(`<div class="step-content anim-fade" data-v-e3edb116><div class="group" data-v-e3edb116><span class="label" data-v-e3edb116>01 · Selección de Combo</span><div class="stack" data-v-e3edb116><!--[-->`);
				ssrRenderList(comboOpts.value, (o) => {
					_push(`<button class="combo-btn" style="${ssrRenderStyle(o.style)}" data-v-e3edb116><span data-v-e3edb116>${ssrInterpolate(o.name)}</span><span class="combo-num" data-v-e3edb116>${ssrInterpolate(o.n)}</span></button>`);
				});
				_push(`<!--]--></div></div><div class="group mt-32" data-v-e3edb116><span class="label" data-v-e3edb116>02 · Estilo de diseño</span><div class="style-grid" data-v-e3edb116><!--[-->`);
				ssrRenderList(styleOpts.value, (o) => {
					_push(`<button class="style-btn" style="${ssrRenderStyle(o.style)}" data-v-e3edb116><div class="style-img" data-v-e3edb116><img${ssrRenderAttr("src", o.img)} alt="" data-v-e3edb116></div><span class="style-name" data-v-e3edb116>${ssrInterpolate(o.name)}</span></button>`);
				});
				_push(`<!--]--></div></div></div>`);
			} else _push(`<!---->`);
			if (step.value === 3) _push(`<div class="step-content anim-fade" data-v-e3edb116><div class="inputs-grid" data-v-e3edb116><label class="field" data-v-e3edb116><span class="label" data-v-e3edb116>Nombres</span><input${ssrRenderAttr("value", q.value.nombre)} class="input" placeholder="Tu nombre" data-v-e3edb116></label><label class="field" data-v-e3edb116><span class="label" data-v-e3edb116>Apellidos</span><input${ssrRenderAttr("value", q.value.apellido)} class="input" placeholder="Tu apellido" data-v-e3edb116></label><label class="field" data-v-e3edb116><span class="label" data-v-e3edb116>Teléfono</span><input${ssrRenderAttr("value", q.value.tel)} class="input" placeholder="Tu teléfono" data-v-e3edb116></label><label class="field" data-v-e3edb116><span class="label" data-v-e3edb116>Correo electrónico</span><input${ssrRenderAttr("value", q.value.email)} type="email" class="input" placeholder="Tu correo" data-v-e3edb116></label><label class="field" data-v-e3edb116><span class="label" data-v-e3edb116>Ciudad</span><input${ssrRenderAttr("value", q.value.ciudad)} class="input" placeholder="Ej. Bogotá" data-v-e3edb116></label><label class="field" style="${ssrRenderStyle({ "grid-column": "1 / -1" })}" data-v-e3edb116><span class="label" data-v-e3edb116>Dirección del proyecto</span><input${ssrRenderAttr("value", q.value.direccion)} class="input" placeholder="Dirección del inmueble" data-v-e3edb116></label></div></div>`);
			else _push(`<!---->`);
			_push(`</div><aside class="side" data-v-e3edb116><div class="stepper-wrap" data-v-e3edb116><div class="${ssrRenderClass([{ "is-active": step.value >= 1 }, "step-circle"])}" data-v-e3edb116>1</div><div class="${ssrRenderClass([{ "is-active": step.value >= 2 }, "step-line"])}" data-v-e3edb116></div><div class="${ssrRenderClass([{ "is-active": step.value >= 2 }, "step-circle"])}" data-v-e3edb116>2</div><div class="${ssrRenderClass([{ "is-active": step.value >= 3 }, "step-line"])}" data-v-e3edb116></div><div class="${ssrRenderClass([{ "is-active": step.value >= 3 }, "step-circle"])}" data-v-e3edb116>3</div></div><span class="label mt-8" data-v-e3edb116>Resumen de tu cotización</span><div class="room-viewer" data-v-e3edb116><div class="room-selector" data-v-e3edb116><!--[-->`);
			ssrRenderList(roomOpts.value, (r, i) => {
				_push(`<button class="${ssrRenderClass([{ "is-active": r.active }, "room-tab"])}" data-v-e3edb116>${ssrInterpolate(r.label)}</button>`);
			});
			_push(`<!--]--></div><div class="room-img" data-v-e3edb116><img${ssrRenderAttr("src", currentRoomImg.value)}${ssrRenderAttr("alt", roomOpts.value[unref(store).room].label)} class="anim-fade" data-v-e3edb116></div></div><div class="summary" data-v-e3edb116><!--[-->`);
			ssrRenderList(summary.value, (s, i) => {
				_push(`<div class="sum-row" data-v-e3edb116><span class="sum-k" data-v-e3edb116>${ssrInterpolate(s.k)}</span>`);
				if (s.k !== "Espacios") _push(`<span class="sum-v" data-v-e3edb116>${ssrInterpolate(s.v)}</span>`);
				else {
					_push(`<span class="sum-v" data-v-e3edb116><!--[-->`);
					ssrRenderList(summarySpaces.value, (space, i) => {
						_push(`<span class="sum-space" data-v-e3edb116>${ssrInterpolate(space)}</span>`);
					});
					_push(`<!--]--></span>`);
				}
				_push(`</div>`);
			});
			_push(`<!--]--></div><div class="actions" data-v-e3edb116>`);
			if (step.value < 3) _push(`<div class="step-nav" data-v-e3edb116><button class="btn-outline"${ssrIncludeBooleanAttr(step.value === 1) ? " disabled" : ""} data-v-e3edb116>Atrás</button><button class="btn-send" data-v-e3edb116>Siguiente</button></div>`);
			else _push(`<div class="step-nav-final" data-v-e3edb116><button class="btn-outline" data-v-e3edb116>Atrás</button><a${ssrRenderAttr("href", waQuote.value)} target="_blank" rel="noopener" class="btn-wa" data-v-e3edb116> Enviar a WhatsApp </a></div>`);
			_push(`</div></aside></div></div></section>`);
		};
	}
};
var _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/CotizadorSection.vue");
	return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
var CotizadorSection_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$7, [["__scopeId", "data-v-e3edb116"]]);
//#endregion
//#region src/views/CotizadorView.vue
var _sfc_main$6 = {
	__name: "CotizadorView",
	__ssrInlineRender: true,
	setup(__props) {
		useHead(seo);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_router_link = resolveComponent("router-link");
			_push(`<!--[--><nav class="nav" style="${ssrRenderStyle({
				"background": "rgba(18, 17, 14, 0.88)",
				"backdrop-filter": "blur(12px)"
			})}" data-v-227dae09>`);
			_push(ssrRenderComponent(_component_router_link, {
				to: "/",
				class: "brand",
				onClick: _ctx.closeMenu
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$19, {
						class: "brand-logo",
						icon: "",
						text: ""
					}, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$19, {
						class: "brand-logo",
						icon: "",
						text: ""
					})];
				}),
				_: 1
			}, _parent));
			_push(`<div class="nav-links" data-v-227dae09>`);
			_push(ssrRenderComponent(_component_router_link, {
				to: "/",
				class: "nav-cta",
				onClick: _ctx.closeMenu
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`${ssrInterpolate(unref(t).nav.inicio)}`);
					else return [createTextVNode(toDisplayString(unref(t).nav.inicio), 1)];
				}),
				_: 1
			}, _parent));
			_push(`</div></nav>`);
			_push(ssrRenderComponent(CotizadorSection_default, null, null, _parent));
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/CotizadorView.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
var CotizadorView_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$6, [["__scopeId", "data-v-227dae09"]]);
//#endregion
//#region src/components/system-design/CodeBlock.vue
var _sfc_main$5 = {
	__name: "CodeBlock",
	__ssrInlineRender: true,
	props: { code: {
		type: String,
		required: true
	} },
	setup(__props) {
		const props = __props;
		const copied = ref(false);
		const escapeHtml = (str) => str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
		const highlighted = computed(() => escapeHtml(props.code));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<pre${ssrRenderAttrs(mergeProps({ class: "code" }, _attrs))} data-v-a65b38a9><button class="${ssrRenderClass([{ "is-copied": copied.value }, "copy-btn"])}" data-v-a65b38a9>${ssrInterpolate(copied.value ? "Copiado" : "Copiar")}</button><code data-v-a65b38a9>${highlighted.value ?? ""}</code></pre>`);
		};
	}
};
var _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/system-design/CodeBlock.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var CodeBlock_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$5, [["__scopeId", "data-v-a65b38a9"]]);
//#endregion
//#region src/components/system-design/CompareSlider.vue
var imgA = "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80";
var imgB = "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80";
var _sfc_main$4 = {
	__name: "CompareSlider",
	__ssrInlineRender: true,
	setup(__props) {
		const root = ref(null);
		const pos = ref(50);
		ref(false);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				ref_key: "root",
				ref: root,
				class: "compare",
				style: {
					"aspect-ratio": "1318/942",
					"max-height": "420px"
				}
			}, _attrs))}><img${ssrRenderAttr("src", imgB)} alt=""><img${ssrRenderAttr("src", imgA)} alt="" style="${ssrRenderStyle({ clipPath: `inset(0 ${100 - pos.value}% 0 0)` })}"><div class="compare__handle" style="${ssrRenderStyle({ left: pos.value + "%" })}"><div class="compare__knob">‹ ›</div></div><span class="badge" style="${ssrRenderStyle({
				"position": "absolute",
				"left": "16px",
				"bottom": "16px"
			})}">Industrial</span><span class="badge badge--cream" style="${ssrRenderStyle({
				"position": "absolute",
				"right": "16px",
				"bottom": "16px"
			})}">Natural</span></div>`);
		};
	}
};
var _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/system-design/CompareSlider.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
//#endregion
//#region src/components/system-design/ColorSwatch.vue
var _sfc_main$3 = {
	__name: "ColorSwatch",
	__ssrInlineRender: true,
	props: {
		name: {
			type: String,
			required: true
		},
		hex: {
			type: String,
			required: true
		},
		token: {
			type: String,
			default: ""
		},
		/** Ej: '1px solid rgba(243,240,233,.1)' */
		borderBottom: {
			type: String,
			default: "none"
		}
	},
	setup(__props) {
		const isCopied = ref(false);
		/** Normaliza a #RRGGBB en mayúsculas (con # inicial) */
		const normalizeHex = (input) => {
			let h = String(input).trim();
			if (!h.startsWith("#")) h = "#" + h;
			if (/^#[0-9a-f]{3}$/i.test(h)) h = "#" + h.slice(1).split("").map((c) => c + c).join("");
			return h.toUpperCase();
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				class: ["swatch swatch--clickable", { "is-copied": isCopied.value }],
				role: "button",
				tabindex: "0",
				"aria-label": `Copiar ${__props.hex} al portapapeles`
			}, _attrs))} data-v-76ad7d5e><div class="swatch__color" style="${ssrRenderStyle({
				background: __props.hex,
				borderBottom: __props.borderBottom
			})}" data-v-76ad7d5e>`);
			if (isCopied.value) _push(`<span class="swatch__feedback" data-v-76ad7d5e><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-76ad7d5e><polyline points="20 6 9 17 4 12" data-v-76ad7d5e></polyline></svg> Copiado </span>`);
			else _push(`<!---->`);
			_push(`</div><div class="swatch__meta" data-v-76ad7d5e><p class="swatch__name" data-v-76ad7d5e>${ssrInterpolate(__props.name)}</p><p class="swatch__hex" data-v-76ad7d5e>${ssrInterpolate(normalizeHex(__props.hex))}</p><p class="swatch__token" data-v-76ad7d5e>${ssrInterpolate(__props.token)}</p></div></div>`);
		};
	}
};
var _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/system-design/ColorSwatch.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
//#endregion
//#region src/views/SystemDesignView.vue
var codeSpacing = `/* Espaciado */
--gutter:    clamp(20px, 4vw, 56px);
--section-y: clamp(72px, 10vw, 140px);
--max-w:     1400px;`;
var codeRadii = `--r-pill: 999px;  /* Botones, badges */
--r-sm:   4px;    /* Chips, badges cuadrados */
--r-md:   8px;    /* Tarjetas */
--r-lg:   16px;`;
var codeMotion = `--ease:    cubic-bezier(.2, .7, .2, 1);
--ease-io: cubic-bezier(.76, 0, .24, 1);
--t-fast:  .2s;   --t-base: .3s;   --t-slow: .4s;`;
var codeShadows = `--shadow-sm: 0 4px 12px rgba(0,0,0,.18);
--shadow-md: 0 10px 30px rgba(0,0,0,.28);
--shadow-lg: 0 20px 50px rgba(0,0,0,.35);`;
var codeTypography = `<p class="t-display">Habitar</p>
<p class="t-h1">Espacios que se <em>sienten</em>.</p>
<p class="t-h2">Tres formas de habitar</p>
<p class="t-lead">…</p>
<p class="t-eyebrow">Arquitectura e interiorismo</p>`;
var codeButtons = `<!-- Botones base -->
<button class="btn btn--primary">Diseña tu espacio</button>
<button class="btn btn--outline">Solicitar cotización</button>
<button class="btn btn--ghost">Ver más</button>
<button class="btn btn--sage">Agendar visita</button>

<!-- Tamaños -->
<button class="btn btn--sm btn--primary">Small</button>
<button class="btn btn--lg btn--primary">Large</button>

<!-- Tabs -->
<button class="btn-tab is-on">01 Natural</button>
<button class="btn-tab">02 Minimal</button>

<!-- Selector de idioma -->
<div class="lang-toggle">
  <button class="is-on">ES</button>
  <button>EN</button>
</div>`;
var codeBadges = `<span class="badge">01 · Combos</span>
<span class="badge badge--sage">Nuevo</span>
<span class="badge badge--cream">Integral · Natural</span>
<span class="badge badge--ghost">En obra</span>`;
var codeCards = `<!-- Tarjeta combo -->
<article class="card is-active">
  <div class="card__media" style="aspect-ratio:16/10">
    <img src="…" alt="">
  </div>
  <div class="card__body">
    <div class="card__head">
      <span class="card__title">Vital</span>
      <span class="card__kicker">02</span>
    </div>
    <span class="card__kw">Práctico · Estructurado</span>
    <p class="card__desc">Descripción…</p>
    <span class="card__cta">Ver en el configurador →</span>
  </div>
</article>`;
var codeForms = `<!-- Campo -->
<label class="field">
  <span class="field__label">Nombre</span>
  <input class="input" type="text" placeholder="Tu nombre">
</label>

<!-- Chip -->
<button class="chip is-on">
  <span class="chip__mark">✓</span> Cocina
</button>

<!-- Día -->
<button class="day is-on">
  <span class="day__wd">Mar</span>
  <span class="day__num">29</span>
  <span class="day__mo">Sep</span>
</button>`;
var codeNav = `<nav class="nav">
  <a href="#top">Inhabi</a>
  <div class="nav__links">
    <a href="#combos">Combos</a>
    <a href="#estilos">Estilos</a>
    <div class="lang-toggle">…</div>
    <a href="#agenda" class="btn btn--primary btn--sm">Agendar</a>
  </div>
</nav>

<!-- JS: añade .is-scrolled al superar 60px de scroll -->`;
var codeSection = `<section class="section section--dark">
  <div class="container">
    <header class="section-head">
      <div class="section-head__col">
        <p class="t-eyebrow">01 — Combos</p>
        <h2 class="t-h2">Tres tipos de remodelación</h2>
      </div>
      <p class="section-head__sub t-body">…</p>
    </header>
  </div>
</section>`;
var codeCompare = `<div class="compare">
  <img src="antes.jpg">
  <img src="despues.jpg" style="clip-path:inset(0 50% 0 0)">
  <div class="compare__handle" style="left:50%">
    <div class="compare__knob">‹ ›</div>
  </div>
</div>`;
var codeAnimations = `<div class="anim-up">…</div>

/* Keyframes disponibles */
@keyframes inFade  { from { opacity: 0 } to { opacity: 1 } }
@keyframes inUp    { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: none } }
@keyframes inLine  { from { transform: scaleX(0) } to { transform: scaleX(1) } }
@keyframes kb      { from { transform: scale(1.12) } to { transform: scale(1) } }

/* Respeta reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}`;
var codeFileStructure = `styles/
├── tokens.css        /* Variables :root — importar primero */
├── reset.css         /* Reset mínimo */
├── typography.css    /* .t-display, .t-h1, .t-body… */
├── buttons.css       /* .btn, .btn-tab, .lang-toggle */
├── cards.css         /* .card, .card-project, .opt, .opt-thumb */
├── forms.css         /* .field, .input, .chip, .day, .range */
├── navigation.css    /* .nav, .nav__links */
├── sections.css      /* .section, .container, .section-head */
├── components.css    /* .fab, .sticky-panel, .compare, .callout */
├── animations.css    /* @keyframes + .anim-* */
└── utilities.css     /* .flex, .gap-*, .mt-* */

main.css  /* importa todo en orden */`;
var codeAdoption = `<link rel="stylesheet" href="styles/main.css">

<!-- Sección clara: envuelve en .surface--light para que los componentes hereden -->
<section class="section section--light surface--light">
  <div class="container">
    <button class="btn btn--primary">Acción</button>
  </div>
</section>`;
var _sfc_main$2 = {
	__name: "SystemDesignView",
	__ssrInlineRender: true,
	setup(__props) {
		const navItems = [
			{
				id: "intro",
				num: "00",
				label: "Introducción"
			},
			{
				id: "tokens",
				num: "01",
				label: "Tokens"
			},
			{
				id: "colores",
				num: "02",
				label: "Colores"
			},
			{
				id: "tipografia",
				num: "03",
				label: "Tipografía"
			},
			{
				id: "botones",
				num: "04",
				label: "Botones"
			},
			{
				id: "badges",
				num: "05",
				label: "Badges"
			},
			{
				id: "tarjetas",
				num: "06",
				label: "Tarjetas"
			},
			{
				id: "formularios",
				num: "07",
				label: "Formularios"
			},
			{
				id: "navegacion",
				num: "08",
				label: "Navegación"
			},
			{
				id: "secciones",
				num: "09",
				label: "Secciones"
			},
			{
				id: "especiales",
				num: "10",
				label: "Especiales"
			},
			{
				id: "animaciones",
				num: "11",
				label: "Animaciones"
			},
			{
				id: "utilidades",
				num: "12",
				label: "Utilidades"
			}
		];
		const activeSection = ref("intro");
		const handleScroll = () => {
			const y = window.scrollY + 140;
			let current = navItems[0].id;
			for (const item of navItems) {
				const el = document.getElementById(item.id);
				if (el && el.offsetTop <= y) current = item.id;
			}
			activeSection.value = current;
		};
		onMounted(() => {
			window.addEventListener("scroll", handleScroll, { passive: true });
			handleScroll();
		});
		onUnmounted(() => {
			window.removeEventListener("scroll", handleScroll);
		});
		const brandColors = [
			{
				name: "Ink",
				hex: "#12110e",
				token: "--ink"
			},
			{
				name: "Ink Soft",
				hex: "#1b1a16",
				token: "--ink-soft"
			},
			{
				name: "Ink Hover",
				hex: "#2b2a24",
				token: "--ink-hover"
			},
			{
				name: "Cream",
				hex: "#f3f0e9",
				token: "--cream"
			},
			{
				name: "Cream Soft",
				hex: "#e6e1d6",
				token: "--cream-soft"
			},
			{
				name: "Sage",
				hex: "#cdd2c0",
				token: "--sage"
			}
		];
		const darkTextColors = [
			{
				name: "FG",
				hex: "#f3f0e9",
				token: "--fg"
			},
			{
				name: "FG Muted",
				hex: "#d8d4c8",
				token: "--fg-muted"
			},
			{
				name: "FG Soft",
				hex: "#b9b5a8",
				token: "--fg-soft"
			},
			{
				name: "FG Dim",
				hex: "#a8a597",
				token: "--fg-dim"
			},
			{
				name: "FG Ghost",
				hex: "#8f8c80",
				token: "--fg-ghost"
			}
		];
		const lightTextColors = [
			{
				name: "Ink FG",
				hex: "#12110e",
				token: "--ink-fg"
			},
			{
				name: "Ink Muted",
				hex: "#4d493f",
				token: "--ink-muted"
			},
			{
				name: "Ink Soft",
				hex: "#6b675c",
				token: "--ink-soft-fg"
			},
			{
				name: "Ink Accent",
				hex: "#6f7a5f",
				token: "--ink-accent"
			}
		];
		const borders = [
			{
				token: "--border-dark-1",
				value: "rgba(243,240,233,.12)",
				usage: "Divisores sutiles sobre oscuro"
			},
			{
				token: "--border-dark-2",
				value: "rgba(243,240,233,.20)",
				usage: "Bordes de tarjeta / meta"
			},
			{
				token: "--border-dark-3",
				value: "rgba(243,240,233,.35)",
				usage: "Botones tab, inputs"
			},
			{
				token: "--border-dark-4",
				value: "rgba(243,240,233,.50)",
				usage: "Botón outline, focus"
			},
			{
				token: "--border-light-1",
				value: "rgba(18,17,14,.15)",
				usage: "Divisores sobre claro"
			},
			{
				token: "--border-light-2",
				value: "rgba(18,17,14,.25)",
				usage: "Chips, inputs claro"
			},
			{
				token: "--border-light-3",
				value: "#12110e",
				usage: "Borde sólido principal"
			}
		];
		const utilities = [
			{
				cls: ".flex",
				effect: "display: flex"
			},
			{
				cls: ".flex-col",
				effect: "flex-direction: column"
			},
			{
				cls: ".gap-8 / .gap-12 / .gap-16 / .gap-24 / .gap-48",
				effect: "Espaciado entre hijos"
			},
			{
				cls: ".wrap",
				effect: "flex-wrap: wrap"
			},
			{
				cls: ".center",
				effect: "align-items: center"
			},
			{
				cls: ".between",
				effect: "justify-content: space-between"
			},
			{
				cls: ".baseline",
				effect: "align-items: baseline"
			},
			{
				cls: ".mt-24 / .mb-24 / .mt-48",
				effect: "Márgenes verticales"
			},
			{
				cls: ".hr",
				effect: "Divisor oscuro"
			},
			{
				cls: ".hr--light",
				effect: "Divisor claro"
			}
		];
		const sectionBackgrounds = [
			{
				cls: "ds-demo--dark",
				label: ".section--dark"
			},
			{
				cls: "ds-demo--dark2",
				label: ".section--dark2"
			},
			{
				cls: "ds-demo--light",
				label: ".section--light"
			},
			{
				cls: "ds-demo--light2",
				label: ".section--light2"
			}
		];
		const rangeValue = ref(120);
		const selectedDay = ref(29);
		const selectedTime = ref("10:30");
		const demoDays = [
			{
				wd: "Lun",
				num: 28,
				mo: "Sep"
			},
			{
				wd: "Mar",
				num: 29,
				mo: "Sep"
			},
			{
				wd: "Mié",
				num: 30,
				mo: "Sep"
			},
			{
				wd: "Jue",
				num: 1,
				mo: "Oct"
			},
			{
				wd: "Vie",
				num: 2,
				mo: "Oct"
			}
		];
		const demoTimes = [
			"9:00",
			"10:30",
			"12:00",
			"14:30",
			"16:00",
			"17:30"
		];
		const copiedToken = ref(null);
		useHead(seo);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "ds-layout" }, _attrs))} data-v-f90fdcd8><aside class="ds-sidebar" data-v-f90fdcd8><h1 data-v-f90fdcd8>Inhabi</h1><p class="ds-brand-sub" data-v-f90fdcd8>Design System v1.0</p><nav class="ds-nav" data-v-f90fdcd8><!--[-->`);
			ssrRenderList(navItems, (item) => {
				_push(`<a${ssrRenderAttr("href", `#${item.id}`)} class="${ssrRenderClass({ "is-active": activeSection.value === item.id })}" data-v-f90fdcd8><span data-v-f90fdcd8>${ssrInterpolate(item.num)}</span> ${ssrInterpolate(item.label)}</a>`);
			});
			_push(`<!--]--></nav></aside><main class="ds-main" data-v-f90fdcd8><header id="intro" class="ds-hero" data-v-f90fdcd8><p class="ds-section__eyebrow" data-v-f90fdcd8>00 · Introducción</p><h1 data-v-f90fdcd8>Design System<br data-v-f90fdcd8><em style="${ssrRenderStyle({ "color": "var(--sage)" })}" data-v-f90fdcd8>Inhabi</em></h1><p data-v-f90fdcd8> Sistema de diseño normalizado a partir del sitio original. Consolida colores, tipografía, botones, tarjetas, formularios y componentes reutilizables en tokens CSS y clases utilitarias. Todas las clases llevan el prefijo del sistema y funcionan tanto en superficies oscuras como claras. </p><div class="flex gap-12 wrap mt-48" data-v-f90fdcd8><span class="badge badge--sage" data-v-f90fdcd8>CSS Tokens</span><span class="badge badge--ghost" data-v-f90fdcd8>Vanilla CSS</span><span class="badge badge--ghost" data-v-f90fdcd8>Accesible (AA)</span><span class="badge badge--ghost" data-v-f90fdcd8>Motion reducido</span></div></header><section id="tokens" class="ds-section" data-v-f90fdcd8><p class="ds-section__eyebrow" data-v-f90fdcd8>01 · Fundación</p><h2 data-v-f90fdcd8>Tokens de diseño</h2><p data-v-f90fdcd8> Variables globales que alimentan todos los componentes. Cámbialas y todo el sistema se adapta automáticamente. </p><div class="ds-sub" data-v-f90fdcd8><h3 data-v-f90fdcd8>Espaciado fluido</h3><p data-v-f90fdcd8>Se adaptan al viewport con <code data-v-f90fdcd8>clamp()</code>, sin breakpoints duros.</p>`);
			_push(ssrRenderComponent(CodeBlock_default, { code: codeSpacing }, null, _parent));
			_push(`</div><div class="ds-sub" data-v-f90fdcd8><h3 data-v-f90fdcd8>Radios</h3>`);
			_push(ssrRenderComponent(CodeBlock_default, { code: codeRadii }, null, _parent));
			_push(`</div><div class="ds-sub" data-v-f90fdcd8><h3 data-v-f90fdcd8>Movimiento</h3>`);
			_push(ssrRenderComponent(CodeBlock_default, { code: codeMotion }, null, _parent));
			_push(`</div><div class="ds-sub" data-v-f90fdcd8><h3 data-v-f90fdcd8>Sombras</h3>`);
			_push(ssrRenderComponent(CodeBlock_default, { code: codeShadows }, null, _parent));
			_push(`</div></section><section id="colores" class="ds-section" data-v-f90fdcd8><p class="ds-section__eyebrow" data-v-f90fdcd8>02 · Fundación</p><h2 data-v-f90fdcd8>Paleta de colores</h2><p data-v-f90fdcd8> Dos superficies base (tinta y crema), un acento verde salvia y escalas de texto/borde derivadas. </p><div class="ds-sub" data-v-f90fdcd8><h3 data-v-f90fdcd8>Marca</h3><div class="swatches" data-v-f90fdcd8><!--[-->`);
			ssrRenderList(brandColors, (c) => {
				_push(`<div class="${ssrRenderClass([{ "is-copied": copiedToken.value === c.token }, "swatch"])}" role="button" tabindex="0"${ssrRenderAttr("aria-label", `Copiar ${c.hex}`)} data-v-f90fdcd8><div class="swatch__color" style="${ssrRenderStyle({
					background: c.hex,
					borderBottom: c.token === "--ink" ? "1px solid rgba(243,240,233,.1)" : "none"
				})}" data-v-f90fdcd8>`);
				if (copiedToken.value === c.token) _push(`<span class="swatch__feedback" data-v-f90fdcd8>✓ Copiado</span>`);
				else _push(`<!---->`);
				_push(`</div><div class="swatch__meta" data-v-f90fdcd8><p class="swatch__name" data-v-f90fdcd8>${ssrInterpolate(c.name)}</p><p class="swatch__hex" data-v-f90fdcd8>${ssrInterpolate(c.hex.toUpperCase())}</p><p class="swatch__token" data-v-f90fdcd8>${ssrInterpolate(c.token)}</p></div></div>`);
			});
			_push(`<!--]--></div></div><div class="ds-sub" data-v-f90fdcd8><h3 data-v-f90fdcd8>Texto sobre oscuro</h3><div class="swatches" data-v-f90fdcd8><!--[-->`);
			ssrRenderList(darkTextColors, (c) => {
				_push(`<div class="${ssrRenderClass([{ "is-copied": copiedToken.value === c.token }, "swatch"])}" role="button" tabindex="0"${ssrRenderAttr("aria-label", `Copiar ${c.hex}`)} data-v-f90fdcd8><div class="swatch__color" style="${ssrRenderStyle({
					background: c.hex,
					borderBottom: c.token === "--ink" ? "1px solid rgba(243,240,233,.1)" : "none"
				})}" data-v-f90fdcd8>`);
				if (copiedToken.value === c.token) _push(`<span class="swatch__feedback" data-v-f90fdcd8>✓ Copiado</span>`);
				else _push(`<!---->`);
				_push(`</div><div class="swatch__meta" data-v-f90fdcd8><p class="swatch__name" data-v-f90fdcd8>${ssrInterpolate(c.name)}</p><p class="swatch__hex" data-v-f90fdcd8>${ssrInterpolate(c.hex.toUpperCase())}</p><p class="swatch__token" data-v-f90fdcd8>${ssrInterpolate(c.token)}</p></div></div>`);
			});
			_push(`<!--]--></div></div><div class="ds-sub" data-v-f90fdcd8><h3 data-v-f90fdcd8>Texto sobre claro</h3><div class="swatches" data-v-f90fdcd8><!--[-->`);
			ssrRenderList(lightTextColors, (c) => {
				_push(`<div class="${ssrRenderClass([{ "is-copied": copiedToken.value === c.token }, "swatch"])}" role="button" tabindex="0"${ssrRenderAttr("aria-label", `Copiar ${c.hex}`)} data-v-f90fdcd8><div class="swatch__color" style="${ssrRenderStyle({
					background: c.hex,
					borderBottom: c.token === "--ink" ? "1px solid rgba(243,240,233,.1)" : "none"
				})}" data-v-f90fdcd8>`);
				if (copiedToken.value === c.token) _push(`<span class="swatch__feedback" data-v-f90fdcd8>✓ Copiado</span>`);
				else _push(`<!---->`);
				_push(`</div><div class="swatch__meta" data-v-f90fdcd8><p class="swatch__name" data-v-f90fdcd8>${ssrInterpolate(c.name)}</p><p class="swatch__hex" data-v-f90fdcd8>${ssrInterpolate(c.hex.toUpperCase())}</p><p class="swatch__token" data-v-f90fdcd8>${ssrInterpolate(c.token)}</p></div></div>`);
			});
			_push(`<!--]--></div></div><div class="ds-sub" data-v-f90fdcd8><h3 data-v-f90fdcd8>Bordes</h3><table class="ds-table" data-v-f90fdcd8><thead data-v-f90fdcd8><tr data-v-f90fdcd8><th data-v-f90fdcd8>Token</th><th data-v-f90fdcd8>Valor</th><th data-v-f90fdcd8>Uso</th></tr></thead><tbody data-v-f90fdcd8><!--[-->`);
			ssrRenderList(borders, (b) => {
				_push(`<tr data-v-f90fdcd8><td data-v-f90fdcd8><code data-v-f90fdcd8>${ssrInterpolate(b.token)}</code></td><td data-v-f90fdcd8>${ssrInterpolate(b.value)}</td><td data-v-f90fdcd8>${ssrInterpolate(b.usage)}</td></tr>`);
			});
			_push(`<!--]--></tbody></table></div></section><section id="tipografia" class="ds-section" data-v-f90fdcd8><p class="ds-section__eyebrow" data-v-f90fdcd8>03 · Fundación</p><h2 data-v-f90fdcd8>Tipografía</h2><p data-v-f90fdcd8> Tres familias con roles claros: <strong data-v-f90fdcd8>Instrument Serif</strong> para titulares y cifras, <strong data-v-f90fdcd8>Manrope</strong> para cuerpo, <strong data-v-f90fdcd8>IBM Plex Mono</strong> para etiquetas y datos técnicos. </p><div class="ds-sub" data-v-f90fdcd8><h3 data-v-f90fdcd8>Escala</h3><div class="ds-demo ds-demo--dark" data-v-f90fdcd8><p class="ds-demo__label" data-v-f90fdcd8>Display · 148px</p><p class="t-display" data-v-f90fdcd8>Habitar</p></div><div class="ds-demo ds-demo--dark" data-v-f90fdcd8><p class="ds-demo__label" data-v-f90fdcd8>H1 · 120px</p><p class="t-h1" data-v-f90fdcd8>Espacios que se <em style="${ssrRenderStyle({ "color": "var(--sage)" })}" data-v-f90fdcd8>sienten</em>.</p></div><div class="ds-demo ds-demo--dark" data-v-f90fdcd8><p class="ds-demo__label" data-v-f90fdcd8>H2 · 88px</p><p class="t-h2" data-v-f90fdcd8>Tres formas de habitar</p></div><div class="ds-demo ds-demo--dark" data-v-f90fdcd8><p class="ds-demo__label" data-v-f90fdcd8>H3 · 56px</p><p class="t-h3" data-v-f90fdcd8>Mismo espacio, otro carácter</p></div><div class="ds-demo ds-demo--dark" data-v-f90fdcd8><p class="ds-demo__label" data-v-f90fdcd8>H4 · 40px</p><p class="t-h4" data-v-f90fdcd8>Detalles que importan</p></div><div class="ds-demo ds-demo--dark" data-v-f90fdcd8><p class="ds-demo__label" data-v-f90fdcd8>Cuerpo + Lead + Italic</p><p class="t-lead" data-v-f90fdcd8>Diseñamos soluciones exclusivas, innovadoras y de alta calidad.</p><p class="t-body mt-24" data-v-f90fdcd8> Cada proyecto se cotiza según metraje, alcance, ubicación y acabados. Completa los datos y te enviamos una propuesta a la medida. </p><p class="t-italic" style="${ssrRenderStyle({
				"font-size": "22px",
				"color": "var(--sage)",
				"margin-top": "20px"
			})}" data-v-f90fdcd8> Si te identificas con la luz, la calidez y los espacios que recargan el espíritu… </p></div><div class="ds-demo ds-demo--dark" data-v-f90fdcd8><p class="ds-demo__label" data-v-f90fdcd8>Eyebrow + Mono label</p><p class="t-eyebrow" data-v-f90fdcd8>Arquitectura e interiorismo · Bogotá</p><p class="t-mono-label" style="${ssrRenderStyle({
				"color": "var(--fg-soft)",
				"margin-top": "14px"
			})}" data-v-f90fdcd8> WhatsApp · +57 322 727 6453 </p></div>`);
			_push(ssrRenderComponent(CodeBlock_default, { code: codeTypography }, null, _parent));
			_push(`</div></section><section id="botones" class="ds-section" data-v-f90fdcd8><p class="ds-section__eyebrow" data-v-f90fdcd8>04 · Componente</p><h2 data-v-f90fdcd8>Botones</h2><p data-v-f90fdcd8> Variantes que se adaptan automáticamente a la superficie contenedora. Añade <code data-v-f90fdcd8>.surface--light</code> al contenedor y los botones adoptan la paleta clara. </p><div class="ds-sub" data-v-f90fdcd8><h3 data-v-f90fdcd8>Sobre superficie oscura</h3><div class="ds-demo ds-demo--dark flex gap-12 wrap center" data-v-f90fdcd8><button class="btn btn--primary" data-v-f90fdcd8>Diseña tu espacio</button><button class="btn btn--outline" data-v-f90fdcd8>Solicitar cotización</button><button class="btn btn--ghost" data-v-f90fdcd8>Ver más</button><button class="btn btn--sage" data-v-f90fdcd8>Agendar visita</button></div><h3 style="${ssrRenderStyle({ "margin-top": "32px" })}" data-v-f90fdcd8>Sobre superficie clara</h3><div class="ds-demo ds-demo--light surface--light flex gap-12 wrap center" data-v-f90fdcd8><button class="btn btn--primary" data-v-f90fdcd8>Cotizar esta combinación</button><button class="btn btn--outline" data-v-f90fdcd8>Explorar</button><button class="btn btn--ghost" data-v-f90fdcd8>Cancelar</button></div><h3 style="${ssrRenderStyle({ "margin-top": "32px" })}" data-v-f90fdcd8>Tamaños</h3><div class="ds-demo ds-demo--dark flex gap-12 wrap center" data-v-f90fdcd8><button class="btn btn--sm btn--primary" data-v-f90fdcd8>Small</button><button class="btn btn--primary" data-v-f90fdcd8>Default</button><button class="btn btn--lg btn--primary" data-v-f90fdcd8>Large</button></div><h3 style="${ssrRenderStyle({ "margin-top": "32px" })}" data-v-f90fdcd8>Tabs y selector de idioma</h3><div class="ds-demo ds-demo--dark2 flex gap-12 wrap center" data-v-f90fdcd8><button class="btn-tab is-on" data-v-f90fdcd8>01 Natural</button><button class="btn-tab" data-v-f90fdcd8>02 Minimal</button><button class="btn-tab" data-v-f90fdcd8>03 Industrial</button><div class="lang-toggle" style="${ssrRenderStyle({ "margin-left": "12px" })}" data-v-f90fdcd8><button class="is-on" data-v-f90fdcd8>ES</button><button data-v-f90fdcd8>EN</button></div></div><div class="ds-demo ds-demo--light surface--light flex gap-12 wrap center" data-v-f90fdcd8><button class="btn-tab is-on" data-v-f90fdcd8>Apartamento</button><button class="btn-tab" data-v-f90fdcd8>Casa</button><button class="btn-tab" data-v-f90fdcd8>Oficina</button></div>`);
			_push(ssrRenderComponent(CodeBlock_default, { code: codeButtons }, null, _parent));
			_push(`</div></section><section id="badges" class="ds-section" data-v-f90fdcd8><p class="ds-section__eyebrow" data-v-f90fdcd8>05 · Componente</p><h2 data-v-f90fdcd8>Badges &amp; etiquetas</h2><p data-v-f90fdcd8>Pequeñas cápsulas informativas: categorías, estados, numeración de pasos.</p><div class="ds-demo ds-demo--dark flex gap-12 wrap center" data-v-f90fdcd8><span class="badge" data-v-f90fdcd8>01 · Combos</span><span class="badge badge--sage" data-v-f90fdcd8>Nuevo</span><span class="badge badge--cream" data-v-f90fdcd8>Integral · Natural</span><span class="badge badge--ghost" data-v-f90fdcd8>En obra</span><span class="step-index" data-v-f90fdcd8>01 —</span></div>`);
			_push(ssrRenderComponent(CodeBlock_default, { code: codeBadges }, null, _parent));
			_push(`</section><section id="tarjetas" class="ds-section" data-v-f90fdcd8><p class="ds-section__eyebrow" data-v-f90fdcd8>06 · Componente</p><h2 data-v-f90fdcd8>Tarjetas</h2><p data-v-f90fdcd8> Tres familias: combo (paquete con imagen), proyecto (link visual) y opción de configurador. </p><div class="ds-sub" data-v-f90fdcd8><h3 data-v-f90fdcd8>Tarjeta Combo</h3><div class="ds-demo ds-demo--dark" data-v-f90fdcd8><div class="grid-auto" style="${ssrRenderStyle({ "grid-template-columns": "repeat(auto-fit, minmax(min(100%, 280px), 1fr))" })}" data-v-f90fdcd8><article class="card is-active" data-v-f90fdcd8><div class="card__media" style="${ssrRenderStyle({ "aspect-ratio": "16/10" })}" data-v-f90fdcd8><img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&amp;q=80" alt="" data-v-f90fdcd8></div><div class="card__body" data-v-f90fdcd8><div class="card__head" data-v-f90fdcd8><span class="card__title" data-v-f90fdcd8>Vital</span><span class="card__kicker" data-v-f90fdcd8>02</span></div><span class="card__kw" data-v-f90fdcd8>Práctico · Estructurado</span><p class="card__desc" data-v-f90fdcd8> Mantiene el sello de diseño elevando la experiencia con mobiliario más amplio y mejor organización diaria. </p><span class="card__cta" data-v-f90fdcd8>Ver en el configurador →</span></div></article><article class="card" data-v-f90fdcd8><div class="card__media" style="${ssrRenderStyle({ "aspect-ratio": "16/10" })}" data-v-f90fdcd8><img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&amp;q=80" alt="" data-v-f90fdcd8></div><div class="card__body" data-v-f90fdcd8><div class="card__head" data-v-f90fdcd8><span class="card__title" data-v-f90fdcd8>Integral</span><span class="card__kicker" data-v-f90fdcd8>03</span></div><span class="card__kw" data-v-f90fdcd8>Sofisticación · Presencia</span><p class="card__desc" data-v-f90fdcd8> La experiencia más completa: mobiliario de gran escala, áreas sociales integradas y almacenamiento superior. </p><span class="card__cta" data-v-f90fdcd8>Ver en el configurador →</span></div></article></div></div></div><div class="ds-sub" data-v-f90fdcd8><h3 data-v-f90fdcd8>Tarjeta Proyecto</h3><div class="ds-demo ds-demo--dark" data-v-f90fdcd8><div class="grid-auto" style="${ssrRenderStyle({ "grid-template-columns": "repeat(auto-fit, minmax(min(100%, 240px), 1fr))" })}" data-v-f90fdcd8><a href="#" class="card-project" data-v-f90fdcd8><div class="card__media" data-v-f90fdcd8><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&amp;q=80" alt="" data-v-f90fdcd8></div><div class="card-project__meta" data-v-f90fdcd8><span class="card-project__name" data-v-f90fdcd8>Prieto 208</span><span class="card-project__tag" data-v-f90fdcd8>01 · Ver →</span></div></a><a href="#" class="card-project" data-v-f90fdcd8><div class="card__media" data-v-f90fdcd8><img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&amp;q=80" alt="" data-v-f90fdcd8></div><div class="card-project__meta" data-v-f90fdcd8><span class="card-project__name" data-v-f90fdcd8>Serna &amp; Velasco</span><span class="card-project__tag" data-v-f90fdcd8>02 · Ver →</span></div></a></div></div></div><div class="ds-sub" data-v-f90fdcd8><h3 data-v-f90fdcd8>Opciones del configurador (sobre claro)</h3><div class="ds-demo ds-demo--light surface--light" style="${ssrRenderStyle({
				"display": "grid",
				"gap": "12px"
			})}" data-v-f90fdcd8><div style="${ssrRenderStyle({
				"max-width": "320px",
				"display": "grid",
				"gap": "6px"
			})}" data-v-f90fdcd8><button class="opt is-on" data-v-f90fdcd8><span data-v-f90fdcd8>Balance</span><span class="opt__n" data-v-f90fdcd8>01</span></button><button class="opt" data-v-f90fdcd8><span data-v-f90fdcd8>Vital</span><span class="opt__n" data-v-f90fdcd8>02</span></button><button class="opt" data-v-f90fdcd8><span data-v-f90fdcd8>Integral</span><span class="opt__n" data-v-f90fdcd8>03</span></button></div><div style="${ssrRenderStyle({
				"display": "grid",
				"grid-template-columns": "repeat(3, 1fr)",
				"gap": "8px",
				"max-width": "360px",
				"margin-top": "20px"
			})}" data-v-f90fdcd8><button class="opt-thumb is-on" data-v-f90fdcd8><div class="opt-thumb__img" data-v-f90fdcd8><img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&amp;q=80" alt="" style="${ssrRenderStyle({
				"width": "100%",
				"height": "100%",
				"object-fit": "cover"
			})}" data-v-f90fdcd8></div><span class="opt-thumb__label" data-v-f90fdcd8>Natural</span></button><button class="opt-thumb" data-v-f90fdcd8><div class="opt-thumb__img" data-v-f90fdcd8><img src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&amp;q=80" alt="" style="${ssrRenderStyle({
				"width": "100%",
				"height": "100%",
				"object-fit": "cover"
			})}" data-v-f90fdcd8></div><span class="opt-thumb__label" data-v-f90fdcd8>Minimal</span></button><button class="opt-thumb" data-v-f90fdcd8><div class="opt-thumb__img" data-v-f90fdcd8><img src="https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400&amp;q=80" alt="" style="${ssrRenderStyle({
				"width": "100%",
				"height": "100%",
				"object-fit": "cover"
			})}" data-v-f90fdcd8></div><span class="opt-thumb__label" data-v-f90fdcd8>Industrial</span></button></div></div>`);
			_push(ssrRenderComponent(CodeBlock_default, { code: codeCards }, null, _parent));
			_push(`</div></section><section id="formularios" class="ds-section" data-v-f90fdcd8><p class="ds-section__eyebrow" data-v-f90fdcd8>07 · Componente</p><h2 data-v-f90fdcd8>Formularios</h2><p data-v-f90fdcd8> Inputs minimalistas con subrayado, chips de selección múltiple, rangos y botones de día/hora. Todos heredan el tema de su contenedor. </p><div class="ds-sub" data-v-f90fdcd8><h3 data-v-f90fdcd8>Campos (superficie clara)</h3><div class="ds-demo ds-demo--light surface--light" data-v-f90fdcd8><div style="${ssrRenderStyle({
				"display": "grid",
				"grid-template-columns": "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
				"gap": "20px"
			})}" data-v-f90fdcd8><label class="field" data-v-f90fdcd8><span class="field__label" data-v-f90fdcd8>Nombre</span><input class="input" type="text" placeholder="Tu nombre" data-v-f90fdcd8></label><label class="field" data-v-f90fdcd8><span class="field__label" data-v-f90fdcd8>Teléfono</span><input class="input" type="tel" placeholder="+57 …" data-v-f90fdcd8></label><label class="field" data-v-f90fdcd8><span class="field__label" data-v-f90fdcd8>Email</span><input class="input" type="email" placeholder="tu@correo.com" data-v-f90fdcd8></label><label class="field" data-v-f90fdcd8><span class="field__label" data-v-f90fdcd8>Ciudad / barrio</span><input class="input" type="text" placeholder="Bogotá" data-v-f90fdcd8></label></div><label class="field mt-24" data-v-f90fdcd8><span class="field__label" data-v-f90fdcd8>Cuéntanos más</span><textarea class="textarea" rows="3" placeholder="Detalles del proyecto…" data-v-f90fdcd8></textarea></label></div></div><div class="ds-sub" data-v-f90fdcd8><h3 data-v-f90fdcd8>Chips de selección múltiple</h3><div class="ds-demo ds-demo--light surface--light flex gap-8 wrap" data-v-f90fdcd8><button class="chip is-on" data-v-f90fdcd8><span class="chip__mark" data-v-f90fdcd8>✓</span> Cocina</button><button class="chip is-on" data-v-f90fdcd8><span class="chip__mark" data-v-f90fdcd8>✓</span> Baños</button><button class="chip" data-v-f90fdcd8><span class="chip__mark" data-v-f90fdcd8>+</span> Zona social</button><button class="chip" data-v-f90fdcd8><span class="chip__mark" data-v-f90fdcd8>+</span> Habitaciones</button><button class="chip" data-v-f90fdcd8><span class="chip__mark" data-v-f90fdcd8>+</span> Estudio</button><button class="chip" data-v-f90fdcd8><span class="chip__mark" data-v-f90fdcd8>+</span> Terraza</button></div></div><div class="ds-sub" data-v-f90fdcd8><h3 data-v-f90fdcd8>Range (área)</h3><div class="ds-demo ds-demo--light surface--light" style="${ssrRenderStyle({
				"display": "grid",
				"gap": "14px"
			})}" data-v-f90fdcd8><div class="flex between baseline" data-v-f90fdcd8><span class="field__label" data-v-f90fdcd8>Área aproximada</span><span style="${ssrRenderStyle({ "font": "400 44px/1 var(--font-display)" })}" data-v-f90fdcd8>${ssrInterpolate(rangeValue.value)} m²</span></div><input${ssrRenderAttr("value", rangeValue.value)} class="range" type="range" min="20" max="400" step="5" data-v-f90fdcd8></div></div><div class="ds-sub" data-v-f90fdcd8><h3 data-v-f90fdcd8>Selector de día y hora</h3><div class="ds-demo ds-demo--light surface--light" style="${ssrRenderStyle({
				"display": "grid",
				"gap": "20px"
			})}" data-v-f90fdcd8><div style="${ssrRenderStyle({
				"display": "grid",
				"grid-template-columns": "repeat(auto-fill, minmax(68px, 1fr))",
				"gap": "6px"
			})}" data-v-f90fdcd8><!--[-->`);
			ssrRenderList(demoDays, (d) => {
				_push(`<button class="${ssrRenderClass([{ "is-on": selectedDay.value === d.num }, "day"])}" data-v-f90fdcd8><span class="day__wd" data-v-f90fdcd8>${ssrInterpolate(d.wd)}</span><span class="day__num" data-v-f90fdcd8>${ssrInterpolate(d.num)}</span><span class="day__mo" data-v-f90fdcd8>${ssrInterpolate(d.mo)}</span></button>`);
			});
			_push(`<!--]--></div><div style="${ssrRenderStyle({
				"display": "grid",
				"grid-template-columns": "repeat(3, 1fr)",
				"gap": "6px"
			})}" data-v-f90fdcd8><!--[-->`);
			ssrRenderList(demoTimes, (s) => {
				_push(`<button class="${ssrRenderClass([{ "is-on": selectedTime.value === s }, "btn-tab"])}" data-v-f90fdcd8>${ssrInterpolate(s)}</button>`);
			});
			_push(`<!--]--></div></div></div>`);
			_push(ssrRenderComponent(CodeBlock_default, { code: codeForms }, null, _parent));
			_push(`</section><section id="navegacion" class="ds-section" data-v-f90fdcd8><p class="ds-section__eyebrow" data-v-f90fdcd8>08 · Componente</p><h2 data-v-f90fdcd8>Navegación</h2><p data-v-f90fdcd8> Barra fija con fondo translúcido que aparece al hacer scroll. Los enlaces usan mono uppercase para un aire editorial. </p><div class="ds-demo ds-demo--dark" style="${ssrRenderStyle({
				"padding": "0",
				"overflow": "hidden"
			})}" data-v-f90fdcd8><div style="${ssrRenderStyle({
				"position": "relative",
				"height": "90px"
			})}" data-v-f90fdcd8><div class="nav is-scrolled" style="${ssrRenderStyle({ "position": "absolute" })}" data-v-f90fdcd8><a href="#" style="${ssrRenderStyle({
				"display": "flex",
				"align-items": "center",
				"font": "400 20px/1 var(--font-display)"
			})}" data-v-f90fdcd8> Inhabi </a><div class="nav__links" data-v-f90fdcd8><a href="#" data-v-f90fdcd8>Combos</a><a href="#" data-v-f90fdcd8>Estilos</a><a href="#" data-v-f90fdcd8>Configurador</a><a href="#" data-v-f90fdcd8>Proyectos</a><a href="#" data-v-f90fdcd8>Cotizar</a><div class="lang-toggle" data-v-f90fdcd8><button class="is-on" data-v-f90fdcd8>ES</button><button data-v-f90fdcd8>EN</button></div><a href="#" class="btn btn--primary btn--sm" data-v-f90fdcd8>Agendar</a></div></div></div></div>`);
			_push(ssrRenderComponent(CodeBlock_default, { code: codeNav }, null, _parent));
			_push(`</section><section id="secciones" class="ds-section" data-v-f90fdcd8><p class="ds-section__eyebrow" data-v-f90fdcd8>09 · Layout</p><h2 data-v-f90fdcd8>Secciones y contenedores</h2><p data-v-f90fdcd8> Cuatro combinaciones de fondo alternadas. El contenedor limita a 1400 px; el gutter es fluido. </p><div class="ds-sub" data-v-f90fdcd8><h3 data-v-f90fdcd8>Fondos</h3><div style="${ssrRenderStyle({
				"display": "grid",
				"grid-template-columns": "repeat(auto-fit, minmax(180px, 1fr))",
				"gap": "12px"
			})}" data-v-f90fdcd8><!--[-->`);
			ssrRenderList(sectionBackgrounds, (bg) => {
				_push(`<div class="${ssrRenderClass([bg.cls, "ds-demo"])}" style="${ssrRenderStyle({
					"text-align": "center",
					"margin": "0"
				})}" data-v-f90fdcd8><p class="ds-demo__label" style="${ssrRenderStyle({ "margin": "0" })}" data-v-f90fdcd8>${ssrInterpolate(bg.label)}</p></div>`);
			});
			_push(`<!--]--></div>`);
			_push(ssrRenderComponent(CodeBlock_default, { code: codeSection }, null, _parent));
			_push(`</div></section><section id="especiales" class="ds-section" data-v-f90fdcd8><p class="ds-section__eyebrow" data-v-f90fdcd8>10 · Componente</p><h2 data-v-f90fdcd8>Componentes especiales</h2><p data-v-f90fdcd8> Patrones recurrentes del sitio: botón flotante de WhatsApp, panel sticky de resumen, callout de éxito y comparador antes/después. </p><div class="ds-sub" data-v-f90fdcd8><h3 data-v-f90fdcd8>Panel sticky de resumen</h3><div class="ds-demo ds-demo--light surface--light" style="${ssrRenderStyle({
				"display": "grid",
				"grid-template-columns": "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
				"gap": "24px",
				"align-items": "start"
			})}" data-v-f90fdcd8><div style="${ssrRenderStyle({
				"display": "grid",
				"gap": "16px"
			})}" data-v-f90fdcd8><p class="t-body" data-v-f90fdcd8> A la derecha verás el panel de resumen con imagen, lista de filas y botones de acción. Sustituye la imagen por el render del configurador. </p><button class="btn btn--primary" data-v-f90fdcd8>Enviar solicitud</button></div><div class="sticky-panel" style="${ssrRenderStyle({
				"position": "relative",
				"top": "0"
			})}" data-v-f90fdcd8><span class="t-mono-sm" style="${ssrRenderStyle({ "color": "var(--sage)" })}" data-v-f90fdcd8> Resumen de tu solicitud </span><div style="${ssrRenderStyle({
				"aspect-ratio": "16/10",
				"overflow": "hidden",
				"background": "#1b1a16"
			})}" data-v-f90fdcd8><img src="https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=600&amp;q=80" alt="" style="${ssrRenderStyle({
				"width": "100%",
				"height": "100%",
				"object-fit": "cover"
			})}" data-v-f90fdcd8></div><div data-v-f90fdcd8><div class="summary-row" data-v-f90fdcd8><span data-v-f90fdcd8>Inmueble</span><span data-v-f90fdcd8>Apartamento</span></div><div class="summary-row" data-v-f90fdcd8><span data-v-f90fdcd8>Área</span><span data-v-f90fdcd8>120 m²</span></div><div class="summary-row" data-v-f90fdcd8><span data-v-f90fdcd8>Combo</span><span data-v-f90fdcd8>Vital</span></div><div class="summary-row" data-v-f90fdcd8><span data-v-f90fdcd8>Estilo</span><span data-v-f90fdcd8>Natural</span></div><div class="summary-row" data-v-f90fdcd8><span data-v-f90fdcd8>Plazo</span><span data-v-f90fdcd8>Hasta 60 días</span></div></div><button class="btn btn--primary btn--block" data-v-f90fdcd8>Enviar solicitud</button></div></div></div><div class="ds-sub" data-v-f90fdcd8><h3 data-v-f90fdcd8>Callout de éxito</h3><div class="ds-demo ds-demo--light surface--light" data-v-f90fdcd8><div class="callout-success" style="${ssrRenderStyle({ "max-width": "420px" })}" data-v-f90fdcd8><strong data-v-f90fdcd8>Recibimos tu solicitud.</strong><span style="${ssrRenderStyle({
				"font-size": "14px",
				"line-height": "1.5"
			})}" data-v-f90fdcd8> Te contactaremos en menos de 24 horas hábiles para agendar la visita técnica. </span></div></div></div><div class="ds-sub" data-v-f90fdcd8><h3 data-v-f90fdcd8>Comparador antes / después</h3><div class="ds-demo ds-demo--dark" data-v-f90fdcd8>`);
			_push(ssrRenderComponent(_sfc_main$4, null, null, _parent));
			_push(`</div>`);
			_push(ssrRenderComponent(CodeBlock_default, { code: codeCompare }, null, _parent));
			_push(`</div><div class="ds-sub" data-v-f90fdcd8><h3 data-v-f90fdcd8>Botón flotante WhatsApp</h3><p style="${ssrRenderStyle({
				"color": "var(--fg-soft)",
				"font-size": "14px"
			})}" data-v-f90fdcd8> En producción ocupa la esquina inferior derecha. Aquí lo mostramos inline. </p><div class="ds-demo ds-demo--dark" data-v-f90fdcd8><a href="#" class="fab" style="${ssrRenderStyle({
				"position": "relative",
				"right": "auto",
				"bottom": "auto",
				"display": "inline-flex"
			})}" data-v-f90fdcd8> WhatsApp </a></div></div></section><section id="animaciones" class="ds-section" data-v-f90fdcd8><p class="ds-section__eyebrow" data-v-f90fdcd8>11 · Movimiento</p><h2 data-v-f90fdcd8>Animaciones</h2><p data-v-f90fdcd8> Curvas y duraciones consistentes. Se desactivan automáticamente con <code data-v-f90fdcd8>prefers-reduced-motion</code>. </p><div class="ds-sub" data-v-f90fdcd8><h3 data-v-f90fdcd8>Clases utilitarias</h3><div class="ds-demo ds-demo--dark" style="${ssrRenderStyle({
				"display": "grid",
				"grid-template-columns": "repeat(auto-fit, minmax(180px, 1fr))",
				"gap": "16px"
			})}" data-v-f90fdcd8><!--[-->`);
			ssrRenderList([
				"anim-in",
				"anim-up",
				"anim-up-slow"
			], (anim) => {
				_push(`<div class="${ssrRenderClass(anim)}" style="${ssrRenderStyle({
					"padding": "20px",
					"background": "var(--ink-soft)",
					"text-align": "center"
				})}" data-v-f90fdcd8><p class="t-mono-sm" style="${ssrRenderStyle({ "color": "var(--sage)" })}" data-v-f90fdcd8>.${ssrInterpolate(anim)}</p></div>`);
			});
			_push(`<!--]--></div>`);
			_push(ssrRenderComponent(CodeBlock_default, { code: codeAnimations }, null, _parent));
			_push(`</div></section><section id="utilidades" class="ds-section" data-v-f90fdcd8><p class="ds-section__eyebrow" data-v-f90fdcd8>12 · Ayudas</p><h2 data-v-f90fdcd8>Utilidades</h2><p data-v-f90fdcd8>Clases de una sola función para composición rápida.</p><table class="ds-table" data-v-f90fdcd8><thead data-v-f90fdcd8><tr data-v-f90fdcd8><th data-v-f90fdcd8>Clase</th><th data-v-f90fdcd8>Efecto</th></tr></thead><tbody data-v-f90fdcd8><!--[-->`);
			ssrRenderList(utilities, (u) => {
				_push(`<tr data-v-f90fdcd8><td data-v-f90fdcd8><code data-v-f90fdcd8>${ssrInterpolate(u.cls)}</code></td><td data-v-f90fdcd8>${ssrInterpolate(u.effect)}</td></tr>`);
			});
			_push(`<!--]--></tbody></table><div class="ds-sub" data-v-f90fdcd8><h3 data-v-f90fdcd8>Estructura recomendada de archivos</h3>`);
			_push(ssrRenderComponent(CodeBlock_default, { code: codeFileStructure }, null, _parent));
			_push(`</div><div class="ds-sub" data-v-f90fdcd8><h3 data-v-f90fdcd8>Adopción en HTML</h3>`);
			_push(ssrRenderComponent(CodeBlock_default, { code: codeAdoption }, null, _parent));
			_push(`</div></section><footer style="${ssrRenderStyle({
				"padding": "64px 0 0",
				"border-top": "1px solid var(--border-dark-1)",
				"text-align": "center"
			})}" data-v-f90fdcd8><p class="t-eyebrow" data-v-f90fdcd8>Inhabi Design System · v1.0</p><p style="${ssrRenderStyle({
				"font": "400 11px/1.6 var(--font-mono)",
				"letter-spacing": "0.14em",
				"text-transform": "uppercase",
				"color": "var(--fg-ghost)",
				"margin-top": "12px"
			})}" data-v-f90fdcd8> Arquitectura · Interiorismo · Remodelación </p></footer></main></div>`);
		};
	}
};
var _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/SystemDesignView.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var SystemDesignView_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$2, [["__scopeId", "data-v-f90fdcd8"]]);
var en_default = { proyectos: [{
	"id": 1,
	"titulo": "Prieto 208",
	"tipo": "vivienda",
	"imagenes": [
		"bano_industrial_vital",
		"bano_industrial_balance",
		"bano_industrial_integral"
	],
	"intervencion": "Complete renovation of 120 m². Walls were removed to integrate the kitchen and living area, maximizing natural light. Custom-designed furniture with oak and quartz finishes.",
	"resena": "The Inhabi team completely transformed our apartment. The process was transparent, and the results exceeded our expectations. The new lighting changed the way we experience the space.",
	"author": "Prieto Family"
}, {
	"id": 2,
	"titulo": "Serna & Velasco",
	"tipo": "vivienda",
	"imagenes": ["bano_industrial_vital", "bano_industrial_balance"],
	"intervencion": "Industrial-style interior design. Incorporation of exposed concrete textures, track lighting, and black metal framing for bathroom and home office partitions.",
	"resena": "They perfectly captured the minimalist industrial style we wanted. Very professional and punctual with delivery.",
	"cliente": "Serna & Velasco"
}] };
var es_default = { proyectos: [
	{
		"id": 1,
		"titulo": "Prieto 208",
		"tipo": "comercial",
		"imagenes": [
			"bano_industrial_vital",
			"bano_industrial_balance",
			"bano_industrial_integral"
		],
		"intervencion": "Remodelación integral de 120 m². Se derribaron muros para integrar la cocina y la zona social, maximizando la luz natural. Diseño de mobiliario a medida con acabados en roble y cuarzo.",
		"resena": "El equipo de Inhabi transformó por completo nuestro apartamento. El proceso fue transparente y el resultado superó nuestras expectativas. La nueva iluminación cambió la forma en que vivimos el espacio.",
		"cliente": "Familia Prieto"
	},
	{
		"id": 2,
		"titulo": "Serna & Velasco",
		"tipo": "vivienda",
		"imagenes": ["bano_industrial_vital", "bano_industrial_balance"],
		"intervencion": "Diseño interior de estilo industrial. Incorporación de texturas de concreto expuesto, iluminación en rieles y perfilería metálica negra en divisiones de baño y estudio.",
		"resena": "Captaron a la perfección el estilo minimalista e industrial que queríamos. Muy profesionales en los tiempos de entrega.",
		"cliente": "Serna & Velasco"
	},
	{
		"id": 3,
		"titulo": "Balcon de rosales",
		"tipo": "institucional",
		"imagenes": ["bano_industrial_vital", "bano_industrial_balance"],
		"intervencion": "Diseño interior de estilo industrial. Incorporación de texturas de concreto expuesto, iluminación en rieles y perfilería metálica negra en divisiones de baño y estudio.",
		"resena": "Captaron a la perfección el estilo minimalista e industrial que queríamos. Muy profesionales en los tiempos de entrega.",
		"cliente": "Serna & Velasco"
	}
] };
//#endregion
//#region src/views/ProyectosView.vue
var _sfc_main$1 = {
	__name: "ProyectosView",
	__ssrInlineRender: true,
	setup(__props) {
		const route = useRoute();
		const categoriaActual = computed(() => route.params.categoria || "");
		const archivosProyectos = /* #__PURE__ */ Object.assign({
			"/src/data/proyectos/en.json": en_default,
			"/src/data/proyectos/es.json": es_default
		});
		const todosLosProyectos = computed(() => {
			const idioma = store.lang || "es";
			return archivosProyectos[`/src/data/proyectos/${idioma}.json`]?.proyectos ?? [];
		});
		const categoriasDisponibles = computed(() => {
			const cats = todosLosProyectos.value.map((p) => p.tipo).filter(Boolean);
			return [...new Set(cats)];
		});
		const proyectosFiltrados = computed(() => {
			if (!categoriaActual.value) return todosLosProyectos.value;
			return todosLosProyectos.value.filter((p) => p.tipo.toLowerCase() === categoriaActual.value.toLowerCase());
		});
		useHead(seo);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_router_link = resolveComponent("router-link");
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "projects-page" }, _attrs))} data-v-a2acef95><header class="page-nav" data-v-a2acef95>`);
			_push(ssrRenderComponent(_component_router_link, {
				to: "/",
				class: "brand"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$19, {
						class: "brand-logo",
						icon: "",
						text: ""
					}, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$19, {
						class: "brand-logo",
						icon: "",
						text: ""
					})];
				}),
				_: 1
			}, _parent));
			_push(`<div class="nav-actions" data-v-a2acef95>`);
			_push(ssrRenderComponent(_component_router_link, {
				to: "/#proyectos",
				class: "nav-btn-back"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`← Volver`);
					else return [createTextVNode("← Volver")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_router_link, {
				to: "/cotiza",
				class: "nav-cta"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`${ssrInterpolate(unref(t).nav.cotizar)}`);
					else return [createTextVNode(toDisplayString(unref(t).nav.cotizar), 1)];
				}),
				_: 1
			}, _parent));
			_push(`</div></header><main class="container sec" data-v-a2acef95><div class="head" data-v-a2acef95><span class="eyebrow" data-v-a2acef95>${ssrInterpolate(unref(t).nav.proyectos)} `);
			if (categoriaActual.value) _push(`<span data-v-a2acef95>/ ${ssrInterpolate(categoriaActual.value.toUpperCase())}</span>`);
			else _push(`<!---->`);
			_push(`</span><h1 class="title" data-v-a2acef95>Arquitectura que genera valor.</h1></div><div class="filter-bar mt-48" data-v-a2acef95>`);
			_push(ssrRenderComponent(_component_router_link, {
				to: "/proyectos",
				class: ["filter-btn", { active: !categoriaActual.value }]
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Todos `);
					else return [createTextVNode(" Todos ")];
				}),
				_: 1
			}, _parent));
			_push(`<!--[-->`);
			ssrRenderList(categoriasDisponibles.value, (cat) => {
				_push(ssrRenderComponent(_component_router_link, {
					key: cat,
					to: `/proyectos/${cat.toLowerCase()}`,
					class: ["filter-btn", { active: categoriaActual.value.toLowerCase() === cat.toLowerCase() }]
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`${ssrInterpolate(cat)}`);
						else return [createTextVNode(toDisplayString(cat), 1)];
					}),
					_: 2
				}, _parent));
			});
			_push(`<!--]--></div><div class="grid-proyectos mt-32" data-v-a2acef95><!--[-->`);
			ssrRenderList(proyectosFiltrados.value, (p, index) => {
				_push(ssrRenderComponent(_component_router_link, {
					key: p.slug,
					to: `/proyectos/${p.tipo.toLowerCase()}/${p.titulo}`,
					class: "card-project"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<div class="card__media" data-v-a2acef95${_scopeId}><img${ssrRenderAttr("src", unref(IMG)(p.imagenes[0]))}${ssrRenderAttr("alt", p.titulo)} loading="lazy" data-v-a2acef95${_scopeId}><span class="card__num" data-v-a2acef95${_scopeId}>0${ssrInterpolate(index + 1)}</span></div><div class="card-meta" data-v-a2acef95${_scopeId}><h3 class="card-title" data-v-a2acef95${_scopeId}>${ssrInterpolate(p.titulo)}</h3><span class="card-arrow" data-v-a2acef95${_scopeId}>Ver proyecto →</span></div>`);
						else return [createVNode("div", { class: "card__media" }, [createVNode("img", {
							src: unref(IMG)(p.imagenes[0]),
							alt: p.titulo,
							loading: "lazy"
						}, null, 8, ["src", "alt"]), createVNode("span", { class: "card__num" }, "0" + toDisplayString(index + 1), 1)]), createVNode("div", { class: "card-meta" }, [createVNode("h3", { class: "card-title" }, toDisplayString(p.titulo), 1), createVNode("span", { class: "card-arrow" }, "Ver proyecto →")])];
					}),
					_: 2
				}, _parent));
			});
			_push(`<!--]--></div>`);
			if (proyectosFiltrados.value.length === 0) _push(`<div class="empty-state" data-v-a2acef95><p data-v-a2acef95>No hay proyectos disponibles en esta categoría actualmente.</p></div>`);
			else _push(`<!---->`);
			_push(`</main></div>`);
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/ProyectosView.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var ProyectosView_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$1, [["__scopeId", "data-v-a2acef95"]]);
//#endregion
//#region src/views/ProyectosDetailView.vue
var _sfc_main = {
	__name: "ProyectosDetailView",
	__ssrInlineRender: true,
	setup(__props) {
		const route = useRoute();
		const categoria = route.params.categoria;
		const proyectoSlug = route.params.proyecto;
		const archivosProyectos = /* #__PURE__ */ Object.assign({
			"/src/data/proyectos/en.json": en_default,
			"/src/data/proyectos/es.json": es_default
		});
		const proyecto = computed(() => {
			const idioma = store.lang || "es";
			return (archivosProyectos[`/src/data/proyectos/${idioma}.json`]?.proyectos ?? []).find((p) => p.titulo === proyectoSlug && p.tipo.toLowerCase() === categoria.toLowerCase());
		});
		const currentImgIndex = ref(0);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_router_link = resolveComponent("router-link");
			if (proyecto.value) {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: "detail-page" }, _attrs))} data-v-955999be><header class="page-nav" data-v-955999be>`);
				_push(ssrRenderComponent(_component_router_link, {
					to: "/",
					class: "brand"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(ssrRenderComponent(_sfc_main$19, {
							class: "brand-logo",
							icon: "",
							text: ""
						}, null, _parent, _scopeId));
						else return [createVNode(_sfc_main$19, {
							class: "brand-logo",
							icon: "",
							text: ""
						})];
					}),
					_: 1
				}, _parent));
				_push(`<div class="nav-actions" data-v-955999be>`);
				_push(ssrRenderComponent(_component_router_link, {
					to: `/proyectos/${unref(categoria)}`,
					class: "nav-btn-back"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`← Volver`);
						else return [createTextVNode("← Volver")];
					}),
					_: 1
				}, _parent));
				_push(ssrRenderComponent(_component_router_link, {
					to: "/cotiza",
					class: "nav-cta"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`${ssrInterpolate(unref(t).nav.cotizar)}`);
						else return [createTextVNode(toDisplayString(unref(t).nav.cotizar), 1)];
					}),
					_: 1
				}, _parent));
				_push(`</div></header><main class="container detail-content" data-v-955999be><h1 class="project-title" data-v-955999be>${ssrInterpolate(proyecto.value.titulo)}</h1><div class="detail-grid" data-v-955999be><div class="gallery-col" data-v-955999be><div class="carousel-track" data-v-955999be><img${ssrRenderAttr("src", unref(IMG)(proyecto.value.imagenes[currentImgIndex.value]))}${ssrRenderAttr("alt", `${proyecto.value.titulo} - ${currentImgIndex.value + 1}`)} data-v-955999be>`);
				if (proyecto.value.imagenes.length > 1) _push(`<div class="carousel-ctrls" data-v-955999be><button aria-label="Anterior" data-v-955999be>‹</button><span class="counter" data-v-955999be>${ssrInterpolate(currentImgIndex.value + 1)} / ${ssrInterpolate(proyecto.value.imagenes.length)}</span><button aria-label="Siguiente" data-v-955999be>›</button></div>`);
				else _push(`<!---->`);
				_push(`</div></div><div class="info-col" data-v-955999be><div class="info-box" data-v-955999be><span class="eyebrow" data-v-955999be>${ssrInterpolate(unref(t).proy.inter)}</span><p class="body-text" data-v-955999be>${ssrInterpolate(proyecto.value.intervencion)}</p></div>`);
				if (proyecto.value.resena) _push(`<div class="info-box" data-v-955999be><span class="eyebrow" data-v-955999be>${ssrInterpolate(unref(t).proy.resena)}</span><blockquote class="review-box" data-v-955999be>&quot;${ssrInterpolate(proyecto.value.resena)}&quot;</blockquote></div>`);
				else _push(`<!---->`);
				_push(`</div></div></main></div>`);
			} else {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: "detail-page not-found" }, _attrs))} data-v-955999be><div class="container" style="${ssrRenderStyle({
					"text-align": "center",
					"padding-top": "150px"
				})}" data-v-955999be><h2 data-v-955999be>Proyecto no encontrado</h2>`);
				_push(ssrRenderComponent(_component_router_link, {
					to: "/proyectos/vivienda",
					class: "nav-cta",
					style: {
						"display": "inline-block",
						"margin-top": "20px"
					}
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Ver proyectos`);
						else return [createTextVNode("Ver proyectos")];
					}),
					_: 1
				}, _parent));
				_push(`</div></div>`);
			}
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/ProyectosDetailView.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
//#region src/router/index.js
var routes = [
	{
		path: "/",
		name: "home",
		component: _sfc_main$8
	},
	{
		path: "/cotiza",
		name: "cotiza",
		component: CotizadorView_default
	},
	{
		path: "/system-design",
		name: "system-design",
		component: SystemDesignView_default
	},
	{
		path: "/proyectos/:categoria?",
		component: ProyectosView_default
	},
	{
		path: "/proyectos/:categoria/:proyecto",
		component: /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-955999be"]])
	},
	{
		path: "/:pathMatch(.*)*",
		redirect: "/"
	}
];
//#endregion
//#region src/directives/reveal.js
var reveal = {
	mounted(el) {
		if (!("IntersectionObserver" in window)) {
			el.style.opacity = 1;
			el.style.transform = "none";
			return;
		}
		if (el.getBoundingClientRect().top < window.innerHeight) {
			el.style.opacity = 1;
			el.style.transform = "none";
			return;
		}
		el.style.opacity = 0;
		el.style.transform = "translateY(28px)";
		el.style.transition = "opacity .9s cubic-bezier(.2,.7,.2,1), transform .9s cubic-bezier(.2,.7,.2,1)";
		const io = new IntersectionObserver((entries) => {
			entries.forEach((en) => {
				if (en.isIntersecting) {
					el.style.opacity = 1;
					el.style.transform = "none";
					io.unobserve(el);
				}
			});
		}, { threshold: .12 });
		io.observe(el);
		el._io = io;
	},
	unmounted(el) {
		el._io?.disconnect();
	}
};
//#endregion
//#region src/directives/parallax.js
var items = /* @__PURE__ */ new Set();
var raf = 0;
function tick() {
	raf = 0;
	const vh = window.innerHeight;
	items.forEach((el) => {
		const f = el._parallaxFactor || 0;
		const p = el.parentElement.getBoundingClientRect();
		if (p.bottom < -200 || p.top > vh + 200) return;
		el.style.transform = `translate3d(0,${(p.top + p.height / 2 - vh / 2) * -f}px,0)`;
	});
}
function onScroll() {
	if (!raf) raf = requestAnimationFrame(tick);
}
if (typeof window !== "undefined") {
	window.addEventListener("scroll", onScroll, { passive: true });
	window.addEventListener("resize", onScroll);
}
var parallax = {
	mounted(el, binding) {
		el._parallaxFactor = parseFloat(binding.value) || 0;
		items.add(el);
		tick();
	},
	unmounted(el) {
		items.delete(el);
	}
};
//#endregion
//#region src/main.js
var createApp = ViteSSG(App_default, {
	routes,
	base: "/",
	concurrency: 2,
	formatting: "html",
	dir: "dist",
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) return savedPosition;
		if (to.hash) return {
			el: to.hash,
			behavior: "smooth"
		};
		return { top: 0 };
	}
}, ({ app, head, isClient }) => {
	app.use(createHead());
	app.directive("reveal", reveal);
	app.directive("parallax", parallax);
	if (isClient) import("./assets/virtual_pwa-register-CqR_vCOk.js").then(({ registerSW }) => {
		registerSW({ immediate: true });
	});
});
//#endregion
export { createApp };
