
'use strict';

const Plugin = module.exports;

const async = require.main.require('async');
const nconf = require.main.require('nconf');

const db = require.main.require('./src/database');
const privileges = require.main.require('./src/privileges');
const SocketTopics = require.main.require('./src/socket.io/topics');
const topics = require.main.require('./src/topics');
const user = require.main.require('./src/user');

let app;

Plugin.init = async (params) => {
	app = params.app;

	SocketTopics.getFeaturedTopics = async (socket, data) => getFeaturedTopics(socket.uid, data);

	SocketTopics.setFeaturedTopics = async (socket, data) => {
		if (!data || !data.tids) {
			throw new Error('[[error:invalid-data]]');
		}
		const topicData = await topics.getTopicsFields(data.tids, ['cid']);
		const cids = topicData.map(t => t.cid);
		const [isAdmin, isMod] = await Promise.all([
			user.isAdministrator(socket.uid),
			user.isModerator(socket.uid, cids),
		]);

		if (!isAdmin && !isMod.every(mod => !!mod)) {
			throw new Error('[[error:no-privileges]]');
		}
		await db.delete('featured:tids');

		// TODO: use db.listAppend with array once core has it
		// await db.listAppend('featured:tids', data.tids);
		await async.eachSeries(data.tids, async (tid) => {
			await db.listAppend('featured:tids', tid);
		});
	};
};

Plugin.renderFeaturedTopicsSidebar = async (widget) => {
	const featuredTopics = await getFeaturedTopics(widget.uid, null);
	widget.html = await app.renderAsync('widgets/featured-topics-sidebar', {
		topics: featuredTopics,
		relative_path: nconf.get('relative_path'),
	});
	return widget;
};

Plugin.renderFeaturedTopics4x1 = async (widget) => {
	const featuredTopics = await getFeaturedTopics(widget.uid, null);
	widget.html = await app.renderAsync('widgets/featured-topics-4x1', {
		topics: featuredTopics,
		relative_path: nconf.get('relative_path'),
	});
	return widget;
};

async function getFeaturedTopics(uid, data) {
	data = data || {};

	let tids = await db.getListRange('featured:tids', 0, -1);
	if (data.tid) {
		if (tids.indexOf(data.tid) === -1) {
			await db.listAppend('featured:tids', data.tid);
			tids.push(data.tid);
		}
	}
	tids = await privileges.topics.filterTids('topics:read', tids, uid);
	return await topics.getTopicsByTids(tids, uid);
}

Plugin.addThreadTools = async function (hookData) {
	const allowed = await privileges.categories.isAdminOrMod(hookData.topic.cid, hookData.uid);
	if (allowed) {
		hookData.tools.push({
			title: 'Feature this thread',
			class: 'mark-featured',
			icon: 'fa-star-o',
		});
	}
	return hookData;
};

Plugin.defineWidgets = async (widgets) => {
	widgets = widgets.concat([
		{
			widget: 'featuredTopicsSidebar',
			name: 'Featured Topics Sidebar',
			description: 'List of featured topics',
			content: '<small>Use Thread Tools in a topic to feature it.</small>',
		},
		{
			widget: 'featuredTopics4x1',
			name: 'Featured Topics 4x1',
			description: 'List of featured topics',
			content: '<small>Use Thread Tools in a topic to feature it.</small>',
		},
	]);
	return widgets;
};

