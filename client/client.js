
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
	console.log('snippets user id', Session.get('username'));
	var snippets = SavedSnippets.find({_id: Session.get('username')}).fetch();
	console.log('snippets', snippets);
	return Snippet.find();
};

Template.snippetList.events({
	'click button.save_button': function (evt) {

		Meteor.call('save_article',this.user_id, this.title, this.text, this.href);
		console.log("saved article", this, SavedSnippets.find());
		
		SavedSnippets.find().forEach(function (user) {
			console.log('user', user);
		});
	}
});

Template.users.events({
	'click button': function (evt) {
		var username = this.user;
		console.log(username);
		Session.set('username', username);
		
	}
});

Template.buttons.events({
	"click button.refresh_button" : function (evt) {
		console.log('called update');
		// TODO this should be Meteor.userId().. or the server can call that
		Meteor.call('update_stuff', Session.get('username'));
	},
	"click button.friends_button" : function (evt) {
		console.log('friends button');
		Meteor.call('get_friends');
	},
	"click button.save_screen_button" : function (evt) {
		console.log(Session.get('username'),'save button');
		Session.set('screen', 'save');
	},
	"click button.share_screen_button" : function (evt) {
		console.log('friends button');
		
		Session.set('screen', 'share');
	}

});

