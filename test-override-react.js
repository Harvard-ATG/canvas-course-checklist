// Delete the existing definitions of these course wizard modules
// So that we can redefine/customize them.
delete require.s.contexts._.defined['jsx/course_wizard/ListItems'];
delete require.s.contexts._.defined['jsx/course_wizard/Checklist'];
delete require.s.contexts._.defined['jsx/course_wizard/CourseWizard'];

define('jsx/course_wizard/ListItems', ['i18n!course_wizard'], function (I18n) {
    /**
     * Returns an array containing all the possible items for the checklist
     */
    return [
      {
        key:'content_import',
        complete: ENV.COURSE_WIZARD.checklist_states.import_step,
        title: I18n.t("Import Content"),
        text: I18n.t("If you've been using another course management system, you probably have stuff in there that you're going to want moved over to Canvas. We can walk you through the process of easily migrating your content into Canvas."),
        url: ENV.COURSE_WIZARD.urls.content_import,
        iconClass: 'icon-upload'
      },
      {
        key:'add_assignments',
        complete: ENV.COURSE_WIZARD.checklist_states.assignment_step,
        title: I18n.t("Add Course Assignments"),
        text: I18n.t("Add your assignments.  You can just make a long list, or break them up into groups - and even specify weights for each assignment group."),
        url: ENV.COURSE_WIZARD.urls.add_assignments,
        iconClass: 'icon-assignment'
      },
// NOTE: Removing this menu item.
//      {
//        key:'add_students',
//        complete: ENV.COURSE_WIZARD.checklist_states.add_student_step,
//        title: I18n.t("Add Students to the Course"),
//        text: I18n.t("You'll definitely want some of these.  What's the fun of teaching a course if nobody's even listening?"),
//        url: ENV.COURSE_WIZARD.urls.add_students,
//        iconClass: 'icon-group-new'
//      },
      {
        key:'add_files',
        complete: ENV.COURSE_WIZARD.checklist_states.import_step, /* Super odd in the existing wizard this is set to display: none */
        title: I18n.t("Add Files to the Course"),
        text: I18n.t("The Files tab is the place to share lecture slides, example documents, study helps -- anything your students will want to download.  Uploading and organizing your files is easy with Canvas.  We'll show you how."),
        url: ENV.COURSE_WIZARD.urls.add_files,
        iconClass: 'icon-note-light'
      },
      {
        key:'select_navigation',
        complete: ENV.COURSE_WIZARD.checklist_states.navigation_step,
        title: I18n.t("Select Navigation Links"),
        text: I18n.t("By default all links are enabled for a course.  Students won't see links to sections that don't have content.  For example, if you haven't created any quizzes, they won't see the quizzes link.  You can sort and explicitly disable these links if there are areas of the course you don't want your students accessing."),
        url: ENV.COURSE_WIZARD.urls.select_navigation,
        iconClass: 'icon-hamburger'
      },
      {
        key:'home_page',
        complete: ENV.COURSE_WIZARD.checklist_states.home_page_step,
        title: I18n.t("Choose a Course Home Page"),
        text: I18n.t("When people visit the course, this is the page they'll see.  You can set it to show an activity stream, the list of course modules, a syllabus, or a custom page you write yourself.  The default is the course activity stream."),
        iconClass: 'icon-home'
      },
      {
        key:'course_calendar',
        complete: ENV.COURSE_WIZARD.checklist_states.calendar_event_step,
        title: I18n.t("Add Course Calendar Events"),
        text: I18n.t("Here's a great chance to get to know the calendar and add any non-assignment events you might have to the course. Don't worry, we'll help you through it."),
        url: ENV.COURSE_WIZARD.urls.course_calendar,
        iconClass: 'icon-calendar-month'
      },
// NOTE: Changed text: all instances of "TAs" changed to "TFs"
      {
        key:'add_tas',
        complete: ENV.COURSE_WIZARD.checklist_states.add_ta_step,
        title: I18n.t("Add TFs to the Course"),
        text: I18n.t("You may want to assign some TFs to help you with the course.  TFs can grade student submissions, help moderate the discussions and even update due dates and assignment details for you."),
        url: ENV.COURSE_WIZARD.urls.add_tas,
        iconClass: 'icon-educators'
      },
// NOTE: Added item for customizing the academic integrity policy for the course
      {
        key:'policy_wizard',
        complete: ENV.COURSE_WIZARD.checklist_states.publish_step,
        title: "Customize academic integrity policy",
        text: "Customize the academic integrity policy for your course.",
        url: "/courses/39/external_tools/1513",
        iconClass: 'icon-educators'
	  },
      {
        key:'publish_course',
        complete: ENV.COURSE_WIZARD.checklist_states.publish_step,
        title: I18n.t("Publish the Course"),
        text: I18n.t("All finished?  Time to publish your course!  Click the button below to make it official! Publishing will allow the users to begin participating in the course."),
        non_registered_text: I18n.t("This course is claimed and ready, but you'll need to finish the registration process before you can publish the course.  You should have received an email from Canvas with a link to finish the process.  Be sure to check your spam box."),
        iconClass: 'icon-publish'
      }
    ]
});

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

define("jsx/course_wizard/CourseWizard", [
  'jquery',
  'react',
  'i18n!course_wizard',
  'react-modal',
  './InfoFrame',
  './Checklist',
  'compiled/userSettings',
  'compiled/jquery.rails_flash_notifications'
], function($, React, I18n, ReactModal, InfoFrame, Checklist, userSettings) {

  var CourseWizard = React.createClass({
      displayName: 'CourseWizard',

      propTypes: {
        showWizard: React.PropTypes.bool,
        overlayClassName: React.PropTypes.string
      },

      getInitialState: function () {
        return {
          showWizard: this.props.showWizard,
          selectedItem: false
        };
      },

      componentDidMount: function () {
        this.refs.closeLink.getDOMNode().focus();
        $(this.refs.wizardBox.getDOMNode()).removeClass('ic-wizard-box--is-closed');
        $.screenReaderFlashMessageExclusive(I18n.t("Course Setup Wizard is showing."));
      },

      componentWillReceiveProps: function (nextProps) {
        this.setState({
          showWizard: nextProps.showWizard
        }, function() {
          $(this.refs.wizardBox.getDOMNode()).removeClass('ic-wizard-box--is-closed');
          if (this.state.showWizard) {
            this.refs.closeLink.getDOMNode().focus();
          }
        });
      },

      /**
       * Handles what should happen when a checklist item is clicked.
       */
      checklistClickHandler: function (itemToShowKey) {
        this.setState({
          selectedItem: itemToShowKey
        });
      },

      closeModal: function (event) {
        if (event) {
          event.preventDefault()
        };

        var pathname = window.location.pathname;
        userSettings.set('hide_wizard_' + pathname, true);

        this.setState({
          showWizard: false
        })
      },

      render: function () {
          return (
              React.createElement(ReactModal, {
                isOpen: this.state.showWizard, 
                onRequestClose: this.closeModal, 
                overlayClassName: this.props.overlayClassName
              }, 
                React.createElement("div", {ref: "wizardBox", className: "ic-wizard-box"}, 
                  React.createElement("div", {className: "ic-wizard-box__header"}, 
                    React.createElement("a", {href: "/", className: "ic-wizard-box__logo-link"}, 
                      React.createElement("span", {className: "screenreader-only"}, I18n.t("My dashboard"))
                    ), 
                    React.createElement(Checklist, {className: "ic-wizard-box__nav", 
                               selectedItem: this.state.selectedItem, 
                               clickHandler: this.checklistClickHandler}
                    )
                  ), 
                  React.createElement("div", {className: "ic-wizard-box__main"}, 
                    React.createElement("div", {className: "ic-wizard-box__close"}, 
                      React.createElement("div", {className: "ic-Expand-link ic-Expand-link--Secondary ic-Expand-link--from-right"}, 
                        React.createElement("a", {ref: "closeLink", href: "#", className: "ic-Expand-link__trigger", onClick: this.closeModal}, 
                          React.createElement("div", {className: "ic-Expand-link__layout"}, 
                            React.createElement("i", {className: "icon-x ic-Expand-link__icon"}), 
                            React.createElement("span", {className: "ic-Expand-link__text"}, I18n.t("Close and return to Canvas"))
                          )
                        )
                      )
                    ), 
                    React.createElement(InfoFrame, {className: "ic-wizard-box__content", itemToShow: this.state.selectedItem, closeModal: this.closeModal})
                  )
                )
              )
          );
      }
  });

  return CourseWizard;
});

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
