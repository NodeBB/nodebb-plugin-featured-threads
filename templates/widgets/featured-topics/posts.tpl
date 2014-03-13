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