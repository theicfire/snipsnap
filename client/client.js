console.log('Im the client');

Accounts.ui.config({
  requestPermissions: {
    facebook: ['email, user_about_me, user_birthday, user_location, read_stream']
  }
});

Template.snippetList.snippets = function () {
    return Snippet.find();
};

Template.snippetList.id = function () {
	// return Meteor.userId();
	return Session.get('username');
};

Template.users.users = function () {
	return [{user: 'dog'}, {user: 'cat'}, {user: 'rat'}];
};

Template.snippetList.snippets = function () {
	return Snippet.find();
};

Template.users.events({
	'click button': function (evt) {
		var username = evt.target.dataset['name'];
		console.log(username);
		Session.set('username', username);
	}
});

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

