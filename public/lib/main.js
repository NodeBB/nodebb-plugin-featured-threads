'use strict';

/* global $, window, ajaxify, socket, app, */
$(window).on('action:ajaxify.end', () => {
	if (ajaxify.data.template.topic) {
		$('.topic').on('click', '.thread-tools .mark-featured', () => {
			require(['bootbox'], (bootbox) => {
				socket.emit('topics.getFeaturedTopics', { tid: ajaxify.data.tid }, (err, topics) => {
					if (err) {
						return app.alertError(err);
					}

					app.parseAndTranslate('modals/sort-featured-topics', { topics: topics }, (html) => {
						bootbox.confirm(html, (confirm) => {
							const tids = [];
							if (confirm) {
								$('.featured-topic').each(function () {
									tids.push(this.getAttribute('data-tid'));
								});

								socket.emit('topics.setFeaturedTopics', { tids: tids }, (err) => {
									if (err) {
										return app.alertError(err);
									}
								});
							}
						}).on('shown.bs.modal', () => {
							app.loadJQueryUI(() => {
								$('span.timeago').timeago();
								$('#sort-featured').sortable().disableSelection();

								$('.delete-featured').on('click', function () {
									$(this).parents('.panel').remove();
								});
							});
						});
					});
				});
			});
			return false;
		});
	}
});
