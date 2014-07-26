////server
console.log("im the server too");

Meteor.startup(function () {
	Meteor.methods({
		update_stuff: function () {
			console.log('refresh!');
			//GET "https://www.kimonolabs.com/api/9bfmpq4s?apikey=4f4ec5d7768e5516b71c7ba5c69b786d"
			HTTP.get('https://www.kimonolabs.com/api/9bfmpq4s',{apikey:'4f4ec5d7768e5516b71c7ba5c69b786d'},
				function (error,result) {
					console.log(result);
				});

		}
	});

});