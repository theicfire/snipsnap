
Accounts.ui.config({
  requestPermissions: {
    facebook: ['email, user_about_me, user_birthday, user_location, read_stream']
  }
});

// Template Methods
Template.friends_list.friends = function () {

	var clickedUsers = Session.get('clickedUsers');
	var friends = Users.find().fetch();
	
	// TODO friends.filter(function (arg) {return arg != Session.get('username')});
	
	friends.forEach(function (friend) {
		if (clickedUsers[friend.user_id]) {
			friend.button_class = 'green';
		} 
	});
	return friends;
};

var get_all_snippets = function () {
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

Template.first_snippet.snippet = function () {
	return Session.get('current_snippet');
};

Template.share_button.events({
	'click li': function (evt) {
		// no green shows up
		Session.set('clickedUsers',{});
		Session.set('is_popup', true);
	}
});

Template.send_button.events({
	'click li': function (evt) {
		var to_user_ids = Object.keys(Session.get('clickedUsers'));
		Meteor.call('share_snip', Session.get('current_snippet')._id, Session.get('username'), to_user_ids, function() {
			Session.set('is_popup', false);
			var snip = Snippet.findOne({user_id: Session.get('username'),status: {$ne:'shared'}});
			Session.set('current_snippet', snip);
		});
	}
});

//managing popup screen
Template.main_message.popup = function () {
	return Session.get('is_popup');
};


Template.userinfo.feeds = function() {
	var user = Users.findOne({user_id:Meteor.userId()});
	return user ? user.feeds : [];
};

Template.save_button.events({
	'click li': function (evt) {
		var current_post = Session.get('current_snippet');
		Meteor.call('save_snip',Session.get('username'), current_post.title, current_post.text, current_post.href);
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
		if (clickedUsers[this.user_id]) {
			delete clickedUsers[this.user_id];
		} else {
			clickedUsers[this.user_id] = 1;
		}
		Session.set('clickedUsers', clickedUsers);
	}
});

Template.userinfo.events({
	'click button': function (evt) {
		Meteor.call('insert_feed_url', Meteor.userId(),document.getElementById('feed_url').value);	
	}
});

Template.sidebar_message.events({
	'click li': function (evt) {
		Session.set('current_snippet', this);
	}
});

Deps.autorun(function (){
	Session.set('username', Meteor.userId());
	if (Meteor.userId() && Meteor.user()) {
		Meteor.call('add_user',Meteor.userId(),Meteor.user().profile.name);
	}
});

Deps.autorun(function() {
	// When snippets is loaded; need publish for some reason here
	Meteor.subscribe('snippets', function () {
		Session.set('current_snippet', Snippet.findOne({user_id: Session.get('username'),status: {$ne:'shared'}}));
	});
});
