this.primevue = this.primevue || {};
this.primevue.menu = (function (OverlayEventBus, Portal, utils, Ripple, vue) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var OverlayEventBus__default = /*#__PURE__*/_interopDefaultLegacy(OverlayEventBus);
    var Portal__default = /*#__PURE__*/_interopDefaultLegacy(Portal);
    var Ripple__default = /*#__PURE__*/_interopDefaultLegacy(Ripple);

    var script$1 = {
        name: 'Menuitem',
        inheritAttrs: false,
        emits: ['item-click'],
        props: {
            item: null,
            template: null,
            exact: null,
            id: null,
            focusedOptionId: null
        },
        methods: {
            getItemProp(processedItem, name) {
                return processedItem && processedItem.item ? utils.ObjectUtils.getItemValue(processedItem.item[name]) : undefined;
            },
            onItemActionClick(event, navigate) {
                navigate && navigate(event);
            },
            onItemClick(event) {
                const command = this.getItemProp(this.item, 'command');

                command && command({ originalEvent: event, item: this.item.item });
                this.$emit('item-click', { originalEvent: event, item: this.item, id: this.id });
            },
            containerClass() {
                return ['p-menuitem', this.item.class, { 'p-focus': this.id === this.focusedOptionId, 'p-disabled': this.disabled() }];
            },
            linkClass(routerProps) {
                return [
                    'p-menuitem-link',
                    {
                        'router-link-active': routerProps && routerProps.isActive,
                        'router-link-active-exact': this.exact && routerProps && routerProps.isExactActive
                    }
                ];
            },
            visible() {
                return typeof this.item.visible === 'function' ? this.item.visible() : this.item.visible !== false;
            },
            disabled() {
                return typeof this.item.disabled === 'function' ? this.item.disabled() : this.item.disabled;
            },
            label() {
                return typeof this.item.label === 'function' ? this.item.label() : this.item.label;
            }
        },
        directives: {
            ripple: Ripple__default["default"]
        }
    };

    const _hoisted_1$1 = ["id", "aria-label", "aria-disabled"];
    const _hoisted_2$1 = ["href", "onClick"];
    const _hoisted_3$1 = { class: "p-menuitem-text" };
    const _hoisted_4$1 = ["href", "target"];
    const _hoisted_5$1 = { class: "p-menuitem-text" };

    function render$1(_ctx, _cache, $props, $setup, $data, $options) {
      const _component_router_link = vue.resolveComponent("router-link");
      const _directive_ripple = vue.resolveDirective("ripple");

      return ($options.visible())
        ? (vue.openBlock(), vue.createElementBlock("li", {
            key: 0,
            id: $props.id,
            class: vue.normalizeClass($options.containerClass()),
            role: "menuitem",
            style: vue.normalizeStyle($props.item.style),
            "aria-label": $options.label(),
            "aria-disabled": $options.disabled()
          }, [
            vue.createElementVNode("div", {
              class: "p-menuitem-content",
              onClick: _cache[0] || (_cache[0] = $event => ($options.onItemClick($event)))
            }, [
              (!$props.template)
                ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                    ($props.item.to && !$options.disabled())
                      ? (vue.openBlock(), vue.createBlock(_component_router_link, {
                          key: 0,
                          to: $props.item.to,
                          custom: ""
                        }, {
                          default: vue.withCtx(({ navigate, href, isActive, isExactActive }) => [
                            vue.withDirectives((vue.openBlock(), vue.createElementBlock("a", {
                              href: href,
                              class: vue.normalizeClass($options.linkClass({ isActive, isExactActive })),
                              tabindex: "-1",
                              "aria-hidden": "true",
                              onClick: $event => ($options.onItemActionClick($event, navigate))
                            }, [
                              ($props.item.icon)
                                ? (vue.openBlock(), vue.createElementBlock("span", {
                                    key: 0,
                                    class: vue.normalizeClass(['p-menuitem-icon', $props.item.icon])
                                  }, null, 2))
                                : vue.createCommentVNode("", true),
                              vue.createElementVNode("span", _hoisted_3$1, vue.toDisplayString($options.label()), 1)
                            ], 10, _hoisted_2$1)), [
                              [_directive_ripple]
                            ])
                          ]),
                          _: 1
                        }, 8, ["to"]))
                      : vue.withDirectives((vue.openBlock(), vue.createElementBlock("a", {
                          key: 1,
                          href: $props.item.url,
                          class: vue.normalizeClass($options.linkClass()),
                          target: $props.item.target,
                          tabindex: "-1",
                          "aria-hidden": "true"
                        }, [
                          ($props.item.icon)
                            ? (vue.openBlock(), vue.createElementBlock("span", {
                                key: 0,
                                class: vue.normalizeClass(['p-menuitem-icon', $props.item.icon])
                              }, null, 2))
                            : vue.createCommentVNode("", true),
                          vue.createElementVNode("span", _hoisted_5$1, vue.toDisplayString($options.label()), 1)
                        ], 10, _hoisted_4$1)), [
                          [_directive_ripple]
                        ])
                  ], 64))
                : (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent($props.template), {
                    key: 1,
                    item: $props.item
                  }, null, 8, ["item"]))
            ])
          ], 14, _hoisted_1$1))
        : vue.createCommentVNode("", true)
    }

    script$1.render = render$1;

    var script = {
        name: 'Menu',
        inheritAttrs: false,
        emits: ['show', 'hide', 'focus', 'blur'],
        props: {
            popup: {
                type: Boolean,
                default: false
            },
            model: {
                type: Array,
                default: null
            },
            appendTo: {
                type: String,
                default: 'body'
            },
            autoZIndex: {
                type: Boolean,
                default: true
            },
            baseZIndex: {
                type: Number,
                default: 0
            },
            exact: {
                type: Boolean,
                default: true
            },
            tabindex: {
                type: Number,
                default: 0
            },
            'aria-label': {
                type: String,
                default: null
            },
            'aria-labelledby': {
                type: String,
                default: null
            }
        },
        data() {
            return {
                id: this.$attrs.id,
                overlayVisible: false,
                focused: false,
                focusedOptionIndex: -1,
                selectedOptionIndex: -1
            };
        },
        watch: {
            '$attrs.id': function (newValue) {
                this.id = newValue || utils.UniqueComponentId();
            }
        },
        target: null,
        outsideClickListener: null,
        scrollHandler: null,
        resizeListener: null,
        container: null,
        list: null,
        mounted() {
            this.id = this.id || utils.UniqueComponentId();

            if (!this.popup) {
                this.bindResizeListener();
                this.bindOutsideClickListener();
            }
        },
        beforeUnmount() {
            this.unbindResizeListener();
            this.unbindOutsideClickListener();

            if (this.scrollHandler) {
                this.scrollHandler.destroy();
                this.scrollHandler = null;
            }

            this.target = null;

            if (this.container && this.autoZIndex) {
                utils.ZIndexUtils.clear(this.container);
            }

            this.container = null;
        },
        methods: {
            itemClick(event) {
                const item = event.item;

                if (this.disabled(item)) {
                    return;
                }

                if (item.command) {
                    item.command(event);
                }

                if (item.to && event.navigate) {
                    event.navigate(event.originalEvent);
                }

                if (this.overlayVisible) this.hide();

                if (!this.popup && this.focusedOptionIndex !== event.id) {
                    this.focusedOptionIndex = event.id;
                }
            },
            onListFocus(event) {
                this.focused = true;

                if (!this.popup) {
                    if (this.selectedOptionIndex !== -1) {
                        this.changeFocusedOptionIndex(this.selectedOptionIndex);
                        this.selectedOptionIndex = -1;
                    } else this.changeFocusedOptionIndex(0);
                }

                this.$emit('focus', event);
            },
            onListBlur(event) {
                this.focused = false;
                this.focusedOptionIndex = -1;
                this.$emit('blur', event);
            },
            onListKeyDown(event) {
                switch (event.code) {
                    case 'ArrowDown':
                        this.onArrowDownKey(event);
                        break;

                    case 'ArrowUp':
                        this.onArrowUpKey(event);
                        break;

                    case 'Home':
                        this.onHomeKey(event);
                        break;

                    case 'End':
                        this.onEndKey(event);
                        break;

                    case 'Enter':
                        this.onEnterKey(event);
                        break;

                    case 'Space':
                        this.onSpaceKey(event);
                        break;

                    case 'Escape':
                        if (this.popup) {
                            utils.DomHandler.focus(this.target);
                            this.hide();
                        }

                    case 'Tab':
                        this.overlayVisible && this.hide();
                        break;
                }
            },
            onArrowDownKey(event) {
                const optionIndex = this.findNextOptionIndex(this.focusedOptionIndex);

                this.changeFocusedOptionIndex(optionIndex);
                event.preventDefault();
            },
            onArrowUpKey(event) {
                if (event.altKey && this.popup) {
                    utils.DomHandler.focus(this.target);
                    this.hide();
                    event.preventDefault();
                } else {
                    const optionIndex = this.findPrevOptionIndex(this.focusedOptionIndex);

                    this.changeFocusedOptionIndex(optionIndex);
                    event.preventDefault();
                }
            },
            onHomeKey(event) {
                this.changeFocusedOptionIndex(0);
                event.preventDefault();
            },
            onEndKey(event) {
                this.changeFocusedOptionIndex(utils.DomHandler.find(this.container, 'li.p-menuitem:not(.p-disabled)').length - 1);
                event.preventDefault();
            },
            onEnterKey(event) {
                const element = utils.DomHandler.findSingle(this.list, `li[id="${`${this.focusedOptionIndex}`}"]`);
                const anchorElement = element && utils.DomHandler.findSingle(element, '.p-menuitem-link');

                this.popup && utils.DomHandler.focus(this.target);
                anchorElement ? anchorElement.click() : element && element.click();

                event.preventDefault();
            },
            onSpaceKey(event) {
                this.onEnterKey(event);
            },
            findNextOptionIndex(index) {
                const links = utils.DomHandler.find(this.container, 'li.p-menuitem:not(.p-disabled)');
                const matchedOptionIndex = [...links].findIndex((link) => link.id === index);

                return matchedOptionIndex > -1 ? matchedOptionIndex + 1 : 0;
            },
            findPrevOptionIndex(index) {
                const links = utils.DomHandler.find(this.container, 'li.p-menuitem:not(.p-disabled)');
                const matchedOptionIndex = [...links].findIndex((link) => link.id === index);

                return matchedOptionIndex > -1 ? matchedOptionIndex - 1 : 0;
            },
            changeFocusedOptionIndex(index) {
                const links = utils.DomHandler.find(this.container, 'li.p-menuitem:not(.p-disabled)');
                let order = index >= links.length ? links.length - 1 : index < 0 ? 0 : index;

                order > -1 && (this.focusedOptionIndex = links[order].getAttribute('id'));
            },
            toggle(event) {
                if (this.overlayVisible) this.hide();
                else this.show(event);
            },
            show(event) {
                this.overlayVisible = true;
                this.target = event.currentTarget;
            },
            hide() {
                this.overlayVisible = false;
                this.target = null;
            },
            onEnter(el) {
                this.alignOverlay();
                this.bindOutsideClickListener();
                this.bindResizeListener();
                this.bindScrollListener();

                if (this.autoZIndex) {
                    utils.ZIndexUtils.set('menu', el, this.baseZIndex + this.$primevue.config.zIndex.menu);
                }

                if (this.popup) {
                    utils.DomHandler.focus(this.list);
                    this.changeFocusedOptionIndex(0);
                }

                this.$emit('show');
            },
            onLeave() {
                this.unbindOutsideClickListener();
                this.unbindResizeListener();
                this.unbindScrollListener();
                this.$emit('hide');
            },
            onAfterLeave(el) {
                if (this.autoZIndex) {
                    utils.ZIndexUtils.clear(el);
                }
            },
            alignOverlay() {
                utils.DomHandler.absolutePosition(this.container, this.target);
                this.container.style.minWidth = utils.DomHandler.getOuterWidth(this.target) + 'px';
            },
            bindOutsideClickListener() {
                if (!this.outsideClickListener) {
                    this.outsideClickListener = (event) => {
                        const isOutsideContainer = this.container && !this.container.contains(event.target);
                        const isOutsideTarget = !(this.target && (this.target === event.target || this.target.contains(event.target)));

                        if (this.overlayVisible && isOutsideContainer && isOutsideTarget) {
                            this.hide();
                        } else if (!this.popup && isOutsideContainer && isOutsideTarget) {
                            this.focusedOptionIndex = -1;
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
            bindScrollListener() {
                if (!this.scrollHandler) {
                    this.scrollHandler = new utils.ConnectedOverlayScrollHandler(this.target, () => {
                        if (this.overlayVisible) {
                            this.hide();
                        }
                    });
                }

                this.scrollHandler.bindScrollListener();
            },
            unbindScrollListener() {
                if (this.scrollHandler) {
                    this.scrollHandler.unbindScrollListener();
                }
            },
            bindResizeListener() {
                if (!this.resizeListener) {
                    this.resizeListener = () => {
                        if (this.overlayVisible && !utils.DomHandler.isTouchDevice()) {
                            this.hide();
                        }
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
            visible(item) {
                return typeof item.visible === 'function' ? item.visible() : item.visible !== false;
            },
            disabled(item) {
                return typeof item.disabled === 'function' ? item.disabled() : item.disabled;
            },
            label(item) {
                return typeof item.label === 'function' ? item.label() : item.label;
            },
            separatorClass(item) {
                return ['p-menuitem-separator', item.class];
            },
            onOverlayClick(event) {
                OverlayEventBus__default["default"].emit('overlay-click', {
                    originalEvent: event,
                    target: this.target
                });
            },
            containerRef(el) {
                this.container = el;
            },
            listRef(el) {
                this.list = el;
            }
        },
        computed: {
            containerClass() {
                return [
                    'p-menu p-component',
                    {
                        'p-menu-overlay': this.popup,
                        'p-input-filled': this.$primevue.config.inputStyle === 'filled',
                        'p-ripple-disabled': this.$primevue.config.ripple === false
                    }
                ];
            },
            focusedOptionId() {
                return this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : null;
            }
        },
        components: {
            PVMenuitem: script$1,
            Portal: Portal__default["default"]
        }
    };

    const _hoisted_1 = ["id"];
    const _hoisted_2 = {
      key: 0,
      class: "p-menu-start"
    };
    const _hoisted_3 = ["id", "tabindex", "aria-activedescendant", "aria-label", "aria-labelledby"];
    const _hoisted_4 = ["id"];
    const _hoisted_5 = {
      key: 1,
      class: "p-menu-end"
    };

    function render(_ctx, _cache, $props, $setup, $data, $options) {
      const _component_PVMenuitem = vue.resolveComponent("PVMenuitem");
      const _component_Portal = vue.resolveComponent("Portal");

      return (vue.openBlock(), vue.createBlock(_component_Portal, {
        appendTo: $props.appendTo,
        disabled: !$props.popup
      }, {
        default: vue.withCtx(() => [
          vue.createVNode(vue.Transition, {
            name: "p-connected-overlay",
            onEnter: $options.onEnter,
            onLeave: $options.onLeave,
            onAfterLeave: $options.onAfterLeave
          }, {
            default: vue.withCtx(() => [
              ($props.popup ? $data.overlayVisible : true)
                ? (vue.openBlock(), vue.createElementBlock("div", vue.mergeProps({
                    key: 0,
                    ref: $options.containerRef,
                    id: $data.id,
                    class: $options.containerClass
                  }, _ctx.$attrs, {
                    onClick: _cache[3] || (_cache[3] = (...args) => ($options.onOverlayClick && $options.onOverlayClick(...args)))
                  }), [
                    (_ctx.$slots.start)
                      ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2, [
                          vue.renderSlot(_ctx.$slots, "start")
                        ]))
                      : vue.createCommentVNode("", true),
                    vue.createElementVNode("ul", {
                      ref: $options.listRef,
                      id: $data.id + '_list',
                      class: "p-menu-list p-reset",
                      role: "menu",
                      tabindex: $props.tabindex,
                      "aria-activedescendant": $data.focused ? $options.focusedOptionId : undefined,
                      "aria-label": _ctx.ariaLabel,
                      "aria-labelledby": _ctx.ariaLabelledby,
                      onFocus: _cache[0] || (_cache[0] = (...args) => ($options.onListFocus && $options.onListFocus(...args))),
                      onBlur: _cache[1] || (_cache[1] = (...args) => ($options.onListBlur && $options.onListBlur(...args))),
                      onKeydown: _cache[2] || (_cache[2] = (...args) => ($options.onListKeyDown && $options.onListKeyDown(...args)))
                    }, [
                      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($props.model, (item, i) => {
                        return (vue.openBlock(), vue.createElementBlock(vue.Fragment, {
                          key: $options.label(item) + i.toString()
                        }, [
                          (item.items && $options.visible(item) && !item.separator)
                            ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                                (item.items)
                                  ? (vue.openBlock(), vue.createElementBlock("li", {
                                      key: 0,
                                      id: $data.id + '_' + i,
                                      class: "p-submenu-header",
                                      role: "none"
                                    }, [
                                      vue.renderSlot(_ctx.$slots, "item", { item: item }, () => [
                                        vue.createTextVNode(vue.toDisplayString($options.label(item)), 1)
                                      ])
                                    ], 8, _hoisted_4))
                                  : vue.createCommentVNode("", true),
                                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(item.items, (child, j) => {
                                  return (vue.openBlock(), vue.createElementBlock(vue.Fragment, {
                                    key: child.label + i + '_' + j
                                  }, [
                                    ($options.visible(child) && !child.separator)
                                      ? (vue.openBlock(), vue.createBlock(_component_PVMenuitem, {
                                          key: 0,
                                          id: $data.id + '_' + i + '_' + j,
                                          item: child,
                                          template: _ctx.$slots.item,
                                          exact: $props.exact,
                                          focusedOptionId: $options.focusedOptionId,
                                          onItemClick: $options.itemClick
                                        }, null, 8, ["id", "item", "template", "exact", "focusedOptionId", "onItemClick"]))
                                      : ($options.visible(child) && child.separator)
                                        ? (vue.openBlock(), vue.createElementBlock("li", {
                                            key: 'separator' + i + j,
                                            class: vue.normalizeClass($options.separatorClass(item)),
                                            style: vue.normalizeStyle(child.style),
                                            role: "separator"
                                          }, null, 6))
                                        : vue.createCommentVNode("", true)
                                  ], 64))
                                }), 128))
                              ], 64))
                            : ($options.visible(item) && item.separator)
                              ? (vue.openBlock(), vue.createElementBlock("li", {
                                  key: 'separator' + i.toString(),
                                  class: vue.normalizeClass($options.separatorClass(item)),
                                  style: vue.normalizeStyle(item.style),
                                  role: "separator"
                                }, null, 6))
                              : (vue.openBlock(), vue.createBlock(_component_PVMenuitem, {
                                  key: $options.label(item) + i.toString(),
                                  id: $data.id + '_' + i,
                                  item: item,
                                  template: _ctx.$slots.item,
                                  exact: $props.exact,
                                  focusedOptionId: $options.focusedOptionId,
                                  onItemClick: $options.itemClick
                                }, null, 8, ["id", "item", "template", "exact", "focusedOptionId", "onItemClick"]))
                        ], 64))
                      }), 128))
                    ], 40, _hoisted_3),
                    (_ctx.$slots.end)
                      ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_5, [
                          vue.renderSlot(_ctx.$slots, "end")
                        ]))
                      : vue.createCommentVNode("", true)
                  ], 16, _hoisted_1))
                : vue.createCommentVNode("", true)
            ]),
            _: 3
          }, 8, ["onEnter", "onLeave", "onAfterLeave"])
        ]),
        _: 3
      }, 8, ["appendTo", "disabled"]))
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

    var css_248z = "\n.p-menu-overlay {\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\n}\n.p-menu ul {\r\n    margin: 0;\r\n    padding: 0;\r\n    list-style: none;\n}\n.p-menu .p-menuitem-link {\r\n    cursor: pointer;\r\n    display: flex;\r\n    align-items: center;\r\n    text-decoration: none;\r\n    overflow: hidden;\r\n    position: relative;\n}\n.p-menu .p-menuitem-text {\r\n    line-height: 1;\n}\r\n";
    styleInject(css_248z);

    script.render = render;

    return script;

})(primevue.overlayeventbus, primevue.portal, primevue.utils, primevue.ripple, Vue);
