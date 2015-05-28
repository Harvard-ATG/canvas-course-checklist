require(['jquery'], function($) {

	var Customize = {
		// Event handler for when the "Setup Checklist" button is clicked
		onClick: function(e) {
			console.log("Clicked Wizard", "event", e, "this", this);
			this.customize();
		},
		customize: function() {
			this.removeItem('wizard_add_students');

			this.updateItem({
				id: "wizard_add_tas", 
				text: "Add TFs to the Course", 
				msg: [
					"You may want to assign some TFs to help you with the course. ",
					"TFs can grade student submissions, help moderate the discussions ",
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
		updateItem: function(item) {
			console.log("update", item);
			var that = this, $el = $("#"+item.id);
			$el.text(item.text);
			$el.on("click", function(e) {
				var $box = that.getMessageBoxEl();
				console.log("clicked", e, $box, item.msg, item.btn);
				$box.find('.ic-wizard-box__message-text').text(item.msg);
				$box.find('.ic-wizard-box__message-button .Button').text(item.btn);
				e.stopPropagation();
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
