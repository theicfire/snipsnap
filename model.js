console.log('both places');

Snippet = new Meteor.Collection('snippets'); 
// {_id, user_id, href, title, text, founder, from_user}
// Unique is <founder, href, text>
 
// User = new Meteor.Collection('users'); 
//{ _id, user_id, snippet_id}
// Unique is <user_id, snippet_id>

