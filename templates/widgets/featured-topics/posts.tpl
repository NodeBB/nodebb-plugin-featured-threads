				<!-- BEGIN posts -->
				<div class="post-preview clearfix">
					<a style="color: {topics.category.color};" href="./user/{topics.posts.user.userslug}">
						<img src="{topics.posts.user.picture}" title="{topics.posts.user.username}" class="pull-left user-img" />
					</a>

					<p>
						<strong>{topics.posts.user.username}</strong><br/>
						{topics.posts.content}
					</p>
					<span class="pull-right">
						<a href="topic/{topics.slug}/{topics.posts.index}">posted</a>
						<span class="timeago" title="{topics.posts.relativeTime}"></span>
					</span>
				</div>
				<!-- END posts -->