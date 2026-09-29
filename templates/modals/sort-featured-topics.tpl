<h2>Re-order Featured Topics</h2>
<ul id="sort-featured" class="list-unstyled">
	{{{ each topics }}}
	<li class="mb-2">
		<div class="card">
			<div class="card-header featured-topic d-flex justify-content-between" data-tid="{./tid}">
				<div>
					<strong>{./title}</strong> <small><span class="timeago" title="{./timestampISO}"></span></small>
				</div>
				<a href="#" class="text-reset delete-featured"><i class="fa fa-times-circle text-danger"></i></a>
			</div>
		</div>
	</li>
	{{{ end }}}
</ul>