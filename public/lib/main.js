(function() {
	"use strict";

	jQuery('document').ready(function() {
		$(window).on('action:ajaxify.end', function(ev, data) {
			if (data.url.match(/^topic/)) {
				$('.thread-tools .mark-featured').on('click', function(ev) {
					templates.preload_template('modals/sort-featured-topics', function() {
						socket.emit('topics.getFeaturedTopics', {tid: templates.get('topic_id')}, function(err, topics) {
							if (!err) {
								bootbox.confirm(templates['modals/sort-featured-topics'].parse({topics:topics}), function(confirm) {
									var tids = [];
									$('.featured-topic').each(function(i) {
										tids.push(this.getAttribute('data-tid'));
									});

									socket.emit('topics.setFeaturedTopics', {tids: tids});
								});

								setTimeout(function() {
									// wtb callback for bootbox...
									$('span.timeago').timeago();
									$('#sort-featured').sortable().disableSelection();

									$('.delete-featured').on('click', function() {
										$(this).parents('.panel').remove();
									});
								}, 500);
							}
						});
					});

					ev.preventDefault();
					return false;
				});

			}
		});
	});
}());