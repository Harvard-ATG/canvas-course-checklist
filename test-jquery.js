require([
	'jquery',
	'react',
	'jsx/course_wizard/ListItems',
	'jsx/course_wizard/ChecklistItem',
	'jsx/course_wizard/CourseWizard'
], function($, React, ListItems, ChecklistItem, CourseWizard) {
	
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
	 * In order to customize the CourseWizard, we need to unmount the component and disable the existing
	 * event handler on the "Setup Checklist" button. Then, we need to pull in the React components,
	 * customize the ListItems and override the method that renders those items, and then re-initialize
	 * the button that renders the top-level CourseWizard React component.
	 *
	 * You might be wondering why all of this is necessary. Why not just write some jQuery code to
	 * grab the DOM elements and change them at will? The reason is: React. React expects to completely
	 * manage the DOM under the root node, and has a sophisticated algorithm for changing the DOM when
	 * there are state changes (it maintains its own shadow DOM and performs a diff to know what to
	 * change and when to change it). This makes it rather complicated to change things out from under
	 * React, and expect the React component to still work as intended. Efforts to do so only partially
	 * worked. So while this approach seems more complicated than it needs to be, it is in fact a "safer"
	 * approach since we can be sure the React component is working properly.
	 *
	 * The bottom line is that Instructure has not made this component very flexible or open to
	 * modification, so at present, it's the best we can do, assuming we don't want to completely
	 * disable their version of the CourseWizard and write our own from scratch.
	 */

	var CustomizedListItems = (function(items) {

		// REMOVE: Add Students (third item -- at index 2 in the array)
		items.splice(2, 1);
		
		// CHANGE: TA => TF in title and text
		$.each(['text', 'title'], function(idx, prop) {
			var wizard_add_tas = items[6];
			wizard_add_tas[prop] = wizard_add_tas[prop].replace(/TA(s)?/g, "TF$1");
		});
		
		// INSERT: Academic Integrity Policy
		items.splice(7, 0, {
			key:'policy_wizard',
			complete: false,
			title: "Customize academic integrity policy",
			text: "Customize the academic integrity policy for your course.",
			url: "/courses/39/external_tools/1513",
			iconClass: 'icon-educators'
		});

		return items;
	})(ListItems); 

/*
	var $popup_link = $(".wizard_popup_link");
	var $wizard_box = $("#wizard_box");
	var courseWizardFactory = React.createFactory(CourseWizard);

	React.unmountComponentAtNode($wizard_box[0]);

	$popup_link.off("click");

	$popup_link.on("click", function(event) {
		var component = React.render(courseWizardFactory({
			overlayClassName: 'CourseWizard__modalOverlay',
			showWizard: true
		}), $wizard_box[0]);

		var checklist_component = component.refs.wizardBox.props.children[0].props.children[1];
		
		var saved_render = checklist_component.render;
		
		checklist_component.render = function() {
			console.log("render called for checklist component");
			return saved_render.apply(this, arguments);
		};
		
		checklist_component.renderCheckList = function() {
			console.log("render checklist", this, CustomizedListItems);
			var result = CustomizedListItems.map(function(item) {
				console.log("mapped", item.title, item.id);
				var isSelected = (this.state.selectedItem === item.key);
				var id = "wizard_" + item.key;
				return ChecklistItem({
					complete: item.complete,
					id: id,
					key: item.key,
					stepKey: item.key,
					title: item.title,
					onClick: this.props.clickHandler,
					isSelected: isSelected
				})
			}.bind(this))
			
			console.log("result", result);

			return result;
		};

		//checklist_component.render();
	});
*/
});
