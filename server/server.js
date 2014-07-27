////server
var xxhash = Meteor.require('xxhash');
console.log("im the server too");

var insert_snip = function(user_id, title, text, href, from_user_id) {
	var totalString = user_id+title+href+text;
	var snippet_key = xxhash.hash(new Buffer(totalString), 0xCAFEBABE).toString(16);
	// var user_key = xxhash.hash(new Buffer(snippet_key + user_id), 0xCAFEBABE).toString(16);

	Snippet.upsert({_id: snippet_key},{$set: {title: title, href: href, text: text, from_user_id: null, user_id: user_id}});
	// Users.upsert({_id: user_key},{$set: {user_id: user_id, snippet_key: snippet_key}});
};

var insert_new_snip = function(user_id, title, text, href, from_user_id) {
	insert_snip(user_id, title, text, href, null);
};

// Share a snippet
var share_snip = function(snip_id, from_user_id, to_user_id) {
	var snip = Snippet.findOne({_id: snip_id});
	insert_snip(to_user_id, snip.title, snip.text, snip.href, from_user_id);
};

Meteor.methods({
	update_stuff: function () {
		console.log('refresh!');
		// TODO remove.. but for now delete everything
		Snippet.remove({});

		HTTP.get('https://www.kimonolabs.com/api/9bfmpq4s?apikey=4f4ec5d7768e5516b71c7ba5c69b786d',{},
			function (error,result) {
				console.log('got back results');
				
				var results = JSON.parse(result.content).results.collection1;

				// overwrite.. temporary
				results = [
					{title: 'title here', text: 'and text', href: 'http://www.google.com'},
					{title: 'title2', text: 'text2', href: 'http://www.google2.com'}
				];


				for (var i = 0; i < results.length; i++) {
					// var title = results[i]['Article Title'].text;
					// var href = results[i]['Article Url'].href;
					// var text = results[i]['Actual Text'].text;
					var title = results[i].title;
					var text = results[i].text;
					var href = results[i].href;
					// var user_id = Meteor.userId();
					// TODO fix
					var user_id = 22;
					insert_new_snip(user_id, title, text, href);
				}

				console.log('ok, all things :)');
				Snippet.find().forEach(function (snip) {
					console.log('one oof the texts is', snip);
				});
			});
	}
});