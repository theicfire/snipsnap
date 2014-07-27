////server
console.log("im the server too");

var xxhash = Meteor.require('xxhash');

Meteor.startup(function () {
	Meteor.methods({
		update_stuff: function () {
			console.log('refresh!');
			//GET "https://www.kimonolabs.com/api/9bfmpq4s?apikey=4f4ec5d7768e5516b71c7ba5c69b786d"
			HTTP.get('https://www.kimonolabs.com/api/9bfmpq4s?apikey=4f4ec5d7768e5516b71c7ba5c69b786d',{},
				function (error,result) {
					
					var results = JSON.parse(result.content).results.collection1;
					
					for (var i = 0; i < results.length; i++) {
// {_id, user_path, href, title, text, founder}

						// console.log('hello there');
						console.log(results[i]['Article Title'].href);
						var title = results[i]['Article Title'].text;
						var href = results[i]['Article Url'].href;
						var text = results[i]['Actual Text'].text;
						var totalString = title+href+text;
						// console.log(XXHash.hash(totalString, 0xCAFEBABE));

					}
				});
		}
	});

});