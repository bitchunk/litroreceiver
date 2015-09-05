<!DOCTYPE html>
<html lang="ja">
	<head>
		<title>LitroReceiver | LitroSound</title>
		<meta charset="utf-8">
		<meta name="description" content="">
		<meta name="author" content="しふたろう">
		<meta name="viewport" content="width=320, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">

		<!-- SNS OG params -->
		<meta property="og:title" content="LitroReceiver">
		<meta property="og:type" content="player">
		<meta property="og:url" content="<?php echo PROTOCOL_HOST_REQUEST; ?>">
		<meta property="og:image" content="https://ltsnd.bitchunk.net/receiver/img/twitter_card_player.png">
		<meta name="twitter:card" content="player">
		<meta name="twitter:site" content="@litrosound">
		<meta name="twitter:title" content="LitroReceiver">
		<meta name="twitter:image" content="https://ltsnd.bitchunk.net/receiver/img/twitter_card_player.png">
		<meta name="twitter:description" content="Litrosound on smart device">
		<meta name="twitter:creator" content="@litrosound">
		<meta name="twitter:player" content="<?php echo PROTOCOL_HOST_REQUEST; ?>">
		<meta name="twitter:player:width" content="320">
		<meta name="twitter:player:height" content="320">

		
		<!-- Replace favicon.ico & apple-touch-icon.png in the root of your domain and delete these references -->
		<title>LitroReceiver</title>
		<link rel="shortcut icon" href="./img/favicon.png">
		<link rel="apple-touch-icon-precomposed" href="./img/apple-touch-icon.png">
		
		<link rel="stylesheet" type="text/css" href="./style.css" media="all">

		<script src="./chunklekit/string.js"></script>
		<script src="./chunklekit/prop.js"></script>
		<script src="./chunklekit/keyControll.js"></script>
		<script src="./chunklekit/canvasdraw.js"></script>
		<script src="./chunklekit/wordPrint.js"></script>
		<script src="./litrosound/Litrosound.js"></script>
		<script src="./LitroReceiver.js"></script>

		<!-- AWS Analytics SDK -->
		<script src="/libjs/aws-sdk.min.js"></script>
		<script src="/libjs/aws-sdk-mobile-analytics.min.js"></script>
		<script type="text/javascript">
			var options = {
				appId : '284cad9a703d47589109f9cb12038e22', //Amazon Mobile Analytics App ID
				appTitle : LITRORECEIVER_NAME, //Optional e.g. 'Example App'
				// appVersionName : APP_VERSION_NAME, //Optional e.g. '1.4.1'
				appVersionCode : LITRORECEIVER_VERSION, //Optional e.g. '42'
				// appPackageName : APP_PACKAGE_NAME //Optional e.g. 'com.amazon.example'
			};

			var mobileAnalyticsClient = new AMA.Manager(options);
		</script>
		<style>
			
		</style>
	</head>

	<body>
		<div id="display" class="display center">
		</div>
		</body>
	</html>
