<div class="recent-replies">
	<ul>
		<!-- BEGIN topics -->
		<li data-tid="{topics.tid}" class="clearfix">
			<a href="{relative_path}/topic/{topics.user.slug}">
				<img title="{topics.user.username}" class="img-rounded user-img" src="{topics.user.picture}" />
			</a>
			<strong><a href="{relative_path}/topic/{topics.slug}">{topics.title}</a></strong>
			<br /><span>by {topics.user.username}</span><br />
			
			<span class="pull-right">posted <span class="timeago" title="{topics.relativeTime}"></span></span>
		</li>
		<!-- END topics -->
	</ul>
</div>
<script type="text/javascript">
$('span.timeago').timeago();
</script>