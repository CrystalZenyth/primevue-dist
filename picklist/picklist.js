this.primevue = this.primevue || {};
this.primevue.picklist = (function (Button, Ripple, utils, vue) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var Button__default = /*#__PURE__*/_interopDefaultLegacy(Button);
    var Ripple__default = /*#__PURE__*/_interopDefaultLegacy(Ripple);

    var script = {
        name: 'PickList',
        emits: ['update:modelValue', 'reorder', 'update:selection', 'selection-change', 'move-to-target', 'move-to-source', 'move-all-to-target', 'move-all-to-source', 'focus', 'blur'],
        props: {
            modelValue: {
                type: Array,
                default: () => [[], []]
            },
            selection: {
                type: Array,
                default: () => [[], []]
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
            showSourceControls: {
                type: Boolean,
                default: true
            },
            showTargetControls: {
                type: Boolean,
                default: true
            },
            targetListProps: {
                type: null,
                default: null
            },
            sourceListProps: {
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
            moveToTargetProps: {
                type: null,
                default: null
            },
            moveAllToTargetProps: {
                type: null,
                default: null
            },
            moveToSourceProps: {
                type: null,
                default: null
            },
            moveAllToSourceProps: {
                type: null,
                default: null
            },
            tabindex: {
                type: Number,
                default: 0
            }
        },
        itemTouched: false,
        reorderDirection: null,
        styleElement: null,
        data() {
            return {
                id: this.$attrs.id,
                d_selection: this.selection,
                focused: {
                    sourceList: false,
                    targetList: false
                },
                focusedOptionIndex: -1
            };
        },
        watch: {
            '$attrs.id': function (newValue) {
                this.id = newValue || utils.UniqueComponentId();
            },
            selection(newValue) {
                this.d_selection = newValue;
            }
        },
        updated() {
            if (this.reorderDirection) {
                this.updateListScroll(this.$refs.sourceList.$el);
                this.updateListScroll(this.$refs.targetList.$el);
                this.reorderDirection = null;
            }
        },
        beforeUnmount() {
            this.destroyStyle();
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
            isSelected(item, listIndex) {
                return utils.ObjectUtils.findIndexInList(item, this.d_selection[listIndex]) != -1;
            },
            onListFocus(event, listType) {
                const selectedFirstItem = utils.DomHandler.findSingle(this.$refs[listType].$el, 'li.p-picklist-item.p-highlight');
                const findIndex = utils.ObjectUtils.findIndexInList(selectedFirstItem, this.$refs[listType].$el.children);

                this.focused[listType] = true;

                const index = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : selectedFirstItem ? findIndex : -1;

                this.changeFocusedOptionIndex(index, listType);
                this.$emit('focus', event);
            },
            onListBlur(event, listType) {
                this.focused[listType] = false;
                this.focusedOptionIndex = -1;
                this.$emit('blur', event);
            },
            onOptionMouseDown(index, listType) {
                this.focused[listType] = true;
                this.focusedOptionIndex = index;
            },
            moveUp(event, listIndex) {
                if (this.d_selection && this.d_selection[listIndex]) {
                    let valueList = [...this.modelValue[listIndex]];
                    let selectionList = this.d_selection[listIndex];

                    for (let i = 0; i < selectionList.length; i++) {
                        let selectedItem = selectionList[i];
                        let selectedItemIndex = utils.ObjectUtils.findIndexInList(selectedItem, valueList);

                        if (selectedItemIndex !== 0) {
                            let movedItem = valueList[selectedItemIndex];
                            let temp = valueList[selectedItemIndex - 1];

                            valueList[selectedItemIndex - 1] = movedItem;
                            valueList[selectedItemIndex] = temp;
                        } else {
                            break;
                        }
                    }

                    let value = [...this.modelValue];

                    value[listIndex] = valueList;

                    this.reorderDirection = 'up';
                    this.$emit('update:modelValue', value);
                    this.$emit('reorder', {
                        originalEvent: event,
                        value: value,
                        direction: this.reorderDirection,
                        listIndex: listIndex
                    });
                }
            },
            moveTop(event, listIndex) {
                if (this.d_selection) {
                    let valueList = [...this.modelValue[listIndex]];
                    let selectionList = this.d_selection[listIndex];

                    for (let i = 0; i < selectionList.length; i++) {
                        let selectedItem = selectionList[i];
                        let selectedItemIndex = utils.ObjectUtils.findIndexInList(selectedItem, valueList);

                        if (selectedItemIndex !== 0) {
                            let movedItem = valueList.splice(selectedItemIndex, 1)[0];

                            valueList.unshift(movedItem);
                        } else {
                            break;
                        }
                    }

                    let value = [...this.modelValue];

                    value[listIndex] = valueList;

                    this.reorderDirection = 'top';
                    this.$emit('update:modelValue', value);
                    this.$emit('reorder', {
                        originalEvent: event,
                        value: value,
                        direction: this.reorderDirection,
                        listIndex: listIndex
                    });
                }
            },
            moveDown(event, listIndex) {
                if (this.d_selection) {
                    let valueList = [...this.modelValue[listIndex]];
                    let selectionList = this.d_selection[listIndex];

                    for (let i = selectionList.length - 1; i >= 0; i--) {
                        let selectedItem = selectionList[i];
                        let selectedItemIndex = utils.ObjectUtils.findIndexInList(selectedItem, valueList);

                        if (selectedItemIndex !== valueList.length - 1) {
                            let movedItem = valueList[selectedItemIndex];
                            let temp = valueList[selectedItemIndex + 1];

                            valueList[selectedItemIndex + 1] = movedItem;
                            valueList[selectedItemIndex] = temp;
                        } else {
                            break;
                        }
                    }

                    let value = [...this.modelValue];

                    value[listIndex] = valueList;

                    this.reorderDirection = 'down';
                    this.$emit('update:modelValue', value);
                    this.$emit('reorder', {
                        originalEvent: event,
                        value: value,
                        direction: this.reorderDirection,
                        listIndex: listIndex
                    });
                }
            },
            moveBottom(event, listIndex) {
                if (this.d_selection) {
                    let valueList = [...this.modelValue[listIndex]];
                    let selectionList = this.d_selection[listIndex];

                    for (let i = selectionList.length - 1; i >= 0; i--) {
                        let selectedItem = selectionList[i];
                        let selectedItemIndex = utils.ObjectUtils.findIndexInList(selectedItem, valueList);

                        if (selectedItemIndex !== valueList.length - 1) {
                            let movedItem = valueList.splice(selectedItemIndex, 1)[0];

                            valueList.push(movedItem);
                        } else {
                            break;
                        }
                    }

                    let value = [...this.modelValue];

                    value[listIndex] = valueList;

                    this.reorderDirection = 'bottom';
                    this.$emit('update:modelValue', value);
                    this.$emit('reorder', {
                        originalEvent: event,
                        value: value,
                        direction: this.reorderDirection,
                        listIndex: listIndex
                    });
                }
            },
            moveToTarget(event) {
                let selection = this.d_selection && this.d_selection[0] ? this.d_selection[0] : null;
                let sourceList = [...this.modelValue[0]];
                let targetList = [...this.modelValue[1]];

                if (selection) {
                    for (let i = 0; i < selection.length; i++) {
                        let selectedItem = selection[i];

                        if (utils.ObjectUtils.findIndexInList(selectedItem, targetList) == -1) {
                            targetList.push(sourceList.splice(utils.ObjectUtils.findIndexInList(selectedItem, sourceList), 1)[0]);
                        }
                    }

                    let value = [...this.modelValue];

                    value[0] = sourceList;
                    value[1] = targetList;
                    this.$emit('update:modelValue', value);

                    this.$emit('move-to-target', {
                        originalEvent: event,
                        items: selection
                    });

                    this.d_selection[0] = [];
                    this.$emit('update:selection', this.d_selection);
                    this.$emit('selection-change', {
                        originalEvent: event,
                        value: this.d_selection
                    });
                }
            },
            moveAllToTarget(event) {
                if (this.modelValue[0]) {
                    let sourceList = [...this.modelValue[0]];
                    let targetList = [...this.modelValue[1]];

                    this.$emit('move-all-to-target', {
                        originalEvent: event,
                        items: sourceList
                    });

                    targetList = [...targetList, ...sourceList];
                    sourceList = [];

                    let value = [...this.modelValue];

                    value[0] = sourceList;
                    value[1] = targetList;
                    this.$emit('update:modelValue', value);

                    this.d_selection[0] = [];
                    this.$emit('update:selection', this.d_selection);
                    this.$emit('selection-change', {
                        originalEvent: event,
                        value: this.d_selection
                    });
                }
            },
            moveToSource(event) {
                let selection = this.d_selection && this.d_selection[1] ? this.d_selection[1] : null;
                let sourceList = [...this.modelValue[0]];
                let targetList = [...this.modelValue[1]];

                if (selection) {
                    for (let i = 0; i < selection.length; i++) {
                        let selectedItem = selection[i];

                        if (utils.ObjectUtils.findIndexInList(selectedItem, sourceList) == -1) {
                            sourceList.push(targetList.splice(utils.ObjectUtils.findIndexInList(selectedItem, targetList), 1)[0]);
                        }
                    }

                    let value = [...this.modelValue];

                    value[0] = sourceList;
                    value[1] = targetList;
                    this.$emit('update:modelValue', value);

                    this.$emit('move-to-source', {
                        originalEvent: event,
                        items: selection
                    });

                    this.d_selection[1] = [];
                    this.$emit('update:selection', this.d_selection);
                    this.$emit('selection-change', {
                        originalEvent: event,
                        value: this.d_selection
                    });
                }
            },
            moveAllToSource(event) {
                if (this.modelValue[1]) {
                    let sourceList = [...this.modelValue[0]];
                    let targetList = [...this.modelValue[1]];

                    this.$emit('move-all-to-source', {
                        originalEvent: event,
                        items: targetList
                    });

                    sourceList = [...sourceList, ...targetList];
                    targetList = [];

                    let value = [...this.modelValue];

                    value[0] = sourceList;
                    value[1] = targetList;
                    this.$emit('update:modelValue', value);

                    this.d_selection[1] = [];
                    this.$emit('update:selection', this.d_selection);
                    this.$emit('selection-change', {
                        originalEvent: event,
                        value: this.d_selection
                    });
                }
            },
            onItemClick(event, item, index, listIndex) {
                const listType = listIndex === 0 ? 'sourceList' : 'targetList';

                this.itemTouched = false;
                const selectionList = this.d_selection[listIndex];
                const selectedIndex = utils.ObjectUtils.findIndexInList(item, this.d_selection);
                const selected = selectedIndex != -1;
                const metaSelection = this.itemTouched ? false : this.metaKeySelection;
                const selectedId = utils.DomHandler.find(this.$refs[listType].$el, '.p-picklist-item')[index].getAttribute('id');

                this.focusedOptionIndex = selectedId;
                let _selection;

                if (metaSelection) {
                    let metaKey = event.metaKey || event.ctrlKey;

                    if (selected && metaKey) {
                        _selection = selectionList.filter((val, index) => index !== selectedIndex);
                    } else {
                        _selection = metaKey ? (selectionList ? [...selectionList] : []) : [];
                        _selection.push(item);
                    }
                } else {
                    if (selected) {
                        _selection = selectionList.filter((val, index) => index !== selectedIndex);
                    } else {
                        _selection = selectionList ? [...selectionList] : [];
                        _selection.push(item);
                    }
                }

                let newSelection = [...this.d_selection];

                newSelection[listIndex] = _selection;
                this.d_selection = newSelection;

                this.$emit('update:selection', this.d_selection);
                this.$emit('selection-change', {
                    originalEvent: event,
                    value: this.d_selection
                });
            },
            onItemDblClick(event, item, listIndex) {
                if (listIndex === 0) this.moveToTarget(event);
                else if (listIndex === 1) this.moveToSource(event);
            },
            onItemTouchEnd() {
                this.itemTouched = true;
            },
            onItemKeyDown(event, listType) {
                switch (event.code) {
                    case 'ArrowDown':
                        this.onArrowDownKey(event, listType);
                        break;

                    case 'ArrowUp':
                        this.onArrowUpKey(event, listType);
                        break;

                    case 'Home':
                        this.onHomeKey(event, listType);
                        break;

                    case 'End':
                        this.onEndKey(event, listType);
                        break;

                    case 'Enter':
                        this.onEnterKey(event, listType);
                        break;

                    case 'Space':
                        this.onSpaceKey(event, listType);
                        break;

                    case 'KeyA':
                        if (event.ctrlKey) {
                            this.d_selection = [...this.modelValue];
                            this.$emit('update:selection', this.d_selection);
                        }
                }
            },
            onArrowDownKey(event, listType) {
                const optionIndex = this.findNextOptionIndex(this.focusedOptionIndex, listType);

                this.changeFocusedOptionIndex(optionIndex, listType);

                if (event.shiftKey) {
                    this.onEnterKey(event, listType);
                }

                event.preventDefault();
            },
            onArrowUpKey(event, listType) {
                const optionIndex = this.findPrevOptionIndex(this.focusedOptionIndex, listType);

                this.changeFocusedOptionIndex(optionIndex, listType);

                if (event.shiftKey) {
                    this.onEnterKey(event, listType);
                }

                event.preventDefault();
            },
            onEnterKey(event, listType) {
                const items = utils.DomHandler.find(this.$refs[listType].$el, 'li.p-picklist-item');
                const focusedItem = utils.DomHandler.findSingle(this.$refs[listType].$el, `li.p-picklist-item[id=${this.focusedOptionIndex}]`);
                const matchedOptionIndex = [...items].findIndex((item) => item === focusedItem);
                const listId = listType === 'sourceList' ? 0 : 1;

                this.onItemClick(event, this.modelValue[listId][matchedOptionIndex], matchedOptionIndex, listId);

                event.preventDefault();
            },
            onSpaceKey(event, listType) {
                event.preventDefault();

                if (event.shiftKey) {
                    const listId = listType === 'sourceList' ? 0 : 1;
                    const items = utils.DomHandler.find(this.$refs[listType].$el, 'li.p-picklist-item');
                    const selectedItemIndex = utils.ObjectUtils.findIndexInList(this.d_selection[listId][0], [...this.modelValue[listId]]);
                    const focusedItem = utils.DomHandler.findSingle(this.$refs[listType].$el, `li.p-picklist-item[id=${this.focusedOptionIndex}]`);
                    const matchedOptionIndex = [...items].findIndex((item) => item === focusedItem);

                    this.d_selection[listId] = [...this.modelValue[listId]].slice(Math.min(selectedItemIndex, matchedOptionIndex), Math.max(selectedItemIndex, matchedOptionIndex) + 1);
                    this.$emit('update:selection', this.d_selection);
                } else {
                    this.onEnterKey(event, listType);
                }
            },
            onHomeKey(event, listType) {
                if (event.ctrlKey && event.shiftKey) {
                    const listId = listType === 'sourceList' ? 0 : 1;
                    const items = utils.DomHandler.find(this.$refs[listType].$el, 'li.p-picklist-item');
                    const focusedItem = utils.DomHandler.findSingle(this.$refs[listType].$el, `li.p-picklist-item[id=${this.focusedOptionIndex}]`);
                    const matchedOptionIndex = [...items].findIndex((item) => item === focusedItem);

                    this.d_selection[listId] = [...this.modelValue[listId]].slice(0, matchedOptionIndex + 1);
                    this.$emit('update:selection', this.d_selection);
                } else {
                    this.changeFocusedOptionIndex(0, listType);
                }

                event.preventDefault();
            },
            onEndKey(event, listType) {
                const items = utils.DomHandler.find(this.$refs[listType].$el, 'li.p-picklist-item');

                if (event.ctrlKey && event.shiftKey) {
                    const listId = listType === 'sourceList' ? 0 : 1;
                    const focusedItem = utils.DomHandler.findSingle(this.$refs[listType].$el, `li.p-picklist-item[id=${this.focusedOptionIndex}]`);
                    const matchedOptionIndex = [...items].findIndex((item) => item === focusedItem);

                    this.d_selection[listId] = [...this.modelValue[listId]].slice(matchedOptionIndex, items.length);
                    this.$emit('update:selection', this.d_selection);
                } else {
                    this.changeFocusedOptionIndex(items.length - 1, listType);
                }

                event.preventDefault();
            },
            findNextOptionIndex(index, listType) {
                const items = utils.DomHandler.find(this.$refs[listType].$el, 'li.p-picklist-item');

                const matchedOptionIndex = [...items].findIndex((link) => link.id === index);

                return matchedOptionIndex > -1 ? matchedOptionIndex + 1 : 0;
            },
            findPrevOptionIndex(index, listType) {
                const items = utils.DomHandler.find(this.$refs[listType].$el, 'li.p-picklist-item');
                const matchedOptionIndex = [...items].findIndex((link) => link.id === index);

                return matchedOptionIndex > -1 ? matchedOptionIndex - 1 : 0;
            },
            changeFocusedOptionIndex(index, listType) {
                const items = utils.DomHandler.find(this.$refs[listType].$el, 'li.p-picklist-item');

                let order = index >= items.length ? items.length - 1 : index < 0 ? 0 : index;

                this.focusedOptionIndex = items[order].getAttribute('id');
                this.scrollInView(items[order].getAttribute('id'), listType);
            },
            scrollInView(id, listType) {
                const element = utils.DomHandler.findSingle(this.$refs[listType].$el, `li[id="${id}"]`);

                if (element) {
                    element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'start' });
                }
            },
            updateListScroll(listElement) {
                const listItems = utils.DomHandler.find(listElement, '.p-picklist-item.p-highlight');

                if (listItems && listItems.length) {
                    switch (this.reorderDirection) {
                        case 'up':
                            utils.DomHandler.scrollInView(listElement, listItems[0]);
                            break;

                        case 'top':
                            listElement.scrollTop = 0;
                            break;

                        case 'down':
                            utils.DomHandler.scrollInView(listElement, listItems[listItems.length - 1]);
                            break;

                        case 'bottom':
                            listElement.scrollTop = listElement.scrollHeight;
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
    .p-picklist[${this.attributeSelector}] {
        flex-direction: column;
    }

    .p-picklist[${this.attributeSelector}] .p-picklist-buttons {
        padding: var(--content-padding);
        flex-direction: row;
    }

    .p-picklist[${this.attributeSelector}] .p-picklist-buttons .p-button {
        margin-right: var(--inline-spacing);
        margin-bottom: 0;
    }

    .p-picklist[${this.attributeSelector}] .p-picklist-buttons .p-button:last-child {
        margin-right: 0;
    }

    .p-picklist[${this.attributeSelector}] .pi-angle-right:before {
        content: "\\e930"
    }

    .p-picklist[${this.attributeSelector}] .pi-angle-double-right:before {
        content: "\\e92c"
    }

    .p-picklist[${this.attributeSelector}] .pi-angle-left:before {
        content: "\\e933"
    }

    .p-picklist[${this.attributeSelector}] .pi-angle-double-left:before {
        content: "\\e92f"
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
            moveDisabled(index) {
                if (!this.d_selection[index] || !this.d_selection[index].length) {
                    return true;
                }
            },
            moveAllDisabled(list) {
                return utils.ObjectUtils.isEmpty(this[list]);
            },
            moveSourceDisabled() {
                return utils.ObjectUtils.isEmpty(this.targetList);
            },
            itemClass(item, id, listIndex) {
                return ['p-picklist-item', { 'p-highlight': this.isSelected(item, listIndex), 'p-focus': id === this.focusedOptionId }];
            }
        },
        computed: {
            idSource() {
                return `${this.id}_source`;
            },
            idTarget() {
                return `${this.id}_target`;
            },
            focusedOptionId() {
                return this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : null;
            },
            containerClass() {
                return [
                    'p-picklist p-component',
                    {
                        'p-picklist-striped': this.stripedRows
                    }
                ];
            },
            sourceList() {
                return this.modelValue && this.modelValue[0] ? this.modelValue[0] : null;
            },
            targetList() {
                return this.modelValue && this.modelValue[1] ? this.modelValue[1] : null;
            },
            attributeSelector() {
                return utils.UniqueComponentId();
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
            },
            moveToTargetAriaLabel() {
                return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.moveToTarget : undefined;
            },
            moveAllToTargetAriaLabel() {
                return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.moveAllToTarget : undefined;
            },
            moveToSourceAriaLabel() {
                return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.moveToSource : undefined;
            },
            moveAllToSourceAriaLabel() {
                return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.moveAllToSource : undefined;
            }
        },
        components: {
            PLButton: Button__default["default"]
        },
        directives: {
            ripple: Ripple__default["default"]
        }
    };

    const _hoisted_1 = {
      key: 0,
      class: "p-picklist-buttons p-picklist-source-controls"
    };
    const _hoisted_2 = { class: "p-picklist-list-wrapper p-picklist-source-wrapper" };
    const _hoisted_3 = {
      key: 0,
      class: "p-picklist-header"
    };
    const _hoisted_4 = ["id", "onClick", "onDblclick", "onMousedown", "aria-selected"];
    const _hoisted_5 = { class: "p-picklist-buttons p-picklist-transfer-buttons" };
    const _hoisted_6 = { class: "p-picklist-list-wrapper p-picklist-target-wrapper" };
    const _hoisted_7 = {
      key: 0,
      class: "p-picklist-header"
    };
    const _hoisted_8 = ["id", "onClick", "onDblclick", "onMousedown", "aria-selected"];
    const _hoisted_9 = {
      key: 1,
      class: "p-picklist-buttons p-picklist-target-controls"
    };

    function render(_ctx, _cache, $props, $setup, $data, $options) {
      const _component_PLButton = vue.resolveComponent("PLButton");
      const _directive_ripple = vue.resolveDirective("ripple");

      return (vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass($options.containerClass)
      }, [
        ($props.showSourceControls)
          ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
              vue.renderSlot(_ctx.$slots, "sourcecontrolsstart"),
              vue.createVNode(_component_PLButton, vue.mergeProps({
                "aria-label": $options.moveUpAriaLabel,
                disabled: $options.moveDisabled(0)
              }, $props.moveUpButtonProps, {
                type: "button",
                icon: "pi pi-angle-up",
                onClick: _cache[0] || (_cache[0] = $event => ($options.moveUp($event, 0)))
              }), null, 16, ["aria-label", "disabled"]),
              vue.createVNode(_component_PLButton, vue.mergeProps({
                "aria-label": $options.moveTopAriaLabel,
                disabled: $options.moveDisabled(0)
              }, $props.moveTopButtonProps, {
                type: "button",
                icon: "pi pi-angle-double-up",
                onClick: _cache[1] || (_cache[1] = $event => ($options.moveTop($event, 0)))
              }), null, 16, ["aria-label", "disabled"]),
              vue.createVNode(_component_PLButton, vue.mergeProps({
                "aria-label": $options.moveDownAriaLabel,
                disabled: $options.moveDisabled(0)
              }, $props.moveDownButtonProps, {
                type: "button",
                icon: "pi pi-angle-down",
                onClick: _cache[2] || (_cache[2] = $event => ($options.moveDown($event, 0)))
              }), null, 16, ["aria-label", "disabled"]),
              vue.createVNode(_component_PLButton, vue.mergeProps({
                "aria-label": $options.moveBottomAriaLabel,
                disabled: $options.moveDisabled(0)
              }, $props.moveBottomButtonProps, {
                type: "button",
                icon: "pi pi-angle-double-down",
                onClick: _cache[3] || (_cache[3] = $event => ($options.moveBottom($event, 0)))
              }), null, 16, ["aria-label", "disabled"]),
              vue.renderSlot(_ctx.$slots, "sourcecontrolsend")
            ]))
          : vue.createCommentVNode("", true),
        vue.createElementVNode("div", _hoisted_2, [
          (_ctx.$slots.sourceheader)
            ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3, [
                vue.renderSlot(_ctx.$slots, "sourceheader")
              ]))
            : vue.createCommentVNode("", true),
          vue.createVNode(vue.TransitionGroup, vue.mergeProps({
            ref: "sourceList",
            id: $options.idSource + '_list',
            name: "p-picklist-flip",
            tag: "ul",
            class: "p-picklist-list p-picklist-source",
            style: $props.listStyle,
            role: "listbox",
            "aria-multiselectable": "true",
            "aria-activedescendant": $data.focused['sourceList'] ? $options.focusedOptionId : undefined,
            tabindex: $options.sourceList && $options.sourceList.length > 0 ? $props.tabindex : -1,
            onFocus: _cache[5] || (_cache[5] = $event => ($options.onListFocus($event, 'sourceList'))),
            onBlur: _cache[6] || (_cache[6] = $event => ($options.onListBlur($event, 'sourceList'))),
            onKeydown: _cache[7] || (_cache[7] = $event => ($options.onItemKeyDown($event, 'sourceList')))
          }, $props.sourceListProps), {
            default: vue.withCtx(() => [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.sourceList, (item, i) => {
                return vue.withDirectives((vue.openBlock(), vue.createElementBlock("li", {
                  key: $options.getItemKey(item, i),
                  id: $options.idSource + '_' + i,
                  class: vue.normalizeClass($options.itemClass(item, `${$options.idSource}_${i}`, 0)),
                  onClick: $event => ($options.onItemClick($event, item, i, 0)),
                  onDblclick: $event => ($options.onItemDblClick($event, item, 0)),
                  onTouchend: _cache[4] || (_cache[4] = (...args) => ($options.onItemTouchEnd && $options.onItemTouchEnd(...args))),
                  onMousedown: $event => ($options.onOptionMouseDown(i, 'sourceList')),
                  role: "option",
                  "aria-selected": $options.isSelected(item, 0)
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
          }, 16, ["id", "style", "aria-activedescendant", "tabindex"])
        ]),
        vue.createElementVNode("div", _hoisted_5, [
          vue.renderSlot(_ctx.$slots, "movecontrolsstart"),
          vue.createVNode(_component_PLButton, vue.mergeProps({
            "aria-label": $options.moveToTargetAriaLabel,
            type: "button",
            icon: "pi pi-angle-right",
            onClick: $options.moveToTarget,
            disabled: $options.moveDisabled(0)
          }, $props.moveToTargetProps), null, 16, ["aria-label", "onClick", "disabled"]),
          vue.createVNode(_component_PLButton, vue.mergeProps({
            "aria-label": $options.moveAllToTargetAriaLabel,
            type: "button",
            icon: "pi pi-angle-double-right",
            onClick: $options.moveAllToTarget,
            disabled: $options.moveAllDisabled('sourceList')
          }, $props.moveAllToTargetProps), null, 16, ["aria-label", "onClick", "disabled"]),
          vue.createVNode(_component_PLButton, vue.mergeProps({
            "aria-label": $options.moveToSourceAriaLabel,
            type: "button",
            icon: "pi pi-angle-left",
            onClick: $options.moveToSource,
            disabled: $options.moveDisabled(1)
          }, $props.moveToSourceProps), null, 16, ["aria-label", "onClick", "disabled"]),
          vue.createVNode(_component_PLButton, vue.mergeProps({
            "aria-label": $options.moveAllToSourceAriaLabel,
            type: "button",
            icon: "pi pi-angle-double-left",
            onClick: $options.moveAllToSource,
            disabled: $options.moveSourceDisabled('targetList')
          }, $props.moveAllToSourceProps), null, 16, ["aria-label", "onClick", "disabled"]),
          vue.renderSlot(_ctx.$slots, "movecontrolsend")
        ]),
        vue.createElementVNode("div", _hoisted_6, [
          (_ctx.$slots.targetheader)
            ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_7, [
                vue.renderSlot(_ctx.$slots, "targetheader")
              ]))
            : vue.createCommentVNode("", true),
          vue.createVNode(vue.TransitionGroup, vue.mergeProps({
            ref: "targetList",
            id: $options.idTarget + '_list',
            name: "p-picklist-flip",
            tag: "ul",
            class: "p-picklist-list p-picklist-target",
            style: $props.listStyle,
            role: "listbox",
            "aria-multiselectable": "true",
            "aria-activedescendant": $data.focused['targetList'] ? $options.focusedOptionId : undefined,
            tabindex: $options.targetList && $options.targetList.length > 0 ? $props.tabindex : -1,
            onFocus: _cache[10] || (_cache[10] = $event => ($options.onListFocus($event, 'targetList'))),
            onBlur: _cache[11] || (_cache[11] = $event => ($options.onListBlur($event, 'targetList'))),
            onKeydown: _cache[12] || (_cache[12] = $event => ($options.onItemKeyDown($event, 'targetList')))
          }, $props.targetListProps), {
            default: vue.withCtx(() => [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.targetList, (item, i) => {
                return vue.withDirectives((vue.openBlock(), vue.createElementBlock("li", {
                  key: $options.getItemKey(item, i),
                  id: $options.idTarget + '_' + i,
                  class: vue.normalizeClass($options.itemClass(item, `${$options.idTarget}_${i}`, 1)),
                  onClick: $event => ($options.onItemClick($event, item, i, 1)),
                  onDblclick: $event => ($options.onItemDblClick($event, item, 1)),
                  onKeydown: _cache[8] || (_cache[8] = $event => ($options.onItemKeyDown($event, 'targetList'))),
                  onMousedown: $event => ($options.onOptionMouseDown(i, 'targetList')),
                  onTouchend: _cache[9] || (_cache[9] = (...args) => ($options.onItemTouchEnd && $options.onItemTouchEnd(...args))),
                  role: "option",
                  "aria-selected": $options.isSelected(item, 1)
                }, [
                  vue.renderSlot(_ctx.$slots, "item", {
                    item: item,
                    index: i
                  })
                ], 42, _hoisted_8)), [
                  [_directive_ripple]
                ])
              }), 128))
            ]),
            _: 3
          }, 16, ["id", "style", "aria-activedescendant", "tabindex"])
        ]),
        ($props.showTargetControls)
          ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_9, [
              vue.renderSlot(_ctx.$slots, "targetcontrolsstart"),
              vue.createVNode(_component_PLButton, vue.mergeProps({
                "aria-label": $options.moveUpAriaLabel,
                disabled: $options.moveDisabled(1)
              }, $props.moveUpButtonProps, {
                type: "button",
                icon: "pi pi-angle-up",
                onClick: _cache[13] || (_cache[13] = $event => ($options.moveUp($event, 1)))
              }), null, 16, ["aria-label", "disabled"]),
              vue.createVNode(_component_PLButton, vue.mergeProps({
                "aria-label": $options.moveTopAriaLabel,
                disabled: $options.moveDisabled(1)
              }, $props.moveTopButtonProps, {
                type: "button",
                icon: "pi pi-angle-double-up",
                onClick: _cache[14] || (_cache[14] = $event => ($options.moveTop($event, 1)))
              }), null, 16, ["aria-label", "disabled"]),
              vue.createVNode(_component_PLButton, vue.mergeProps({
                "aria-label": $options.moveDownAriaLabel,
                disabled: $options.moveDisabled(1)
              }, $props.moveDownButtonProps, {
                type: "button",
                icon: "pi pi-angle-down",
                onClick: _cache[15] || (_cache[15] = $event => ($options.moveDown($event, 1)))
              }), null, 16, ["aria-label", "disabled"]),
              vue.createVNode(_component_PLButton, vue.mergeProps({
                "aria-label": $options.moveBottomAriaLabel,
                disabled: $options.moveDisabled(1)
              }, $props.moveBottomButtonProps, {
                type: "button",
                icon: "pi pi-angle-double-down",
                onClick: _cache[16] || (_cache[16] = $event => ($options.moveBottom($event, 1)))
              }), null, 16, ["aria-label", "disabled"]),
              vue.renderSlot(_ctx.$slots, "targetcontrolsend")
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

    var css_248z = "\n.p-picklist {\r\n    display: flex;\n}\n.p-picklist-buttons {\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\n}\n.p-picklist-list-wrapper {\r\n    flex: 1 1 50%;\n}\n.p-picklist-list {\r\n    list-style-type: none;\r\n    margin: 0;\r\n    padding: 0;\r\n    overflow: auto;\r\n    min-height: 12rem;\r\n    max-height: 24rem;\n}\n.p-picklist-item {\r\n    cursor: pointer;\r\n    overflow: hidden;\r\n    position: relative;\n}\n.p-picklist-item.p-picklist-flip-enter-active.p-picklist-flip-enter-to,\r\n.p-picklist-item.p-picklist-flip-leave-active.p-picklist-flip-leave-to {\r\n    transition: none !important;\n}\r\n";
    styleInject(css_248z);

    script.render = render;

    return script;

})(primevue.button, primevue.ripple, primevue.utils, Vue);
