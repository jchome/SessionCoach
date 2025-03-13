<?php
namespace App\Controllers\Api\v2;

use App\Controllers\AjaxController;
use Exception;

Class Auth extends AjaxController{

    /**
     * Authentication by token
     */
    public function index(){
        try{
            $user = $this->getAuthorizedUser();
            return $this->respond( [
                "status" => "ok",
                "user" => $user
            ] ) ;
        }catch(Exception $e){
            return $this->respond( ["status" => "error"] ) ;
        }
    }
    
}