require(['jquery'], function($) {
	var Customize = {
		onClick: function(e) {
			console.log("Clicked Wizard", "event", e, "this", this);
			this.updateWizard();
		},
		updateWizard: function() {
			console.log("Updating Wizard...");
			this.remove('wizard_add_students');
			this.replaceText("wizard_add_tas", /TA(s?)/g, "TF$1");
		},
		remove: function(id) {
			$("#"+id).remove();
		},
		replaceText: function(id, pattern, replacement) {
			var $itemEl = $("#"+id); 
			var $boxEl = this.getMessageBoxEl();
			var that = this;

			// Replace text on the checklist 
			that._replaceText($itemEl, pattern, replacement);

			// When the checklist item is clicked, replace text in the message box
			$itemEl.on("click", function(e) {
				that._replaceText($boxEl, pattern, replacement);
			});
		},
		_replaceText: function($el, pattern, replacement) {
			// Replace all descendant text node values
			$el.find("*").contents().filter(function () { 
				return this.nodeType === 3; 
			}).each(function() {
				console.log("replacing", $el, this);
				this.nodeValue = this.nodeValue.replace(pattern, replacement);
			});
		},
		getMessageBoxEl: function() {
			return $(".CourseWizard__modalOverlay .ic-wizard-box__message");
		}
	};

	Customize.onClick = $.proxy(Customize.onClick, Customize);

	console.log("setting up jquery test...", Customize);

	$(".wizard_popup_link").on("click", Customize.onClick);
});
