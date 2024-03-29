'use strict';

var utils = require('primevue/utils');
var Ripple = require('primevue/ripple');
var vue = require('vue');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Ripple__default = /*#__PURE__*/_interopDefaultLegacy(Ripple);

var script$2 = {
    name: 'PanelMenuSub',
    emits: ['item-toggle'],
    props: {
        panelId: {
            type: String,
            default: null
        },
        focusedItemId: {
            type: String,
            default: null
        },
        items: {
            type: Array,
            default: null
        },
        level: {
            type: Number,
            default: 0
        },
        template: {
            type: Function,
            default: null
        },
        activeItemPath: {
            type: Object,
            default: null
        },
        exact: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        getItemId(processedItem) {
            return `${this.panelId}_${processedItem.key}`;
        },
        getItemKey(processedItem) {
            return this.getItemId(processedItem);
        },
        getItemProp(processedItem, name, params) {
            return processedItem && processedItem.item ? utils.ObjectUtils.getItemValue(processedItem.item[name], params) : undefined;
        },
        getItemLabel(processedItem) {
            return this.getItemProp(processedItem, 'label');
        },
        isItemActive(processedItem) {
            return this.activeItemPath.some((path) => path.key === processedItem.key);
        },
        isItemVisible(processedItem) {
            return this.getItemProp(processedItem, 'visible') !== false;
        },
        isItemDisabled(processedItem) {
            return this.getItemProp(processedItem, 'disabled');
        },
        isItemFocused(processedItem) {
            return this.focusedItemId === this.getItemId(processedItem);
        },
        isItemGroup(processedItem) {
            return utils.ObjectUtils.isNotEmpty(processedItem.items);
        },
        onItemClick(event, processedItem) {
            this.getItemProp(processedItem, 'command', { originalEvent: event, item: processedItem.item });
            this.$emit('item-toggle', { processedItem, expanded: !this.isItemActive(processedItem) });
        },
        onItemToggle(event) {
            this.$emit('item-toggle', event);
        },
        onItemActionClick(event, navigate) {
            navigate && navigate(event);
        },
        getAriaSetSize() {
            return this.items.filter((processedItem) => this.isItemVisible(processedItem) && !this.getItemProp(processedItem, 'separator')).length;
        },
        getAriaPosInset(index) {
            return index - this.items.slice(0, index).filter((processedItem) => this.isItemVisible(processedItem) && this.getItemProp(processedItem, 'separator')).length + 1;
        },
        getItemClass(processedItem) {
            return [
                'p-menuitem',
                this.getItemProp(processedItem, 'class'),
                {
                    'p-focus': this.isItemFocused(processedItem),
                    'p-disabled': this.isItemDisabled(processedItem)
                }
            ];
        },
        getItemActionClass(processedItem, routerProps) {
            return [
                'p-menuitem-link',
                {
                    'router-link-active': routerProps && routerProps.isActive,
                    'router-link-active-exact': this.exact && routerProps && routerProps.isExactActive
                }
            ];
        },
        getItemIconClass(processedItem) {
            return ['p-menuitem-icon', this.getItemProp(processedItem, 'icon')];
        },
        getItemToggleIconClass(processedItem) {
            return ['p-submenu-icon', this.isItemActive(processedItem) ? 'pi pi-fw pi-chevron-down' : 'pi pi-fw pi-chevron-right'];
        },
        getSeparatorItemClass(processedItem) {
            return ['p-menuitem-separator', this.getItemProp(processedItem, 'class')];
        }
    },
    directives: {
        ripple: Ripple__default["default"]
    }
};

const _hoisted_1$1 = { class: "p-submenu-list" };
const _hoisted_2$1 = ["id", "aria-label", "aria-expanded", "aria-level", "aria-setsize", "aria-posinset"];
const _hoisted_3$1 = ["onClick"];
const _hoisted_4$1 = ["href", "onClick"];
const _hoisted_5$1 = { class: "p-menuitem-text" };
const _hoisted_6$1 = ["href", "target"];
const _hoisted_7$1 = { class: "p-menuitem-text" };
const _hoisted_8$1 = { class: "p-toggleable-content" };

function render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_link = vue.resolveComponent("router-link");
  const _component_PanelMenuSub = vue.resolveComponent("PanelMenuSub", true);
  const _directive_ripple = vue.resolveDirective("ripple");

  return (vue.openBlock(), vue.createElementBlock("ul", _hoisted_1$1, [
    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($props.items, (processedItem, index) => {
      return (vue.openBlock(), vue.createElementBlock(vue.Fragment, {
        key: $options.getItemKey(processedItem)
      }, [
        ($options.isItemVisible(processedItem) && !$options.getItemProp(processedItem, 'separator'))
          ? (vue.openBlock(), vue.createElementBlock("li", {
              key: 0,
              id: $options.getItemId(processedItem),
              style: vue.normalizeStyle($options.getItemProp(processedItem, 'style')),
              class: vue.normalizeClass($options.getItemClass(processedItem)),
              role: "treeitem",
              "aria-label": $options.getItemLabel(processedItem),
              "aria-expanded": $options.isItemGroup(processedItem) ? $options.isItemActive(processedItem) : undefined,
              "aria-level": $props.level + 1,
              "aria-setsize": $options.getAriaSetSize(),
              "aria-posinset": $options.getAriaPosInset(index)
            }, [
              vue.createElementVNode("div", {
                class: "p-menuitem-content",
                onClick: $event => ($options.onItemClick($event, processedItem))
              }, [
                (!$props.template)
                  ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                      ($options.getItemProp(processedItem, 'to') && !$options.isItemDisabled(processedItem))
                        ? (vue.openBlock(), vue.createBlock(_component_router_link, {
                            key: 0,
                            to: $options.getItemProp(processedItem, 'to'),
                            custom: ""
                          }, {
                            default: vue.withCtx(({ navigate, href, isActive, isExactActive }) => [
                              vue.withDirectives((vue.openBlock(), vue.createElementBlock("a", {
                                href: href,
                                class: vue.normalizeClass($options.getItemActionClass(processedItem, { isActive, isExactActive })),
                                tabindex: "-1",
                                "aria-hidden": "true",
                                onClick: $event => ($options.onItemActionClick($event, navigate))
                              }, [
                                ($options.getItemProp(processedItem, 'icon'))
                                  ? (vue.openBlock(), vue.createElementBlock("span", {
                                      key: 0,
                                      class: vue.normalizeClass($options.getItemIconClass(processedItem))
                                    }, null, 2))
                                  : vue.createCommentVNode("", true),
                                vue.createElementVNode("span", _hoisted_5$1, vue.toDisplayString($options.getItemLabel(processedItem)), 1)
                              ], 10, _hoisted_4$1)), [
                                [_directive_ripple]
                              ])
                            ]),
                            _: 2
                          }, 1032, ["to"]))
                        : vue.withDirectives((vue.openBlock(), vue.createElementBlock("a", {
                            key: 1,
                            href: $options.getItemProp(processedItem, 'url'),
                            class: vue.normalizeClass($options.getItemActionClass(processedItem)),
                            target: $options.getItemProp(processedItem, 'target'),
                            tabindex: "-1",
                            "aria-hidden": "true"
                          }, [
                            ($options.isItemGroup(processedItem))
                              ? (vue.openBlock(), vue.createElementBlock("span", {
                                  key: 0,
                                  class: vue.normalizeClass($options.getItemToggleIconClass(processedItem))
                                }, null, 2))
                              : vue.createCommentVNode("", true),
                            ($options.getItemProp(processedItem, 'icon'))
                              ? (vue.openBlock(), vue.createElementBlock("span", {
                                  key: 1,
                                  class: vue.normalizeClass($options.getItemIconClass(processedItem))
                                }, null, 2))
                              : vue.createCommentVNode("", true),
                            vue.createElementVNode("span", _hoisted_7$1, vue.toDisplayString($options.getItemLabel(processedItem)), 1)
                          ], 10, _hoisted_6$1)), [
                            [_directive_ripple]
                          ])
                    ], 64))
                  : (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent($props.template), {
                      key: 1,
                      item: processedItem.item
                    }, null, 8, ["item"]))
              ], 8, _hoisted_3$1),
              vue.createVNode(vue.Transition, { name: "p-toggleable-content" }, {
                default: vue.withCtx(() => [
                  vue.withDirectives(vue.createElementVNode("div", _hoisted_8$1, [
                    ($options.isItemVisible(processedItem) && $options.isItemGroup(processedItem))
                      ? (vue.openBlock(), vue.createBlock(_component_PanelMenuSub, {
                          key: 0,
                          id: $options.getItemId(processedItem) + '_list',
                          role: "group",
                          panelId: $props.panelId,
                          focusedItemId: $props.focusedItemId,
                          items: processedItem.items,
                          level: $props.level + 1,
                          template: $props.template,
                          activeItemPath: $props.activeItemPath,
                          exact: $props.exact,
                          onItemToggle: $options.onItemToggle
                        }, null, 8, ["id", "panelId", "focusedItemId", "items", "level", "template", "activeItemPath", "exact", "onItemToggle"]))
                      : vue.createCommentVNode("", true)
                  ], 512), [
                    [vue.vShow, $options.isItemActive(processedItem)]
                  ])
                ]),
                _: 2
              }, 1024)
            ], 14, _hoisted_2$1))
          : vue.createCommentVNode("", true),
        ($options.isItemVisible(processedItem) && $options.getItemProp(processedItem, 'separator'))
          ? (vue.openBlock(), vue.createElementBlock("li", {
              key: 1,
              style: vue.normalizeStyle($options.getItemProp(processedItem, 'style')),
              class: vue.normalizeClass($options.getSeparatorItemClass(processedItem)),
              role: "separator"
            }, null, 6))
          : vue.createCommentVNode("", true)
      ], 64))
    }), 128))
  ]))
}

script$2.render = render$2;

var script$1 = {
    name: 'PanelMenuList',
    emits: ['item-toggle', 'header-focus'],
    props: {
        panelId: {
            type: String,
            default: null
        },
        items: {
            type: Array,
            default: null
        },
        template: {
            type: Function,
            default: null
        },
        expandedKeys: {
            type: Object,
            default: null
        },
        exact: {
            type: Boolean,
            default: true
        }
    },
    searchTimeout: null,
    searchValue: null,
    data() {
        return {
            focused: false,
            focusedItem: null,
            activeItemPath: []
        };
    },
    watch: {
        expandedKeys(newValue) {
            this.autoUpdateActiveItemPath(newValue);
        }
    },
    mounted() {
        this.autoUpdateActiveItemPath(this.expandedKeys);
    },
    methods: {
        getItemProp(processedItem, name) {
            return processedItem && processedItem.item ? utils.ObjectUtils.getItemValue(processedItem.item[name]) : undefined;
        },
        getItemLabel(processedItem) {
            return this.getItemProp(processedItem, 'label');
        },
        isItemVisible(processedItem) {
            return this.getItemProp(processedItem, 'visible') !== false;
        },
        isItemDisabled(processedItem) {
            return this.getItemProp(processedItem, 'disabled');
        },
        isItemActive(processedItem) {
            return this.activeItemPath.some((path) => path.key === processedItem.parentKey);
        },
        isItemGroup(processedItem) {
            return utils.ObjectUtils.isNotEmpty(processedItem.items);
        },
        onFocus(event) {
            this.focused = true;
            this.focusedItem = this.focusedItem || (this.isElementInPanel(event, event.relatedTarget) ? this.findFirstItem() : this.findLastItem());
        },
        onBlur() {
            this.focused = false;
            this.focusedItem = null;
            this.searchValue = '';
        },
        onKeyDown(event) {
            const metaKey = event.metaKey || event.ctrlKey;

            switch (event.code) {
                case 'ArrowDown':
                    this.onArrowDownKey(event);
                    break;

                case 'ArrowUp':
                    this.onArrowUpKey(event);
                    break;

                case 'ArrowLeft':
                    this.onArrowLeftKey(event);
                    break;

                case 'ArrowRight':
                    this.onArrowRightKey(event);
                    break;

                case 'Home':
                    this.onHomeKey(event);
                    break;

                case 'End':
                    this.onEndKey(event);
                    break;

                case 'Space':
                    this.onSpaceKey(event);
                    break;

                case 'Enter':
                    this.onEnterKey(event);
                    break;

                case 'Escape':
                case 'Tab':
                case 'PageDown':
                case 'PageUp':
                case 'Backspace':
                case 'ShiftLeft':
                case 'ShiftRight':
                    //NOOP
                    break;

                default:
                    if (!metaKey && utils.ObjectUtils.isPrintableCharacter(event.key)) {
                        this.searchItems(event, event.key);
                    }

                    break;
            }
        },
        onArrowDownKey(event) {
            const processedItem = utils.ObjectUtils.isNotEmpty(this.focusedItem) ? this.findNextItem(this.focusedItem) : this.findFirstItem();

            this.changeFocusedItem({ originalEvent: event, processedItem, focusOnNext: true });
            event.preventDefault();
        },
        onArrowUpKey(event) {
            const processedItem = utils.ObjectUtils.isNotEmpty(this.focusedItem) ? this.findPrevItem(this.focusedItem) : this.findLastItem();

            this.changeFocusedItem({ originalEvent: event, processedItem, selfCheck: true });
            event.preventDefault();
        },
        onArrowLeftKey(event) {
            if (utils.ObjectUtils.isNotEmpty(this.focusedItem)) {
                const matched = this.activeItemPath.some((p) => p.key === this.focusedItem.key);

                if (matched) {
                    this.activeItemPath = this.activeItemPath.filter((p) => p.key !== this.focusedItem.key);
                } else {
                    this.focusedItem = utils.ObjectUtils.isNotEmpty(this.focusedItem.parent) ? this.focusedItem.parent : this.focusedItem;
                }

                event.preventDefault();
            }
        },
        onArrowRightKey(event) {
            if (utils.ObjectUtils.isNotEmpty(this.focusedItem)) {
                const grouped = this.isItemGroup(this.focusedItem);

                if (grouped) {
                    const matched = this.activeItemPath.some((p) => p.key === this.focusedItem.key);

                    if (matched) {
                        this.onArrowDownKey(event);
                    } else {
                        this.activeItemPath = this.activeItemPath.filter((p) => p.parentKey !== this.focusedItem.parentKey);
                        this.activeItemPath.push(this.focusedItem);
                    }
                }

                event.preventDefault();
            }
        },
        onHomeKey(event) {
            this.changeFocusedItem({ originalEvent: event, processedItem: this.findFirstItem(), allowHeaderFocus: false });
            event.preventDefault();
        },
        onEndKey(event) {
            this.changeFocusedItem({ originalEvent: event, processedItem: this.findLastItem(), focusOnNext: true, allowHeaderFocus: false });
            event.preventDefault();
        },
        onEnterKey(event) {
            if (utils.ObjectUtils.isNotEmpty(this.focusedItem)) {
                const element = utils.DomHandler.findSingle(this.$el, `li[id="${`${this.focusedItemId}`}"]`);
                const anchorElement = element && (utils.DomHandler.findSingle(element, '.p-menuitem-link') || utils.DomHandler.findSingle(element, 'a,button'));

                anchorElement ? anchorElement.click() : element && element.click();
            }

            event.preventDefault();
        },
        onSpaceKey(event) {
            this.onEnterKey(event);
        },
        onItemToggle(event) {
            const { processedItem, expanded } = event;

            if (this.expandedKeys) {
                this.$emit('item-toggle', { item: processedItem.item, expanded });
            } else {
                this.activeItemPath = this.activeItemPath.filter((p) => p.parentKey !== processedItem.parentKey);
                expanded && this.activeItemPath.push(processedItem);
            }

            this.focusedItem = processedItem;
            utils.DomHandler.focus(this.$el);
        },
        isElementInPanel(event, element) {
            const panel = event.currentTarget.closest('.p-panelmenu-panel');

            return panel && panel.contains(element);
        },
        isItemMatched(processedItem) {
            return this.isValidItem(processedItem) && this.getItemLabel(processedItem).toLocaleLowerCase(this.searchLocale).startsWith(this.searchValue.toLocaleLowerCase(this.searchLocale));
        },
        isVisibleItem(processedItem) {
            return !!processedItem && (processedItem.level === 0 || this.isItemActive(processedItem)) && this.isItemVisible(processedItem);
        },
        isValidItem(processedItem) {
            return !!processedItem && !this.isItemDisabled(processedItem);
        },
        findFirstItem() {
            return this.visibleItems.find((processedItem) => this.isValidItem(processedItem));
        },
        findLastItem() {
            return utils.ObjectUtils.findLast(this.visibleItems, (processedItem) => this.isValidItem(processedItem));
        },
        findNextItem(processedItem) {
            const index = this.visibleItems.findIndex((item) => item.key === processedItem.key);
            const matchedItem = index < this.visibleItems.length - 1 ? this.visibleItems.slice(index + 1).find((pItem) => this.isValidItem(pItem)) : undefined;

            return matchedItem || processedItem;
        },
        findPrevItem(processedItem) {
            const index = this.visibleItems.findIndex((item) => item.key === processedItem.key);
            const matchedItem = index > 0 ? utils.ObjectUtils.findLast(this.visibleItems.slice(0, index), (pItem) => this.isValidItem(pItem)) : undefined;

            return matchedItem || processedItem;
        },
        searchItems(event, char) {
            this.searchValue = (this.searchValue || '') + char;

            let matchedItem = null;
            let matched = false;

            if (utils.ObjectUtils.isNotEmpty(this.focusedItem)) {
                const focusedItemIndex = this.visibleItems.findIndex((processedItem) => processedItem.key === this.focusedItem.key);

                matchedItem = this.visibleItems.slice(focusedItemIndex).find((processedItem) => this.isItemMatched(processedItem));
                matchedItem = utils.ObjectUtils.isEmpty(matchedItem) ? this.visibleItems.slice(0, focusedItemIndex).find((processedItem) => this.isItemMatched(processedItem)) : matchedItem;
            } else {
                matchedItem = this.visibleItems.find((processedItem) => this.isItemMatched(processedItem));
            }

            if (utils.ObjectUtils.isNotEmpty(matchedItem)) {
                matched = true;
            }

            if (utils.ObjectUtils.isEmpty(matchedItem) && utils.ObjectUtils.isEmpty(this.focusedItem)) {
                matchedItem = this.findFirstItem();
            }

            if (utils.ObjectUtils.isNotEmpty(matchedItem)) {
                this.changeFocusedItem({
                    originalEvent: event,
                    processedItem: matchedItem,
                    allowHeaderFocus: false
                });
            }

            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }

            this.searchTimeout = setTimeout(() => {
                this.searchValue = '';
                this.searchTimeout = null;
            }, 500);

            return matched;
        },
        changeFocusedItem(event) {
            const { originalEvent, processedItem, focusOnNext, selfCheck, allowHeaderFocus = true } = event;

            if (utils.ObjectUtils.isNotEmpty(this.focusedItem) && this.focusedItem.key !== processedItem.key) {
                this.focusedItem = processedItem;
                this.scrollInView();
            } else if (allowHeaderFocus) {
                this.$emit('header-focus', { originalEvent, focusOnNext, selfCheck });
            }
        },
        scrollInView() {
            const element = utils.DomHandler.findSingle(this.$el, `li[id="${`${this.focusedItemId}`}"]`);

            if (element) {
                element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'start' });
            }
        },
        autoUpdateActiveItemPath(expandedKeys) {
            this.activeItemPath = Object.entries(expandedKeys || {}).reduce((acc, [key, val]) => {
                if (val) {
                    const processedItem = this.findProcessedItemByItemKey(key);

                    processedItem && acc.push(processedItem);
                }

                return acc;
            }, []);
        },
        findProcessedItemByItemKey(key, processedItems, level = 0) {
            processedItems = processedItems || (level === 0 && this.processedItems);

            if (!processedItems) return null;

            for (let i = 0; i < processedItems.length; i++) {
                const processedItem = processedItems[i];

                if (this.getItemProp(processedItem, 'key') === key) return processedItem;

                const matchedItem = this.findProcessedItemByItemKey(key, processedItem.items, level + 1);

                if (matchedItem) return matchedItem;
            }
        },
        createProcessedItems(items, level = 0, parent = {}, parentKey = '') {
            const processedItems = [];

            items &&
                items.forEach((item, index) => {
                    const key = (parentKey !== '' ? parentKey + '_' : '') + index;
                    const newItem = {
                        item,
                        index,
                        level,
                        key,
                        parent,
                        parentKey
                    };

                    newItem['items'] = this.createProcessedItems(item.items, level + 1, newItem, key);
                    processedItems.push(newItem);
                });

            return processedItems;
        },
        flatItems(processedItems, processedFlattenItems = []) {
            processedItems &&
                processedItems.forEach((processedItem) => {
                    if (this.isVisibleItem(processedItem)) {
                        processedFlattenItems.push(processedItem);
                        this.flatItems(processedItem.items, processedFlattenItems);
                    }
                });

            return processedFlattenItems;
        }
    },
    computed: {
        processedItems() {
            return this.createProcessedItems(this.items || []);
        },
        visibleItems() {
            return this.flatItems(this.processedItems);
        },
        focusedItemId() {
            return utils.ObjectUtils.isNotEmpty(this.focusedItem) ? `${this.panelId}_${this.focusedItem.key}` : null;
        }
    },
    components: {
        PanelMenuSub: script$2
    }
};

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_PanelMenuSub = vue.resolveComponent("PanelMenuSub");

  return (vue.openBlock(), vue.createBlock(_component_PanelMenuSub, {
    id: $props.panelId + '_list',
    class: "p-panelmenu-root-list",
    role: "tree",
    tabindex: -1,
    "aria-activedescendant": $data.focused ? $options.focusedItemId : undefined,
    panelId: $props.panelId,
    focusedItemId: $data.focused ? $options.focusedItemId : undefined,
    items: $options.processedItems,
    template: $props.template,
    activeItemPath: $data.activeItemPath,
    exact: $props.exact,
    onFocus: $options.onFocus,
    onBlur: $options.onBlur,
    onKeydown: $options.onKeyDown,
    onItemToggle: $options.onItemToggle
  }, null, 8, ["id", "aria-activedescendant", "panelId", "focusedItemId", "items", "template", "activeItemPath", "exact", "onFocus", "onBlur", "onKeydown", "onItemToggle"]))
}

script$1.render = render$1;

var script = {
    name: 'PanelMenu',
    emits: ['update:expandedKeys', 'panel-open', 'panel-close'],
    props: {
        model: {
            type: Array,
            default: null
        },
        expandedKeys: {
            type: Object,
            default: null
        },
        exact: {
            type: Boolean,
            default: true
        },
        tabindex: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            id: this.$attrs.id,
            activeItem: null
        };
    },
    watch: {
        '$attrs.id': function (newValue) {
            this.id = newValue || utils.UniqueComponentId();
        }
    },
    mounted() {
        this.id = this.id || utils.UniqueComponentId();
    },
    methods: {
        getItemProp(item, name) {
            return item ? utils.ObjectUtils.getItemValue(item[name]) : undefined;
        },
        getItemLabel(item) {
            return this.getItemProp(item, 'label');
        },
        isItemActive(item) {
            return this.expandedKeys ? this.expandedKeys[this.getItemProp(item, 'key')] : utils.ObjectUtils.equals(item, this.activeItem);
        },
        isItemVisible(item) {
            return this.getItemProp(item, 'visible') !== false;
        },
        isItemDisabled(item) {
            return this.getItemProp(item, 'disabled');
        },
        getPanelId(index) {
            return `${this.id}_${index}`;
        },
        getPanelKey(index) {
            return this.getPanelId(index);
        },
        getHeaderId(index) {
            return `${this.getPanelId(index)}_header`;
        },
        getContentId(index) {
            return `${this.getPanelId(index)}_content`;
        },
        onHeaderClick(event, item) {
            if (this.isItemDisabled(item)) {
                event.preventDefault();

                return;
            }

            if (item.command) {
                item.command({ originalEvent: event, item });
            }

            this.changeActiveItem(event, item);
            utils.DomHandler.focus(event.currentTarget);
        },
        onHeaderKeyDown(event, item) {
            switch (event.code) {
                case 'ArrowDown':
                    this.onHeaderArrowDownKey(event);
                    break;

                case 'ArrowUp':
                    this.onHeaderArrowUpKey(event);
                    break;

                case 'Home':
                    this.onHeaderHomeKey(event);
                    break;

                case 'End':
                    this.onHeaderEndKey(event);
                    break;

                case 'Enter':
                case 'Space':
                    this.onHeaderEnterKey(event, item);
                    break;
            }
        },
        onHeaderArrowDownKey(event) {
            const rootList = utils.DomHandler.hasClass(event.currentTarget, 'p-highlight') ? utils.DomHandler.findSingle(event.currentTarget.nextElementSibling, '.p-panelmenu-root-list') : null;

            rootList ? utils.DomHandler.focus(rootList) : this.updateFocusedHeader({ originalEvent: event, focusOnNext: true });
            event.preventDefault();
        },
        onHeaderArrowUpKey(event) {
            const prevHeader = this.findPrevHeader(event.currentTarget.parentElement) || this.findLastHeader();
            const rootList = utils.DomHandler.hasClass(prevHeader, 'p-highlight') ? utils.DomHandler.findSingle(prevHeader.nextElementSibling, '.p-panelmenu-root-list') : null;

            rootList ? utils.DomHandler.focus(rootList) : this.updateFocusedHeader({ originalEvent: event, focusOnNext: false });
            event.preventDefault();
        },
        onHeaderHomeKey(event) {
            this.changeFocusedHeader(event, this.findFirstHeader());
            event.preventDefault();
        },
        onHeaderEndKey(event) {
            this.changeFocusedHeader(event, this.findLastHeader());
            event.preventDefault();
        },
        onHeaderEnterKey(event, item) {
            const headerAction = utils.DomHandler.findSingle(event.currentTarget, '.p-panelmenu-header-action');

            headerAction ? headerAction.click() : this.onHeaderClick(event, item);
            event.preventDefault();
        },
        onHeaderActionClick(event, navigate) {
            navigate && navigate(event);
        },
        findNextHeader(panelElement, selfCheck = false) {
            const nextPanelElement = selfCheck ? panelElement : panelElement.nextElementSibling;
            const headerElement = utils.DomHandler.findSingle(nextPanelElement, '.p-panelmenu-header');

            return headerElement ? (utils.DomHandler.hasClass(headerElement, 'p-disabled') ? this.findNextHeader(headerElement.parentElement) : headerElement) : null;
        },
        findPrevHeader(panelElement, selfCheck = false) {
            const prevPanelElement = selfCheck ? panelElement : panelElement.previousElementSibling;
            const headerElement = utils.DomHandler.findSingle(prevPanelElement, '.p-panelmenu-header');

            return headerElement ? (utils.DomHandler.hasClass(headerElement, 'p-disabled') ? this.findPrevHeader(headerElement.parentElement) : headerElement) : null;
        },
        findFirstHeader() {
            return this.findNextHeader(this.$el.firstElementChild, true);
        },
        findLastHeader() {
            return this.findPrevHeader(this.$el.lastElementChild, true);
        },
        updateFocusedHeader(event) {
            const { originalEvent, focusOnNext, selfCheck } = event;
            const panelElement = originalEvent.currentTarget.closest('.p-panelmenu-panel');
            const header = selfCheck ? utils.DomHandler.findSingle(panelElement, '.p-panelmenu-header') : focusOnNext ? this.findNextHeader(panelElement) : this.findPrevHeader(panelElement);

            header ? this.changeFocusedHeader(originalEvent, header) : focusOnNext ? this.onHeaderHomeKey(originalEvent) : this.onHeaderEndKey(originalEvent);
        },
        changeActiveItem(event, item, selfActive = false) {
            if (!this.isItemDisabled(item)) {
                const active = this.isItemActive(item);
                const eventName = !active ? 'panel-open' : 'panel-close';

                this.activeItem = selfActive ? item : this.activeItem && utils.ObjectUtils.equals(item, this.activeItem) ? null : item;
                this.changeExpandedKeys({ item, expanded: !active });
                this.$emit(eventName, { originalEvent: event, item });
            }
        },
        changeExpandedKeys({ item, expanded = false }) {
            if (this.expandedKeys) {
                let _keys = { ...this.expandedKeys };

                if (expanded) _keys[item.key] = true;
                else delete _keys[item.key];

                this.$emit('update:expandedKeys', _keys);
            }
        },
        changeFocusedHeader(event, element) {
            element && utils.DomHandler.focus(element);
        },
        getPanelClass(item) {
            return ['p-panelmenu-panel', this.getItemProp(item, 'class')];
        },
        getHeaderClass(item) {
            return [
                'p-panelmenu-header',
                this.getItemProp(item, 'headerClass'),
                {
                    'p-highlight': this.isItemActive(item),
                    'p-disabled': this.isItemDisabled(item)
                }
            ];
        },
        getHeaderActionClass(item, routerProps) {
            return [
                'p-panelmenu-header-action',
                {
                    'router-link-active': routerProps && routerProps.isActive,
                    'router-link-active-exact': this.exact && routerProps && routerProps.isExactActive
                }
            ];
        },
        getHeaderIconClass(item) {
            return ['p-menuitem-icon', this.getItemProp(item, 'icon')];
        },
        getHeaderToggleIconClass(item) {
            return ['p-submenu-icon', this.isItemActive(item) ? 'pi pi-chevron-down' : 'pi pi-chevron-right'];
        }
    },
    components: {
        PanelMenuList: script$1
    }
};

const _hoisted_1 = ["id"];
const _hoisted_2 = ["id", "tabindex", "aria-label", "aria-expanded", "aria-controls", "aria-disabled", "onClick", "onKeydown"];
const _hoisted_3 = { class: "p-panelmenu-header-content" };
const _hoisted_4 = ["href", "onClick"];
const _hoisted_5 = { class: "p-menuitem-text" };
const _hoisted_6 = ["href"];
const _hoisted_7 = { class: "p-menuitem-text" };
const _hoisted_8 = ["id", "aria-labelledby"];
const _hoisted_9 = {
  key: 0,
  class: "p-panelmenu-content"
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_link = vue.resolveComponent("router-link");
  const _component_PanelMenuList = vue.resolveComponent("PanelMenuList");

  return (vue.openBlock(), vue.createElementBlock("div", {
    id: $data.id,
    class: "p-panelmenu p-component"
  }, [
    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($props.model, (item, index) => {
      return (vue.openBlock(), vue.createElementBlock(vue.Fragment, {
        key: $options.getPanelKey(index)
      }, [
        ($options.isItemVisible(item))
          ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              style: vue.normalizeStyle($options.getItemProp(item, 'style')),
              class: vue.normalizeClass($options.getPanelClass(item))
            }, [
              vue.createElementVNode("div", {
                id: $options.getHeaderId(index),
                class: vue.normalizeClass($options.getHeaderClass(item)),
                tabindex: $options.isItemDisabled(item) ? -1 : $props.tabindex,
                role: "button",
                "aria-label": $options.getItemLabel(item),
                "aria-expanded": $options.isItemActive(item),
                "aria-controls": $options.getContentId(index),
                "aria-disabled": $options.isItemDisabled(item),
                onClick: $event => ($options.onHeaderClick($event, item)),
                onKeydown: $event => ($options.onHeaderKeyDown($event, item))
              }, [
                vue.createElementVNode("div", _hoisted_3, [
                  (!_ctx.$slots.item)
                    ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                        ($options.getItemProp(item, 'to') && !$options.isItemDisabled(item))
                          ? (vue.openBlock(), vue.createBlock(_component_router_link, {
                              key: 0,
                              to: $options.getItemProp(item, 'to'),
                              custom: ""
                            }, {
                              default: vue.withCtx(({ navigate, href, isActive, isExactActive }) => [
                                vue.createElementVNode("a", {
                                  href: href,
                                  class: vue.normalizeClass($options.getHeaderActionClass(item, { isActive, isExactActive })),
                                  tabindex: -1,
                                  onClick: $event => ($options.onHeaderActionClick($event, navigate))
                                }, [
                                  ($options.getItemProp(item, 'icon'))
                                    ? (vue.openBlock(), vue.createElementBlock("span", {
                                        key: 0,
                                        class: vue.normalizeClass($options.getHeaderIconClass(item))
                                      }, null, 2))
                                    : vue.createCommentVNode("", true),
                                  vue.createElementVNode("span", _hoisted_5, vue.toDisplayString($options.getItemLabel(item)), 1)
                                ], 10, _hoisted_4)
                              ]),
                              _: 2
                            }, 1032, ["to"]))
                          : (vue.openBlock(), vue.createElementBlock("a", {
                              key: 1,
                              href: $options.getItemProp(item, 'url'),
                              class: vue.normalizeClass($options.getHeaderActionClass(item)),
                              tabindex: -1
                            }, [
                              ($options.getItemProp(item, 'items'))
                                ? (vue.openBlock(), vue.createElementBlock("span", {
                                    key: 0,
                                    class: vue.normalizeClass($options.getHeaderToggleIconClass(item))
                                  }, null, 2))
                                : vue.createCommentVNode("", true),
                              ($options.getItemProp(item, 'icon'))
                                ? (vue.openBlock(), vue.createElementBlock("span", {
                                    key: 1,
                                    class: vue.normalizeClass($options.getHeaderIconClass(item))
                                  }, null, 2))
                                : vue.createCommentVNode("", true),
                              vue.createElementVNode("span", _hoisted_7, vue.toDisplayString($options.getItemLabel(item)), 1)
                            ], 10, _hoisted_6))
                      ], 64))
                    : (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.$slots.item), {
                        key: 1,
                        item: item
                      }, null, 8, ["item"]))
                ])
              ], 42, _hoisted_2),
              vue.createVNode(vue.Transition, { name: "p-toggleable-content" }, {
                default: vue.withCtx(() => [
                  vue.withDirectives(vue.createElementVNode("div", {
                    id: $options.getContentId(index),
                    class: "p-toggleable-content",
                    role: "region",
                    "aria-labelledby": $options.getHeaderId(index)
                  }, [
                    ($options.getItemProp(item, 'items'))
                      ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_9, [
                          vue.createVNode(_component_PanelMenuList, {
                            panelId: $options.getPanelId(index),
                            items: $options.getItemProp(item, 'items'),
                            template: _ctx.$slots.item,
                            expandedKeys: $props.expandedKeys,
                            onItemToggle: $options.changeExpandedKeys,
                            onHeaderFocus: $options.updateFocusedHeader,
                            exact: $props.exact
                          }, null, 8, ["panelId", "items", "template", "expandedKeys", "onItemToggle", "onHeaderFocus", "exact"])
                        ]))
                      : vue.createCommentVNode("", true)
                  ], 8, _hoisted_8), [
                    [vue.vShow, $options.isItemActive(item)]
                  ])
                ]),
                _: 2
              }, 1024)
            ], 6))
          : vue.createCommentVNode("", true)
      ], 64))
    }), 128))
  ], 8, _hoisted_1))
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "\n.p-panelmenu .p-panelmenu-header-action {\r\n    display: flex;\r\n    align-items: center;\r\n    user-select: none;\r\n    cursor: pointer;\r\n    position: relative;\r\n    text-decoration: none;\n}\n.p-panelmenu .p-panelmenu-header-action:focus {\r\n    z-index: 1;\n}\n.p-panelmenu .p-submenu-list {\r\n    margin: 0;\r\n    padding: 0;\r\n    list-style: none;\n}\n.p-panelmenu .p-menuitem-link {\r\n    display: flex;\r\n    align-items: center;\r\n    user-select: none;\r\n    cursor: pointer;\r\n    text-decoration: none;\r\n    position: relative;\r\n    overflow: hidden;\n}\n.p-panelmenu .p-menuitem-text {\r\n    line-height: 1;\n}\r\n";
styleInject(css_248z);

script.render = render;

module.exports = script;
