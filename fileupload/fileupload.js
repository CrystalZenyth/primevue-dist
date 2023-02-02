this.primevue = this.primevue || {};
this.primevue.fileupload = (function (Button, Message, ProgressBar, Ripple, utils, Badge, vue) {
    'use strict';

    var script$1 = {
        emits: ['remove'],
        props: {
            files: {
                type: Array,
                default: () => []
            },
            badgeSeverity: {
                type: String,
                default: 'warning'
            },
            badgeValue: {
                type: String,
                default: null
            },
            previewWidth: {
                type: Number,
                default: 50
            }
        },
        methods: {
            formatSize(bytes) {
                if (bytes === 0) {
                    return '0 B';
                }

                let k = 1000,
                    dm = 3,
                    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                    i = Math.floor(Math.log(bytes) / Math.log(k));

                return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
            }
        },
        components: {
            FileUploadButton: Button,
            FileUploadBadge: Badge
        }
    };

    const _hoisted_1$1 = ["alt", "src", "width"];
    const _hoisted_2$1 = { class: "p-fileupload-file-details" };
    const _hoisted_3$1 = { class: "p-fileupload-file-name" };
    const _hoisted_4$1 = { class: "p-fileupload-file-size" };
    const _hoisted_5$1 = { class: "p-fileupload-file-actions" };

    function render$1(_ctx, _cache, $props, $setup, $data, $options) {
      const _component_FileUploadBadge = vue.resolveComponent("FileUploadBadge");
      const _component_FileUploadButton = vue.resolveComponent("FileUploadButton");

      return (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($props.files, (file, index) => {
        return (vue.openBlock(), vue.createElementBlock("div", {
          key: file.name + file.type + file.size,
          class: "p-fileupload-file"
        }, [
          vue.createElementVNode("img", {
            role: "presentation",
            class: "p-fileupload-file-thumbnail",
            alt: file.name,
            src: file.objectURL,
            width: $props.previewWidth
          }, null, 8, _hoisted_1$1),
          vue.createElementVNode("div", _hoisted_2$1, [
            vue.createElementVNode("div", _hoisted_3$1, vue.toDisplayString(file.name), 1),
            vue.createElementVNode("span", _hoisted_4$1, vue.toDisplayString($options.formatSize(file.size)), 1),
            vue.createVNode(_component_FileUploadBadge, {
              value: $props.badgeValue,
              class: "p-fileupload-file-badge",
              severity: $props.badgeSeverity
            }, null, 8, ["value", "severity"])
          ]),
          vue.createElementVNode("div", _hoisted_5$1, [
            vue.createVNode(_component_FileUploadButton, {
              icon: "pi pi-times",
              onClick: $event => (_ctx.$emit('remove', index)),
              class: "p-fileupload-file-remove p-button-text p-button-danger p-button-rounded"
            }, null, 8, ["onClick"])
          ])
        ]))
      }), 128))
    }

    script$1.render = render$1;

    var script = {
        name: 'FileUpload',
        emits: ['select', 'uploader', 'before-upload', 'progress', 'upload', 'error', 'before-send', 'clear', 'remove', 'remove-uploaded-file'],
        props: {
            name: {
                type: String,
                default: null
            },
            url: {
                type: String,
                default: null
            },
            mode: {
                type: String,
                default: 'advanced'
            },
            multiple: {
                type: Boolean,
                default: false
            },
            accept: {
                type: String,
                default: null
            },
            disabled: {
                type: Boolean,
                default: false
            },
            auto: {
                type: Boolean,
                default: false
            },
            maxFileSize: {
                type: Number,
                default: null
            },
            invalidFileSizeMessage: {
                type: String,
                default: '{0}: Invalid file size, file size should be smaller than {1}.'
            },
            invalidFileTypeMessage: {
                type: String,
                default: '{0}: Invalid file type, allowed file types: {1}.'
            },
            fileLimit: {
                type: Number,
                default: null
            },
            invalidFileLimitMessage: {
                type: String,
                default: 'Maximum number of files exceeded, limit is {0} at most.'
            },
            withCredentials: {
                type: Boolean,
                default: false
            },
            previewWidth: {
                type: Number,
                default: 50
            },
            chooseLabel: {
                type: String,
                default: null
            },
            uploadLabel: {
                type: String,
                default: null
            },
            cancelLabel: {
                type: String,
                default: null
            },
            customUpload: {
                type: Boolean,
                default: false
            },
            showUploadButton: {
                type: Boolean,
                default: true
            },
            showCancelButton: {
                type: Boolean,
                default: true
            },
            chooseIcon: {
                type: String,
                default: 'pi pi-plus'
            },
            uploadIcon: {
                type: String,
                default: 'pi pi-upload'
            },
            cancelIcon: {
                type: String,
                default: 'pi pi-times'
            },
            style: null,
            class: null
        },
        duplicateIEEvent: false,
        data() {
            return {
                uploadedFileCount: 0,
                files: [],
                messages: [],
                focused: false,
                progress: null,
                uploadedFiles: []
            };
        },
        methods: {
            onFileSelect(event) {
                if (event.type !== 'drop' && this.isIE11() && this.duplicateIEEvent) {
                    this.duplicateIEEvent = false;

                    return;
                }

                this.messages = [];
                this.files = this.files || [];
                let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;

                for (let file of files) {
                    if (!this.isFileSelected(file)) {
                        if (this.validate(file)) {
                            if (this.isImage(file)) {
                                file.objectURL = window.URL.createObjectURL(file);
                            }

                            this.files.push(file);
                        }
                    }
                }

                this.$emit('select', { originalEvent: event, files: this.files });

                if (this.fileLimit) {
                    this.checkFileLimit();
                }

                if (this.auto && this.hasFiles && !this.isFileLimitExceeded()) {
                    this.upload();
                }

                if (event.type !== 'drop' && this.isIE11()) {
                    this.clearIEInput();
                } else {
                    this.clearInputElement();
                }
            },
            choose() {
                this.$refs.fileInput.click();
            },
            upload() {
                if (this.customUpload) {
                    if (this.fileLimit) {
                        this.uploadedFileCount += this.files.length;
                    }

                    this.$emit('uploader', { files: this.files });
                    this.clear();
                } else {
                    let xhr = new XMLHttpRequest();
                    let formData = new FormData();

                    this.$emit('before-upload', {
                        xhr: xhr,
                        formData: formData
                    });

                    for (let file of this.files) {
                        formData.append(this.name, file, file.name);
                    }

                    xhr.upload.addEventListener('progress', (event) => {
                        if (event.lengthComputable) {
                            this.progress = Math.round((event.loaded * 100) / event.total);
                        }

                        this.$emit('progress', {
                            originalEvent: event,
                            progress: this.progress
                        });
                    });

                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === 4) {
                            this.progress = 0;

                            if (xhr.status >= 200 && xhr.status < 300) {
                                if (this.fileLimit) {
                                    this.uploadedFileCount += this.files.length;
                                }

                                this.$emit('upload', {
                                    xhr: xhr,
                                    files: this.files
                                });
                            } else {
                                this.$emit('error', {
                                    xhr: xhr,
                                    files: this.files
                                });
                            }

                            this.uploadedFiles.push(...this.files);
                            this.clear();
                        }
                    };

                    xhr.open('POST', this.url, true);

                    this.$emit('before-send', {
                        xhr: xhr,
                        formData: formData
                    });

                    xhr.withCredentials = this.withCredentials;

                    xhr.send(formData);
                }
            },
            clear() {
                this.files = [];
                this.messages = null;
                this.$emit('clear');

                if (this.isAdvanced) {
                    this.clearInputElement();
                }
            },
            onFocus() {
                this.focused = true;
            },
            onBlur() {
                this.focused = false;
            },
            isFileSelected(file) {
                if (this.files && this.files.length) {
                    for (let sFile of this.files) {
                        if (sFile.name + sFile.type + sFile.size === file.name + file.type + file.size) return true;
                    }
                }

                return false;
            },
            isIE11() {
                return !!window['MSInputMethodContext'] && !!document['documentMode'];
            },
            validate(file) {
                if (this.accept && !this.isFileTypeValid(file)) {
                    this.messages.push(this.invalidFileTypeMessage.replace('{0}', file.name).replace('{1}', this.accept));

                    return false;
                }

                if (this.maxFileSize && file.size > this.maxFileSize) {
                    this.messages.push(this.invalidFileSizeMessage.replace('{0}', file.name).replace('{1}', this.formatSize(this.maxFileSize)));

                    return false;
                }

                return true;
            },
            isFileTypeValid(file) {
                let acceptableTypes = this.accept.split(',').map((type) => type.trim());

                for (let type of acceptableTypes) {
                    let acceptable = this.isWildcard(type) ? this.getTypeClass(file.type) === this.getTypeClass(type) : file.type == type || this.getFileExtension(file).toLowerCase() === type.toLowerCase();

                    if (acceptable) {
                        return true;
                    }
                }

                return false;
            },
            getTypeClass(fileType) {
                return fileType.substring(0, fileType.indexOf('/'));
            },
            isWildcard(fileType) {
                return fileType.indexOf('*') !== -1;
            },
            getFileExtension(file) {
                return '.' + file.name.split('.').pop();
            },
            isImage(file) {
                return /^image\//.test(file.type);
            },
            onDragEnter(event) {
                if (!this.disabled) {
                    event.stopPropagation();
                    event.preventDefault();
                }
            },
            onDragOver(event) {
                if (!this.disabled) {
                    utils.DomHandler.addClass(this.$refs.content, 'p-fileupload-highlight');
                    event.stopPropagation();
                    event.preventDefault();
                }
            },
            onDragLeave() {
                if (!this.disabled) {
                    utils.DomHandler.removeClass(this.$refs.content, 'p-fileupload-highlight');
                }
            },
            onDrop(event) {
                if (!this.disabled) {
                    utils.DomHandler.removeClass(this.$refs.content, 'p-fileupload-highlight');
                    event.stopPropagation();
                    event.preventDefault();

                    const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
                    const allowDrop = this.multiple || (files && files.length === 1);

                    if (allowDrop) {
                        this.onFileSelect(event);
                    }
                }
            },
            onBasicUploaderClick() {
                if (this.hasFiles) this.upload();
                else this.$refs.fileInput.click();
            },
            remove(index) {
                this.clearInputElement();
                let removedFile = this.files.splice(index, 1)[0];

                this.files = [...this.files];
                this.$emit('remove', {
                    file: removedFile,
                    files: this.files
                });
            },
            removeUploadedFile(index) {
                let removedFile = this.uploadedFiles.splice(index, 1)[0];

                this.uploadedFiles = [...this.uploadedFiles];
                this.$emit('remove-uploaded-file', {
                    file: removedFile,
                    files: this.uploadedFiles
                });
            },
            clearInputElement() {
                this.$refs.fileInput.value = '';
            },
            clearIEInput() {
                if (this.$refs.fileInput) {
                    this.duplicateIEEvent = true; //IE11 fix to prevent onFileChange trigger again
                    this.$refs.fileInput.value = '';
                }
            },
            formatSize(bytes) {
                if (bytes === 0) {
                    return '0 B';
                }

                let k = 1000,
                    dm = 3,
                    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                    i = Math.floor(Math.log(bytes) / Math.log(k));

                return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
            },
            isFileLimitExceeded() {
                if (this.fileLimit && this.fileLimit <= this.files.length + this.uploadedFileCount && this.focused) {
                    this.focused = false;
                }

                return this.fileLimit && this.fileLimit < this.files.length + this.uploadedFileCount;
            },
            checkFileLimit() {
                if (this.isFileLimitExceeded()) {
                    this.messages.push(this.invalidFileLimitMessage.replace('{0}', this.fileLimit.toString()));
                }
            },
            onMessageClose() {
                this.messages = null;
            }
        },
        computed: {
            isAdvanced() {
                return this.mode === 'advanced';
            },
            isBasic() {
                return this.mode === 'basic';
            },
            advancedChooseButtonClass() {
                return [
                    'p-button p-component p-fileupload-choose',
                    this.class,
                    {
                        'p-disabled': this.disabled,
                        'p-focus': this.focused
                    }
                ];
            },
            basicChooseButtonClass() {
                return [
                    'p-button p-component p-fileupload-choose',
                    this.class,
                    {
                        'p-fileupload-choose-selected': this.hasFiles,
                        'p-disabled': this.disabled,
                        'p-focus': this.focused
                    }
                ];
            },
            advancedChooseIconClass() {
                return ['p-button-icon p-button-icon-left pi-fw', this.chooseIcon];
            },
            basicChooseButtonIconClass() {
                return ['p-button-icon p-button-icon-left', !this.hasFiles || this.auto ? this.uploadIcon : this.chooseIcon];
            },
            basicChooseButtonLabel() {
                return this.auto ? this.chooseButtonLabel : this.hasFiles ? this.files.map((f) => f.name).join(', ') : this.chooseButtonLabel;
            },
            hasFiles() {
                return this.files && this.files.length > 0;
            },
            hasUploadedFiles() {
                return this.uploadedFiles && this.uploadedFiles.length > 0;
            },
            chooseDisabled() {
                return this.disabled || (this.fileLimit && this.fileLimit <= this.files.length + this.uploadedFileCount);
            },
            uploadDisabled() {
                return this.disabled || !this.hasFiles || (this.fileLimit && this.fileLimit < this.files.length);
            },
            cancelDisabled() {
                return this.disabled || !this.hasFiles;
            },
            chooseButtonLabel() {
                return this.chooseLabel || this.$primevue.config.locale.choose;
            },
            uploadButtonLabel() {
                return this.uploadLabel || this.$primevue.config.locale.upload;
            },
            cancelButtonLabel() {
                return this.cancelLabel || this.$primevue.config.locale.cancel;
            },
            completedLabel() {
                return this.$primevue.config.locale.completed;
            },
            pendingLabel() {
                return this.$primevue.config.locale.pending;
            }
        },
        components: {
            FileUploadButton: Button,
            FileUploadProgressBar: ProgressBar,
            FileUploadMessage: Message,
            FileContent: script$1
        },
        directives: {
            ripple: Ripple
        }
    };

    const _hoisted_1 = {
      key: 0,
      class: "p-fileupload p-fileupload-advanced p-component"
    };
    const _hoisted_2 = ["multiple", "accept", "disabled"];
    const _hoisted_3 = { class: "p-fileupload-buttonbar" };
    const _hoisted_4 = { class: "p-button-label" };
    const _hoisted_5 = {
      key: 0,
      class: "p-fileupload-empty"
    };
    const _hoisted_6 = {
      key: 1,
      class: "p-fileupload p-fileupload-basic p-component"
    };
    const _hoisted_7 = { class: "p-button-label" };
    const _hoisted_8 = ["accept", "disabled", "multiple"];

    function render(_ctx, _cache, $props, $setup, $data, $options) {
      const _component_FileUploadButton = vue.resolveComponent("FileUploadButton");
      const _component_FileUploadProgressBar = vue.resolveComponent("FileUploadProgressBar");
      const _component_FileUploadMessage = vue.resolveComponent("FileUploadMessage");
      const _component_FileContent = vue.resolveComponent("FileContent");
      const _directive_ripple = vue.resolveDirective("ripple");

      return ($options.isAdvanced)
        ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
            vue.createElementVNode("input", {
              ref: "fileInput",
              type: "file",
              onChange: _cache[0] || (_cache[0] = (...args) => ($options.onFileSelect && $options.onFileSelect(...args))),
              multiple: $props.multiple,
              accept: $props.accept,
              disabled: $options.chooseDisabled
            }, null, 40, _hoisted_2),
            vue.createElementVNode("div", _hoisted_3, [
              vue.renderSlot(_ctx.$slots, "header", {
                files: $data.files,
                uploadedFiles: $data.uploadedFiles,
                chooseCallback: $options.choose,
                uploadCallback: $options.upload,
                clearCallback: $options.clear
              }, () => [
                vue.withDirectives((vue.openBlock(), vue.createElementBlock("span", {
                  class: vue.normalizeClass($options.advancedChooseButtonClass),
                  style: vue.normalizeStyle($props.style),
                  onClick: _cache[1] || (_cache[1] = (...args) => ($options.choose && $options.choose(...args))),
                  onKeydown: _cache[2] || (_cache[2] = vue.withKeys((...args) => ($options.choose && $options.choose(...args)), ["enter"])),
                  onFocus: _cache[3] || (_cache[3] = (...args) => ($options.onFocus && $options.onFocus(...args))),
                  onBlur: _cache[4] || (_cache[4] = (...args) => ($options.onBlur && $options.onBlur(...args))),
                  tabindex: "0"
                }, [
                  vue.createElementVNode("span", {
                    class: vue.normalizeClass($options.advancedChooseIconClass)
                  }, null, 2),
                  vue.createElementVNode("span", _hoisted_4, vue.toDisplayString($options.chooseButtonLabel), 1)
                ], 38)), [
                  [_directive_ripple]
                ]),
                ($props.showUploadButton)
                  ? (vue.openBlock(), vue.createBlock(_component_FileUploadButton, {
                      key: 0,
                      label: $options.uploadButtonLabel,
                      icon: $props.uploadIcon,
                      onClick: $options.upload,
                      disabled: $options.uploadDisabled
                    }, null, 8, ["label", "icon", "onClick", "disabled"]))
                  : vue.createCommentVNode("", true),
                ($props.showCancelButton)
                  ? (vue.openBlock(), vue.createBlock(_component_FileUploadButton, {
                      key: 1,
                      label: $options.cancelButtonLabel,
                      icon: $props.cancelIcon,
                      onClick: $options.clear,
                      disabled: $options.cancelDisabled
                    }, null, 8, ["label", "icon", "onClick", "disabled"]))
                  : vue.createCommentVNode("", true)
              ])
            ]),
            vue.createElementVNode("div", {
              ref: "content",
              class: "p-fileupload-content",
              onDragenter: _cache[5] || (_cache[5] = (...args) => ($options.onDragEnter && $options.onDragEnter(...args))),
              onDragover: _cache[6] || (_cache[6] = (...args) => ($options.onDragOver && $options.onDragOver(...args))),
              onDragleave: _cache[7] || (_cache[7] = (...args) => ($options.onDragLeave && $options.onDragLeave(...args))),
              onDrop: _cache[8] || (_cache[8] = (...args) => ($options.onDrop && $options.onDrop(...args)))
            }, [
              vue.renderSlot(_ctx.$slots, "content", {
                files: $data.files,
                uploadedFiles: $data.uploadedFiles,
                removeUploadedFileCallback: $options.removeUploadedFile,
                removeFileCallback: $options.remove,
                progress: $data.progress,
                messages: $data.messages
              }, () => [
                ($options.hasFiles)
                  ? (vue.openBlock(), vue.createBlock(_component_FileUploadProgressBar, {
                      key: 0,
                      value: $data.progress,
                      showValue: false
                    }, null, 8, ["value"]))
                  : vue.createCommentVNode("", true),
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.messages, (msg) => {
                  return (vue.openBlock(), vue.createBlock(_component_FileUploadMessage, {
                    key: msg,
                    severity: "error",
                    onClose: $options.onMessageClose
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode(vue.toDisplayString(msg), 1)
                    ]),
                    _: 2
                  }, 1032, ["onClose"]))
                }), 128)),
                ($options.hasFiles)
                  ? (vue.openBlock(), vue.createBlock(_component_FileContent, {
                      key: 1,
                      files: $data.files,
                      onRemove: $options.remove,
                      badgeValue: $options.pendingLabel,
                      previewWidth: $props.previewWidth
                    }, null, 8, ["files", "onRemove", "badgeValue", "previewWidth"]))
                  : vue.createCommentVNode("", true),
                vue.createVNode(_component_FileContent, {
                  files: $data.uploadedFiles,
                  onRemove: $options.removeUploadedFile,
                  badgeValue: $options.completedLabel,
                  badgeSeverity: "success",
                  previewWidth: $props.previewWidth
                }, null, 8, ["files", "onRemove", "badgeValue", "previewWidth"])
              ]),
              (_ctx.$slots.empty && !$options.hasFiles && !$options.hasUploadedFiles)
                ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_5, [
                    vue.renderSlot(_ctx.$slots, "empty")
                  ]))
                : vue.createCommentVNode("", true)
            ], 544)
          ]))
        : ($options.isBasic)
          ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.messages, (msg) => {
                return (vue.openBlock(), vue.createBlock(_component_FileUploadMessage, {
                  key: msg,
                  severity: "error",
                  onClose: $options.onMessageClose
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(vue.toDisplayString(msg), 1)
                  ]),
                  _: 2
                }, 1032, ["onClose"]))
              }), 128)),
              vue.withDirectives((vue.openBlock(), vue.createElementBlock("span", {
                class: vue.normalizeClass($options.basicChooseButtonClass),
                style: vue.normalizeStyle($props.style),
                onMouseup: _cache[12] || (_cache[12] = (...args) => ($options.onBasicUploaderClick && $options.onBasicUploaderClick(...args))),
                onKeydown: _cache[13] || (_cache[13] = vue.withKeys((...args) => ($options.choose && $options.choose(...args)), ["enter"])),
                onFocus: _cache[14] || (_cache[14] = (...args) => ($options.onFocus && $options.onFocus(...args))),
                onBlur: _cache[15] || (_cache[15] = (...args) => ($options.onBlur && $options.onBlur(...args))),
                tabindex: "0"
              }, [
                vue.createElementVNode("span", {
                  class: vue.normalizeClass($options.basicChooseButtonIconClass)
                }, null, 2),
                vue.createElementVNode("span", _hoisted_7, vue.toDisplayString($options.basicChooseButtonLabel), 1),
                (!$options.hasFiles)
                  ? (vue.openBlock(), vue.createElementBlock("input", {
                      key: 0,
                      ref: "fileInput",
                      type: "file",
                      accept: $props.accept,
                      disabled: $props.disabled,
                      multiple: $props.multiple,
                      onChange: _cache[9] || (_cache[9] = (...args) => ($options.onFileSelect && $options.onFileSelect(...args))),
                      onFocus: _cache[10] || (_cache[10] = (...args) => ($options.onFocus && $options.onFocus(...args))),
                      onBlur: _cache[11] || (_cache[11] = (...args) => ($options.onBlur && $options.onBlur(...args)))
                    }, null, 40, _hoisted_8))
                  : vue.createCommentVNode("", true)
              ], 38)), [
                [_directive_ripple]
              ])
            ]))
          : vue.createCommentVNode("", true)
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

    var css_248z = "\n.p-fileupload-content {\n    position: relative;\n}\n.p-fileupload-content .p-progressbar {\n    width: 100%;\n    position: absolute;\n    top: 0;\n    left: 0;\n}\n.p-button.p-fileupload-choose {\n    position: relative;\n    overflow: hidden;\n}\n.p-fileupload-buttonbar {\n    display: flex;\n    flex-wrap: wrap;\n}\n.p-fileupload > input[type='file'],\n.p-fileupload-basic input[type='file'] {\n    display: none;\n}\n.p-fluid .p-fileupload .p-button {\n    width: auto;\n}\n.p-fileupload-file {\n    display: flex;\n    flex-wrap: wrap;\n    align-items: center;\n}\n.p-fileupload-file-thumbnail {\n    flex-shrink: 0;\n}\n.p-fileupload-file-actions {\n    margin-left: auto;\n}\n";
    styleInject(css_248z);

    script.render = render;

    return script;

})(primevue.button, primevue.message, primevue.progressbar, primevue.ripple, primevue.utils, primevue.badge, Vue);
