this.primevue = this.primevue || {};
this.primevue.orderlist = (function (Button, Ripple, utils, vue) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var Button__default = /*#__PURE__*/_interopDefaultLegacy(Button);
    var Ripple__default = /*#__PURE__*/_interopDefaultLegacy(Ripple);

    var script = {
        name: 'OrderList',
        emits: ['update:modelValue', 'reorder', 'update:selection', 'selection-change', 'focus', 'blur'],
        props: {
            modelValue: {
                type: Array,
                default: null
            },
            selection: {
                type: Array,
                default: null
            },
            dataKey: {
                type: String,
                default: null
            },
            listStyle: {
                type: null,
                default: null
            },
            metaKeySelection: {
                type: Boolean,
                default: true
            },
            responsive: {
                type: Boolean,
                default: true
            },
            breakpoint: {
                type: String,
                default: '960px'
            },
            stripedRows: {
                type: Boolean,
                default: false
            },
            tabindex: {
                type: Number,
                default: 0
            },
            listProps: {
                type: null,
                default: null
            },
            moveUpButtonProps: {
                type: null,
                default: null
            },
            moveTopButtonProps: {
                type: null,
                default: null
            },
            moveDownButtonProps: {
                type: null,
                default: null
            },
            moveBottomButtonProps: {
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
        itemTouched: false,
        reorderDirection: null,
        styleElement: null,
        list: null,
        data() {
            return {
                id: this.$attrs.id,
                d_selection: this.selection,
                focused: false,
                focusedOptionIndex: -1
            };
        },
        watch: {
            '$attrs.id': function (newValue) {
                this.id = newValue || utils.UniqueComponentId();
            }
        },
        beforeUnmount() {
            this.destroyStyle();
        },
        updated() {
            if (this.reorderDirection) {
                this.updateListScroll();
                this.reorderDirection = null;
            }
        },
        mounted() {
            this.id = this.id || utils.UniqueComponentId();

            if (this.responsive) {
                this.createStyle();
            }
        },
        methods: {
            getItemKey(item, index) {
                return this.dataKey ? utils.ObjectUtils.resolveFieldData(item, this.dataKey) : index;
            },
            isSelected(item) {
                return utils.ObjectUtils.findIndexInList(item, this.d_selection) != -1;
            },
            onListFocus(event) {
                const selectedFirstItem = utils.DomHandler.findSingle(this.list, 'li.p-orderlist-item.p-highlight');
                const findIndex = utils.ObjectUtils.findIndexInList(selectedFirstItem, this.list.children);

                this.focused = true;

                const index = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : selectedFirstItem ? findIndex : -1;

                this.changeFocusedOptionIndex(index);
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

                    case 'KeyA':
                        if (event.ctrlKey) {
                            this.d_selection = [...this.modelValue];
                            this.$emit('update:selection', this.d_selection);
                        }
                }
            },
            onOptionMouseDown(index) {
                this.focused = true;
                this.focusedOptionIndex = index;
            },
            onArrowDownKey(event) {
                const optionIndex = this.findNextOptionIndex(this.focusedOptionIndex);

                this.changeFocusedOptionIndex(optionIndex);

                if (event.shiftKey) {
                    this.onEnterKey(event);
                }

                event.preventDefault();
            },
            onArrowUpKey(event) {
                const optionIndex = this.findPrevOptionIndex(this.focusedOptionIndex);

                this.changeFocusedOptionIndex(optionIndex);

                if (event.shiftKey) {
                    this.onEnterKey(event);
                }

                event.preventDefault();
            },
            onHomeKey(event) {
                if (event.ctrlKey && event.shiftKey) {
                    const items = utils.DomHandler.find(this.list, 'li.p-orderlist-item');
                    const focusedItem = utils.DomHandler.findSingle(this.list, `li.p-orderlist-item[id=${this.focusedOptionIndex}]`);
                    const matchedOptionIndex = [...items].findIndex((item) => item === focusedItem);

                    this.d_selection = [...this.modelValue].slice(0, matchedOptionIndex + 1);
                    this.$emit('update:selection', this.d_selection);
                } else {
                    this.changeFocusedOptionIndex(0);
                }

                event.preventDefault();
            },
            onEndKey(event) {
                if (event.ctrlKey && event.shiftKey) {
                    const items = utils.DomHandler.find(this.list, 'li.p-orderlist-item');
                    const focusedItem = utils.DomHandler.findSingle(this.list, `li.p-orderlist-item[id=${this.focusedOptionIndex}]`);
                    const matchedOptionIndex = [...items].findIndex((item) => item === focusedItem);

                    this.d_selection = [...this.modelValue].slice(matchedOptionIndex, items.length);
                    this.$emit('update:selection', this.d_selection);
                } else {
                    this.changeFocusedOptionIndex(utils.DomHandler.find(this.list, 'li.p-orderlist-item').length - 1);
                }

                event.preventDefault();
            },
            onEnterKey(event) {
                const items = utils.DomHandler.find(this.list, 'li.p-orderlist-item');
                const focusedItem = utils.DomHandler.findSingle(this.list, `li.p-orderlist-item[id=${this.focusedOptionIndex}]`);
                const matchedOptionIndex = [...items].findIndex((item) => item === focusedItem);

                this.onItemClick(event, this.modelValue[matchedOptionIndex], matchedOptionIndex);

                event.preventDefault();
            },
            onSpaceKey(event) {
                if (event.shiftKey) {
                    const items = utils.DomHandler.find(this.list, 'li.p-orderlist-item');
                    const selectedItemIndex = utils.ObjectUtils.findIndexInList(this.d_selection[0], [...this.modelValue]);
                    const focusedItem = utils.DomHandler.findSingle(this.list, `li.p-orderlist-item[id=${this.focusedOptionIndex}]`);
                    const matchedOptionIndex = [...items].findIndex((item) => item === focusedItem);

                    this.d_selection = [...this.modelValue].slice(Math.min(selectedItemIndex, matchedOptionIndex), Math.max(selectedItemIndex, matchedOptionIndex) + 1);
                    this.$emit('update:selection', this.d_selection);
                } else {
                    this.onEnterKey(event);
                }
            },
            findNextOptionIndex(index) {
                const items = utils.DomHandler.find(this.list, 'li.p-orderlist-item');
                const matchedOptionIndex = [...items].findIndex((link) => link.id === index);

                return matchedOptionIndex > -1 ? matchedOptionIndex + 1 : 0;
            },
            findPrevOptionIndex(index) {
                const items = utils.DomHandler.find(this.list, 'li.p-orderlist-item');
                const matchedOptionIndex = [...items].findIndex((link) => link.id === index);

                return matchedOptionIndex > -1 ? matchedOptionIndex - 1 : 0;
            },
            changeFocusedOptionIndex(index) {
                const items = utils.DomHandler.find(this.list, 'li.p-orderlist-item');

                let order = index >= items.length ? items.length - 1 : index < 0 ? 0 : index;

                this.focusedOptionIndex = items[order].getAttribute('id');
                this.scrollInView(items[order].getAttribute('id'));
            },
            scrollInView(id) {
                const element = utils.DomHandler.findSingle(this.list, `li[id="${id}"]`);

                if (element) {
                    element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'start' });
                }
            },
            moveUp(event) {
                if (this.d_selection) {
                    let value = [...this.modelValue];

                    for (let i = 0; i < this.d_selection.length; i++) {
                        let selectedItem = this.d_selection[i];
                        let selectedItemIndex = utils.ObjectUtils.findIndexInList(selectedItem, value);

                        if (selectedItemIndex !== 0) {
                            let movedItem = value[selectedItemIndex];
                            let temp = value[selectedItemIndex - 1];

                            value[selectedItemIndex - 1] = movedItem;
                            value[selectedItemIndex] = temp;
                        } else {
                            break;
                        }
                    }

                    this.reorderDirection = 'up';
                    this.$emit('update:modelValue', value);
                    this.$emit('reorder', {
                        originalEvent: event,
                        value: value,
                        direction: this.reorderDirection
                    });
                }
            },
            moveTop(event) {
                if (this.d_selection) {
                    let value = [...this.modelValue];

                    for (let i = 0; i < this.d_selection.length; i++) {
                        let selectedItem = this.d_selection[i];
                        let selectedItemIndex = utils.ObjectUtils.findIndexInList(selectedItem, value);

                        if (selectedItemIndex !== 0) {
                            let movedItem = value.splice(selectedItemIndex, 1)[0];

                            value.unshift(movedItem);
                        } else {
                            break;
                        }
                    }

                    this.reorderDirection = 'top';
                    this.$emit('update:modelValue', value);
                    this.$emit('reorder', {
                        originalEvent: event,
                        value: value,
                        direction: this.reorderDirection
                    });
                }
            },
            moveDown(event) {
                if (this.d_selection) {
                    let value = [...this.modelValue];

                    for (let i = this.d_selection.length - 1; i >= 0; i--) {
                        let selectedItem = this.d_selection[i];
                        let selectedItemIndex = utils.ObjectUtils.findIndexInList(selectedItem, value);

                        if (selectedItemIndex !== value.length - 1) {
                            let movedItem = value[selectedItemIndex];
                            let temp = value[selectedItemIndex + 1];

                            value[selectedItemIndex + 1] = movedItem;
                            value[selectedItemIndex] = temp;
                        } else {
                            break;
                        }
                    }

                    this.reorderDirection = 'down';
                    this.$emit('update:modelValue', value);
                    this.$emit('reorder', {
                        originalEvent: event,
                        value: value,
                        direction: this.reorderDirection
                    });
                }
            },
            moveBottom(event) {
                if (this.d_selection) {
                    let value = [...this.modelValue];

                    for (let i = this.d_selection.length - 1; i >= 0; i--) {
                        let selectedItem = this.d_selection[i];
                        let selectedItemIndex = utils.ObjectUtils.findIndexInList(selectedItem, value);

                        if (selectedItemIndex !== value.length - 1) {
                            let movedItem = value.splice(selectedItemIndex, 1)[0];

                            value.push(movedItem);
                        } else {
                            break;
                        }
                    }

                    this.reorderDirection = 'bottom';
                    this.$emit('update:modelValue', value);
                    this.$emit('reorder', {
                        originalEvent: event,
                        value: value,
                        direction: this.reorderDirection
                    });
                }
            },
            onItemClick(event, item, index) {
                this.itemTouched = false;
                const selectedIndex = utils.ObjectUtils.findIndexInList(item, this.d_selection);
                const selected = selectedIndex != -1;
                const metaSelection = this.itemTouched ? false : this.metaKeySelection;
                const selectedId = utils.DomHandler.find(this.list, '.p-orderlist-item')[index].getAttribute('id');

                this.focusedOptionIndex = selectedId;

                if (metaSelection) {
                    const metaKey = event.metaKey || event.ctrlKey;

                    if (selected && metaKey) {
                        this.d_selection = this.d_selection.filter((val, index) => index !== selectedIndex);
                    } else {
                        this.d_selection = metaKey ? (this.d_selection ? [...this.d_selection] : []) : [];
                        utils.ObjectUtils.insertIntoOrderedArray(item, index, this.d_selection, this.modelValue);
                    }
                } else {
                    if (selected) {
                        this.d_selection = this.d_selection.filter((val, index) => index !== selectedIndex);
                    } else {
                        this.d_selection = this.d_selection ? [...this.d_selection] : [];
                        utils.ObjectUtils.insertIntoOrderedArray(item, index, this.d_selection, this.modelValue);
                    }
                }

                this.$emit('update:selection', this.d_selection);
                this.$emit('selection-change', {
                    originalEvent: event,
                    value: this.d_selection
                });
            },
            onItemTouchEnd() {
                this.itemTouched = true;
            },
            findNextItem(item) {
                let nextItem = item.nextElementSibling;

                if (nextItem) return !utils.DomHandler.hasClass(nextItem, 'p-orderlist-item') ? this.findNextItem(nextItem) : nextItem;
                else return null;
            },
            findPrevItem(item) {
                let prevItem = item.previousElementSibling;

                if (prevItem) return !utils.DomHandler.hasClass(prevItem, 'p-orderlist-item') ? this.findPrevItem(prevItem) : prevItem;
                else return null;
            },
            findFirstItem() {
                return utils.DomHandler.findSingle(this.list, '.p-orderlist-item');
            },
            findLastItem() {
                const items = utils.DomHandler.find(this.list, '.p-orderlist-item');

                return items[items.length - 1];
            },
            itemClass(item, id) {
                return ['p-orderlist-item', { 'p-highlight': this.isSelected(item), 'p-focus': id === this.focusedOptionId }];
            },
            updateListScroll() {
                const listItems = utils.DomHandler.find(this.list, '.p-orderlist-item.p-highlight');

                if (listItems && listItems.length) {
                    switch (this.reorderDirection) {
                        case 'up':
                            utils.DomHandler.scrollInView(this.list, listItems[0]);
                            break;

                        case 'top':
                            this.list.scrollTop = 0;
                            break;

                        case 'down':
                            utils.DomHandler.scrollInView(this.list, listItems[listItems.length - 1]);
                            break;

                        case 'bottom':
                            this.list.scrollTop = this.list.scrollHeight;
                            break;
                    }
                }
            },
            createStyle() {
                if (!this.styleElement) {
                    this.$el.setAttribute(this.attributeSelector, '');
                    this.styleElement = document.createElement('style');
                    this.styleElement.type = 'text/css';
                    document.head.appendChild(this.styleElement);

                    let innerHTML = `
@media screen and (max-width: ${this.breakpoint}) {
    .p-orderlist[${this.attributeSelector}] {
        flex-direction: column;
    }

    .p-orderlist[${this.attributeSelector}] .p-orderlist-controls {
        padding: var(--content-padding);
        flex-direction: row;
    }

    .p-orderlist[${this.attributeSelector}] .p-orderlist-controls .p-button {
        margin-right: var(--inline-spacing);
        margin-bottom: 0;
    }

    .p-orderlist[${this.attributeSelector}] .p-orderlist-controls .p-button:last-child {
        margin-right: 0;
    }
}
`;

                    this.styleElement.innerHTML = innerHTML;
                }
            },
            destroyStyle() {
                if (this.styleElement) {
                    document.head.removeChild(this.styleElement);
                    this.styleElement = null;
                }
            },
            moveDisabled() {
                if (!this.d_selection || !this.d_selection.length) {
                    return true;
                }
            },
            listRef(el) {
                this.list = el ? el.$el : undefined;
            }
        },
        computed: {
            containerClass() {
                return [
                    'p-orderlist p-component',
                    {
                        'p-orderlist-striped': this.stripedRows
                    }
                ];
            },
            attributeSelector() {
                return utils.UniqueComponentId();
            },
            focusedOptionId() {
                return this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : null;
            },
            moveUpAriaLabel() {
                return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.moveUp : undefined;
            },
            moveTopAriaLabel() {
                return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.moveTop : undefined;
            },
            moveDownAriaLabel() {
                return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.moveDown : undefined;
            },
            moveBottomAriaLabel() {
                return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.moveBottom : undefined;
            }
        },
        components: {
            OLButton: Button__default["default"]
        },
        directives: {
            ripple: Ripple__default["default"]
        }
    };

    const _hoisted_1 = { class: "p-orderlist-controls" };
    const _hoisted_2 = { class: "p-orderlist-list-container" };
    const _hoisted_3 = {
      key: 0,
      class: "p-orderlist-header"
    };
    const _hoisted_4 = ["id", "onClick", "aria-selected", "onMousedown"];

    function render(_ctx, _cache, $props, $setup, $data, $options) {
      const _component_OLButton = vue.resolveComponent("OLButton");
      const _directive_ripple = vue.resolveDirective("ripple");

      return (vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass($options.containerClass)
      }, [
        vue.createElementVNode("div", _hoisted_1, [
          vue.renderSlot(_ctx.$slots, "controlsstart"),
          vue.createVNode(_component_OLButton, vue.mergeProps({
            type: "button",
            icon: "pi pi-angle-up",
            onClick: $options.moveUp,
            "aria-label": $options.moveUpAriaLabel,
            disabled: $options.moveDisabled()
          }, $props.moveUpButtonProps), null, 16, ["onClick", "aria-label", "disabled"]),
          vue.createVNode(_component_OLButton, vue.mergeProps({
            type: "button",
            icon: "pi pi-angle-double-up",
            onClick: $options.moveTop,
            "aria-label": $options.moveTopAriaLabel,
            disabled: $options.moveDisabled()
          }, $props.moveTopButtonProps), null, 16, ["onClick", "aria-label", "disabled"]),
          vue.createVNode(_component_OLButton, vue.mergeProps({
            type: "button",
            icon: "pi pi-angle-down",
            onClick: $options.moveDown,
            "aria-label": $options.moveDownAriaLabel,
            disabled: $options.moveDisabled()
          }, $props.moveDownButtonProps), null, 16, ["onClick", "aria-label", "disabled"]),
          vue.createVNode(_component_OLButton, vue.mergeProps({
            type: "button",
            icon: "pi pi-angle-double-down",
            onClick: $options.moveBottom,
            "aria-label": $options.moveBottomAriaLabel,
            disabled: $options.moveDisabled()
          }, $props.moveBottomButtonProps), null, 16, ["onClick", "aria-label", "disabled"]),
          vue.renderSlot(_ctx.$slots, "controlsend")
        ]),
        vue.createElementVNode("div", _hoisted_2, [
          (_ctx.$slots.header)
            ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3, [
                vue.renderSlot(_ctx.$slots, "header")
              ]))
            : vue.createCommentVNode("", true),
          vue.createVNode(vue.TransitionGroup, vue.mergeProps({
            ref: $options.listRef,
            id: $data.id + '_list',
            name: "p-orderlist-flip",
            tag: "ul",
            class: "p-orderlist-list",
            style: $props.listStyle,
            role: "listbox",
            "aria-multiselectable": "true",
            tabindex: $props.tabindex,
            "aria-activedescendant": $data.focused ? $options.focusedOptionId : undefined,
            "aria-label": _ctx.ariaLabel,
            "aria-labelledby": _ctx.ariaLabelledby,
            onFocus: $options.onListFocus,
            onBlur: $options.onListBlur,
            onKeydown: $options.onListKeyDown
          }, $props.listProps), {
            default: vue.withCtx(() => [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($props.modelValue, (item, i) => {
                return vue.withDirectives((vue.openBlock(), vue.createElementBlock("li", {
                  key: $options.getItemKey(item, i),
                  id: $data.id + '_' + i,
                  role: "option",
                  class: vue.normalizeClass($options.itemClass(item, `${$data.id}_${i}`)),
                  onClick: $event => ($options.onItemClick($event, item, i)),
                  onTouchend: _cache[0] || (_cache[0] = (...args) => ($options.onItemTouchEnd && $options.onItemTouchEnd(...args))),
                  "aria-selected": $options.isSelected(item),
                  onMousedown: $event => ($options.onOptionMouseDown(i))
                }, [
                  vue.renderSlot(_ctx.$slots, "item", {
                    item: item,
                    index: i
                  })
                ], 42, _hoisted_4)), [
                  [_directive_ripple]
                ])
              }), 128))
            ]),
            _: 3
          }, 16, ["id", "style", "tabindex", "aria-activedescendant", "aria-label", "aria-labelledby", "onFocus", "onBlur", "onKeydown"])
        ])
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

    var css_248z = "\n.p-orderlist {\r\n    display: flex;\n}\n.p-orderlist-controls {\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\n}\n.p-orderlist-list-container {\r\n    flex: 1 1 auto;\n}\n.p-orderlist-list {\r\n    list-style-type: none;\r\n    margin: 0;\r\n    padding: 0;\r\n    overflow: auto;\r\n    min-height: 12rem;\r\n    max-height: 24rem;\n}\n.p-orderlist-item {\r\n    cursor: pointer;\r\n    overflow: hidden;\r\n    position: relative;\n}\n.p-orderlist.p-state-disabled .p-orderlist-item,\r\n.p-orderlist.p-state-disabled .p-button {\r\n    cursor: default;\n}\n.p-orderlist.p-state-disabled .p-orderlist-list {\r\n    overflow: hidden;\n}\r\n";
    styleInject(css_248z);

    script.render = render;

    return script;

})(primevue.button, primevue.ripple, primevue.utils, Vue);
