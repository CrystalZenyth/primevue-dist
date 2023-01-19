import { openBlock, createElementBlock, createElementVNode, renderSlot } from 'vue';

var script = {
    name: 'Toolbar',
    props: {
        'aria-labelledby': {
            type: String,
            default: null
        }
    }
};

const _hoisted_1 = ["aria-labelledby"];
const _hoisted_2 = { class: "p-toolbar-group-start p-toolbar-group-left" };
const _hoisted_3 = { class: "p-toolbar-group-center" };
const _hoisted_4 = { class: "p-toolbar-group-end p-toolbar-group-right" };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("div", {
    class: "p-toolbar p-component",
    role: "toolbar",
    "aria-labelledby": _ctx.ariaLabelledby
  }, [
    createElementVNode("div", _hoisted_2, [
      renderSlot(_ctx.$slots, "start")
    ]),
    createElementVNode("div", _hoisted_3, [
      renderSlot(_ctx.$slots, "center")
    ]),
    createElementVNode("div", _hoisted_4, [
      renderSlot(_ctx.$slots, "end")
    ])
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

var css_248z = "\n.p-toolbar {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    flex-wrap: wrap;\n}\n.p-toolbar-group-start,\n.p-toolbar-group-center,\n.p-toolbar-group-end {\n    display: flex;\n    align-items: center;\n}\n.p-toolbar-group-left,\n.p-toolbar-group-right {\n    display: flex;\n    align-items: center;\n}\n";
styleInject(css_248z);

script.render = render;

export { script as default };
