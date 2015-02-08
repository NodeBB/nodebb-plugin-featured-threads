(function(module) {
	"use strict";

	var Plugin = {};

	var async = module.parent.require('async'),
		SocketTopics = module.parent.require('./socket.io/topics'),
        Sockets = module.parent.require('./socket.io/index'),
        topics = module.parent.require('./topics.js'),
        db = module.parent.require('./database.js'),
        app;

    function getFeaturedTopics(uid, data, callback) {
		data = data || {};

		db.getListRange('featured:tids', 0, -1, function(err, tids) {
			if (data.tid) {
				if (tids.indexOf(data.tid) === -1) {
					db.listAppend('featured:tids', data.tid, function(){});
					tids.push(data.tid);
				}
			}

			topics.getTopicsByTids(tids, uid, callback);
		});
    }

    Plugin.init = function(params, callback) {
		app = params.router;

		SocketTopics.getFeaturedTopics = function(socket, data, callback) {
			getFeaturedTopics(socket.uid, data, callback);
		};

		SocketTopics.setFeaturedTopics = function(socket, data, callback) {
			db.delete('featured:tids', function(err) {
				// there's something wrong? with redis rpush, its not allowing me to send in an array of items
				// db.listAppend.apply(this, ['featured:tids'].concat(data.tids).concat(callback));
				// so here goes, totally should have done this as a sorted set instead:
				async.each(data.tids, function(tid, next) {
					db.listAppend('featured:tids', tid, next);
				}, function(err) {
					callback(err);
				});
			});
		};

		callback(false);
    };

    Plugin.renderFeaturedTopicsSidebar = function(widget, callback) {
		getFeaturedTopics(widget.uid, null, function(err, featuredTopics) {
			app.render('widgets/featured-topics-sidebar', {topics:featuredTopics}, callback);
		});
	};

	Plugin.renderFeaturedTopics4x1 = function(widget, callback) {
		getFeaturedTopics(widget.uid, null, function(err, featuredTopics) {
			async.each(featuredTopics, function(topic, next) {
				topics.getTopicPosts(topic.tid, 'tid:' + topic.tid + ':posts', 0, 4, widget.uid, true, function(err, posts) {
					topic.posts = posts;
					next(err);
				});
			}, function(err) {
				app.render('widgets/featured-topics-4x1', {topics:featuredTopics}, callback);
			});

		});
	};

	Plugin.addThreadTools = function(data, callback) {
		data.tools.push({
			"title": "Feature this thread",
			"class": "mark-featured",
			"icon": "fa-star-o"
		});

		callback(null, data);
	};

	Plugin.defineWidgets = function(widgets, callback) {
		widgets = widgets.concat([
			{
				widget: "featuredTopicsSidebar",
				name: "Featured Topics Sidebar",
				description: "List of featured topics",
				content: "<small>Use Thread Tools in a topic to feature it.</small>"
			},
			{
				widget: "featuredTopics4x1",
				name: "Featured Topics 4x1",
				description: "List of featured topics",
				content: "<small>Use Thread Tools in a topic to feature it.</small>"
			}
		]);

		callback(null, widgets);
	};

	module.exports = Plugin;
}(module));
