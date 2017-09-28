$(window).on('action:ajaxify.end', function(ev, data) {
	"use strict";

	if (data.url.match(/^topic/)) {
		$('.topic').on('click', '.thread-tools .mark-featured', function(ev) {
			ajaxify.loadTemplate('modals/sort-featured-topics', function(featuredTpl) {
				socket.emit('topics.getFeaturedTopics', {tid: ajaxify.data.tid}, function(err, topics) {
					if (err) return console.log(err);

					templates.parse(featuredTpl, {topics:topics}, function(tpl) {
						bootbox.confirm(tpl, function(confirm) {
							var tids = [];
							$('.featured-topic').each(function(i) {
								tids.push(this.getAttribute('data-tid'));
							});
	
							socket.emit('topics.setFeaturedTopics', {tids: tids});
						}).on("shown.bs.modal", function() {
							$('span.timeago').timeago();
							$('#sort-featured').sortable().disableSelection();
	
							$('.delete-featured').on('click', function() {
								$(this).parents('.panel').remove();
							});
						});
					});
				});
			});
		});
	}
});
