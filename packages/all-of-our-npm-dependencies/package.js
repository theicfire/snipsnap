Npm.depends({
	"xxhash": "0.2.0",
	"fbgraph": "0.2.10" 
});

Package.on_use(function (api) {
	api.export(['xxhash', 'fbgraph']);
	api.add_files('exports.js', 'server'); // Or 'client', or ['server', 'client']
});