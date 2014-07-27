////server
console.log("im the server too");

var xxhash = Meteor.require('xxhash');

Meteor.startup(function () {
	Meteor.methods({
		update_stuff: function () {
			console.log('refresh!');
			// TODO remove.. but for now delete everything
			// Snippet.remove({});

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
						var totalString = title+href+text;
						var unique_key = xxhash.hash(new Buffer(totalString), 0xCAFEBABE).toString(16);

						Snippet.upsert({_id: unique_key},{$set: {title: title, href: href, text: text}});
					}

					console.log('ok, all things :)');
					Snippet.find().forEach(function (snip) {
						console.log('one oof the texts is', snip);
					});
				});
		}
	});

});