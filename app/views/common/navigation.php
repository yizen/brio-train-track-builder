<div class="nav-collapse">
	<ul class="nav">
    <li <?php if ($activeTab == "home") echo "class=\"active\" "?>><a href="<?= site_url()?>">Home</a></li>
    <li <?php if ($activeTab == "library") echo "class=\"active\" "?>><a href="<?= site_url("library")?>">Library</a></li>
    <li <?php if ($activeTab == "user") echo "class=\"active\" "?>><a href="<?= site_url("user")?>">User</a></li>
    </ul>
</div><!--/.nav-collapse -->