<div class="row home" itemscope itemtype="http://www.schema.org/ItemList">
	<!-- BEGIN topics -->
	<div class="col-xs-3 col-xs-12 category-item" data-tid="{topics.tid}">
		<meta itemprop="name" content="{topics.title}">

		<div class="category-icon">
			<a style="color: {topics.category.color};" href="{relative_path}/topic/{topics.slug}" itemprop="url">
				<div class="category-header" style="background: {topics.category.bgColor}; color: {topics.category.color};">
					<span class="badge">{topics.postcount} </span>
					<div><i class="fa {topics.category.icon} fa-4x"></i></div>
				</div>
			</a>

			<div class="category-box">
				<a href="{relative_path}/topic/{topics.slug}" itemprop="url">
					<h4><i class="fa {topics.category.icon} visible-xs-inline"></i> {topics.title}</h4>
				</a>
				<div class="description" itemprop="description">by {topics.user.username}</div>
				<!-- BEGIN posts -->
				<div class="post-preview clearfix">
					<a style="color: {topics.category.color};" href="./user/{topics.posts.userslug}">
						<img src="{topics.posts.picture}" title="{topics.posts.username}" class="pull-left user-img" />
					</a>

					<p>
						<strong>{topics.posts.username}</strong><br/>
						{topics.posts.content}
					</p>
					<span class="pull-right">
						<a href="topic/{topics.posts.topic.slug}#{topics.posts.pid}">posted</a>
						<span class="timeago" title="{topics.posts.relativeTime}"></span>
					</span>
				</div>
				<!-- END posts -->
			</div>
		</div>
	</div>
	<!-- END topics -->
</div>

<script type="text/javascript">
(function() {
	$('span.timeago').timeago();

	var featuredThreadsWidget = app.widgets.featuredThreadsWidget;

	var numPosts = parseInt('{numPostsPerTopic}', 10); // TODO replace with setting from widget
	numPosts = numPosts || 8;

	if (!featuredThreadsWidget) {
		featuredThreadsWidget = {};
		featuredThreadsWidget.onNewPost = function(data) {
			var tid;
			if(data && data.posts && data.posts.length) {
				tid = data.posts[0].tid;
			}

			var insertBefore = $('.home .category-item[data-tid="' + tid + '"] .post-preview').first();
			var recentPosts = $('.home .category-item[data-tid="' + tid + '"] .post-preview');
			if (!insertBefore.length) {
				return;
			}

			parseAndTranslate(data.posts, function(html) {
				html.hide()
					.insertBefore(insertBefore)
					.fadeIn();

				app.createUserTooltips();
				if (recentPosts.children().length > numPosts) {
					recentPosts.children().last().remove();
				}
			});
		}

		app.widgets.featuredThreads = featuredThreadsWidget;
		socket.on('event:new_post', app.widgets.featuredThreads.onNewPost);
	}

	function parseAndTranslate(posts, callback) {
		templates.preload_template('featured-topics-4x1', function() {

			templates['featured-topics-4x1'].parse({topics:[]});

			var html = templates.prepare(templates['featured-topics-4x1'].blocks['posts']).parse({
				posts: posts
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