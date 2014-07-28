console.log('both places');

TempUsers = [{user: 'dog'}, {user: 'cat'}, {user: 'rat'}];
Snippet = new Meteor.Collection('snippets');


// {_id, user_id, href, title, text, founder, user_path,status}
// Unique is <founder, href, text>
 
SavedSnippets = new Meteor.Collection('savedsnippets');
//{ _id, user_id, snippet_id}
// Unique is <user_id, snippet_id>

Users = new Meteor.Collection('appusers');
//{ _id, user_id, name}
// _id is hash(user_id)

if (Meteor.isServer) {
	Meteor.publish('snippets', function () {
		return Snippet.find();
	});
}