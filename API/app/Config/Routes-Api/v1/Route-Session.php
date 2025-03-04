<?php
$routes->group('api/v1', ['namespace' => 'App\Controllers\Api\v1'], function($routes) {
    $routes->resource('sessions', ['controller' => 'Session']);
});
