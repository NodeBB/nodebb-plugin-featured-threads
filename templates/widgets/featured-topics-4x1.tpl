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
$('span.timeago').timeago();
</script>