(function(module) {
	"use strict";

	var Plugin = {};

	var SocketTopics = module.parent.require('./socket.io/topics'),
        Sockets = module.parent.require('./socket.io/index'),
        topics = module.parent.require('./topics.js'),
        db = module.parent.require('./database.js'),
        app;

    function getFeaturedTopics(data, callback) {
		data = data || {};

		db.getListRange('featured:tids', 0, -1, function(err, tids) {
			if (data.tid) {
				if (tids.indexOf(data.tid) === -1) {
					db.listAppend('featured:tids', data.tid);
					tids.push(data.tid);
				}
			}

			topics.getTopicsByTids(tids, 0, callback);
		});
    }

    Plugin.init = function(expressApp) {
		app = expressApp;

		SocketTopics.getFeaturedTopics = function(socket, data, callback) {
			getFeaturedTopics(data, callback);
		};

		SocketTopics.setFeaturedTopics = function(socket, data, callback) {
			db.delete('featured:tids', function(err) {
				db.listAppend.apply(this, ['featured:tids'].concat(data.tids).concat([callback]));
			});
		};
    };

    Plugin.renderFeaturedTopics = function(widget, callback) {
		getFeaturedTopics(null, function(err, topics) {
			app.render('widgets/featured-topics', {topics:topics}, callback);
		});
	};

	Plugin.addScripts = function(scripts, callback) {
		scripts.push('plugins/nodebb-plugin-featured-threads/lib/main.js');
		callback(null, scripts);
	};

	Plugin.addThreadTools = function(threadTools, callback) {
		threadTools.push({
			"title": "Feature this thread",
			"class": "mark-featured",
			"icon": "fa-star-o"
		});

		callback(null, threadTools);
	};

	Plugin.defineWidgets = function(widgets, callback) {
		widgets = widgets.concat([
			{
				widget: "featuredTopics",
				name: "Featured Topics",
				description: "List of featured topics",
				content: "<small>Use Thread Tools in a topic to feature it.</small>"
			}
		]);

		callback(null, widgets);
	};

	module.exports = Plugin;
}(module));