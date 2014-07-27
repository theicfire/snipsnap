
console.log('Im the client');

Accounts.ui.config({
  requestPermissions: {
    facebook: ['email, user_about_me, user_birthday, user_location, read_stream']
  }
});


// Template Methods

// Template.snippetList.name = function () {
// 	// if (Meteor.userId() && Meteor.user()) {
// 	// 	return Meteor.user().profile.name;	
// 	// }
// 	return 'nonexistent';
// };

// Template.snippetList.id = function () {
// 	// return Meteor.userId();
// 	return Session.get('username');
// };

// Template.users.users = function () {
// 	return Users.find();
// };

Template.friends_list.friends = function () {
	console.log('call friends_list');

	var clickedUsers = Session.get('clickedUsers');
	var friends = Users.find().fetch();
	
	// friends.filter(function (arg) {return arg != Session.get('username')});
	
	friends.forEach(function (friend) {
		console.log('friend', friend);
		if (clickedUsers[friend.user_id]) {
			console.log('set green', friend.user);
			friend.button_class = 'green';
		} 
	});
	console.log('end friends is', friends);
	return friends;
	
};

// Template.friends_list.clicked = function () {
// 	// console.log("is clicked?", this);
// 	return Session.get('clicked_share_button') == this._id;
// };


var get_all_snippets = function () {
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
	return Snippet.find({user_id: Session.get('username'),status: {$ne:'shared'}});
};
Template.sidebar_messages.snippet_sidebar_list = function() {
	return get_all_snippets();
};
Template.snippetList.snippets = function () {
	return get_all_snippets();
};

Template.first_snippet.user = function () {
	return get_all_snippets().fetch()[0];
};

Template.share_button.events({
	'click li': function (evt) {
		// no green shows up
		Session.set('clickedUsers',{});
		var snippet = get_all_snippets().fetch();

		console.log('clicked share', snippet);
		Session.set('is_popup', true);
	}
});

Template.send_button.events({
	'click li': function (evt) {
		Session.set('is_popup', false);
		var to_user_ids = Object.keys(Session.get('clickedUsers'));
		console.log('SENDSHARE to', this, to_user_ids);
		Meteor.call('share_snip', get_all_snippets().fetch()[0]._id, Session.get('username'), to_user_ids);
		//first is article ID
	}
});

//managing popup screen
Template.main_message.popup = function () {
	return Session.get('is_popup');
};

Template.save_button.events({
	'click li': function (evt) {
		console.log('clicked save');
	}
});

Template.userinfo.feeds = function() {
	var ret = [];
	var user = Users.findOne({user_id:Meteor.userId()});

	if (user) {
		console.log(user);
		if (user.feeds) {
			user.feeds.forEach(function (feed) {
				ret.push({feed: feed});
			});
		}
	}
	
	return ret;
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
		// Session.set('clicked_share_button',this._id);
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
		console.log('click here', this);
		// toggle state of this.user in users to send
		var clickedUsers = Session.get('clickedUsers');
		if (clickedUsers[this.user_id]) {
			delete clickedUsers[this.user_id];
		} else {
			clickedUsers[this.user_id] = 1;
		}
		Session.set('clickedUsers', clickedUsers);
		console.log('share to ', this.name, clickedUsers);
	}
});

Template.userinfo.events({
	'click button': function (evt) {
		console.log('this', document.getElementById('feed_url').value);
		Meteor.call('insert_feed_url', Meteor.userId(),document.getElementById('feed_url').value);

		
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