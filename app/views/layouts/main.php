<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title><?= $pageTitle ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<?= $pageDescription ?>">
    <meta name="author" content="">

    <!-- Le styles -->
    <link href="<?= base_url() ?>includes/css/bootstrap.min.css" rel="stylesheet">
    <style>
      body {
        padding-top: 60px; /* 60px to make the container go all the way to the bottom of the topbar */
      }
    </style>
    <link href="<?= base_url() ?>includes/css/bootstrap-responsive.min.css" rel="stylesheet">
    <link href="<?= base_url() ?>includes/css/style.css" rel="stylesheet">


    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Le fav and touch icons 
    <link rel="shortcut icon" href="images/favicon.ico">
    <link rel="apple-touch-icon" href="images/apple-touch-icon.png">
    <link rel="apple-touch-icon" sizes="72x72" href="images/apple-touch-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="114x114" href="images/apple-touch-icon-114x114.png">
    -->
  </head>
  <body>
  
  <div class="navbar navbar-fixed-top">
  	<div class="navbar-inner">
    	<div class="container">
          <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </a>
          <a class="brand" href="#">FO</a>
          <?= $nav_bar ?>
        </div> <!-- /container -->
      </div>
    </div>
    
    <div class="container">
		<?= $content ?>
    </div> <!-- /container -->
    
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
    <script src="<?= base_url() ?>/includes/js/bootstrap.min.js"></script>
    
    <script src="<?= base_url() ?>/includes/js/lib/base.js"></script>
	<script src="<?= base_url() ?>/includes/js/lib/jquery.jkey-1.1.js"></script>

	
	<!-- NODE GRAPH LIBS -->
	<script src="<?= base_url() ?>/includes/js/lib/node-graph/edge.js"></script>
	<script src="<?= base_url() ?>/includes/js/lib/node-graph/graph.js"></script>
	<script src="<?= base_url() ?>/includes/js/lib/node-graph/vertex.js"></script>
	<script src="<?= base_url() ?>/includes/js/lib/node-graph/matrices/adjacency.js"></script>
	<script src="<?= base_url() ?>/includes/js/lib/node-graph/searches/depthfirstsearch.js"></script>
	<script src="<?= base_url() ?>/includes/js/lib/node-graph/searches/dijkstra.js"></script>
	
	<!-- EASELJS LIBS -->
	<script src="/EaselJS/src/easeljs/utils/UID.js"></script>
	<script src="/EaselJS/src/easeljs/geom/Matrix2D.js"></script>
	<script src="/EaselJS/src/easeljs/geom/Point.js"></script>
	<script src="/EaselJS/src/easeljs/geom/Rectangle.js"></script>
	<script src="/EaselJS/src/easeljs/events/MouseEvent.js"></script>
	<script src="/EaselJS/src/easeljs/display/SpriteSheet.js"></script>
	<script src="/EaselJS/src/easeljs/display/Shadow.js"></script>
	<script src="/EaselJS/src/easeljs/display/DisplayObject.js"></script>
	<script src="/EaselJS/src/easeljs/display/Container.js"></script>
	<script src="/EaselJS/src/easeljs/display/Stage.js"></script>
	<script src="/EaselJS/src/easeljs/display/Bitmap.js"></script>
	<script src="/EaselJS/src/easeljs/display/BitmapAnimation.js"></script>
	<script src="/EaselJS/src/easeljs/display/Graphics.js"></script>
	<script src="/EaselJS/src/easeljs/display/Shape.js"></script>
	<script src="/EaselJS/src/easeljs/display/Text.js"></script>
	<script src="/EaselJS/src/easeljs/filters/Filter.js"></script> 
	<script src="/EaselJS/src/easeljs/filters/ColorFilter.js"></script> 
	<script src="/EaselJS/src/easeljs/filters/BoxBlurFilter.js"></script> 
	<script src="/EaselJS/src/easeljs/filters/ColorMatrixFilter.js"></script> 
	<script src="/EaselJS/src/easeljs/utils/SpriteSheetUtils.js"></script>
	<script src="/EaselJS/src/easeljs/utils/Ticker.js"></script>
	
	<script src="<?= base_url() ?>includes/js/lib/SimpleMaskContainer.js"></script>
	
	<!-- Tween JS LIBS -->
	<script src="/TweenJS/src/tweenjs/Tween.js"></script>
	<script src="/TweenJS/src/tweenjs/Ease.js"></script>

	
	<!-- BEZIER PATH LIBS -->
	<script src="<?= base_url() ?>includes/js/lib/oliversteele/bezier.js"></script>
	<script src="<?= base_url() ?>includes/js/lib/oliversteele/path.js"></script>
	
	<!-- GEOMETRY LIBS -->
	<script src="<?= base_url() ?>includes/js/lib/kevinlindsay/Point2D.js"></script>
	<script src="<?= base_url() ?>includes/js/lib/kevinlindsay/Vector2D.js"></script>
	<script src="<?= base_url() ?>includes/js/lib/kevinlindsay/Polynomial.js"></script>
	<script src="<?= base_url() ?>includes/js/lib/kevinlindsay/Intersection.js"></script>

	<!-- APP LIBS -->
	<script src="<?= base_url() ?>includes/js/tracks/Storage.js"></script>
	
	<script src="<?= base_url() ?>includes/js/tracks/Config.js"></script>
	<script src="<?= base_url() ?>includes/js/tracks/Library.js"></script>
	
	<script src="<?= base_url() ?>includes/js/tracks/Button.js"></script>


	<script src="<?= base_url() ?>includes/js/tracks/Track.js"></script>
	
	<script src="<?= base_url() ?>includes/js/tracks/TracksDrawer.js"></script>

	<script src="<?= base_url() ?>includes/js/tracks/Measure.js"></script>
	
	<script src="<?= base_url() ?>includes/js/tracks/Segment.js"></script>

	<script src="<?= base_url() ?>includes/js/tracks/Connector.js"></script>
	<script src="<?= base_url() ?>includes/js/tracks/Grid.js"></script>
	<script src="<?= base_url() ?>includes/js/tracks/MapView.js"></script>

	<script src="<?= base_url() ?>includes/js/tracks/Gizmo.js"></script>
	
	<script src="<?= base_url() ?>includes/js/tracks/Selection.js"></script>
	<script src="<?= base_url() ?>includes/js/tracks/RotationDial.js"></script>
	
	<script src="<?= base_url() ?>includes/js/tracks/Railway.js"></script>

	<!-- 
	<script src="<?= base_url() ?>includes/js/tracks/static/StaticTrack.js"></script>
	<script src="<?= base_url() ?>includes/js/tracks/static/StraightTrack.js"></script>
	<script src="<?= base_url() ?>includes/js/tracks/static/CurvedTrack.js"></script>
	<script src="<?= base_url() ?>includes/js/tracks/static/TripleTrack.js"></script>
	-->
	
	<script src="<?= base_url() ?>includes/js/tracks/Bogie.js"></script>
	<script src="<?= base_url() ?>includes/js/tracks/Carriage.js"></script>
	<script src="<?= base_url() ?>includes/js/tracks/Arrow.js"></script>
	
	<script src="<?= base_url() ?>includes/js/tracks/Switch.js"></script>
	
	<script src="<?= base_url() ?>includes/js/tracks/Keys.js"></script>
	<script src="<?= base_url() ?>includes/js/tracks/Cursor.js"></script>

	<script src="<?= base_url() ?>includes/js/tracks/Main.js"></script>
	<?php
	
	//Are we loading a track ?
	
	if (isset($loadedRailwayId)) {
		echo '<script type="text/javascript">
	loadedRailwayId = "'.$loadedRailwayId.'";
	</script>';
	}
	?>
  </body>
</html>
