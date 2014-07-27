console.log('both places');

Snippet = new Meteor.Collection('snippets'); 
// {_id, user_path, href, title, text, founder}
// Unique is <founder, href, text>
 
User = new Meteor.Collection('users'); 
//{ _id, user_id, snippet_id}
// Unique is <user_id, snippet_id>