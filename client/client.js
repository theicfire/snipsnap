
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

var temp_users = [{user: 'dog'}, {user: 'cat'}, {user: 'rat'}];
Template.users.users = function () {
	return temp_users;
};

Template.friends_list.friends = function () {

	var clickedUsers = Session.get('clickedUsers');
	var friends = jQuery.extend(true,[],temp_users)

	friends.filter(function (arg) {return arg != Session.get('username')});
	
	temp_users.forEach(function (friend) {
		console.log('start friends', friend.button_class);
	});

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
	},
	'click button.share_button': function (evt) {
		console.log('this', this);
		Session.set('clickedUsers',{});
		Session.set('clicked_share_button',this._id);
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