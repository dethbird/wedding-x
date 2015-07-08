<?php

	/**
	*
	*    _____                                 __
  	*   /  _  \ ______ ______     ______ _____/  |_ __ ________
 	*  /  /_\  \\____ \\____ \   /  ___// __ \   __\  |  \____ \
	* /    |    \  |_> >  |_> >  \___ \\  ___/|  | |  |  /  |_> >
	* \____|__  /   __/|   __/  /____  >\___  >__| |____/|   __/
	*         \/|__|   |__|          \/     \/           |__|
	*/
	// ini_set('error_reporting', E_ALL);
	error_reporting(E_ALL);
	ini_set('display_errors', 1);
	define("APPLICATION_PATH", __DIR__);
	date_default_timezone_set('America/New_York');

	// Ensure src/ is on include_path
	set_include_path(implode(PATH_SEPARATOR, array(
		__DIR__ ,
	    __DIR__ . '/src',
	    get_include_path(),
	)));
	global $httpClient, $configs;
	$siteData = null;

	/**
	* __________               __
	* \______   \ ____   _____/  |_  __________________  ______
 	* |    |  _//  _ \ /  _ \   __\/  ___/\_  __ \__  \ \____ \
 	* |    |   (  <_> |  <_> )  |  \___ \  |  | \// __ \|  |_> >
 	* |______  /\____/ \____/|__| /____  > |__|  (____  /   __/
	*         \/                        \/             \/|__|
	*/

	require '../vendor/autoload.php';
	use Symfony\Component\Yaml\Yaml;
	use Guzzle\Http\Client;

	$configs = Yaml::parse(file_get_contents("../configs/config.yml"));
	$httpClient = new Client;


	// echo "<pre>";
	// print_r($configs);
	// echo "</pre>";
	// die();

	class AcmeExtension extends \Twig_Extension
	{
	    public function getFilters()
	    {
	        return array(
	            new \Twig_SimpleFilter('resizeImage', array($this, 'resizeImage')),
	            new \Twig_SimpleFilter('date_format', array($this, 'date_format')),
	            new \Twig_SimpleFilter('print_r', array($this, 'print_r')),
	            new \Twig_SimpleFilter('json_encode', array($this, 'json_encode')),
	            new \Twig_SimpleFilter('strip_tags', array($this, 'strip_tags'))
	        );
	    }

	    public function date_format($date, $format = "F j, Y g:i:a")
	    {
	    	// echo $date; die();
	        return date($format, strtotime($date));
	    }

	    public function resizeImage($url, $width, $height)
	    {
	        $url = parse_url($url);

	        return $url['scheme'] . "://" . $url['host'] . "/w". $width . "-h" . $height . $url['path'];
	    }

	    public function print_r($output)
	    {
	        return print_r($output,1);
	    }


	    public function strip_tags($html)
	    {
	        return strip_tags($html);
	    }

	    public function json_encode($output)
	    {
	        return json_encode($output);
	    }

	    public function getName()
	    {
	        return 'acme_extension';
	    }
	}

	$app = new \Slim\Slim(array(
    	'view' => new Slim\Views\Twig(),
    	'templates.path' => __DIR__ . '/../view',
	));
	$view = $app->view();
	$view->parserExtensions = array(
	    new \Slim\Views\TwigExtension(),
	    new AcmeExtension()
	);


	/**
	* __________               __  .__
	* \______   \ ____  __ ___/  |_|__| ____    ____
 	* |       _//  _ \|  |  \   __\  |/    \  / ___\
 	* |    |   (  <_> )  |  /|  | |  |   |  \/ /_/  >
 	* |____|_  /\____/|____/ |__| |__|___|  /\___  /
	*         \/                           \//_____/
	*/

	$app->get('/', function () use ($app) {

	    $app->render('partials/home.html.twig', array(
		    	'section'=>'index'
    		)
	    );
	});

	$app->get('/pics', function () use ($app) {

		$json = file_get_contents("pics.json");

	    $app->render('partials/pics.html.twig', array(
		    	'section'=>'pics',
		    	'picsJson' => $json
    		)
	    );
	});

	$app->get('/pics/reset', function () use ($app) {

		$handle = fopen("pics.json", "w");

		$_photographers = scandir("img/photos");
		$photographers = array();
		foreach ($_photographers as $pg) {
			if (substr($pg, 0, 1)!==".") {
				$photographers[] = $pg;
			}
		}
		$response = array();
		foreach ($photographers as $pg) {
			$dir = scandir("img/photos/" . $pg);
			foreach ($dir as $file) {
				if (
					substr($file, 0, 1)!=="." &&
					$file !=="thumbnails"
				) {
					$response[$pg][] = $file;
				}
			}
			// var_dump($dir);
		}
		// var_dump($photographers);
		fputs($handle, json_encode($response));

		fclose($handle);
	});


	/**
	* __________            ._._._.
	* \______   \__ __  ____| | | |
 	* |       _/  |  \/    \ | | |
 	* |    |   \  |  /   |  \|\|\|
 	* |____|_  /____/|___|  /_____
	*        \/           \/\/\/\/
	*/
	$app->run();
?>
