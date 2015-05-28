//require(['jquery'], function($) {
	var CustomizedWizard = {
		onClick: function(e) {
			console.log("Clicked Wizard", "event", e, "this", this);
		}
	};

	console.log("setting up jquery test...", CustomizeWizard);

	$(".wizard_popup_link").on("click", CustomizedWizard.onClick);
//});
