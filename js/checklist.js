require(['jquery', 'jsx/course_wizard/ListItems'], function($, ListItems) {

	/**
	 * SYNOPSIS:
	 *
	 * This module modifies the checklist items that populate the "Setup Checklist" for
	 * course instructors.
	 *
	 * DESCRIPTION:
	 *
	 * The "Setup Checklist", or CourseWizard, as it is called in Canvas, is a component built
	 * using ReactJS and a syntax extension called JSX. The CourseWizard is composed of several
	 * sub-components, each of which is contained in a separate JSX file, which compiles down
	 * to native JS (the compilation step happens on the server).
	 *
	 * The components are passed environment values from the Courses Controller, and these values
	 * are accessed in the global ENV namespace. To better understand how the CourseWizard works,
	 * refer to these source files:
	 * 
	 * 1) https://github.com/instructure/canvas-lms/blob/master/app/jsx/course_wizard/ListItems.jsx
	 * 2) https://github.com/instructure/canvas-lms/blob/master/app/jsx/course_wizard/ChecklistItem.jsx
	 * 3) https://github.com/instructure/canvas-lms/blob/master/app/jsx/course_wizard/CourseWizard.jsx
	 * 4) https://github.com/instructure/canvas-lms/blob/master/app/controllers/courses_controller.rb
	 *
	 * To customize the list of items that appear in the CourseWizard, we load the ListItems
	 * module and then modify the desired items. ListItems is a reference to an array of objects,
	 * and CourseWizard uses this same reference at render time, so any changes we make here are
	 * visible to the CourseWizard component.
	 *
	 * NOTE ABOUT EXTERNAL TOOL LINKS:
	 *
	 * The external tool links have the tool ID hard coded for the "Harvard College/GSAS"
	 * account (account_id=39), since it would be too cumbersome to obtain the tool ID
	 * using the Canvas API. Ideally, these would be provided to the JS as environment
	 * variables, but since we don't have the ability to modify the server-side controller,
	 * that's not an option.
	 *
	 * Here's an easy way to get the list of external tools if you know the account ID. Just
	 * run this code from the course home page, and then inspect the objects to find the "id"
	 * of the tool you want:
	 * 
	 * $.getJSON("/api/v1/accounts/39/external_tools", $.proxy(console.log, console));
	 *
	 * TECHNICAL RISKS:
	 *
	 * 1) Instructure does not support this kind of modification to the checklist, and Instructure
	 * could release a breaking change to the CourseWizard code at any time.
	 *
	 * 2) The external tool links could break if this code is executed from a different account, 
	 * or if the external tools themselves are modified such that the IDs are no longer valid.
	 * 
	 */

	// Hard-coded external tool IDs
	var POLICY_WIZARD_TOOL_ID = 1509; // Tool ID for account_id=39 
	var MANAGE_PEOPLE_TOOL_ID = 3958; // Tool ID for account_id=39
	
	// Background image
	// Source: http://hpac.harvard.edu/pages/photos
	//var BACKGROUND_IMG_URL = "//hpac.harvard.edu/files/hpac/files/022210_stock_jc_047_124407_978454_1.jpg"; 
	var BACKGROUND_IMG_URL = "//harvard-atg.github.io/canvas-course-checklist/img/john_harvard_statue.jpg";

	// Base course URL (i.e. /courses/1234)
	var BASE_COURSE_URL = window.location.pathname;
	var DEBUG = false; // (window.location.pathname == "/courses/39");

	//----- CHANGE #1 -----
	// REMOVE: "Add Students" item
	ListItems.splice(2, 1);
	
	//----- CHANGE #2 -----
	// CHANGE: "Add TAs" item text and move up near the top of the list
	var add_tas = ListItems.splice(6, 1)[0];
	ListItems.splice(1, 0, add_tas);
	$.each(['text', 'title'], function(idx, prop) {
		add_tas[prop] = add_tas[prop].replace(/TA(s)?/g, "TF$1");
	});
	add_tas.url = BASE_COURSE_URL + "/external_tools/" + MANAGE_PEOPLE_TOOL_ID;
	

	//----- CHANGE #3 -----
	// INSERT: Academic Integrity Policy tool
	ListItems.splice(7, 0, {
		key:'policy_wizard',
		complete: false,
		title: "Customize academic integrity policy",
		text: "Customize the academic integrity policy for your course.",
		url: BASE_COURSE_URL + "/external_tools/" + POLICY_WIZARD_TOOL_ID,
		iconClass: 'icon-educators'
	});
	
	//----- CHANGE #4 -----
	// Modify background image.
	if (BACKGROUND_IMG_URL) {
		$("head").append([
			'<style>',
			'.ic-wizard-box {',
				'background: url("'+BACKGROUND_IMG_URL+'") no-repeat center center !important;',
				'background-size: 100% auto !important;',
			'</style>'
		].join(''));
	}

	//----- DEBUG -----
	if(DEBUG) {
		$.getJSON("/api/v1/accounts/39/external_tools").done(function(data) {
			console.log("List of tools for account_id 39:");
			$.each(data, function(idx, tool) { 
				console.log("tool consumer key:", tool.consumer_key, "tool id:", tool.id);
			});
		});
		console.log("customized setup checklist: ", ListItems);
	}

});
