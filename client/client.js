console.log('Im the client');

Accounts.ui.config({
  requestPermissions: {
    facebook: ['email, user_about_me, user_birthday, user_location, read_stream']
  }
});

Template.snippets.snippets = function (name) {
    return Snippet.find();
};

Template.snippets.id = function (name) {
	return Meteor.userId();
};

Template.snippets.events({
	"click button.refresh_button" : function (evt) {
		console.log('called update');
		Meteor.call('update_stuff');
	},
	"click button.friends_button" : function (evt) {
		console.log('friends button');
		Meteor.call('get_friends');
	}
})

