import FocusTrap from 'primevue/focustrap';
import Portal from 'primevue/portal';
import Ripple from 'primevue/ripple';
import { ZIndexUtils, DomHandler, UniqueComponentId } from 'primevue/utils';
import { computed, resolveComponent, resolveDirective, openBlock, createBlock, withCtx, createElementBlock, normalizeClass, createVNode, Transition, withDirectives, mergeProps, renderSlot, toDisplayString, createCommentVNode, createElementVNode, createTextVNode } from 'vue';

var script = {
    name: 'Dialog',
    inheritAttrs: false,
    emits: ['update:visible', 'show', 'hide', 'after-hide', 'maximize', 'unmaximize', 'dragend'],
    props: {
        header: {
            type: null,
            default: null
        },
        footer: {
            type: null,
            default: null
        },
        visible: {
            type: Boolean,
            default: false
        },
        modal: {
            type: Boolean,
            default: null
        },
        contentStyle: {
            type: null,
            default: null
        },
        contentClass: {
            type: String,
            default: null
        },
        contentProps: {
            type: null,
            default: null
        },
        rtl: {
            type: Boolean,
            default: null
        },
        maximizable: {
            type: Boolean,
            default: false
        },
        dismissableMask: {
            type: Boolean,
            default: false
        },
        closable: {
            type: Boolean,
            default: true
        },
        closeOnEscape: {
            type: Boolean,
            default: true
        },
        showHeader: {
            type: Boolean,
            default: true
        },
        baseZIndex: {
            type: Number,
            default: 0
        },
        autoZIndex: {
            type: Boolean,
            default: true
        },
        position: {
            type: String,
            default: 'center'
        },
        breakpoints: {
            type: Object,
            default: null
        },
        draggable: {
            type: Boolean,
            default: true
        },
        keepInViewport: {
            type: Boolean,
            default: true
        },
        minX: {
            type: Number,
            default: 0
        },
        minY: {
            type: Number,
            default: 0
        },
        appendTo: {
            type: String,
            default: 'body'
        },
        closeIcon: {
            type: String,
            default: 'pi pi-times'
        },
        maximizeIcon: {
            type: String,
            default: 'pi pi-window-maximize'
        },
        minimizeIcon: {
            type: String,
            default: 'pi pi-window-minimize'
        },
        closeButtonProps: {
            type: null,
            default: null
        },
        _instance: null
    },
    provide() {
        return {
            dialogRef: computed(() => this._instance)
        };
    },
    data() {
        return {
            containerVisible: this.visible,
            maximized: false,
            focusable: false
        };
    },
    documentKeydownListener: null,
    container: null,
    mask: null,
    content: null,
    headerContainer: null,
    footerContainer: null,
    maximizableButton: null,
    closeButton: null,
    styleElement: null,
    dragging: null,
    documentDragListener: null,
    documentDragEndListener: null,
    lastPageX: null,
    lastPageY: null,
    updated() {
        if (this.visible) {
            this.containerVisible = this.visible;
        }
    },
    beforeUnmount() {
        this.unbindDocumentState();
        this.unbindGlobalListeners();
        this.destroyStyle();

        if (this.mask && this.autoZIndex) {
            ZIndexUtils.clear(this.mask);
        }

        this.container = null;
        this.mask = null;
    },
    mounted() {
        if (this.breakpoints) {
            this.createStyle();
        }
    },
    methods: {
        close() {
            this.$emit('update:visible', false);
        },
        onBeforeEnter(el) {
            el.setAttribute(this.attributeSelector, '');
        },
        onEnter() {
            this.$emit('show');
            this.focus();
            this.enableDocumentSettings();
            this.bindGlobalListeners();

            if (this.autoZIndex) {
                ZIndexUtils.set('modal', this.mask, this.baseZIndex + this.$primevue.config.zIndex.modal);
            }
        },
        onBeforeLeave() {
            if (this.modal) {
                DomHandler.addClass(this.mask, 'p-component-overlay-leave');
            }
        },
        onLeave() {
            this.$emit('hide');
            this.focusable = false;
        },
        onAfterLeave() {
            if (this.autoZIndex) {
                ZIndexUtils.clear(this.mask);
            }

            this.containerVisible = false;
            this.unbindDocumentState();
            this.unbindGlobalListeners();
            this.$emit('after-hide');
        },
        onMaskClick(event) {
            if (this.dismissableMask && this.modal && this.mask === event.target) {
                this.close();
            }
        },
        focus() {
            const findFocusableElement = (container) => {
                return container.querySelector('[autofocus]');
            };

            let focusTarget = this.$slots.footer && findFocusableElement(this.footerContainer);

            if (!focusTarget) {
                focusTarget = this.$slots.header && findFocusableElement(this.headerContainer);

                if (!focusTarget) {
                    focusTarget = this.$slots.default && findFocusableElement(this.content);

                    if (!focusTarget) {
                        focusTarget = findFocusableElement(this.container);
                    }
                }
            }

            if (focusTarget) {
                this.focusable = true;
                focusTarget.focus();
            }
        },
        maximize(event) {
            if (this.maximized) {
                this.maximized = false;
                this.$emit('unmaximize', event);
            } else {
                this.maximized = true;
                this.$emit('maximize', event);
            }

            if (!this.modal) {
                if (this.maximized) DomHandler.addClass(document.body, 'p-overflow-hidden');
                else DomHandler.removeClass(document.body, 'p-overflow-hidden');
            }
        },
        enableDocumentSettings() {
            if (this.modal || (this.maximizable && this.maximized)) {
                DomHandler.addClass(document.body, 'p-overflow-hidden');
            }
        },
        unbindDocumentState() {
            if (this.modal || (this.maximizable && this.maximized)) {
                DomHandler.removeClass(document.body, 'p-overflow-hidden');
            }
        },
        onKeyDown(event) {
            if (event.code === 'Escape' && this.closeOnEscape) {
                this.close();
            }
        },
        bindDocumentKeyDownListener() {
            if (!this.documentKeydownListener) {
                this.documentKeydownListener = this.onKeyDown.bind(this);
                window.document.addEventListener('keydown', this.documentKeydownListener);
            }
        },
        unbindDocumentKeyDownListener() {
            if (this.documentKeydownListener) {
                window.document.removeEventListener('keydown', this.documentKeydownListener);
                this.documentKeydownListener = null;
            }
        },
        getPositionClass() {
            const positions = ['left', 'right', 'top', 'topleft', 'topright', 'bottom', 'bottomleft', 'bottomright'];
            const pos = positions.find((item) => item === this.position);

            return pos ? `p-dialog-${pos}` : '';
        },
        containerRef(el) {
            this.container = el;
        },
        maskRef(el) {
            this.mask = el;
        },
        contentRef(el) {
            this.content = el;
        },
        headerContainerRef(el) {
            this.headerContainer = el;
        },
        footerContainerRef(el) {
            this.footerContainer = el;
        },
        maximizableRef(el) {
            this.maximizableButton = el;
        },
        closeButtonRef(el) {
            this.closeButton = el;
        },
        createStyle() {
            if (!this.styleElement) {
                this.styleElement = document.createElement('style');
                this.styleElement.type = 'text/css';
                document.head.appendChild(this.styleElement);

                let innerHTML = '';

                for (let breakpoint in this.breakpoints) {
                    innerHTML += `
                        @media screen and (max-width: ${breakpoint}) {
                            .p-dialog[${this.attributeSelector}] {
                                width: ${this.breakpoints[breakpoint]} !important;
                            }
                        }
                    `;
                }

                this.styleElement.innerHTML = innerHTML;
            }
        },
        destroyStyle() {
            if (this.styleElement) {
                document.head.removeChild(this.styleElement);
                this.styleElement = null;
            }
        },
        initDrag(event) {
            if (DomHandler.hasClass(event.target, 'p-dialog-header-icon') || DomHandler.hasClass(event.target.parentElement, 'p-dialog-header-icon')) {
                return;
            }

            if (this.draggable) {
                this.dragging = true;
                this.lastPageX = event.pageX;
                this.lastPageY = event.pageY;

                this.container.style.margin = '0';
                DomHandler.addClass(document.body, 'p-unselectable-text');
            }
        },
        bindGlobalListeners() {
            if (this.draggable) {
                this.bindDocumentDragListener();
                this.bindDocumentDragEndListener();
            }

            if (this.closeOnEscape && this.closable) {
                this.bindDocumentKeyDownListener();
            }
        },
        unbindGlobalListeners() {
            this.unbindDocumentDragListener();
            this.unbindDocumentDragEndListener();
            this.unbindDocumentKeyDownListener();
        },
        bindDocumentDragListener() {
            this.documentDragListener = (event) => {
                if (this.dragging) {
                    let width = DomHandler.getOuterWidth(this.container);
                    let height = DomHandler.getOuterHeight(this.container);
                    let deltaX = event.pageX - this.lastPageX;
                    let deltaY = event.pageY - this.lastPageY;
                    let offset = this.container.getBoundingClientRect();
                    let leftPos = offset.left + deltaX;
                    let topPos = offset.top + deltaY;
                    let viewport = DomHandler.getViewport();

                    this.container.style.position = 'fixed';

                    if (this.keepInViewport) {
                        if (leftPos >= this.minX && leftPos + width < viewport.width) {
                            this.lastPageX = event.pageX;
                            this.container.style.left = leftPos + 'px';
                        }

                        if (topPos >= this.minY && topPos + height < viewport.height) {
                            this.lastPageY = event.pageY;
                            this.container.style.top = topPos + 'px';
                        }
                    } else {
                        this.lastPageX = event.pageX;
                        this.container.style.left = leftPos + 'px';
                        this.lastPageY = event.pageY;
                        this.container.style.top = topPos + 'px';
                    }
                }
            };

            window.document.addEventListener('mousemove', this.documentDragListener);
        },
        unbindDocumentDragListener() {
            if (this.documentDragListener) {
                window.document.removeEventListener('mousemove', this.documentDragListener);
                this.documentDragListener = null;
            }
        },
        bindDocumentDragEndListener() {
            this.documentDragEndListener = (event) => {
                if (this.dragging) {
                    this.dragging = false;
                    DomHandler.removeClass(document.body, 'p-unselectable-text');

                    this.$emit('dragend', event);
                }
            };

            window.document.addEventListener('mouseup', this.documentDragEndListener);
        },
        unbindDocumentDragEndListener() {
            if (this.documentDragEndListener) {
                window.document.removeEventListener('mouseup', this.documentDragEndListener);
                this.documentDragEndListener = null;
            }
        }
    },
    computed: {
        maskClass() {
            return ['p-dialog-mask', { 'p-component-overlay p-component-overlay-enter': this.modal }, this.getPositionClass()];
        },
        dialogClass() {
            return [
                'p-dialog p-component',
                {
                    'p-dialog-rtl': this.rtl,
                    'p-dialog-maximized': this.maximizable && this.maximized,
                    'p-input-filled': this.$primevue.config.inputStyle === 'filled',
                    'p-ripple-disabled': this.$primevue.config.ripple === false
                }
            ];
        },
        maximizeIconClass() {
            return [
                'p-dialog-header-maximize-icon',
                {
                    [this.maximizeIcon]: !this.maximized,
                    [this.minimizeIcon]: this.maximized
                }
            ];
        },
        ariaId() {
            return UniqueComponentId();
        },
        ariaLabelledById() {
            return this.header != null || this.$attrs['aria-labelledby'] !== null ? this.ariaId + '_header' : null;
        },
        closeAriaLabel() {
            return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.close : undefined;
        },
        attributeSelector() {
            return UniqueComponentId();
        },
        contentStyleClass() {
            return ['p-dialog-content', this.contentClass];
        }
    },
    directives: {
        ripple: Ripple,
        focustrap: FocusTrap
    },
    components: {
        Portal: Portal
    }
};

const _hoisted_1 = ["aria-labelledby", "aria-modal"];
const _hoisted_2 = ["id"];
const _hoisted_3 = { class: "p-dialog-header-icons" };
const _hoisted_4 = ["autofocus", "tabindex"];
const _hoisted_5 = ["autofocus", "aria-label"];

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Portal = resolveComponent("Portal");
  const _directive_ripple = resolveDirective("ripple");
  const _directive_focustrap = resolveDirective("focustrap");

  return (openBlock(), createBlock(_component_Portal, { appendTo: $props.appendTo }, {
    default: withCtx(() => [
      ($data.containerVisible)
        ? (openBlock(), createElementBlock("div", {
            key: 0,
            ref: $options.maskRef,
            class: normalizeClass($options.maskClass),
            onClick: _cache[3] || (_cache[3] = (...args) => ($options.onMaskClick && $options.onMaskClick(...args)))
          }, [
            createVNode(Transition, {
              name: "p-dialog",
              onBeforeEnter: $options.onBeforeEnter,
              onEnter: $options.onEnter,
              onBeforeLeave: $options.onBeforeLeave,
              onLeave: $options.onLeave,
              onAfterLeave: $options.onAfterLeave,
              appear: ""
            }, {
              default: withCtx(() => [
                ($props.visible)
                  ? withDirectives((openBlock(), createElementBlock("div", mergeProps({
                      key: 0,
                      ref: $options.containerRef,
                      class: $options.dialogClass,
                      role: "dialog",
                      "aria-labelledby": $options.ariaLabelledById,
                      "aria-modal": $props.modal
                    }, _ctx.$attrs), [
                      ($props.showHeader)
                        ? (openBlock(), createElementBlock("div", {
                            key: 0,
                            ref: $options.headerContainerRef,
                            class: "p-dialog-header",
                            onMousedown: _cache[2] || (_cache[2] = (...args) => ($options.initDrag && $options.initDrag(...args)))
                          }, [
                            renderSlot(_ctx.$slots, "header", {}, () => [
                              ($props.header)
                                ? (openBlock(), createElementBlock("span", {
                                    key: 0,
                                    id: $options.ariaLabelledById,
                                    class: "p-dialog-title"
                                  }, toDisplayString($props.header), 9, _hoisted_2))
                                : createCommentVNode("", true)
                            ]),
                            createElementVNode("div", _hoisted_3, [
                              ($props.maximizable)
                                ? withDirectives((openBlock(), createElementBlock("button", {
                                    key: 0,
                                    ref: $options.maximizableRef,
                                    autofocus: $data.focusable,
                                    class: "p-dialog-header-icon p-dialog-header-maximize p-link",
                                    onClick: _cache[0] || (_cache[0] = (...args) => ($options.maximize && $options.maximize(...args))),
                                    type: "button",
                                    tabindex: $props.maximizable ? '0' : '-1'
                                  }, [
                                    createElementVNode("span", {
                                      class: normalizeClass($options.maximizeIconClass)
                                    }, null, 2)
                                  ], 8, _hoisted_4)), [
                                    [_directive_ripple]
                                  ])
                                : createCommentVNode("", true),
                              ($props.closable)
                                ? withDirectives((openBlock(), createElementBlock("button", mergeProps({
                                    key: 1,
                                    ref: $options.closeButtonRef,
                                    autofocus: $data.focusable,
                                    class: "p-dialog-header-icon p-dialog-header-close p-link",
                                    onClick: _cache[1] || (_cache[1] = (...args) => ($options.close && $options.close(...args))),
                                    "aria-label": $options.closeAriaLabel,
                                    type: "button"
                                  }, $props.closeButtonProps), [
                                    createElementVNode("span", {
                                      class: normalizeClass(['p-dialog-header-close-icon', $props.closeIcon])
                                    }, null, 2)
                                  ], 16, _hoisted_5)), [
                                    [_directive_ripple]
                                  ])
                                : createCommentVNode("", true)
                            ])
                          ], 544))
                        : createCommentVNode("", true),
                      createElementVNode("div", mergeProps({
                        ref: $options.contentRef,
                        class: $options.contentStyleClass,
                        style: $props.contentStyle
                      }, $props.contentProps), [
                        renderSlot(_ctx.$slots, "default")
                      ], 16),
                      ($props.footer || _ctx.$slots.footer)
                        ? (openBlock(), createElementBlock("div", {
                            key: 1,
                            ref: $options.footerContainerRef,
                            class: "p-dialog-footer"
                          }, [
                            renderSlot(_ctx.$slots, "footer", {}, () => [
                              createTextVNode(toDisplayString($props.footer), 1)
                            ])
                          ], 512))
                        : createCommentVNode("", true)
                    ], 16, _hoisted_1)), [
                      [_directive_focustrap, { disabled: !$props.modal }]
                    ])
                  : createCommentVNode("", true)
              ]),
              _: 3
            }, 8, ["onBeforeEnter", "onEnter", "onBeforeLeave", "onLeave", "onAfterLeave"])
          ], 2))
        : createCommentVNode("", true)
    ]),
    _: 3
  }, 8, ["appendTo"]))
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

var css_248z = "\n.p-dialog-mask {\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n    pointer-events: none;\n}\n.p-dialog-mask.p-component-overlay {\r\n    pointer-events: auto;\n}\n.p-dialog {\r\n    display: flex;\r\n    flex-direction: column;\r\n    pointer-events: auto;\r\n    max-height: 90%;\r\n    transform: scale(1);\n}\n.p-dialog-content {\r\n    overflow-y: auto;\n}\n.p-dialog-header {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    flex-shrink: 0;\n}\n.p-dialog-footer {\r\n    flex-shrink: 0;\n}\n.p-dialog .p-dialog-header-icons {\r\n    display: flex;\r\n    align-items: center;\n}\n.p-dialog .p-dialog-header-icon {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    overflow: hidden;\r\n    position: relative;\n}\r\n\r\n/* Fluid */\n.p-fluid .p-dialog-footer .p-button {\r\n    width: auto;\n}\r\n\r\n/* Animation */\r\n/* Center */\n.p-dialog-enter-active {\r\n    transition: all 150ms cubic-bezier(0, 0, 0.2, 1);\n}\n.p-dialog-leave-active {\r\n    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.p-dialog-enter-from,\r\n.p-dialog-leave-to {\r\n    opacity: 0;\r\n    transform: scale(0.7);\n}\r\n\r\n/* Top, Bottom, Left, Right, Top* and Bottom* */\n.p-dialog-top .p-dialog,\r\n.p-dialog-bottom .p-dialog,\r\n.p-dialog-left .p-dialog,\r\n.p-dialog-right .p-dialog,\r\n.p-dialog-topleft .p-dialog,\r\n.p-dialog-topright .p-dialog,\r\n.p-dialog-bottomleft .p-dialog,\r\n.p-dialog-bottomright .p-dialog {\r\n    margin: 0.75rem;\r\n    transform: translate3d(0px, 0px, 0px);\n}\n.p-dialog-top .p-dialog-enter-active,\r\n.p-dialog-top .p-dialog-leave-active,\r\n.p-dialog-bottom .p-dialog-enter-active,\r\n.p-dialog-bottom .p-dialog-leave-active,\r\n.p-dialog-left .p-dialog-enter-active,\r\n.p-dialog-left .p-dialog-leave-active,\r\n.p-dialog-right .p-dialog-enter-active,\r\n.p-dialog-right .p-dialog-leave-active,\r\n.p-dialog-topleft .p-dialog-enter-active,\r\n.p-dialog-topleft .p-dialog-leave-active,\r\n.p-dialog-topright .p-dialog-enter-active,\r\n.p-dialog-topright .p-dialog-leave-active,\r\n.p-dialog-bottomleft .p-dialog-enter-active,\r\n.p-dialog-bottomleft .p-dialog-leave-active,\r\n.p-dialog-bottomright .p-dialog-enter-active,\r\n.p-dialog-bottomright .p-dialog-leave-active {\r\n    transition: all 0.3s ease-out;\n}\n.p-dialog-top .p-dialog-enter-from,\r\n.p-dialog-top .p-dialog-leave-to {\r\n    transform: translate3d(0px, -100%, 0px);\n}\n.p-dialog-bottom .p-dialog-enter-from,\r\n.p-dialog-bottom .p-dialog-leave-to {\r\n    transform: translate3d(0px, 100%, 0px);\n}\n.p-dialog-left .p-dialog-enter-from,\r\n.p-dialog-left .p-dialog-leave-to,\r\n.p-dialog-topleft .p-dialog-enter-from,\r\n.p-dialog-topleft .p-dialog-leave-to,\r\n.p-dialog-bottomleft .p-dialog-enter-from,\r\n.p-dialog-bottomleft .p-dialog-leave-to {\r\n    transform: translate3d(-100%, 0px, 0px);\n}\n.p-dialog-right .p-dialog-enter-from,\r\n.p-dialog-right .p-dialog-leave-to,\r\n.p-dialog-topright .p-dialog-enter-from,\r\n.p-dialog-topright .p-dialog-leave-to,\r\n.p-dialog-bottomright .p-dialog-enter-from,\r\n.p-dialog-bottomright .p-dialog-leave-to {\r\n    transform: translate3d(100%, 0px, 0px);\n}\r\n\r\n/* Maximize */\n.p-dialog-maximized {\r\n    -webkit-transition: none;\r\n    transition: none;\r\n    transform: none;\r\n    width: 100vw !important;\r\n    height: 100vh !important;\r\n    top: 0px !important;\r\n    left: 0px !important;\r\n    max-height: 100%;\r\n    height: 100%;\n}\n.p-dialog-maximized .p-dialog-content {\r\n    flex-grow: 1;\n}\r\n\r\n/* Position */\n.p-dialog-left {\r\n    justify-content: flex-start;\n}\n.p-dialog-right {\r\n    justify-content: flex-end;\n}\n.p-dialog-top {\r\n    align-items: flex-start;\n}\n.p-dialog-topleft {\r\n    justify-content: flex-start;\r\n    align-items: flex-start;\n}\n.p-dialog-topright {\r\n    justify-content: flex-end;\r\n    align-items: flex-start;\n}\n.p-dialog-bottom {\r\n    align-items: flex-end;\n}\n.p-dialog-bottomleft {\r\n    justify-content: flex-start;\r\n    align-items: flex-end;\n}\n.p-dialog-bottomright {\r\n    justify-content: flex-end;\r\n    align-items: flex-end;\n}\n.p-confirm-dialog .p-dialog-content {\r\n    display: flex;\r\n    align-items: center;\n}\r\n";
styleInject(css_248z);

script.render = render;

export { script as default };
