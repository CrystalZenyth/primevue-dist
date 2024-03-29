'use strict';

var api = require('primevue/api');
var OverlayEventBus = require('primevue/overlayeventbus');
var Portal = require('primevue/portal');
var Ripple = require('primevue/ripple');
var utils = require('primevue/utils');
var VirtualScroller = require('primevue/virtualscroller');
var vue = require('vue');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var OverlayEventBus__default = /*#__PURE__*/_interopDefaultLegacy(OverlayEventBus);
var Portal__default = /*#__PURE__*/_interopDefaultLegacy(Portal);
var Ripple__default = /*#__PURE__*/_interopDefaultLegacy(Ripple);
var VirtualScroller__default = /*#__PURE__*/_interopDefaultLegacy(VirtualScroller);

var script = {
    name: 'MultiSelect',
    emits: ['update:modelValue', 'change', 'focus', 'blur', 'before-show', 'before-hide', 'show', 'hide', 'filter', 'selectall-change'],
    props: {
        modelValue: null,
        options: Array,
        optionLabel: null,
        optionValue: null,
        optionDisabled: null,
        optionGroupLabel: null,
        optionGroupChildren: null,
        scrollHeight: {
            type: String,
            default: '200px'
        },
        placeholder: String,
        disabled: Boolean,
        inputId: {
            type: String,
            default: null
        },
        inputProps: {
            type: null,
            default: null
        },
        panelClass: {
            type: String,
            default: null
        },
        panelStyle: {
            type: null,
            default: null
        },
        panelProps: {
            type: null,
            default: null
        },
        filterInputProps: {
            type: null,
            default: null
        },
        closeButtonProps: {
            type: null,
            default: null
        },
        dataKey: null,
        filter: Boolean,
        filterPlaceholder: String,
        filterLocale: String,
        filterMatchMode: {
            type: String,
            default: 'contains'
        },
        filterFields: {
            type: Array,
            default: null
        },
        appendTo: {
            type: String,
            default: 'body'
        },
        display: {
            type: String,
            default: 'comma'
        },
        selectedItemsLabel: {
            type: String,
            default: '{0} items selected'
        },
        maxSelectedLabels: {
            type: Number,
            default: null
        },
        selectionLimit: {
            type: Number,
            default: null
        },
        showToggleAll: {
            type: Boolean,
            default: true
        },
        loading: {
            type: Boolean,
            default: false
        },
        checkboxIcon: {
            type: String,
            default: 'pi pi-check'
        },
        closeIcon: {
            type: String,
            default: 'pi pi-times'
        },
        dropdownIcon: {
            type: String,
            default: 'pi pi-chevron-down'
        },
        filterIcon: {
            type: String,
            default: 'pi pi-search'
        },
        loadingIcon: {
            type: String,
            default: 'pi pi-spinner pi-spin'
        },
        removeTokenIcon: {
            type: String,
            default: 'pi pi-times-circle'
        },
        selectAll: {
            type: Boolean,
            default: null
        },
        resetFilterOnHide: {
            type: Boolean,
            default: false
        },
        virtualScrollerOptions: {
            type: Object,
            default: null
        },
        autoOptionFocus: {
            type: Boolean,
            default: true
        },
        autoFilterFocus: {
            type: Boolean,
            default: false
        },
        filterMessage: {
            type: String,
            default: null
        },
        selectionMessage: {
            type: String,
            default: null
        },
        emptySelectionMessage: {
            type: String,
            default: null
        },
        emptyFilterMessage: {
            type: String,
            default: null
        },
        emptyMessage: {
            type: String,
            default: null
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
    outsideClickListener: null,
    scrollHandler: null,
    resizeListener: null,
    overlay: null,
    list: null,
    virtualScroller: null,
    startRangeIndex: -1,
    searchTimeout: null,
    searchValue: '',
    selectOnFocus: false,
    focusOnHover: false,
    data() {
        return {
            id: this.$attrs.id,
            focused: false,
            focusedOptionIndex: -1,
            headerCheckboxFocused: false,
            filterValue: null,
            overlayVisible: false
        };
    },
    watch: {
        '$attrs.id': function (newValue) {
            this.id = newValue || utils.UniqueComponentId();
        },
        options() {
            this.autoUpdateModel();
        }
    },
    mounted() {
        this.id = this.id || utils.UniqueComponentId();

        this.autoUpdateModel();
    },
    beforeUnmount() {
        this.unbindOutsideClickListener();
        this.unbindResizeListener();

        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }

        if (this.overlay) {
            utils.ZIndexUtils.clear(this.overlay);
            this.overlay = null;
        }
    },
    methods: {
        getOptionIndex(index, fn) {
            return this.virtualScrollerDisabled ? index : fn && fn(index)['index'];
        },
        getOptionLabel(option) {
            return this.optionLabel ? utils.ObjectUtils.resolveFieldData(option, this.optionLabel) : option;
        },
        getOptionValue(option) {
            return this.optionValue ? utils.ObjectUtils.resolveFieldData(option, this.optionValue) : option;
        },
        getOptionRenderKey(option) {
            return this.dataKey ? utils.ObjectUtils.resolveFieldData(option, this.dataKey) : this.getOptionLabel(option);
        },
        isOptionDisabled(option) {
            if (this.maxSelectionLimitReached && !this.isSelected(option)) {
                return true;
            }

            return this.optionDisabled ? utils.ObjectUtils.resolveFieldData(option, this.optionDisabled) : false;
        },
        isOptionGroup(option) {
            return this.optionGroupLabel && option.optionGroup && option.group;
        },
        getOptionGroupLabel(optionGroup) {
            return utils.ObjectUtils.resolveFieldData(optionGroup, this.optionGroupLabel);
        },
        getOptionGroupChildren(optionGroup) {
            return utils.ObjectUtils.resolveFieldData(optionGroup, this.optionGroupChildren);
        },
        getAriaPosInset(index) {
            return (this.optionGroupLabel ? index - this.visibleOptions.slice(0, index).filter((option) => this.isOptionGroup(option)).length : index) + 1;
        },
        show(isFocus) {
            this.$emit('before-show');
            this.overlayVisible = true;
            this.focusedOptionIndex = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : -1;

            isFocus && utils.DomHandler.focus(this.$refs.focusInput);
        },
        hide(isFocus) {
            const _hide = () => {
                this.$emit('before-hide');
                this.overlayVisible = false;
                this.focusedOptionIndex = -1;
                this.searchValue = '';

                this.resetFilterOnHide && (this.filterValue = null);
                isFocus && utils.DomHandler.focus(this.$refs.focusInput);
            };

            setTimeout(() => {
                _hide();
            }, 0); // For ScreenReaders
        },
        onFocus(event) {
            if (this.disabled) {
                // For ScreenReaders
                return;
            }

            this.focused = true;
            this.focusedOptionIndex = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : this.overlayVisible && this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : -1;
            this.overlayVisible && this.scrollInView(this.focusedOptionIndex);
            this.$emit('focus', event);
        },
        onBlur(event) {
            this.focused = false;
            this.focusedOptionIndex = -1;
            this.searchValue = '';
            this.$emit('blur', event);
        },
        onKeyDown(event) {
            if (this.disabled) {
                event.preventDefault();

                return;
            }

            const metaKey = event.metaKey || event.ctrlKey;

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

                case 'PageDown':
                    this.onPageDownKey(event);
                    break;

                case 'PageUp':
                    this.onPageUpKey(event);
                    break;

                case 'Enter':
                case 'Space':
                    this.onEnterKey(event);
                    break;

                case 'Escape':
                    this.onEscapeKey(event);
                    break;

                case 'Tab':
                    this.onTabKey(event);
                    break;

                case 'ShiftLeft':
                case 'ShiftRight':
                    this.onShiftKey(event);
                    break;

                default:
                    if (event.code === 'KeyA' && metaKey) {
                        const value = this.visibleOptions.filter((option) => this.isValidOption(option)).map((option) => this.getOptionValue(option));

                        this.updateModel(event, value);

                        event.preventDefault();
                        break;
                    }

                    if (!metaKey && utils.ObjectUtils.isPrintableCharacter(event.key)) {
                        !this.overlayVisible && this.show();
                        this.searchOptions(event);
                        event.preventDefault();
                    }

                    break;
            }
        },
        onContainerClick(event) {
            if (this.disabled || this.loading) {
                return;
            }

            if (!this.overlay || !this.overlay.contains(event.target)) {
                this.overlayVisible ? this.hide(true) : this.show(true);
            }
        },
        onFirstHiddenFocus(event) {
            const focusableEl = event.relatedTarget === this.$refs.focusInput ? utils.DomHandler.getFirstFocusableElement(this.overlay, ':not(.p-hidden-focusable)') : this.$refs.focusInput;

            utils.DomHandler.focus(focusableEl);
        },
        onLastHiddenFocus(event) {
            const focusableEl = event.relatedTarget === this.$refs.focusInput ? utils.DomHandler.getLastFocusableElement(this.overlay, ':not(.p-hidden-focusable)') : this.$refs.focusInput;

            utils.DomHandler.focus(focusableEl);
        },
        onCloseClick() {
            this.hide(true);
        },
        onHeaderCheckboxFocus() {
            this.headerCheckboxFocused = true;
        },
        onHeaderCheckboxBlur() {
            this.headerCheckboxFocused = false;
        },
        onOptionSelect(event, option, index = -1, isFocus = false) {
            if (this.disabled || this.isOptionDisabled(option)) {
                return;
            }

            let selected = this.isSelected(option);
            let value = null;

            if (selected) value = this.modelValue.filter((val) => !utils.ObjectUtils.equals(val, this.getOptionValue(option), this.equalityKey));
            else value = [...(this.modelValue || []), this.getOptionValue(option)];

            this.updateModel(event, value);
            index !== -1 && (this.focusedOptionIndex = index);
            isFocus && utils.DomHandler.focus(this.$refs.focusInput);
        },
        onOptionMouseMove(event, index) {
            if (this.focusOnHover) {
                this.changeFocusedOptionIndex(event, index);
            }
        },
        onOptionSelectRange(event, start = -1, end = -1) {
            start === -1 && (start = this.findNearestSelectedOptionIndex(end, true));
            end === -1 && (end = this.findNearestSelectedOptionIndex(start));

            if (start !== -1 && end !== -1) {
                const rangeStart = Math.min(start, end);
                const rangeEnd = Math.max(start, end);
                const value = this.visibleOptions
                    .slice(rangeStart, rangeEnd + 1)
                    .filter((option) => this.isValidOption(option))
                    .map((option) => this.getOptionValue(option));

                this.updateModel(event, value);
            }
        },
        onFilterChange(event) {
            const value = event.target.value;

            this.filterValue = value;
            this.focusedOptionIndex = -1;
            this.$emit('filter', { originalEvent: event, value });

            !this.virtualScrollerDisabled && this.virtualScroller.scrollToIndex(0);
        },
        onFilterKeyDown(event) {
            switch (event.code) {
                case 'ArrowDown':
                    this.onArrowDownKey(event);
                    break;

                case 'ArrowUp':
                    this.onArrowUpKey(event, true);
                    break;

                case 'ArrowLeft':
                case 'ArrowRight':
                    this.onArrowLeftKey(event, true);
                    break;

                case 'Home':
                    this.onHomeKey(event, true);
                    break;

                case 'End':
                    this.onEndKey(event, true);
                    break;

                case 'Enter':
                    this.onEnterKey(event);
                    break;

                case 'Escape':
                    this.onEscapeKey(event);
                    break;

                case 'Tab':
                    this.onTabKey(event, true);
                    break;
            }
        },
        onFilterBlur() {
            this.focusedOptionIndex = -1;
        },
        onFilterUpdated() {
            if (this.overlayVisible) {
                this.alignOverlay();
            }
        },
        onOverlayClick(event) {
            OverlayEventBus__default["default"].emit('overlay-click', {
                originalEvent: event,
                target: this.$el
            });
        },
        onOverlayKeyDown(event) {
            switch (event.code) {
                case 'Escape':
                    this.onEscapeKey(event);
                    break;
            }
        },
        onArrowDownKey(event) {
            const optionIndex = this.focusedOptionIndex !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex) : this.findFirstFocusedOptionIndex();

            if (event.shiftKey) {
                this.onOptionSelectRange(event, this.startRangeIndex, optionIndex);
            }

            this.changeFocusedOptionIndex(event, optionIndex);

            !this.overlayVisible && this.show();
            event.preventDefault();
        },
        onArrowUpKey(event, pressedInInputText = false) {
            if (event.altKey && !pressedInInputText) {
                if (this.focusedOptionIndex !== -1) {
                    this.onOptionSelect(event, this.visibleOptions[this.focusedOptionIndex]);
                }

                this.overlayVisible && this.hide();
                event.preventDefault();
            } else {
                const optionIndex = this.focusedOptionIndex !== -1 ? this.findPrevOptionIndex(this.focusedOptionIndex) : this.findLastFocusedOptionIndex();

                if (event.shiftKey) {
                    this.onOptionSelectRange(event, optionIndex, this.startRangeIndex);
                }

                this.changeFocusedOptionIndex(event, optionIndex);

                !this.overlayVisible && this.show();
                event.preventDefault();
            }
        },
        onArrowLeftKey(event, pressedInInputText = false) {
            pressedInInputText && (this.focusedOptionIndex = -1);
        },
        onHomeKey(event, pressedInInputText = false) {
            const { currentTarget } = event;

            if (pressedInInputText) {
                const len = currentTarget.value.length;

                currentTarget.setSelectionRange(0, event.shiftKey ? len : 0);
                this.focusedOptionIndex = -1;
            } else {
                let metaKey = event.metaKey || event.ctrlKey;
                let optionIndex = this.findFirstOptionIndex();

                if (event.shiftKey && metaKey) {
                    this.onOptionSelectRange(event, optionIndex, this.startRangeIndex);
                }

                this.changeFocusedOptionIndex(event, optionIndex);

                !this.overlayVisible && this.show();
            }

            event.preventDefault();
        },
        onEndKey(event, pressedInInputText = false) {
            const { currentTarget } = event;

            if (pressedInInputText) {
                const len = currentTarget.value.length;

                currentTarget.setSelectionRange(event.shiftKey ? 0 : len, len);
                this.focusedOptionIndex = -1;
            } else {
                let metaKey = event.metaKey || event.ctrlKey;
                let optionIndex = this.findLastOptionIndex();

                if (event.shiftKey && metaKey) {
                    this.onOptionSelectRange(event, this.startRangeIndex, optionIndex);
                }

                this.changeFocusedOptionIndex(event, optionIndex);

                !this.overlayVisible && this.show();
            }

            event.preventDefault();
        },
        onPageUpKey(event) {
            this.scrollInView(0);
            event.preventDefault();
        },
        onPageDownKey(event) {
            this.scrollInView(this.visibleOptions.length - 1);
            event.preventDefault();
        },
        onEnterKey(event) {
            if (!this.overlayVisible) {
                this.onArrowDownKey(event);
            } else {
                if (this.focusedOptionIndex !== -1) {
                    if (event.shiftKey) this.onOptionSelectRange(event, this.focusedOptionIndex);
                    else this.onOptionSelect(event, this.visibleOptions[this.focusedOptionIndex]);
                }
            }

            event.preventDefault();
        },
        onEscapeKey(event) {
            this.overlayVisible && this.hide(true);
            event.preventDefault();
        },
        onTabKey(event, pressedInInputText = false) {
            if (!pressedInInputText) {
                if (this.overlayVisible && this.hasFocusableElements()) {
                    utils.DomHandler.focus(event.shiftKey ? this.$refs.lastHiddenFocusableElementOnOverlay : this.$refs.firstHiddenFocusableElementOnOverlay);

                    event.preventDefault();
                } else {
                    if (this.focusedOptionIndex !== -1) {
                        this.onOptionSelect(event, this.visibleOptions[this.focusedOptionIndex]);
                    }

                    this.overlayVisible && this.hide(this.filter);
                }
            }
        },
        onShiftKey() {
            this.startRangeIndex = this.focusedOptionIndex;
        },
        onOverlayEnter(el) {
            utils.ZIndexUtils.set('overlay', el, this.$primevue.config.zIndex.overlay);
            this.alignOverlay();
            this.scrollInView();

            this.autoFilterFocus && utils.DomHandler.focus(this.$refs.filterInput);
        },
        onOverlayAfterEnter() {
            this.bindOutsideClickListener();
            this.bindScrollListener();
            this.bindResizeListener();

            this.$emit('show');
        },
        onOverlayLeave() {
            this.unbindOutsideClickListener();
            this.unbindScrollListener();
            this.unbindResizeListener();

            this.$emit('hide');
            this.overlay = null;
        },
        onOverlayAfterLeave(el) {
            utils.ZIndexUtils.clear(el);
        },
        alignOverlay() {
            if (this.appendTo === 'self') {
                utils.DomHandler.relativePosition(this.overlay, this.$el);
            } else {
                this.overlay.style.minWidth = utils.DomHandler.getOuterWidth(this.$el) + 'px';
                utils.DomHandler.absolutePosition(this.overlay, this.$el);
            }
        },
        bindOutsideClickListener() {
            if (!this.outsideClickListener) {
                this.outsideClickListener = (event) => {
                    if (this.overlayVisible && this.isOutsideClicked(event)) {
                        this.hide();
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
                this.scrollHandler = new utils.ConnectedOverlayScrollHandler(this.$refs.container, () => {
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
        isOutsideClicked(event) {
            return !(this.$el.isSameNode(event.target) || this.$el.contains(event.target) || (this.overlay && this.overlay.contains(event.target)));
        },
        getLabelByValue(value) {
            const options = this.optionGroupLabel ? this.flatOptions(this.options) : this.options || [];
            const matchedOption = options.find((option) => !this.isOptionGroup(option) && utils.ObjectUtils.equals(this.getOptionValue(option), value, this.equalityKey));

            return matchedOption ? this.getOptionLabel(matchedOption) : null;
        },
        getSelectedItemsLabel() {
            let pattern = /{(.*?)}/;

            if (pattern.test(this.selectedItemsLabel)) {
                return this.selectedItemsLabel.replace(this.selectedItemsLabel.match(pattern)[0], this.modelValue.length + '');
            }

            return this.selectedItemsLabel;
        },
        onToggleAll(event) {
            if (this.selectAll !== null) {
                this.$emit('selectall-change', { originalEvent: event, checked: !this.allSelected });
            } else {
                const value = this.allSelected ? [] : this.visibleOptions.filter((option) => this.isValidOption(option)).map((option) => this.getOptionValue(option));

                this.updateModel(event, value);
            }

            this.headerCheckboxFocused = true;
        },
        removeOption(event, optionValue) {
            let value = this.modelValue.filter((val) => !utils.ObjectUtils.equals(val, optionValue, this.equalityKey));

            this.updateModel(event, value);
        },
        clearFilter() {
            this.filterValue = null;
        },
        hasFocusableElements() {
            return utils.DomHandler.getFocusableElements(this.overlay, ':not(.p-hidden-focusable)').length > 0;
        },
        isOptionMatched(option) {
            return this.isValidOption(option) && this.getOptionLabel(option).toLocaleLowerCase(this.filterLocale).startsWith(this.searchValue.toLocaleLowerCase(this.filterLocale));
        },
        isValidOption(option) {
            return option && !(this.isOptionDisabled(option) || this.isOptionGroup(option));
        },
        isValidSelectedOption(option) {
            return this.isValidOption(option) && this.isSelected(option);
        },
        isSelected(option) {
            const optionValue = this.getOptionValue(option);

            return (this.modelValue || []).some((value) => utils.ObjectUtils.equals(value, optionValue, this.equalityKey));
        },
        findFirstOptionIndex() {
            return this.visibleOptions.findIndex((option) => this.isValidOption(option));
        },
        findLastOptionIndex() {
            return utils.ObjectUtils.findLastIndex(this.visibleOptions, (option) => this.isValidOption(option));
        },
        findNextOptionIndex(index) {
            const matchedOptionIndex = index < this.visibleOptions.length - 1 ? this.visibleOptions.slice(index + 1).findIndex((option) => this.isValidOption(option)) : -1;

            return matchedOptionIndex > -1 ? matchedOptionIndex + index + 1 : index;
        },
        findPrevOptionIndex(index) {
            const matchedOptionIndex = index > 0 ? utils.ObjectUtils.findLastIndex(this.visibleOptions.slice(0, index), (option) => this.isValidOption(option)) : -1;

            return matchedOptionIndex > -1 ? matchedOptionIndex : index;
        },
        findFirstSelectedOptionIndex() {
            return this.hasSelectedOption ? this.visibleOptions.findIndex((option) => this.isValidSelectedOption(option)) : -1;
        },
        findLastSelectedOptionIndex() {
            return this.hasSelectedOption ? utils.ObjectUtils.findLastIndex(this.visibleOptions, (option) => this.isValidSelectedOption(option)) : -1;
        },
        findNextSelectedOptionIndex(index) {
            const matchedOptionIndex = this.hasSelectedOption && index < this.visibleOptions.length - 1 ? this.visibleOptions.slice(index + 1).findIndex((option) => this.isValidSelectedOption(option)) : -1;

            return matchedOptionIndex > -1 ? matchedOptionIndex + index + 1 : -1;
        },
        findPrevSelectedOptionIndex(index) {
            const matchedOptionIndex = this.hasSelectedOption && index > 0 ? utils.ObjectUtils.findLastIndex(this.visibleOptions.slice(0, index), (option) => this.isValidSelectedOption(option)) : -1;

            return matchedOptionIndex > -1 ? matchedOptionIndex : -1;
        },
        findNearestSelectedOptionIndex(index, firstCheckUp = false) {
            let matchedOptionIndex = -1;

            if (this.hasSelectedOption) {
                if (firstCheckUp) {
                    matchedOptionIndex = this.findPrevSelectedOptionIndex(index);
                    matchedOptionIndex = matchedOptionIndex === -1 ? this.findNextSelectedOptionIndex(index) : matchedOptionIndex;
                } else {
                    matchedOptionIndex = this.findNextSelectedOptionIndex(index);
                    matchedOptionIndex = matchedOptionIndex === -1 ? this.findPrevSelectedOptionIndex(index) : matchedOptionIndex;
                }
            }

            return matchedOptionIndex > -1 ? matchedOptionIndex : index;
        },
        findFirstFocusedOptionIndex() {
            const selectedIndex = this.findFirstSelectedOptionIndex();

            return selectedIndex < 0 ? this.findFirstOptionIndex() : selectedIndex;
        },
        findLastFocusedOptionIndex() {
            const selectedIndex = this.findLastSelectedOptionIndex();

            return selectedIndex < 0 ? this.findLastOptionIndex() : selectedIndex;
        },
        searchOptions(event) {
            this.searchValue = (this.searchValue || '') + event.key;

            let optionIndex = -1;

            if (this.focusedOptionIndex !== -1) {
                optionIndex = this.visibleOptions.slice(this.focusedOptionIndex).findIndex((option) => this.isOptionMatched(option));
                optionIndex = optionIndex === -1 ? this.visibleOptions.slice(0, this.focusedOptionIndex).findIndex((option) => this.isOptionMatched(option)) : optionIndex + this.focusedOptionIndex;
            } else {
                optionIndex = this.visibleOptions.findIndex((option) => this.isOptionMatched(option));
            }

            if (optionIndex === -1 && this.focusedOptionIndex === -1) {
                optionIndex = this.findFirstFocusedOptionIndex();
            }

            if (optionIndex !== -1) {
                this.changeFocusedOptionIndex(event, optionIndex);
            }

            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }

            this.searchTimeout = setTimeout(() => {
                this.searchValue = '';
                this.searchTimeout = null;
            }, 500);
        },
        changeFocusedOptionIndex(event, index) {
            if (this.focusedOptionIndex !== index) {
                this.focusedOptionIndex = index;
                this.scrollInView();
            }
        },
        scrollInView(index = -1) {
            const id = index !== -1 ? `${this.id}_${index}` : this.focusedOptionId;
            const element = utils.DomHandler.findSingle(this.list, `li[id="${id}"]`);

            if (element) {
                element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
            } else if (!this.virtualScrollerDisabled) {
                this.virtualScroller && this.virtualScroller.scrollToIndex(index !== -1 ? index : this.focusedOptionIndex);
            }
        },
        autoUpdateModel() {
            if (this.selectOnFocus && this.autoOptionFocus && !this.hasSelectedOption) {
                this.focusedOptionIndex = this.findFirstFocusedOptionIndex();
                const value = this.getOptionValue(this.visibleOptions[this.focusedOptionIndex]);

                this.updateModel(null, [value]);
            }
        },
        updateModel(event, value) {
            this.$emit('update:modelValue', value);
            this.$emit('change', { originalEvent: event, value });
        },
        flatOptions(options) {
            return (options || []).reduce((result, option, index) => {
                result.push({ optionGroup: option, group: true, index });

                const optionGroupChildren = this.getOptionGroupChildren(option);

                optionGroupChildren && optionGroupChildren.forEach((o) => result.push(o));

                return result;
            }, []);
        },
        overlayRef(el) {
            this.overlay = el;
        },
        listRef(el, contentRef) {
            this.list = el;
            contentRef && contentRef(el); // For VirtualScroller
        },
        virtualScrollerRef(el) {
            this.virtualScroller = el;
        }
    },
    computed: {
        containerClass() {
            return [
                'p-multiselect p-component p-inputwrapper',
                {
                    'p-multiselect-chip': this.display === 'chip',
                    'p-disabled': this.disabled,
                    'p-focus': this.focused,
                    'p-inputwrapper-filled': this.modelValue && this.modelValue.length,
                    'p-inputwrapper-focus': this.focused || this.overlayVisible,
                    'p-overlay-open': this.overlayVisible
                }
            ];
        },
        labelClass() {
            return [
                'p-multiselect-label',
                {
                    'p-placeholder': this.label === this.placeholder,
                    'p-multiselect-label-empty': !this.placeholder && (!this.modelValue || this.modelValue.length === 0)
                }
            ];
        },
        dropdownIconClass() {
            return ['p-multiselect-trigger-icon', this.loading ? this.loadingIcon : this.dropdownIcon];
        },
        panelStyleClass() {
            return [
                'p-multiselect-panel p-component',
                this.panelClass,
                {
                    'p-input-filled': this.$primevue.config.inputStyle === 'filled',
                    'p-ripple-disabled': this.$primevue.config.ripple === false
                }
            ];
        },
        headerCheckboxClass() {
            return [
                'p-checkbox p-component',
                {
                    'p-checkbox-checked': this.allSelected,
                    'p-checkbox-focused': this.headerCheckboxFocused
                }
            ];
        },
        visibleOptions() {
            const options = this.optionGroupLabel ? this.flatOptions(this.options) : this.options || [];

            if (this.filterValue) {
                const filteredOptions = api.FilterService.filter(options, this.searchFields, this.filterValue, this.filterMatchMode, this.filterLocale);

                if (this.optionGroupLabel) {
                    const optionGroups = this.options || [];
                    const filtered = [];

                    optionGroups.forEach((group) => {
                        const filteredItems = group.items.filter((item) => filteredOptions.includes(item));

                        if (filteredItems.length > 0) filtered.push({ ...group, items: [...filteredItems] });
                    });

                    return this.flatOptions(filtered);
                }

                return filteredOptions;
            }

            return options;
        },
        label() {
            // TODO: Refactor
            let label;

            if (this.modelValue && this.modelValue.length) {
                if (utils.ObjectUtils.isNotEmpty(this.maxSelectedLabels) && this.modelValue.length > this.maxSelectedLabels) {
                    return this.getSelectedItemsLabel();
                } else {
                    label = '';

                    for (let i = 0; i < this.modelValue.length; i++) {
                        if (i !== 0) {
                            label += ', ';
                        }

                        label += this.getLabelByValue(this.modelValue[i]);
                    }
                }
            } else {
                label = this.placeholder;
            }

            return label;
        },
        chipSelectedItems() {
            return utils.ObjectUtils.isNotEmpty(this.maxSelectedLabels) && this.modelValue && this.modelValue.length > this.maxSelectedLabels ? this.modelValue.slice(0, this.maxSelectedLabels) : this.modelValue;
        },
        allSelected() {
            return this.selectAll !== null ? this.selectAll : utils.ObjectUtils.isNotEmpty(this.visibleOptions) && this.visibleOptions.every((option) => this.isOptionGroup(option) || this.isOptionDisabled(option) || this.isSelected(option));
        },
        hasSelectedOption() {
            return utils.ObjectUtils.isNotEmpty(this.modelValue);
        },
        equalityKey() {
            return this.optionValue ? null : this.dataKey;
        },
        searchFields() {
            return this.filterFields || [this.optionLabel];
        },
        maxSelectionLimitReached() {
            return this.selectionLimit && this.modelValue && this.modelValue.length === this.selectionLimit;
        },
        filterResultMessageText() {
            return utils.ObjectUtils.isNotEmpty(this.visibleOptions) ? this.filterMessageText.replaceAll('{0}', this.visibleOptions.length) : this.emptyFilterMessageText;
        },
        filterMessageText() {
            return this.filterMessage || this.$primevue.config.locale.searchMessage || '';
        },
        emptyFilterMessageText() {
            return this.emptyFilterMessage || this.$primevue.config.locale.emptySearchMessage || this.$primevue.config.locale.emptyFilterMessage || '';
        },
        emptyMessageText() {
            return this.emptyMessage || this.$primevue.config.locale.emptyMessage || '';
        },
        selectionMessageText() {
            return this.selectionMessage || this.$primevue.config.locale.selectionMessage || '';
        },
        emptySelectionMessageText() {
            return this.emptySelectionMessage || this.$primevue.config.locale.emptySelectionMessage || '';
        },
        selectedMessageText() {
            return this.hasSelectedOption ? this.selectionMessageText.replaceAll('{0}', this.modelValue.length) : this.emptySelectionMessageText;
        },
        focusedOptionId() {
            return this.focusedOptionIndex !== -1 ? `${this.id}_${this.focusedOptionIndex}` : null;
        },
        ariaSetSize() {
            return this.visibleOptions.filter((option) => !this.isOptionGroup(option)).length;
        },
        toggleAllAriaLabel() {
            return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria[this.allSelected ? 'selectAll' : 'unselectAll'] : undefined;
        },
        closeAriaLabel() {
            return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.close : undefined;
        },
        virtualScrollerDisabled() {
            return !this.virtualScrollerOptions;
        }
    },
    directives: {
        ripple: Ripple__default["default"]
    },
    components: {
        VirtualScroller: VirtualScroller__default["default"],
        Portal: Portal__default["default"]
    }
};

const _hoisted_1 = { class: "p-hidden-accessible" };
const _hoisted_2 = ["id", "disabled", "placeholder", "tabindex", "aria-label", "aria-labelledby", "aria-expanded", "aria-controls", "aria-activedescendant"];
const _hoisted_3 = { class: "p-multiselect-label-container" };
const _hoisted_4 = { class: "p-multiselect-token-label" };
const _hoisted_5 = ["onClick"];
const _hoisted_6 = { class: "p-multiselect-trigger" };
const _hoisted_7 = {
  key: 0,
  class: "p-multiselect-header"
};
const _hoisted_8 = { class: "p-hidden-accessible" };
const _hoisted_9 = ["checked", "aria-label"];
const _hoisted_10 = {
  key: 1,
  class: "p-multiselect-filter-container"
};
const _hoisted_11 = ["value", "placeholder", "aria-owns", "aria-activedescendant"];
const _hoisted_12 = {
  key: 2,
  role: "status",
  "aria-live": "polite",
  class: "p-hidden-accessible"
};
const _hoisted_13 = ["aria-label"];
const _hoisted_14 = ["id"];
const _hoisted_15 = ["id"];
const _hoisted_16 = ["id", "aria-label", "aria-selected", "aria-disabled", "aria-setsize", "aria-posinset", "onClick", "onMousemove"];
const _hoisted_17 = { class: "p-checkbox p-component" };
const _hoisted_18 = {
  key: 0,
  class: "p-multiselect-empty-message",
  role: "option"
};
const _hoisted_19 = {
  key: 1,
  class: "p-multiselect-empty-message",
  role: "option"
};
const _hoisted_20 = {
  key: 1,
  role: "status",
  "aria-live": "polite",
  class: "p-hidden-accessible"
};
const _hoisted_21 = {
  role: "status",
  "aria-live": "polite",
  class: "p-hidden-accessible"
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_VirtualScroller = vue.resolveComponent("VirtualScroller");
  const _component_Portal = vue.resolveComponent("Portal");
  const _directive_ripple = vue.resolveDirective("ripple");

  return (vue.openBlock(), vue.createElementBlock("div", {
    ref: "container",
    class: vue.normalizeClass($options.containerClass),
    onClick: _cache[15] || (_cache[15] = (...args) => ($options.onContainerClick && $options.onContainerClick(...args)))
  }, [
    vue.createElementVNode("div", _hoisted_1, [
      vue.createElementVNode("input", vue.mergeProps({
        ref: "focusInput",
        id: $props.inputId,
        type: "text",
        readonly: "",
        disabled: $props.disabled,
        placeholder: $props.placeholder,
        tabindex: !$props.disabled ? $props.tabindex : -1,
        role: "combobox",
        "aria-label": _ctx.ariaLabel,
        "aria-labelledby": _ctx.ariaLabelledby,
        "aria-haspopup": "listbox",
        "aria-expanded": $data.overlayVisible,
        "aria-controls": $data.id + '_list',
        "aria-activedescendant": $data.focused ? $options.focusedOptionId : undefined,
        onFocus: _cache[0] || (_cache[0] = (...args) => ($options.onFocus && $options.onFocus(...args))),
        onBlur: _cache[1] || (_cache[1] = (...args) => ($options.onBlur && $options.onBlur(...args))),
        onKeydown: _cache[2] || (_cache[2] = (...args) => ($options.onKeyDown && $options.onKeyDown(...args)))
      }, $props.inputProps), null, 16, _hoisted_2)
    ]),
    vue.createElementVNode("div", _hoisted_3, [
      vue.createElementVNode("div", {
        class: vue.normalizeClass($options.labelClass)
      }, [
        vue.renderSlot(_ctx.$slots, "value", {
          value: $props.modelValue,
          placeholder: $props.placeholder
        }, () => [
          ($props.display === 'comma')
            ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                vue.createTextVNode(vue.toDisplayString($options.label || 'empty'), 1)
              ], 64))
            : ($props.display === 'chip')
              ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.chipSelectedItems, (item) => {
                    return (vue.openBlock(), vue.createElementBlock("div", {
                      key: $options.getLabelByValue(item),
                      class: "p-multiselect-token"
                    }, [
                      vue.renderSlot(_ctx.$slots, "chip", { value: item }, () => [
                        vue.createElementVNode("span", _hoisted_4, vue.toDisplayString($options.getLabelByValue(item)), 1)
                      ]),
                      (!$props.disabled)
                        ? (vue.openBlock(), vue.createElementBlock("span", {
                            key: 0,
                            class: vue.normalizeClass(['p-multiselect-token-icon', $props.removeTokenIcon]),
                            onClick: vue.withModifiers($event => ($options.removeOption($event, item)), ["stop"])
                          }, null, 10, _hoisted_5))
                        : vue.createCommentVNode("", true)
                    ]))
                  }), 128)),
                  (!$props.modelValue || $props.modelValue.length === 0)
                    ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                        vue.createTextVNode(vue.toDisplayString($props.placeholder || 'empty'), 1)
                      ], 64))
                    : vue.createCommentVNode("", true)
                ], 64))
              : vue.createCommentVNode("", true)
        ])
      ], 2)
    ]),
    vue.createElementVNode("div", _hoisted_6, [
      vue.renderSlot(_ctx.$slots, "indicator", {}, () => [
        vue.createElementVNode("span", {
          class: vue.normalizeClass($options.dropdownIconClass),
          "aria-hidden": "true"
        }, null, 2)
      ])
    ]),
    vue.createVNode(_component_Portal, { appendTo: $props.appendTo }, {
      default: vue.withCtx(() => [
        vue.createVNode(vue.Transition, {
          name: "p-connected-overlay",
          onEnter: $options.onOverlayEnter,
          onAfterEnter: $options.onOverlayAfterEnter,
          onLeave: $options.onOverlayLeave,
          onAfterLeave: $options.onOverlayAfterLeave
        }, {
          default: vue.withCtx(() => [
            ($data.overlayVisible)
              ? (vue.openBlock(), vue.createElementBlock("div", vue.mergeProps({
                  key: 0,
                  ref: $options.overlayRef,
                  style: $props.panelStyle,
                  class: $options.panelStyleClass,
                  onClick: _cache[13] || (_cache[13] = (...args) => ($options.onOverlayClick && $options.onOverlayClick(...args))),
                  onKeydown: _cache[14] || (_cache[14] = (...args) => ($options.onOverlayKeyDown && $options.onOverlayKeyDown(...args)))
                }, $props.panelProps), [
                  vue.createElementVNode("span", {
                    ref: "firstHiddenFocusableElementOnOverlay",
                    role: "presentation",
                    "aria-hidden": "true",
                    class: "p-hidden-accessible p-hidden-focusable",
                    tabindex: 0,
                    onFocus: _cache[3] || (_cache[3] = (...args) => ($options.onFirstHiddenFocus && $options.onFirstHiddenFocus(...args)))
                  }, null, 544),
                  vue.renderSlot(_ctx.$slots, "header", {
                    value: $props.modelValue,
                    options: $options.visibleOptions
                  }),
                  (($props.showToggleAll && $props.selectionLimit == null) || $props.filter)
                    ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_7, [
                        ($props.showToggleAll && $props.selectionLimit == null)
                          ? (vue.openBlock(), vue.createElementBlock("div", {
                              key: 0,
                              class: vue.normalizeClass($options.headerCheckboxClass),
                              onClick: _cache[6] || (_cache[6] = (...args) => ($options.onToggleAll && $options.onToggleAll(...args)))
                            }, [
                              vue.createElementVNode("div", _hoisted_8, [
                                vue.createElementVNode("input", {
                                  type: "checkbox",
                                  readonly: "",
                                  checked: $options.allSelected,
                                  "aria-label": $options.toggleAllAriaLabel,
                                  onFocus: _cache[4] || (_cache[4] = (...args) => ($options.onHeaderCheckboxFocus && $options.onHeaderCheckboxFocus(...args))),
                                  onBlur: _cache[5] || (_cache[5] = (...args) => ($options.onHeaderCheckboxBlur && $options.onHeaderCheckboxBlur(...args)))
                                }, null, 40, _hoisted_9)
                              ]),
                              vue.createElementVNode("div", {
                                class: vue.normalizeClass(['p-checkbox-box', { 'p-highlight': $options.allSelected, 'p-focus': $data.headerCheckboxFocused }])
                              }, [
                                vue.createElementVNode("span", {
                                  class: vue.normalizeClass(['p-checkbox-icon', { [$props.checkboxIcon]: $options.allSelected }])
                                }, null, 2)
                              ], 2)
                            ], 2))
                          : vue.createCommentVNode("", true),
                        ($props.filter)
                          ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_10, [
                              vue.createElementVNode("input", vue.mergeProps({
                                ref: "filterInput",
                                type: "text",
                                value: $data.filterValue,
                                onVnodeUpdated: _cache[7] || (_cache[7] = (...args) => ($options.onFilterUpdated && $options.onFilterUpdated(...args))),
                                class: "p-multiselect-filter p-inputtext p-component",
                                placeholder: $props.filterPlaceholder,
                                role: "searchbox",
                                autocomplete: "off",
                                "aria-owns": $data.id + '_list',
                                "aria-activedescendant": $options.focusedOptionId,
                                onKeydown: _cache[8] || (_cache[8] = (...args) => ($options.onFilterKeyDown && $options.onFilterKeyDown(...args))),
                                onBlur: _cache[9] || (_cache[9] = (...args) => ($options.onFilterBlur && $options.onFilterBlur(...args))),
                                onInput: _cache[10] || (_cache[10] = (...args) => ($options.onFilterChange && $options.onFilterChange(...args)))
                              }, $props.filterInputProps), null, 16, _hoisted_11),
                              vue.createElementVNode("span", {
                                class: vue.normalizeClass(['p-multiselect-filter-icon', $props.filterIcon])
                              }, null, 2)
                            ]))
                          : vue.createCommentVNode("", true),
                        ($props.filter)
                          ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_12, vue.toDisplayString($options.filterResultMessageText), 1))
                          : vue.createCommentVNode("", true),
                        vue.withDirectives((vue.openBlock(), vue.createElementBlock("button", vue.mergeProps({
                          class: "p-multiselect-close p-link",
                          "aria-label": $options.closeAriaLabel,
                          onClick: _cache[11] || (_cache[11] = (...args) => ($options.onCloseClick && $options.onCloseClick(...args))),
                          type: "button"
                        }, $props.closeButtonProps), [
                          vue.createElementVNode("span", {
                            class: vue.normalizeClass(['p-multiselect-close-icon', $props.closeIcon])
                          }, null, 2)
                        ], 16, _hoisted_13)), [
                          [_directive_ripple]
                        ])
                      ]))
                    : vue.createCommentVNode("", true),
                  vue.createElementVNode("div", {
                    class: "p-multiselect-items-wrapper",
                    style: vue.normalizeStyle({ 'max-height': $options.virtualScrollerDisabled ? $props.scrollHeight : '' })
                  }, [
                    vue.createVNode(_component_VirtualScroller, vue.mergeProps({ ref: $options.virtualScrollerRef }, $props.virtualScrollerOptions, {
                      items: $options.visibleOptions,
                      style: { height: $props.scrollHeight },
                      tabindex: -1,
                      disabled: $options.virtualScrollerDisabled
                    }), vue.createSlots({
                      content: vue.withCtx(({ styleClass, contentRef, items, getItemOptions, contentStyle, itemSize }) => [
                        vue.createElementVNode("ul", {
                          ref: (el) => $options.listRef(el, contentRef),
                          id: $data.id + '_list',
                          class: vue.normalizeClass(['p-multiselect-items p-component', styleClass]),
                          style: vue.normalizeStyle(contentStyle),
                          role: "listbox",
                          "aria-multiselectable": "true"
                        }, [
                          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(items, (option, i) => {
                            return (vue.openBlock(), vue.createElementBlock(vue.Fragment, {
                              key: $options.getOptionRenderKey(option, $options.getOptionIndex(i, getItemOptions))
                            }, [
                              ($options.isOptionGroup(option))
                                ? (vue.openBlock(), vue.createElementBlock("li", {
                                    key: 0,
                                    id: $data.id + '_' + $options.getOptionIndex(i, getItemOptions),
                                    style: vue.normalizeStyle({ height: itemSize ? itemSize + 'px' : undefined }),
                                    class: "p-multiselect-item-group",
                                    role: "option"
                                  }, [
                                    vue.renderSlot(_ctx.$slots, "optiongroup", {
                                      option: option.optionGroup,
                                      index: $options.getOptionIndex(i, getItemOptions)
                                    }, () => [
                                      vue.createTextVNode(vue.toDisplayString($options.getOptionGroupLabel(option.optionGroup)), 1)
                                    ])
                                  ], 12, _hoisted_15))
                                : vue.withDirectives((vue.openBlock(), vue.createElementBlock("li", {
                                    key: 1,
                                    id: $data.id + '_' + $options.getOptionIndex(i, getItemOptions),
                                    style: vue.normalizeStyle({ height: itemSize ? itemSize + 'px' : undefined }),
                                    class: vue.normalizeClass(['p-multiselect-item', { 'p-highlight': $options.isSelected(option), 'p-focus': $data.focusedOptionIndex === $options.getOptionIndex(i, getItemOptions), 'p-disabled': $options.isOptionDisabled(option) }]),
                                    role: "option",
                                    "aria-label": $options.getOptionLabel(option),
                                    "aria-selected": $options.isSelected(option),
                                    "aria-disabled": $options.isOptionDisabled(option),
                                    "aria-setsize": $options.ariaSetSize,
                                    "aria-posinset": $options.getAriaPosInset($options.getOptionIndex(i, getItemOptions)),
                                    onClick: $event => ($options.onOptionSelect($event, option, $options.getOptionIndex(i, getItemOptions), true)),
                                    onMousemove: $event => ($options.onOptionMouseMove($event, $options.getOptionIndex(i, getItemOptions)))
                                  }, [
                                    vue.createElementVNode("div", _hoisted_17, [
                                      vue.createElementVNode("div", {
                                        class: vue.normalizeClass(['p-checkbox-box', { 'p-highlight': $options.isSelected(option) }])
                                      }, [
                                        vue.createElementVNode("span", {
                                          class: vue.normalizeClass(['p-checkbox-icon', { [$props.checkboxIcon]: $options.isSelected(option) }])
                                        }, null, 2)
                                      ], 2)
                                    ]),
                                    vue.renderSlot(_ctx.$slots, "option", {
                                      option: option,
                                      index: $options.getOptionIndex(i, getItemOptions)
                                    }, () => [
                                      vue.createElementVNode("span", null, vue.toDisplayString($options.getOptionLabel(option)), 1)
                                    ])
                                  ], 46, _hoisted_16)), [
                                    [_directive_ripple]
                                  ])
                            ], 64))
                          }), 128)),
                          ($data.filterValue && (!items || (items && items.length === 0)))
                            ? (vue.openBlock(), vue.createElementBlock("li", _hoisted_18, [
                                vue.renderSlot(_ctx.$slots, "emptyfilter", {}, () => [
                                  vue.createTextVNode(vue.toDisplayString($options.emptyFilterMessageText), 1)
                                ])
                              ]))
                            : (!$props.options || ($props.options && $props.options.length === 0))
                              ? (vue.openBlock(), vue.createElementBlock("li", _hoisted_19, [
                                  vue.renderSlot(_ctx.$slots, "empty", {}, () => [
                                    vue.createTextVNode(vue.toDisplayString($options.emptyMessageText), 1)
                                  ])
                                ]))
                              : vue.createCommentVNode("", true)
                        ], 14, _hoisted_14)
                      ]),
                      _: 2
                    }, [
                      (_ctx.$slots.loader)
                        ? {
                            name: "loader",
                            fn: vue.withCtx(({ options }) => [
                              vue.renderSlot(_ctx.$slots, "loader", { options: options })
                            ]),
                            key: "0"
                          }
                        : undefined
                    ]), 1040, ["items", "style", "disabled"])
                  ], 4),
                  vue.renderSlot(_ctx.$slots, "footer", {
                    value: $props.modelValue,
                    options: $options.visibleOptions
                  }),
                  (!$props.options || ($props.options && $props.options.length === 0))
                    ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_20, vue.toDisplayString($options.emptyMessageText), 1))
                    : vue.createCommentVNode("", true),
                  vue.createElementVNode("span", _hoisted_21, vue.toDisplayString($options.selectedMessageText), 1),
                  vue.createElementVNode("span", {
                    ref: "lastHiddenFocusableElementOnOverlay",
                    role: "presentation",
                    "aria-hidden": "true",
                    class: "p-hidden-accessible p-hidden-focusable",
                    tabindex: 0,
                    onFocus: _cache[12] || (_cache[12] = (...args) => ($options.onLastHiddenFocus && $options.onLastHiddenFocus(...args)))
                  }, null, 544)
                ], 16))
              : vue.createCommentVNode("", true)
          ]),
          _: 3
        }, 8, ["onEnter", "onAfterEnter", "onLeave", "onAfterLeave"])
      ]),
      _: 3
    }, 8, ["appendTo"])
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

var css_248z = "\n.p-multiselect {\r\n    display: inline-flex;\r\n    cursor: pointer;\r\n    position: relative;\r\n    user-select: none;\n}\n.p-multiselect-trigger {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    flex-shrink: 0;\n}\n.p-multiselect-label-container {\r\n    overflow: hidden;\r\n    flex: 1 1 auto;\r\n    cursor: pointer;\n}\n.p-multiselect-label {\r\n    display: block;\r\n    white-space: nowrap;\r\n    cursor: pointer;\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\n}\n.p-multiselect-label-empty {\r\n    overflow: hidden;\r\n    visibility: hidden;\n}\n.p-multiselect-token {\r\n    cursor: default;\r\n    display: inline-flex;\r\n    align-items: center;\r\n    flex: 0 0 auto;\n}\n.p-multiselect-token-icon {\r\n    cursor: pointer;\n}\n.p-multiselect .p-multiselect-panel {\r\n    min-width: 100%;\n}\n.p-multiselect-panel {\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\n}\n.p-multiselect-items-wrapper {\r\n    overflow: auto;\n}\n.p-multiselect-items {\r\n    margin: 0;\r\n    padding: 0;\r\n    list-style-type: none;\n}\n.p-multiselect-item {\r\n    cursor: pointer;\r\n    display: flex;\r\n    align-items: center;\r\n    font-weight: normal;\r\n    white-space: nowrap;\r\n    position: relative;\r\n    overflow: hidden;\n}\n.p-multiselect-item-group {\r\n    cursor: auto;\n}\n.p-multiselect-header {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-between;\n}\n.p-multiselect-filter-container {\r\n    position: relative;\r\n    flex: 1 1 auto;\n}\n.p-multiselect-filter-icon {\r\n    position: absolute;\r\n    top: 50%;\r\n    margin-top: -0.5rem;\n}\n.p-multiselect-filter-container .p-inputtext {\r\n    width: 100%;\n}\n.p-multiselect-close {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    flex-shrink: 0;\r\n    overflow: hidden;\r\n    position: relative;\r\n    margin-left: auto;\n}\n.p-fluid .p-multiselect {\r\n    display: flex;\n}\r\n";
styleInject(css_248z);

script.render = render;

module.exports = script;
