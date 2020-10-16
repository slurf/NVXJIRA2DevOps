/* module-key = 'com.atlassian.jira.plugins.jira-editor-plugin:undo-redo-ui', location = 'js/ui/undo-redo-buttons.js' */
define("jira/editor/ui/undo-redo-buttons", ["jira/editor/constants", "jira/editor/marionette", "jira/util/logger", "jquery"], function(j, k, r, e) {
    var o = k.ItemView.extend({
        tagName: "div",
        template: function(s) {
            return JIRA.Editor.Tags.Templates.undoRedoButtons()
        },
        ui: {
            undo: ".wiki-operation-undo",
            redo: ".wiki-operation-redo"
        },
        events: {
            "click @ui.undo": "onUndo",
            "click @ui.redo": "onRedo"
        },
        initialize: function a(s) {
            this.$container = this.determineButtonsContainer(s.textarea);
            if (null === this.$container) {
                r.warn("Could not attach undo/redo buttons to the editor");
                return
            }
            this.undoManager = s.undoManager
        },
        enable: function n(s) {
            if (!this.undoManager) {
                return
            }
            s = s || e([this.ui.undo, this.ui.redo]);
            s.removeAttr("disabled");
            s.attr("aria-disabled", "false")
        },
        disable: function c(s) {
            if (!this.undoManager) {
                return
            }
            s = s || e([this.ui.undo, this.ui.redo]);
            s.attr("disabled", "");
            s.attr("aria-disabled", "true")
        },
        highlight: function f(s) {
            if (!this.undoManager) {
                return
            }
            s.addClass("active");
            setTimeout(function() {
                s.removeClass("active")
            }, 100)
        },
        updateUI: function q(s, t) {
            if (!this.undoManager) {
                return
            }
            this.updateButton(this.ui.undo, this.undoManager.hasUndo());
            this.updateButton(this.ui.redo, this.undoManager.hasRedo());
            if (j.EventSources.SHORTCUT === t) {
                if (j.EventTypes.UNDO === s) {
                    this.highlight(this.ui.undo)
                } else {
                    if (j.EventTypes.REDO === s) {
                        this.highlight(this.ui.redo)
                    }
                }
            }
        },
        updateButton: function m(t, s) {
            if (s) {
                this.enable(t)
            } else {
                this.disable(t)
            }
        },
        onRender: function g() {
            if (!this.undoManager) {
                return
            }
            this.$el.addClass("wiki-edit-undo-redo-buttons aui-buttons");
            if (this.shouldUseDivider()) {
                this.$el.addClass("wiki-edit-separate-section")
            }
            this.ui.undo.tooltip("destroy");
            this.ui.redo.tooltip("destroy");
            this.updateUI();
            this.$el.prependTo(this.$container);
            this.attachHandlers()
        },
        attachHandlers: function b() {
            this.undoManager.on("editor:historychanged", function s(t, u) {
                this.updateUI(t, u)
            }, this)
        },
        determineButtonsContainer: function l(t) {
            var s;
            s = e(t).closest("div.inline-edit-fields").nextAll(".save-options").find(".wiki-button-bar-content");
            if (!s.length) {
                s = e(t).closest("div.jira-wikifield").next(".save-options").find(".wiki-button-bar-content")
            }
            if (!s.length) {
                s = e(t).siblings(".sd-rte-bar").find(".wiki-button-bar-content")
            }
            if (!s.length) {
                s = e(t).parent(".wiki-edit-content").siblings(".sd-rte-bar").find(".wiki-button-bar-content")
            }
            return (s.length) ? s : null
        },
        shouldUseDivider: function i() {
            var s = this.$container.children(":visible");
            return s.length > 0 && !s.eq(0).is("button, input")
        },
        onUndo: function p() {
            this.undoManager.undo();
            this._focusTextarea()
        },
        onRedo: function h() {
            this.undoManager.redo();
            this._focusTextarea()
        },
        _focusTextarea: function d() {
            this.options.textarea.focus()
        }
    });
    return o
});
