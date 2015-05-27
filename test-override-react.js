// Delete the existing definitions of these course wizard modules
// So that we can redefine/customize them.
delete require.s.contexts._.defined['jsx/course_wizard/ListItems'];
delete require.s.contexts._.defined['jsx/course_wizard/Checklist'];

define('jsx/course_wizard/ListItems', ['i18n!course_wizard'], function() { 
	return [{
            key: "content_import",
            complete: ENV.COURSE_WIZARD.checklist_states.import_step,
            title: "Import Content",
            text: "If you've been using another course management system, you probably have stuff in there that you're going to want moved over to Canvas. We can walk you through the process of easily migrating your content into Canvas.",
            url: ENV.COURSE_WIZARD.urls.content_import,
            iconClass: "icon-upload"
        }, {
            key: "publish_course",
            complete: ENV.COURSE_WIZARD.checklist_states.publish_step,
            title: "Publish the Course",
            text: "All finished?  Time to publish your course!  Click the button below to make it official! Publishing will allow the users to begin participating in the course.",
            non_registered_text: "This course is claimed and ready, but you'll need to finish the registration process before you can publish the course.  You should have received an email from Canvas with a link to finish the process.  Be sure to check your spam box.",
            iconClass: "icon-publish"
        }];
});

/*
define('jsx/course_wizard/Checklist', ['react', './ChecklistItem', './ListItems'], function(e, a, s) {
	var t = e.createClass({
		displayName: "Checklist",
		getInitialState: function() {
			return {
				selectedItem: this.props.selectedItem || ""
			}
		},
		componentWillReceiveProps: function(e) {
			this.setState({
				selectedItem: e.selectedItem
			})
		},
		renderChecklist: function() {
			return s.map(function(e) {
				var s = this.state.selectedItem === e.key,
					t = "wizard_" + e.key;
				return a({
					complete: e.complete,
					id: t,
					key: e.key,
					stepKey: e.key,
					title: e.title,
					onClick: this.props.clickHandler,
					isSelected: s
				})
			}.bind(this))
		},
		render: function() {
			var a = this.renderChecklist();
			return e.DOM.div({
				className: this.props.className
			}, a)
		}
	});
	return t;
});
*/

require(['jquery', 'react'], function($, React) {
    /*
     * This essentially unmounts the existing React CourseWizard Component
	 * bound to the onclick handler of the "Setup Checklist" button.
     */
	React.unmountComponentAtNode($("#wizard_box")[0]);
    $(".wizard_popup_link").off("click");
});


require(['jquery', 'react', 'compiled/userSettings', 'jsx/course_wizard/CourseWizard'], function($, React, userSettings, CourseWizard) {
   /*
    * This essentially handles binding the button events and calling out to the
    * CourseWizard React component that is the actual wizard.
    */
  var $wizard_box, courseWizardFactory, pathname;
  $wizard_box = $("#wizard_box");
  pathname = window.location.pathname;
  courseWizardFactory = React.createFactory(CourseWizard);
  return $(".wizard_popup_link").click(function(event) {
    return React.render(courseWizardFactory({
      overlayClassName: 'CourseWizard__modalOverlay',
      showWizard: true
    }), $wizard_box[0]);
  });
});
