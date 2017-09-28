$(window).on('action:ajaxify.end', function(ev, data) {
	"use strict";

	if (data.url.match(/^topic/)) {
		$('.topic').on('click', '.thread-tools .mark-featured', function(ev) {
		socket.emit('topics.getFeaturedTopics', {tid: ajaxify.data.tid}, function(err, topics) {
				if (err) {
					return console.log(err);
				}

				templates.parse('modals/sort-featured-topics', {topics:topics}, function(tpl) {
					console.log(topics);
					bootbox.confirm(tpl, function(confirm) {
						var tids = [];
						$('.featured-topic').each(function(i) {
							tids.push(this.getAttribute('data-tid'));
						});

						socket.emit('topics.setFeaturedTopics', {tids: tids});
					}).on("shown.bs.modal", function() {
						app.loadJQueryUI(function() {
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
