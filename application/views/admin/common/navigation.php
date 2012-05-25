<div class="nav-collapse">
	<ul class="nav">
    <li <?php if ($activeTab == "home") echo "class=\"active\" "?>><a href="<?= site_url("admin")?>">Home</a></li>
    <li <?php if ($activeTab == "templates") echo "class=\"active\" "?>><a href="<?= site_url("admin/templates")?>">Templates</a></li>
    <li <?php if ($activeTab == "tracks") echo "class=\"active\" "?>><a href="<?= site_url("admin/railways")?>">Railways</a></li>
    <li <?php if ($activeTab == "users") echo "class=\"active\" "?>><a href="<?= site_url("admin/users")?>">Users</a></li>
    </ul>
</div><!--/.nav-collapse -->
