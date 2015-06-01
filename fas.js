require([
	'jquery',
	'jsx/course_wizard/ListItems',
], function($, ListItems) {

	/**
	 * The CourseWizard (i.e. Setup Checklist) is a javascript component built using ReactJS.
	 * If you're not familiar with React, it uses a syntax extension called JSX, which is compiled
	 * down to JS on the server. The CourseWizard is composed of several sub-components, each of
	 * which is contained in a separate JSX file.
	 *
	 * The JSX files are passed environment values from the Courses Controller, which are set in the
	 * global ENV namespace. Refer to the source files below:
	 * 
	 * 1) https://github.com/instructure/canvas-lms/blob/master/app/jsx/course_wizard/ListItems.jsx
	 * 2) https://github.com/instructure/canvas-lms/blob/master/app/jsx/course_wizard/ChecklistItem.jsx
	 * 3) https://github.com/instructure/canvas-lms/blob/master/app/jsx/course_wizard/CourseWizard.jsx
	 * 4) https://github.com/instructure/canvas-lms/blob/master/app/controllers/courses_controller.rb
     *
	 * To customize the list of items that appear in the CourseWizard, we can simply load the ListItems
	 * module that defines the items that are rendered, and then modify that directly. 
	 */
	var ITEMS = ListItems;
	var POLICY_WIZARD_TOOL_ID = 1509;
	var POLICY_WIZARD_TOOL_URL = window.location.pathname + "/external_tools/" + POLICY_WIZARD_TOOL_ID;

	// REMOVE: Add Students (third item -- at index 2 in the array)
	ITEMS.splice(2, 1);
	
	// CHANGE: TA => TF in title and text
	$.each(['text', 'title'], function(idx, prop) {
		var add_tas = ITEMS[6];
		add_tas[prop] = add_tas[prop].replace(/TA(s)?/g, "TF$1");
	});
	
	// INSERT: Academic Integrity Policy
	// TODO: Figure out how to get the correct URL for the course's policy wizard tool.
	ITEMS.splice(7, 0, {
		key:'policy_wizard',
		complete: false,
		title: "Customize academic integrity policy",
		text: "Customize the academic integrity policy for your course.",
		//url: "/courses/:course_id/external_tools/:tool_id",
		url: POLICY_WIZARD_TOOL_URL,
		iconClass: 'icon-educators'
	});

	console.log("Customized Setup Checklist: ", ListItems);
});
