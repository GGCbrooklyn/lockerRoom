var currentUser; // sets the "current user" for display purposes

// these Views are referenced in other files, so I declare them outside of the document.ready 

var CreateGoalView;
var GoalsView;

$(document).ready(function() {
  // Create Goal View
  CreateGoalView = Backbone.View.extend({
    // attaches to create-goal-area div
    el: "#create-goal-area",

    // createGoalView will appear
    show: function() {
      this.$el.show();
    },

    // when we click the compose button, we can create a Goal
    events: { 'click #compose': 'createGoal' },

    // create a Goal using the contents of the message field
    createGoal: function() {
      // grab the contents from the field
      var messageField = this.$('#new_message');
      var message = messageField.val();

      // reset the field
      messageField.val('');
      el = this.$el;

      // create the Goal
      this.collection.create({ message: message});

      // hide the compose form
      el.hide();

      // get the current user
      user = userCollection.get(signedInUserId);
      currentUser = user.attributes.username;

      // grab the user's Workouts for their graphical render.
      goal.workouts.fetch({
        success: function(workouts) {
          new GoalsView({collection: workouts});
        }
      });
    }
  });


  // View for an individual Goal
  var GoalView = Backbone.View.extend({
    tagName: 'li',
    template: _.template($('#goal-template').html()),

    // add events to edit a Goal, update a Goal, and destroy a Goal.
    events: {'click .edit-goal-link': 'editGoal',
      'click .update-goal-button': 'updateGoal',
      'click .delete-goal-link': 'destroyGoal'},

    // hide the Goal and show the edit form
    editGoal: function() {
      this.$('.goal').hide();
      this.$('.edit-goal-form').show();
    },

    // update a Goal with the message in the text field
    updateGoal: function() {
      var newMessage = this.$('.updated-message').val();
      this.model.set({message: newMessage});
      this.model.save();
    },

    // destroy a Goal
    destroyGoal: function() {
      this.model.destroy();
    },

    // render the GoalView
    render: function() {
      this.$el.html(this.template({goal: this.model.toJSON()}));
      return this;
    }
  });

  // View for all of the Goals
  GoalsView = Backbone.View.extend({
    tagName: 'ul',
    id: 'goals',

    initialize: function() {
      // Whenever we add, remove, or update a Goal, we re-render the view
      this.listenTo(this.collection, 'sync add remove', this.render);
    },

    // render all the Goals
    render: function() {
      var el = this.$el;
      // remove whatever is in the content-area and the element itself
      $('#content-area').html('');
      el.html('');

      // add a header
      el.append('<h1>Goals for ' + currentUser + '</h1>');

      // render a GoalView for each Goal
      this.collection.each(function(goal) {
        el.append(new GoalView({model: goal}).render().el);
      });

      // add the view to the content-area
      $('#content-area').html(el);
      return this;
    }
  });
});