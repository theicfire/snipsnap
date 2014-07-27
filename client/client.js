
console.log('Im the client');

Accounts.ui.config({
  requestPermissions: {
    facebook: ['email, user_about_me, user_birthday, user_location, read_stream']
  }
});


// Template Methods

Template.snippetList.name = function () {
	if (Meteor.userId() && Meteor.user()) {
		return Meteor.user().profile.name;	
	}
	return 'nonexistent';
};

Template.snippetList.id = function () {
	// return Meteor.userId();
	return Session.get('username');
};

Template.users.users = function () {
	return Users.find();
};

Template.friends_list.friends = function () {
	var clickedUsers = Session.get('clickedUsers');
	var friends = Users.find().fetch();
	// var friends = jQuery.extend(true,[],TempUsers);
	// friends.filter(function (arg) {return arg != Session.get('username')});
	
	friends.forEach(function (friend) {
		console.log('friend', friend);
		if (clickedUsers[friend.user]) {
			console.log('set green', friend.user);
			friend.button_class = 'green';
		} 

	});
	console.log('end friends is', friends);
	return friends;
	
};

Template.friends_list.clicked = function () {
	// console.log("is clicked?", this);
	return Session.get('clicked_share_button') == this._id;
};


Template.snippetList.snippets = function () {
	// var snippets = SavedSnippets.find({user_id: Session.get('username')}).fetch();
	// console.log('Saved Snippets', snippets);
	if (Session.get('screen') == 'save') {
		var snippets = SavedSnippets.find({user_id: Session.get('username')});
		
		var snippet_ids = [];

		snippets.forEach(function (snippet) {
			snippet_ids.push(snippet.article_id);
		});
		
		return Snippet.find({_id: {$in: snippet_ids}});
		
	}
	return Snippet.find({user_id: Session.get('username')});
};

Template.snippetList.events({
	'click button.save_button': function (evt) {

		Meteor.call('save_snip',this.user_id, this.title, this.text, this.href);
		console.log("saved article", this, SavedSnippets.find());
		
		SavedSnippets.find().forEach(function (user) {
			console.log('user', user);
		});

		SavedSnippets.find({user_id: this.user_id}).forEach(function (user) {
			console.log('saved snip', user);
		});
	},
	'click button.share_button': function (evt) {
		console.log('this', this);
		Session.set('clickedUsers',{});
		Session.set('clicked_share_button',this._id);
	},
	'click button.send_share_button': function (evt) {
		var to_user_ids = Object.keys(Session.get('clickedUsers'));
		console.log('sendshare', this, to_user_ids);
		Meteor.call('share_snip', this._id, Session.get('username'), to_user_ids);

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
		Meteor.call('update_stuff');
	},
	"click button.delete_button" : function (evt) {
		console.log('delete');
		Meteor.call('clear_db');
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

Template.friends_list.events({
	'click button.user': function (evt) {
		// toggle state of this.user in users to send
		var clickedUsers = Session.get('clickedUsers');
		if (clickedUsers[this.user]) {
			delete clickedUsers[this.user];
		} else {
			clickedUsers[this.user] = 1;
		}
		Session.set('clickedUsers', clickedUsers);
		console.log('share to ', this.user);
	}
});

Deps.autorun(function (){
	console.log(Meteor.user());
	Session.set('username', Meteor.userId());
	if (Meteor.userId() && Meteor.user()) {
		console.log('logged in', Meteor.userId());
		console.log('logged in', Meteor.user());
		Meteor.call('add_user',Meteor.userId(),Meteor.user().profile.name);
	}
	
});