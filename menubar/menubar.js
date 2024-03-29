this.primevue = this.primevue || {};
this.primevue.menubar = (function (utils, Ripple, vue) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var Ripple__default = /*#__PURE__*/_interopDefaultLegacy(Ripple);

    var script$1 = {
        name: 'MenubarSub',
        emits: ['item-mouseenter', 'item-click'],
        props: {
            items: {
                type: Array,
                default: null
            },
            root: {
                type: Boolean,
                default: false
            },
            popup: {
                type: Boolean,
                default: false
            },
            mobileActive: {
                type: Boolean,
                default: false
            },
            template: {
                type: Function,
                default: null
            },
            exact: {
                type: Boolean,
                default: true
            },
            level: {
                type: Number,
                default: 0
            },
            menuId: {
                type: String,
                default: null
            },
            focusedItemId: {
                type: String,
                default: null
            },
            activeItemPath: {
                type: Object,
                default: null
            }
        },
        list: null,
        methods: {
            getItemId(processedItem) {
                return `${this.menuId}_${processedItem.key}`;
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
                this.$emit('item-click', { originalEvent: event, processedItem, isFocus: true });
            },
            onItemMouseEnter(event, processedItem) {
                this.$emit('item-mouseenter', { originalEvent: event, processedItem });
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
                        'p-menuitem-active p-highlight': this.isItemActive(processedItem),
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
            getSeparatorItemClass(processedItem) {
                return ['p-menuitem-separator', this.getItemProp(processedItem, 'class')];
            },
            getSubmenuIcon() {
                return ['p-submenu-icon pi', { 'pi-angle-right': !this.root, 'pi-angle-down': this.root }];
            }
        },
        computed: {
            containerClass() {
                return { 'p-submenu-list': !this.root, 'p-menubar-root-list': this.root };
            }
        },
        directives: {
            ripple: Ripple__default["default"]
        }
    };

    const _hoisted_1$1 = ["id", "aria-label", "aria-disabled", "aria-expanded", "aria-haspopup", "aria-level", "aria-setsize", "aria-posinset"];
    const _hoisted_2$1 = ["onClick", "onMouseenter"];
    const _hoisted_3$1 = ["href", "onClick"];
    const _hoisted_4$1 = { class: "p-menuitem-text" };
    const _hoisted_5$1 = ["href", "target"];
    const _hoisted_6 = { class: "p-menuitem-text" };
    const _hoisted_7 = ["id"];

    function render$1(_ctx, _cache, $props, $setup, $data, $options) {
      const _component_router_link = vue.resolveComponent("router-link");
      const _component_MenubarSub = vue.resolveComponent("MenubarSub", true);
      const _directive_ripple = vue.resolveDirective("ripple");

      return (vue.openBlock(), vue.createElementBlock("ul", null, [
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
                  role: "menuitem",
                  "aria-label": $options.getItemLabel(processedItem),
                  "aria-disabled": $options.isItemDisabled(processedItem) || undefined,
                  "aria-expanded": $options.isItemGroup(processedItem) ? $options.isItemActive(processedItem) : undefined,
                  "aria-haspopup": $options.isItemGroup(processedItem) && !$options.getItemProp(processedItem, 'to') ? 'menu' : undefined,
                  "aria-level": $props.level + 1,
                  "aria-setsize": $options.getAriaSetSize(),
                  "aria-posinset": $options.getAriaPosInset(index)
                }, [
                  vue.createElementVNode("div", {
                    class: "p-menuitem-content",
                    onClick: $event => ($options.onItemClick($event, processedItem)),
                    onMouseenter: $event => ($options.onItemMouseEnter($event, processedItem))
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
                                    vue.createElementVNode("span", _hoisted_4$1, vue.toDisplayString($options.getItemLabel(processedItem)), 1)
                                  ], 10, _hoisted_3$1)), [
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
                                ($options.getItemProp(processedItem, 'icon'))
                                  ? (vue.openBlock(), vue.createElementBlock("span", {
                                      key: 0,
                                      class: vue.normalizeClass($options.getItemIconClass(processedItem))
                                    }, null, 2))
                                  : vue.createCommentVNode("", true),
                                vue.createElementVNode("span", _hoisted_6, vue.toDisplayString($options.getItemLabel(processedItem)), 1),
                                ($options.getItemProp(processedItem, 'items'))
                                  ? (vue.openBlock(), vue.createElementBlock("span", {
                                      key: 1,
                                      class: vue.normalizeClass($options.getSubmenuIcon())
                                    }, null, 2))
                                  : vue.createCommentVNode("", true)
                              ], 10, _hoisted_5$1)), [
                                [_directive_ripple]
                              ])
                        ], 64))
                      : (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent($props.template), {
                          key: 1,
                          item: processedItem.item
                        }, null, 8, ["item"]))
                  ], 40, _hoisted_2$1),
                  ($options.isItemVisible(processedItem) && $options.isItemGroup(processedItem))
                    ? (vue.openBlock(), vue.createBlock(_component_MenubarSub, {
                        key: 0,
                        menuId: $props.menuId,
                        role: "menu",
                        class: "p-submenu-list",
                        focusedItemId: $props.focusedItemId,
                        items: processedItem.items,
                        mobileActive: $props.mobileActive,
                        activeItemPath: $props.activeItemPath,
                        template: $props.template,
                        exact: $props.exact,
                        level: $props.level + 1,
                        onItemClick: _cache[0] || (_cache[0] = $event => (_ctx.$emit('item-click', $event))),
                        onItemMouseenter: _cache[1] || (_cache[1] = $event => (_ctx.$emit('item-mouseenter', $event)))
                      }, null, 8, ["menuId", "focusedItemId", "items", "mobileActive", "activeItemPath", "template", "exact", "level"]))
                    : vue.createCommentVNode("", true)
                ], 14, _hoisted_1$1))
              : vue.createCommentVNode("", true),
            ($options.isItemVisible(processedItem) && $options.getItemProp(processedItem, 'separator'))
              ? (vue.openBlock(), vue.createElementBlock("li", {
                  key: 1,
                  id: $options.getItemId(processedItem),
                  style: vue.normalizeStyle($options.getItemProp(processedItem, 'style')),
                  class: vue.normalizeClass($options.getSeparatorItemClass(processedItem)),
                  role: "separator"
                }, null, 14, _hoisted_7))
              : vue.createCommentVNode("", true)
          ], 64))
        }), 128))
      ]))
    }

    script$1.render = render$1;

    var script = {
        name: 'Menubar',
        emits: ['focus', 'blur'],
        props: {
            model: {
                type: Array,
                default: null
            },
            exact: {
                type: Boolean,
                default: true
            },
            buttonProps: {
                type: null,
                default: null
            },
            'aria-labelledby': {
                type: String,
                default: null
            },
            'aria-label': {
                type: String,
                default: null
            }
        },
        data() {
            return {
                id: this.$attrs.id,
                mobileActive: false,
                focused: false,
                focusedItemInfo: { index: -1, level: 0, parentKey: '' },
                activeItemPath: [],
                dirty: false
            };
        },
        watch: {
            '$attrs.id': function (newValue) {
                this.id = newValue || utils.UniqueComponentId();
            },
            activeItemPath(newPath) {
                if (utils.ObjectUtils.isNotEmpty(newPath)) {
                    this.bindOutsideClickListener();
                    this.bindResizeListener();
                } else {
                    this.unbindOutsideClickListener();
                    this.unbindResizeListener();
                }
            }
        },
        outsideClickListener: null,
        container: null,
        menubar: null,
        mounted() {
            this.id = this.id || utils.UniqueComponentId();
        },
        beforeUnmount() {
            this.mobileActive = false;
            this.unbindOutsideClickListener();
            this.unbindResizeListener();

            if (this.container) {
                utils.ZIndexUtils.clear(this.container);
            }

            this.container = null;
        },
        methods: {
            getItemProp(item, name) {
                return item ? utils.ObjectUtils.getItemValue(item[name]) : undefined;
            },
            getItemLabel(item) {
                return this.getItemProp(item, 'label');
            },
            isItemDisabled(item) {
                return this.getItemProp(item, 'disabled');
            },
            isItemGroup(item) {
                return utils.ObjectUtils.isNotEmpty(this.getItemProp(item, 'items'));
            },
            isItemSeparator(item) {
                return this.getItemProp(item, 'separator');
            },
            getProccessedItemLabel(processedItem) {
                return processedItem ? this.getItemLabel(processedItem.item) : undefined;
            },
            isProccessedItemGroup(processedItem) {
                return processedItem && utils.ObjectUtils.isNotEmpty(processedItem.items);
            },
            toggle(event) {
                if (this.mobileActive) {
                    this.mobileActive = false;
                    utils.ZIndexUtils.clear(this.menubar);
                    this.hide();
                } else {
                    this.mobileActive = true;
                    utils.ZIndexUtils.set('menu', this.menubar, this.$primevue.config.zIndex.menu);
                    setTimeout(() => {
                        this.show();
                    }, 0);
                }

                this.bindOutsideClickListener();
                event.preventDefault();
            },
            show() {
                this.focusedItemInfo = { index: this.findFirstFocusedItemIndex(), level: 0, parentKey: '' };

                utils.DomHandler.focus(this.menubar);
            },
            hide(event, isFocus) {
                if (this.mobileActive) {
                    setTimeout(() => {
                        utils.DomHandler.focus(this.$refs.menubutton);
                    }, 0);
                }

                this.activeItemPath = [];
                this.focusedItemInfo = { index: -1, level: 0, parentKey: '' };

                isFocus && utils.DomHandler.focus(this.menubar);
                this.dirty = false;
            },
            onFocus(event) {
                this.focused = true;
                this.focusedItemInfo = this.focusedItemInfo.index !== -1 ? this.focusedItemInfo : { index: this.findFirstFocusedItemIndex(), level: 0, parentKey: '' };
                this.$emit('focus', event);
            },
            onBlur(event) {
                this.focused = false;
                this.focusedItemInfo = { index: -1, level: 0, parentKey: '' };
                this.searchValue = '';
                this.dirty = false;
                this.$emit('blur', event);
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
                        this.onEscapeKey(event);
                        break;

                    case 'Tab':
                        this.onTabKey(event);
                        break;

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
            onItemChange(event) {
                const { processedItem, isFocus } = event;

                if (utils.ObjectUtils.isEmpty(processedItem)) return;

                const { index, key, level, parentKey, items } = processedItem;
                const grouped = utils.ObjectUtils.isNotEmpty(items);
                const activeItemPath = this.activeItemPath.filter((p) => p.parentKey !== parentKey && p.parentKey !== key);

                grouped && activeItemPath.push(processedItem);

                this.focusedItemInfo = { index, level, parentKey };
                this.activeItemPath = activeItemPath;

                grouped && (this.dirty = true);
                isFocus && utils.DomHandler.focus(this.menubar);
            },
            onItemClick(event) {
                const { originalEvent, processedItem } = event;
                const grouped = this.isProccessedItemGroup(processedItem);
                const root = utils.ObjectUtils.isEmpty(processedItem.parent);
                const selected = this.isSelected(processedItem);

                if (selected) {
                    const { index, key, level, parentKey } = processedItem;

                    this.activeItemPath = this.activeItemPath.filter((p) => key !== p.key && key.startsWith(p.key));
                    this.focusedItemInfo = { index, level, parentKey };

                    this.dirty = !root;
                    utils.DomHandler.focus(this.menubar);
                } else {
                    if (grouped) {
                        this.onItemChange(event);
                    } else {
                        const rootProcessedItem = root ? processedItem : this.activeItemPath.find((p) => p.parentKey === '');

                        this.hide(originalEvent);
                        this.changeFocusedItemIndex(originalEvent, rootProcessedItem ? rootProcessedItem.index : -1);

                        this.mobileActive = false;
                        utils.DomHandler.focus(this.menubar);
                    }
                }
            },
            onItemMouseEnter(event) {
                if (!this.mobileActive && this.dirty) {
                    this.onItemChange(event);
                }
            },
            menuButtonClick(event) {
                this.toggle(event);
            },
            menuButtonKeydown(event) {
                (event.code === 'Enter' || event.code === 'Space') && this.menuButtonClick(event);
            },
            onArrowDownKey(event) {
                const processedItem = this.visibleItems[this.focusedItemInfo.index];
                const root = processedItem ? utils.ObjectUtils.isEmpty(processedItem.parent) : null;

                if (root) {
                    const grouped = this.isProccessedItemGroup(processedItem);

                    if (grouped) {
                        this.onItemChange({ originalEvent: event, processedItem });
                        this.focusedItemInfo = { index: -1, parentKey: processedItem.key };
                        this.onArrowRightKey(event);
                    }
                } else {
                    const itemIndex = this.focusedItemInfo.index !== -1 ? this.findNextItemIndex(this.focusedItemInfo.index) : this.findFirstFocusedItemIndex();

                    this.changeFocusedItemIndex(event, itemIndex);
                    event.preventDefault();
                }
            },
            onArrowUpKey(event) {
                const processedItem = this.visibleItems[this.focusedItemInfo.index];
                const root = utils.ObjectUtils.isEmpty(processedItem.parent);

                if (root) {
                    const grouped = this.isProccessedItemGroup(processedItem);

                    if (grouped) {
                        this.onItemChange({ originalEvent: event, processedItem });
                        this.focusedItemInfo = { index: -1, parentKey: processedItem.key };
                        const itemIndex = this.findLastItemIndex();

                        this.changeFocusedItemIndex(event, itemIndex);
                    }
                } else {
                    const parentItem = this.activeItemPath.find((p) => p.key === processedItem.parentKey);

                    if (this.focusedItemInfo.index === 0) {
                        this.focusedItemInfo = { index: -1, parentKey: parentItem ? parentItem.parentKey : '' };
                        this.searchValue = '';
                        this.onArrowLeftKey(event);
                        this.activeItemPath = this.activeItemPath.filter((p) => p.parentKey !== this.focusedItemInfo.parentKey);
                    } else {
                        const itemIndex = this.focusedItemInfo.index !== -1 ? this.findPrevItemIndex(this.focusedItemInfo.index) : this.findLastFocusedItemIndex();

                        this.changeFocusedItemIndex(event, itemIndex);
                    }
                }

                event.preventDefault();
            },
            onArrowLeftKey(event) {
                const processedItem = this.visibleItems[this.focusedItemInfo.index];
                const parentItem = processedItem ? this.activeItemPath.find((p) => p.key === processedItem.parentKey) : null;

                if (parentItem) {
                    this.onItemChange({ originalEvent: event, processedItem: parentItem });
                    this.activeItemPath = this.activeItemPath.filter((p) => p.parentKey !== this.focusedItemInfo.parentKey);

                    event.preventDefault();
                } else {
                    const itemIndex = this.focusedItemInfo.index !== -1 ? this.findPrevItemIndex(this.focusedItemInfo.index) : this.findLastFocusedItemIndex();

                    this.changeFocusedItemIndex(event, itemIndex);
                    event.preventDefault();
                }
            },
            onArrowRightKey(event) {
                const processedItem = this.visibleItems[this.focusedItemInfo.index];
                const parentItem = processedItem ? this.activeItemPath.find((p) => p.key === processedItem.parentKey) : null;

                if (parentItem) {
                    const grouped = this.isProccessedItemGroup(processedItem);

                    if (grouped) {
                        this.onItemChange({ originalEvent: event, processedItem });
                        this.focusedItemInfo = { index: -1, parentKey: processedItem.key };
                        this.onArrowDownKey(event);
                    }
                } else {
                    const itemIndex = this.focusedItemInfo.index !== -1 ? this.findNextItemIndex(this.focusedItemInfo.index) : this.findFirstFocusedItemIndex();

                    this.changeFocusedItemIndex(event, itemIndex);
                    event.preventDefault();
                }
            },
            onHomeKey(event) {
                this.changeFocusedItemIndex(event, this.findFirstItemIndex());
                event.preventDefault();
            },
            onEndKey(event) {
                this.changeFocusedItemIndex(event, this.findLastItemIndex());
                event.preventDefault();
            },
            onEnterKey(event) {
                if (this.focusedItemInfo.index !== -1) {
                    const element = utils.DomHandler.findSingle(this.menubar, `li[id="${`${this.focusedItemId}`}"]`);
                    const anchorElement = element && utils.DomHandler.findSingle(element, '.p-menuitem-link');

                    anchorElement ? anchorElement.click() : element && element.click();

                    const processedItem = this.visibleItems[this.focusedItemInfo.index];
                    const grouped = this.isProccessedItemGroup(processedItem);

                    !grouped && (this.focusedItemInfo.index = this.findFirstFocusedItemIndex());
                }

                event.preventDefault();
            },
            onSpaceKey(event) {
                this.onEnterKey(event);
            },
            onEscapeKey(event) {
                this.hide(event, true);
                this.focusedItemInfo.index = this.findFirstFocusedItemIndex();

                event.preventDefault();
            },
            onTabKey(event) {
                if (this.focusedItemInfo.index !== -1) {
                    const processedItem = this.visibleItems[this.focusedItemInfo.index];
                    const grouped = this.isProccessedItemGroup(processedItem);

                    !grouped && this.onItemChange({ originalEvent: event, processedItem });
                }

                this.hide();
            },
            bindOutsideClickListener() {
                if (!this.outsideClickListener) {
                    this.outsideClickListener = (event) => {
                        const isOutsideContainer = this.menubar !== event.target && !this.menubar.contains(event.target);
                        const isOutsideMenuButton = this.mobileActive && this.$refs.menubutton !== event.target && !this.$refs.menubutton.contains(event.target);

                        if (isOutsideContainer) {
                            isOutsideMenuButton ? (this.mobileActive = false) : this.hide();
                        }
                    };

                    document.addEventListener('click', this.outsideClickListener);
                }
            },
            unbindOutsideClickListener() {
                if (this.outsideClickListener) {
                    document.removeEventListener('click', this.outsideClickListener);
                    this.outsideClickListener = null;
                }
            },
            bindResizeListener() {
                if (!this.resizeListener) {
                    this.resizeListener = (event) => {
                        if (!utils.DomHandler.isTouchDevice()) {
                            this.hide(event, true);
                        }

                        this.mobileActive = false;
                    };

                    window.addEventListener('resize', this.resizeListener);
                }
            },
            unbindResizeListener() {
                if (this.resizeListener) {
                    window.removeEventListener('resize', this.resizeListener);
                    this.resizeListener = null;
                }
            },
            isItemMatched(processedItem) {
                return this.isValidItem(processedItem) && this.getProccessedItemLabel(processedItem).toLocaleLowerCase().startsWith(this.searchValue.toLocaleLowerCase());
            },
            isValidItem(processedItem) {
                return !!processedItem && !this.isItemDisabled(processedItem.item) && !this.isItemSeparator(processedItem.item);
            },
            isValidSelectedItem(processedItem) {
                return this.isValidItem(processedItem) && this.isSelected(processedItem);
            },
            isSelected(processedItem) {
                return this.activeItemPath.some((p) => p.key === processedItem.key);
            },
            findFirstItemIndex() {
                return this.visibleItems.findIndex((processedItem) => this.isValidItem(processedItem));
            },
            findLastItemIndex() {
                return utils.ObjectUtils.findLastIndex(this.visibleItems, (processedItem) => this.isValidItem(processedItem));
            },
            findNextItemIndex(index) {
                const matchedItemIndex = index < this.visibleItems.length - 1 ? this.visibleItems.slice(index + 1).findIndex((processedItem) => this.isValidItem(processedItem)) : -1;

                return matchedItemIndex > -1 ? matchedItemIndex + index + 1 : index;
            },
            findPrevItemIndex(index) {
                const matchedItemIndex = index > 0 ? utils.ObjectUtils.findLastIndex(this.visibleItems.slice(0, index), (processedItem) => this.isValidItem(processedItem)) : -1;

                return matchedItemIndex > -1 ? matchedItemIndex : index;
            },
            findSelectedItemIndex() {
                return this.visibleItems.findIndex((processedItem) => this.isValidSelectedItem(processedItem));
            },
            findFirstFocusedItemIndex() {
                const selectedIndex = this.findSelectedItemIndex();

                return selectedIndex < 0 ? this.findFirstItemIndex() : selectedIndex;
            },
            findLastFocusedItemIndex() {
                const selectedIndex = this.findSelectedItemIndex();

                return selectedIndex < 0 ? this.findLastItemIndex() : selectedIndex;
            },
            searchItems(event, char) {
                this.searchValue = (this.searchValue || '') + char;

                let itemIndex = -1;
                let matched = false;

                if (this.focusedItemInfo.index !== -1) {
                    itemIndex = this.visibleItems.slice(this.focusedItemInfo.index).findIndex((processedItem) => this.isItemMatched(processedItem));
                    itemIndex = itemIndex === -1 ? this.visibleItems.slice(0, this.focusedItemInfo.index).findIndex((processedItem) => this.isItemMatched(processedItem)) : itemIndex + this.focusedItemInfo.index;
                } else {
                    itemIndex = this.visibleItems.findIndex((processedItem) => this.isItemMatched(processedItem));
                }

                if (itemIndex !== -1) {
                    matched = true;
                }

                if (itemIndex === -1 && this.focusedItemInfo.index === -1) {
                    itemIndex = this.findFirstFocusedItemIndex();
                }

                if (itemIndex !== -1) {
                    this.changeFocusedItemIndex(event, itemIndex);
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
            changeFocusedItemIndex(event, index) {
                if (this.focusedItemInfo.index !== index) {
                    this.focusedItemInfo.index = index;
                    this.scrollInView();
                }
            },
            scrollInView(index = -1) {
                const id = index !== -1 ? `${this.id}_${index}` : this.focusedItemId;
                const element = utils.DomHandler.findSingle(this.menubar, `li[id="${id}"]`);

                if (element) {
                    element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'start' });
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
            containerRef(el) {
                this.container = el;
            },
            menubarRef(el) {
                this.menubar = el ? el.$el : undefined;
            }
        },
        computed: {
            containerClass() {
                return ['p-menubar p-component', { 'p-menubar-mobile-active': this.mobileActive }];
            },
            processedItems() {
                return this.createProcessedItems(this.model || []);
            },
            visibleItems() {
                const processedItem = this.activeItemPath.find((p) => p.key === this.focusedItemInfo.parentKey);

                return processedItem ? processedItem.items : this.processedItems;
            },
            focusedItemId() {
                return this.focusedItemInfo.index !== -1 ? `${this.id}${utils.ObjectUtils.isNotEmpty(this.focusedItemInfo.parentKey) ? '_' + this.focusedItemInfo.parentKey : ''}_${this.focusedItemInfo.index}` : null;
            }
        },
        components: {
            MenubarSub: script$1
        }
    };

    const _hoisted_1 = {
      key: 0,
      class: "p-menubar-start"
    };
    const _hoisted_2 = ["aria-haspopup", "aria-expanded", "aria-controls", "aria-label"];
    const _hoisted_3 = /*#__PURE__*/vue.createElementVNode("i", { class: "pi pi-bars" }, null, -1);
    const _hoisted_4 = [
      _hoisted_3
    ];
    const _hoisted_5 = {
      key: 2,
      class: "p-menubar-end"
    };

    function render(_ctx, _cache, $props, $setup, $data, $options) {
      const _component_MenubarSub = vue.resolveComponent("MenubarSub");

      return (vue.openBlock(), vue.createElementBlock("div", {
        ref: $options.containerRef,
        class: vue.normalizeClass($options.containerClass)
      }, [
        (_ctx.$slots.start)
          ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
              vue.renderSlot(_ctx.$slots, "start")
            ]))
          : vue.createCommentVNode("", true),
        ($props.model && $props.model.length > 0)
          ? (vue.openBlock(), vue.createElementBlock("a", vue.mergeProps({
              key: 1,
              ref: "menubutton",
              role: "button",
              tabindex: "0",
              class: "p-menubar-button",
              "aria-haspopup": $props.model.length && $props.model.length > 0 ? true : false,
              "aria-expanded": $data.mobileActive,
              "aria-controls": $data.id,
              "aria-label": _ctx.$primevue.config.locale.aria.navigation,
              onClick: _cache[0] || (_cache[0] = $event => ($options.menuButtonClick($event))),
              onKeydown: _cache[1] || (_cache[1] = $event => ($options.menuButtonKeydown($event)))
            }, $props.buttonProps), _hoisted_4, 16, _hoisted_2))
          : vue.createCommentVNode("", true),
        vue.createVNode(_component_MenubarSub, {
          ref: $options.menubarRef,
          id: $data.id,
          class: "p-menubar-root-list",
          role: "menubar",
          items: $options.processedItems,
          template: _ctx.$slots.item,
          root: true,
          mobileActive: $data.mobileActive,
          tabindex: "0",
          "aria-activedescendant": $data.focused ? $options.focusedItemId : undefined,
          menuId: $data.id,
          focusedItemId: $data.focused ? $options.focusedItemId : undefined,
          activeItemPath: $data.activeItemPath,
          exact: $props.exact,
          level: 0,
          "aria-labelledby": _ctx.ariaLabelledby,
          "aria-label": _ctx.ariaLabel,
          onFocus: $options.onFocus,
          onBlur: $options.onBlur,
          onKeydown: $options.onKeyDown,
          onItemClick: $options.onItemClick,
          onItemMouseenter: $options.onItemMouseEnter
        }, null, 8, ["id", "items", "template", "mobileActive", "aria-activedescendant", "menuId", "focusedItemId", "activeItemPath", "exact", "aria-labelledby", "aria-label", "onFocus", "onBlur", "onKeydown", "onItemClick", "onItemMouseenter"]),
        (_ctx.$slots.end)
          ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_5, [
              vue.renderSlot(_ctx.$slots, "end")
            ]))
          : vue.createCommentVNode("", true)
      ], 2))
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

    var css_248z = "\n.p-menubar {\r\n    display: flex;\r\n    align-items: center;\n}\n.p-menubar ul {\r\n    margin: 0;\r\n    padding: 0;\r\n    list-style: none;\n}\n.p-menubar .p-menuitem-link {\r\n    cursor: pointer;\r\n    display: flex;\r\n    align-items: center;\r\n    text-decoration: none;\r\n    overflow: hidden;\r\n    position: relative;\n}\n.p-menubar .p-menuitem-text {\r\n    line-height: 1;\n}\n.p-menubar .p-menuitem {\r\n    position: relative;\n}\n.p-menubar-root-list {\r\n    display: flex;\r\n    align-items: center;\r\n    flex-wrap: wrap;\n}\n.p-menubar-root-list > li ul {\r\n    display: none;\r\n    z-index: 1;\n}\n.p-menubar-root-list > .p-menuitem-active > .p-submenu-list {\r\n    display: block;\n}\n.p-menubar .p-submenu-list {\r\n    display: none;\r\n    position: absolute;\r\n    z-index: 1;\n}\n.p-menubar .p-submenu-list > .p-menuitem-active > .p-submenu-list {\r\n    display: block;\r\n    left: 100%;\r\n    top: 0;\n}\n.p-menubar .p-submenu-list .p-menuitem .p-menuitem-content .p-menuitem-link .p-submenu-icon {\r\n    margin-left: auto;\n}\n.p-menubar .p-menubar-end {\r\n    margin-left: auto;\r\n    align-self: center;\n}\n.p-menubar-button {\r\n    display: none;\r\n    cursor: pointer;\r\n    align-items: center;\r\n    justify-content: center;\r\n    text-decoration: none;\n}\r\n";
    styleInject(css_248z);

    script.render = render;

    return script;

})(primevue.utils, primevue.ripple, Vue);
