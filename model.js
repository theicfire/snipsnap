console.log('both places');

Snippet = new Meteor.Collection('snippets');


// {_id, user_id, href, title, text, founder, user_path}
// Unique is <founder, href, text>
 
SavedSnippets = new Meteor.Collection('savedsnippets');
//{ _id, user_id, snippet_id}
// Unique is <user_id, snippet_id>

