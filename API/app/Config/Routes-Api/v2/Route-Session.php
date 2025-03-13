<?php
$routes->group('api/v2', ['namespace' => 'App\Controllers\Api\v2'], function($routes) {

    //------------------------------------------
    // GET
    // Usage: http://localhost:8080/api/v2/auth
    $routes->get('auth', 'Auth::index');

    $routes->resource('sessions', ['controller' => 'Session']);
});

