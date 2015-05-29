require(['jquery'], function($) {
	
	/**
	 * See the CourseWizard ListItems JSX file and the Courses Controller for the environment variables passed to the JS ENV:
	 *
	 * 1) https://github.com/instructure/canvas-lms/blob/master/app/jsx/course_wizard/ListItems.jsx
	 * 2) https://github.com/instructure/canvas-lms/blob/master/app/controllers/courses_controller.rb
	 */
	var ADD_TFS_URL = ENV.COURSE_WIZARD.urls.add_tas;

	/**
	 * Customizes the appearance of the "Setup Checklist" on the Course home 
	 * page (for instructors only).
	 *
	 * NOTE: 
	 * The course wizard is a ReactJS component, and this makes
	 * it somewhat difficult to modify the wizard because React expects
	 * to manage the DOM (React implements its own "shadow DOM" to know
	 * when/how to update DOM elements). For background on ReactJS,
	 * see: https://facebook.github.io/react/
	 *
	 */
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
				btn: '<a href="'+ADD_TFS_URL+'" class="Button Button--primary">Add TFs to the Course</a>'
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
			var that = this;
			var $el = $("#"+item.id);
			$el.text(item.text);
			this.getNavEl().on("click", function(e) {
				if (!$(e.target).is($el)) {
					return true;
				}
				var $box = that.getMessageBoxEl();
				console.log("clicked", e, $box, item.msg, item.btn);
				$box.find('.ic-wizard-box__message-text').text(item.msg);
				$box.find('.ic-wizard-box__message-button').html(item.btn);
				return false;
			});
		},
		// Returns the message box container element
		getMessageBoxEl: function() {
			return $(".CourseWizard__modalOverlay .ic-wizard-box__message");
		},
		getNavEl: function() {
			return $(".ic-wizard-box__nav");
		},
		getModalEl: function() {
			return $(".ReactModalPortal");
		}
	};

	// Bind the context of the event handler to the object it is attached to
	Customize.onClick = $.proxy(Customize.onClick, Customize);

	// Attach our customizations to the wizard button
	console.log("setting up jquery test...", Customize);
	$(".wizard_popup_link").on("click", Customize.onClick);
});
