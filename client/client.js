console.log('Im the client');

Template.first.name = function (name) {
    return 'Max';

};

Template.first.events({
	"click" : function (evt) {
		console.log('called update');
		Meteor.call('update_stuff');
	}
})
