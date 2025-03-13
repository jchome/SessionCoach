<?php 

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\HTTP\Response;
use Exception;

/**
 * Renders a HTML content
 */
class AjaxController extends \App\Controllers\BaseController {

	// This will provide this return "$this->respond(...);"
	use ResponseTrait;

	protected function getAuthorizedUser(){
		//log_message('debug', "---------------getAuthorizedUser");
		$authorization = $this->request->getHeaderLine("Authorization");
		//log_message('debug', "authorization=" . $authorization);
        if (preg_match('/Bearer\s(\S+)/', $authorization, $matches)) {
            $token = $matches[1];
        }else{
			log_message('error', "No token");
            throw new Exception("No token");
        }

        return $this->getUserForToken($token);
	}

	protected function getUserForToken($userToken){
		if($userToken == "") {
			log_message('error', "userToken is empty");
			throw new Exception('Token is required');
		}
		$userModel = new UserModel();

        log_message('debug', '[AjaxController.php] userToken: ' . $userToken);
        $users = $userModel->asObject()->where('token', $userToken)->findAll();
        if(sizeof($users) != 1){
            log_message('error', 'User not granted');
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
/*
	protected function checkHeader(): bool{
        // OPTIONS method does not provide the header
		if($this->request->getMethod(true) == 'OPTIONS'){
			return true;
		}
		return ($this->request->getHeaderLine('X-YouDance') == "YouDance-App");
	}*/

	public function getLangFromHeaders(): string{
		return $this->request->getHeaderLine('Content-Language');
	}

	protected function statusOK($data = 'Done.') : Response {
		return $this->respond([
			'status' => 'ok',
			'data' => $data
		], 200);
	}

	protected function statusError($cause) : Response {
		return $this->respond([
			'status' => 'error',
			'data' => $cause
		], 200);
	}

	protected function statusFailure($cause) : Response {
		return $this->respond([
			'status' => 'failure',
			'data' => $cause
		], 500);
	}
}