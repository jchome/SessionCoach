<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\Response;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;

class SecurityFilter implements FilterInterface{

    // List of URL to check : the referer must be set (request from the UI, not from the browser)
    private $uriToCheckWithHttpReferer = [];

    public function before(RequestInterface $request, $arguments = null){
		//log_message('debug','[SecurityFilter.php] : "before" started... Requesting ' . $request->getServer()['REQUEST_URI'] );

        //log_message('debug', 'SecurityFilter#before - METHOD=' . $request->getMethod());
        if($request->getMethod() == 'options'){
            $response = Services::response();
            $response->setStatusCode(200);
            $response->setBody(`{"status": "ok", "data": ""}`);
            $response->setHeader('Access-Control-Allow-Origin', '*')
                ->setHeader('Access-Control-Allow-Headers', '*') 
                ->setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, PUT, DELETE');
            //log_message('debug', 'SecurityFilter#before - Method=OPTION; RETURNING OK.');
            return $response;
        }

        $uri = $request->getServer()['REQUEST_URI'];
        if( $this->checkWithHttpReferer($uri)){
            //log_message('debug', 'SecurityFilter#before - uri is secured by http referer: ' . $uri );
            //log_message('debug', 'SecurityFilter#before - HTTP_REFERER=' . $request->getServer()['HTTP_REFERER'] );
            if( $this->doubleCheckInFailure($request->getServer(), $uri)){
                // Failure
                $response = Services::response();
                $response->setStatusCode(500);
                $response->setBody(`{"status": "failure", "data": "HTTP_REFERER is empty"}`);
                //log_message('debug', 'SecurityFilter#before - HTTP_REFERER is empty --> FAILURE' );
                return $response;
            }else{
                //log_message('debug', 'SecurityFilter#before - HTTP_REFERER is OK' );
                return;
            }
        }
        

        $referer = "";
        if( array_key_exists('HTTP_REFERER', $request->getServer())){
            $referer = $request->getServer()['HTTP_REFERER'];
            //log_message('debug', 'SecurityFilter#before - HTTP_REFERER=' . $referer );
        }else{
            $referer = $request->getServer()['HTTP_HOST'];
            //log_message('debug', 'SecurityFilter#before - HTTP_HOST=' . $referer );
        }

        if( str_starts_with($referer, 'http://') ){
            $referer = substr($referer, 7);
        }
        if( str_starts_with($referer, 'https://') ){
            $referer = substr($referer, 8);
        }
        if( str_starts_with(base_url(), 'http://') ){
            $referer = 'http://' . $referer;
        }else{
            $referer = 'https://' . $referer;
        }
        //log_message('debug', 'SecurityFilter#before - referer=' . $referer );
        //log_message('debug', 'SecurityFilter#before - base_url=' . base_url() );


        if( $referer == "" || str_starts_with($referer, base_url()) || str_starts_with(base_url(), $referer)){
            // This client is allowed
            //log_message('debug', 'SecurityFilter#before - referer=' . $referer . "   -   base_url=" . base_url());
            return;
        }

        //log_message('debug', 'SecurityFilter#before - getHeaderLine "X-App"=' . $request->getHeaderLine('X-App'));

        $clientApp = "";
        if($request->getHeaderLine('X-App') != ""){
            $clientApp = $request->getHeaderLine('X-App');
        } else if($request->getGet('X-App') != ""){
            $clientApp = $request->getGet('X-App');
        }

        if($clientApp == APP_CLIENT || $clientApp == APP_ADMIN){
            // All is OK
            return;
        }

        // This client is not allowed. prepare the response.
        log_message('debug', 'SecurityFilter#before - clientApp=' . $clientApp);

        $response = Services::response();
        $response->setStatusCode(500);
        $response->setBody(`{"status": "failure", "data": "Invalid header"}`);
        $response->setHeader('Access-Control-Allow-Origin', '*')
            ->setHeader('Access-Control-Allow-Headers', '*') 
            ->setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, PUT, DELETE');
        log_message('debug', 'SecurityFilter#before - Invalid header');

        // Failure
        return $response;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null){
        // Nothing to do
        $response->setHeader('Access-Control-Allow-Origin', '*')
            ->setHeader('Access-Control-Allow-Headers', '*') 
            ->setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, PUT, DELETE');
    }

    /**
     * Returns TRUE if the url is secured and there is no referer provided
     */
    private function doubleCheckInFailure($serverData, $uri){
        foreach ($this->uriToCheckWithHttpReferer as $securedUrl) {
            // On secured URL
            if(strpos($uri, $securedUrl) > -1){
                // The referer MUST be set
                if(! array_key_exists('HTTP_REFERER', $serverData)){
                    // Failure
                    return true;
                }

            }
        }
        // No failure
        return false;
    }

    private function checkWithHttpReferer($uri){
        foreach ($this->uriToCheckWithHttpReferer as $securedUrl) {
            if(strpos($uri, $securedUrl) > -1){
                return true;
            }
        }
        return false;
    }

}