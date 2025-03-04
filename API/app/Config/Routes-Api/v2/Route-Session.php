<?php
$routes->group('api/v2', ['namespace' => 'App\Controllers\Api\v2'], function($routes) {
    $routes->resource('sessions', ['controller' => 'Session']);
});
