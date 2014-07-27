////server

var getHash = function(user_id, title, text, href) {
	var totalString = user_id+title+href+text;
	var snippet_key = xxhash.hash(new Buffer(totalString), 0xCAFEBABE).toString(16);
	return snippet_key;
};

var insert_snip = function(user_id, title, text, href) {
	// var user_key = xxhash.hash(new Buffer(snippet_key + user_id), 0xCAFEBABE).toString(16);
	var snippet_key = getHash(user_id, title, text, href);
	Snippet.upsert({_id: snippet_key},{$set: {title: title, href: href, text: text, user_id: user_id}, $push:{user_path:user_id}});
	// SavedSnippets.upsert({_id: user_key},{$set: {user_id: user_id, snippet_key: snippet_key}});
};

var insert_new_snip = function(user_id, title, text, href) {
	insert_snip(user_id, title, text, href);
};

// Share a snippet
// var share_snip = function(snip_id, from_user_id, to_user_id) {
// 	var snip = Snippet.findOne({_id: snip_id});
// 	insert_snip(to_user_id, snip.title, snip.text, snip.href, from_user_id);
// };

var get_remote_snippets = function(user_id) {
	HTTP.get('https://www.kimonolabs.com/api/9bfmpq4s?apikey=4f4ec5d7768e5516b71c7ba5c69b786d',{},
		function (error,result) {
			console.log('got back results');
			
			var results = JSON.parse(result.content).results.collection1;

			for (var i = 0; i < results.length; i++) {
				// get real data this way
				var all = results[i]['Actual Text'].text.split('\n');
				all.push('');
				all.push('');
				all.push('');
				all.push('');
				var title = all[0];
				var date = all[3];
				var text = all[6];
				var href = results[i]['Actual Text'].href;
				insert_new_snip(user_id, title, text, href);
			}

			console.log('ok, all things :)');
			Snippet.find().forEach(function (snip) {
				console.log('one oof the texts is', snip);
			});

			console.log('Check to see if paths in database have been added');
			console.log(Snippet.findOne({}));
		});
};


var get_local_snippets = function(user_id) {
	console.log('local snippets called');
	
	var results = [
		{title: 'new here' + user_id, text: 'and text', href: 'http://www.google.com'},
		{title: 'title2' + user_id, text: 'text2', href: 'http://www.google2.com'},
		{title: 'title2' + user_id, text: 'text3', href: 'http://www.google2.com'},
		{title: 'title2' + user_id, text: 'text4', href: 'http://www.google2.com'},
		{title: 'title2' + user_id, text: 'text5', href: 'http://www.google2.com'}
	];

	for (var i = 0; i < results.length; i++) {
		var title = results[i].title;
		var text = results[i].text;
		var href = results[i].href;
		insert_new_snip(user_id, title, text, href);
	}

	console.log('ok, all things :)');
	Snippet.find().forEach(function (snip) {
		console.log('one oof the texts is', snip);
	});
};

Meteor.methods({
	clear_db: function () {
		console.log('delete all');
		Snippet.remove({});
		SavedSnippets.remove({});
	},
	update_stuff: function () {
		console.log('refresh!');

		TempUsers.forEach(function (user) {
			get_local_snippets(user.user);
		});
	},
	save_snip: function (user_id, title, text, href){
		var hash=getHash(user_id, title, text, href);
		
		SavedSnippets.insert({_id: getHash(user_id.toString()+hash),article_id:hash});
	},
	share_snip: function (snip_id, from_user_id, to_user_ids){
		console.log('share call', snip_id, from_user_id, to_user_ids);
		var snip = Snippet.findOne({_id: snip_id});

		// Insert entry for each share
		to_user_ids.forEach(function (to_user_id) {
			insert_snip(to_user_id, snip.title, snip.text, snip.href, from_user_id);
		});
	},
	get_friends: function() {
	    graph.get('/176234715918973/members', 
	        {fields: 'last_name,first_name,picture', 'type': 'large', 
	            access_token: Meteor.user().services.facebook.accessToken}, 
	        function(err, result) {
	        	console.log('fbres', result);
	        });
	}
});