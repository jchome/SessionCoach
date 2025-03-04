<?php

namespace App\Controllers;


class Password extends \App\Controllers\BaseController {

    /**
     * Don't use '@' in the special code.
     */
    static $special_code = "^UD!";

    public function index($passwordToken){
        helper(['security', 'form']);

        $result = checkPasswordToken($passwordToken);
        if($result["message"] != "OK"){
            echo view('Password/over', []);
            return;
        }

        $data["passwordToken"] = $passwordToken;
        echo view('Password/code', $data);
    }

    public function reset(){
		helper(['security', 'form']);
        $code = $this->request->getPost('code');
        $passwordToken = $this->request->getPost('passwordToken');
        $result = checkPasswordToken($passwordToken);
        
        if($result["message"] != "OK"){$data["error"] = lang('App.password.'. $result["message"]);
            echo view('Password/code', $data);
            return;
        }

        $personalCode = $result["personalCode"];
        if($code != $personalCode){
            $data["error"] = lang('App.password.personal_code_error');
            $data["passwordToken"] = $passwordToken;
            echo view('Password/code', $data);
            return;
        }
        $userId = $result["userId"];
        $passwordToken = buildPassToken($userId, Password::$special_code); // Special personal code
        $data["passwordToken"] = $passwordToken;
        echo view('Password/set', $data);
    }


    public function apply(){
		helper(['security', 'form']);
        $passwordToken = $this->request->getPost('passwordToken');
        $password1 = $this->request->getPost('password');
        $password2 = $this->request->getPost('password2');

        if($password1 != $password2){
            $data["error"] = lang('App.password.mismatch');
            $data["passwordToken"] = $passwordToken;
            echo view('Password/set', $data);
            return;
        }

        $result = checkPasswordToken($passwordToken);
        if($result["message"] != "OK"){
            $data["error"] = lang('App.password.'. $result["message"]);
            $data["passwordToken"] = $passwordToken;
            echo view('Password/set', $data);
            return;
        }
        $personalCode = $result["personalCode"];
        if($personalCode != Password::$special_code){
            $data["error"] = lang('App.password.internal_code');
            $data["passwordToken"] = $passwordToken;
            echo view('Password/set', $data);
            return;
        }

        $userId = $result["userId"];
		$userModel = new \App\Models\UserModel();
		$user = $userModel->find($userId);
        $user["password"] = generateHash($password1);
        $userModel->update($userId, $user);
        echo view('Password/ok', []);
    }


}