console.log('both places');

Snippet = new Meteor.Collection('snippets');


// {_id, user_id, href, title, text, founder, user_path}
// Unique is <founder, href, text>
 
User = new Meteor.Collection('usersSaved');
//{ _id, user_id, snippet_id}
// Unique is <user_id, snippet_id>

