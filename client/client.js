console.log('Im the client');

Template.snippets.snippets = function (name) {
    return Snippet.find();
};

Template.snippets.id = function (name) {
	return Meteor.userId();
};

Template.snippets.events({
	"click" : function (evt) {
		console.log('called update');
		Meteor.call('update_stuff');
	}
})

