<div class="row featured-threads" itemscope itemtype="http://www.schema.org/ItemList">
	<!-- BEGIN topics -->
	<div component="categories/category" class="<!-- IF topics.category.class -->{topics.category.class}<!-- ELSE -->col-md-3 col-sm-6 col-xs-12<!-- ENDIF topics.category.class --> category-item" data-cid="{topics.category.cid}" data-numRecentReplies="{topics.category.numRecentReplies}">
		<meta itemprop="name" content="{topics.category.name}">

		<div class="category-icon">
			<a style="color: {topics.category.color};" href="{config.relative_path}/topic/{topics.slug}" itemprop="url">
				<div
					id="category-{topics.category.cid}" class="category-header category-header-image-{topics.category.imageClass}"
					style="
						<!-- IF topics.category.backgroundImage -->background-image: url({topics.category.backgroundImage});<!-- ENDIF topics.category.backgroundImage -->
						<!-- IF topics.category.bgColor -->background-color: {topics.category.bgColor};<!-- ENDIF topics.category.bgColor -->
						color: {topics.category.color};
					"
				>
					<!-- IF topics.category.icon -->
					<div><i class="fa {topics.category.icon} fa-4x hidden-xs"></i></div>
					<!-- ENDIF topics.category.icon -->
				</div>
			</a>

			<div class="category-box">
				<div class="category-info" style="color: {topics.category.color};">
					<a href="{config.relative_path}/topic/{topics.slug}" itemprop="url" style="color: {topics.category.color};">
						<h4><!-- IF topics.category.icon --><i class="fa {topics.category.icon} visible-xs-inline"></i> <!-- ENDIF topics.category.icon -->{topics.title}</h4>
						<div class="description" itemprop="description"><strong>{topics.category.name}</strong> <span class="timeago" title="{topics.relativeTime}"></span></div>
					</a>
				</div>
			</div>

			<span class="post-count" style="color: {topics.category.color};">{topics.postcount}</span>
		</div>
	</div>
	<!-- END topics -->
</div>
<br />

<script type="text/javascript">
(function() {
	$('span.timeago').timeago();

	var featuredThreadsWidget = app.widgets.featuredThreads;

	var numPosts = parseInt('{numPostsPerTopic}', 10); // TODO replace with setting from widget
	numPosts = numPosts || 8;

	if (!featuredThreadsWidget) {
		featuredThreadsWidget = {};
		featuredThreadsWidget.onNewPost = function(data) {
			var tid;
			if(data && data.posts && data.posts.length) {
				tid = data.posts[0].tid;
			}

			var category = $('.home .category-item[data-tid="' + tid + '"]');
			var recentPosts = category.find('.post-preview');
			var insertBefore =  recentPosts.first();

			if (!insertBefore.length) {
				return;
			}

			parseAndTranslate(data.posts, function(html) {
				html.hide()
					.insertBefore(insertBefore)
					.fadeIn();

				app.createUserTooltips();
				if (category.find('.post-preview').length > numPosts) {
					recentPosts.last().remove();
				}
			});
		}

		app.widgets.featuredThreads = featuredThreadsWidget;
		socket.on('event:new_post', app.widgets.featuredThreads.onNewPost);
	}

	function parseAndTranslate(posts, callback) {
		templates.preload_template('widgets/featured-topics/posts', function() {
			var html = templates['widgets/featured-topics/posts'].parse({
				topics: {
					posts: posts
				}
			});

			translator.translate(html, function(translatedHTML) {
				translatedHTML = $(translatedHTML);
				translatedHTML.find('img').addClass('img-responsive');
				translatedHTML.find('span.timeago').timeago();
				callback(translatedHTML);
			});
		});
	}
}());

</script>