require(['jquery'], function($) {

	var Customize = {
		// Event handler for when the "Setup Checklist" button is clicked
		onClick: function(e) {
			console.log("Clicked Wizard", "event", e, "this", this);

			this.removeItem('wizard_add_students');

			this.updateItem({
				id: "wizard_add_tas", 
				text: "Add TFs to the Course", 
				message: [
					"You may want to assign some TAs to help you with the course. ",
					"TAs can grade student submissions, help moderate the discussions ",
					"and even update due dates and assignment details for you."
				].join(''),
				btn: "Add TFs to the Course"
			});
		},
		// Removes an item from the checklist
		removeItem: function(id) {
			console.log("remove", id);
			$("#"+id).remove();
		},
		// Updates an item in the checklist 
		updateItem: function(replacment) {
			console.log("update", replacement);
			var that = this;
			var $el = $("#"+replacement.id);
			$el.text(replacement.text);
			$el.on("click", function(e) {
				var $box = that.getMessageBoxEl();
				$box.find('.ic-wizard-box__message-text').text(replacement.msg);
				$box.find('.ic-wizard-box__message-button').text(replacement.btn);
			});
		},
		// Returns the message box container element
		getMessageBoxEl: function() {
			return $(".CourseWizard__modalOverlay .ic-wizard-box__message");
		}
	};

	// Bind the context of the event handler to the object it is attached to
	Customize.onClick = $.proxy(Customize.onClick, Customize);

	// Attach our customizations to the wizard button
	console.log("setting up jquery test...", Customize);
	$(".wizard_popup_link").on("click", Customize.onClick);
});
