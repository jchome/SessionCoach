<?php

namespace App\Controllers\Api;

use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;
use Exception;

class SecuredResourceController extends ResourceController{

	protected function validateUserAndApp(){
		$user = $this->getAuthorizedUser();
        if($user == null){
			throw new Exception('User not authorized');
            //return $this->failForbidden('User not authorized');
        }
		return $user;
	}

	protected function getAuthorizedUser(){
		//log_message('debug', "---------------getAuthorizedUser");
		$authorization = $this->request->getHeaderLine("Authorization");
		//log_message('debug', "authorization=" . $authorization);
        if (preg_match('/Bearer\s(\S+)/', $authorization, $matches)) {
            $token = $matches[1];
        }else{
            return null;
        }

        return $this->getUserForToken($token);
	}

	protected function getUserForToken($userToken){
		if($userToken == "") {
            log_message('debug', 'userToken is empty');
			throw new Exception('Token is required');
		}
		$userModel = new UserModel();

        //log_message('debug', '[AjaxController.php] userToken: ' . $userToken);
        $users = $userModel->asObject()->where('token', $userToken)->findAll();
        if(sizeof($users) != 1){
            log_message('debug', 'User not granted. No user for token ' . $userToken);
            throw new Exception('User not granted');
        }
        $user = end($users);
		/* -- Don't check IP and expiration date
		helper(['security']);
        $ipAddress = $this->request->getIPAddress();
		$result = check_token($userToken, $user, $ipAddress);
        if($result != ""){
			throw new Exception('Session expired: ' . $result);
        }

		$user->expiration_token = computeTokenExpirationDate();
		log_message('debug', 'expiration_token : ' . $user->expiration_token);
		$userModel->update($user->id, $user);
        */
		return $user;
	}
}