require(['jquery'], function($) {
	var Customize = {
		onClick: function(e) {
			console.log("Clicked Wizard", "event", e, "this", this);
			this.updateWizard();
		},
		updateWizard: function() {
			console.log("Updating Wizard...");
			//this.remove('wizard_add_students');
		},
		remove: function(id) {
			$(id).remove();
		}
	};

	Customize.onClick = $.proxy(Customize.onClick, Customize);

	console.log("setting up jquery test...", Customize);

	$(".wizard_popup_link").on("click", Customize.onClick);
});
