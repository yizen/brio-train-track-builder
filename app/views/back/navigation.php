<div class="nav-collapse">
	<ul class="nav">
    <li <?php if ($activeTab == "home") echo "class=\"active\" "?>><a href="<?= site_url("back")?>">Home</a></li>
    <li <?php if ($activeTab == "templates") echo "class=\"active\" "?>><a href="<?= site_url("back/templates")?>">Templates</a></li>
    <li <?php if ($activeTab == "tracks") echo "class=\"active\" "?>><a href="<?= site_url("back/tracks")?>">Tracks</a></li>
    <li <?php if ($activeTab == "users") echo "class=\"active\" "?>><a href="<?= site_url("back/users")?>">Users</a></li>
    </ul>
</div><!--/.nav-collapse -->
