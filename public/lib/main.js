(function() {
	"use strict";

	jQuery('document').ready(function() {
		$(window).on('action:ajaxify.end', function(ev, data) {
			if (data.url.match(/^topic/)) {
				$('.topic').on('click', '.thread-tools .mark-featured', function(ev) {
					ajaxify.loadTemplate('modals/sort-featured-topics', function(featuredTpl) {
						socket.emit('topics.getFeaturedTopics', {tid: ajaxify.data.tid}, function(err, topics) {
							if (!err) {
								bootbox.confirm(templates.parse(featuredTpl, {topics:topics}), function(confirm) {
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
							}else{
								console.log(err);
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