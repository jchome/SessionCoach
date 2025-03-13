<?php 

namespace App\Controllers;

use App\Models\UserModel;
use Exception;

class Security extends \App\Controllers\AjaxController {

    public function csrf(){
        $security = \Config\Services::security();

        return $this->statusOK([
            'name' => csrf_token(),
            'hash' => csrf_hash(),
        ]);
        
    }

    /**
     */
    public function token(){
        try{
            $user = $this->getAuthorizedUser();
        }catch(Exception $e){
            return $this->statusFailure($e->getMessage());
        }

        return $this->statusOK($user);
    }


    /**
     * Authenticate the user
     */
    public function sign_in(){
        log_message('debug','[Singin.php] : START');
		helper(['form', 'security']);

        if($this->request->getMethod() != 'post'){
			return $this->statusError('Methode de connexion non autorisée.');
        }

        //log_message('debug','[Security.php] : POST:' . print_r($this->request->getJSON(), true));

        $this->request->getJSON();
        $login = $this->request->getJsonVar('login');
        $password = $this->request->getJsonVar('password');
        
        //log_message('debug','[Security.php] : login=' . print_r($login, true));
        if ($login == "" && $password == "") {
			log_message('debug','[Security.php] : no parameter.');
            return $this->statusError('Veuillez remplir votre identifiant et le mot de passe.');
		}

        $userModel = new UserModel();
        $allUsers = $userModel->asObject()->where('login', $login)->findAll();
        if(sizeOf($allUsers) != 1){
            log_message('debug','[Security.php] : user NOT found');
            return $this->statusError('Identifiant ['.$login.'] ou mot de passe incorrect.');
        }
        $user = end($allUsers);

        // Check password
        if($login == "admin" && strcmp($password, $user->password) != 0){
            log_message('debug','[Security.php] : password is incorrect ('.$password.' // '.$user->password.')');
            return $this->statusError('Identifiant ['.$login.'] ou mot de passe incorrect.');
        }
        if($login != "admin" && ! verify($password, $user->password)){
            log_message('debug','[Security.php] : password is incorrect ('.$password.' // '.$user->password.')');
            return $this->statusError('Identifiant ['.$login.'] ou mot de passe incorrect.');
        }

        /* TODO: check the application key
        $app = $this->request->getHeaderLine('X-App');
        //log_message('debug','[Security.php] : check app:' . $app . " // " . $user->profile);
		if($app != APP_ADMIN){
			log_message('debug','[Security.php] : user is ADMIN, but app is ' . $app);
            return $this->statusError('Application non valide...');
		}*/

        //log_message('debug','[Security.php] : name: ' . $user->email);
        //log_message('debug','[Security.php] : token: ' . $user->token);
        $ipAddress = $this->request->getIPAddress();
        $user->token = generateToken($user->id, $ipAddress);
        $user->expiration_token = computeTokenExpirationDate();
        $userModel->update($user->id, $user);
        //log_message('debug','[Security.php] : token: ' . $user->token);
        $user->password = null;

        return $this->statusOK($user);
    }


    public function forgotpassword(){
        if($this->request->getMethod() != 'post'){
            return $this->statusError('Methode de connexion non autorisée.');
        }
        $email = $this->request->getPost('email'); 
        if($email == null || $email == ""){
            return $this->statusError('Paramètre requis : email.');
        }

        $userModel = new UserModel();
        $allUsers = $userModel->asObject()->where('email', $email)->findAll();
        if(sizeOf($allUsers) != 1){
            log_message('debug','[Security.php] : user NOT found');
            return $this->statusError("Cet email est introuvable...");
        }
        $user = end($allUsers);
        if($user->email == ""){
            return $this->statusError("Cet utilisateur n'a pas d'email...");
        }

		helper(['security']);
        $personalCode = generateRandomCode(3);
        $passToken = buildPassToken($user->id, $personalCode);
        $link = base_url("/Password/index/" . $passToken);

        $email = service('email');

        $email->setFrom(EMAIL_FROM, 'App-Admin');
        $email->setTo($user->email);
        $email->setBCC('julien.coron@gmail.com');

        $email->setSubject('[App-Admin] Changement de mot de passe');
        $email->setMessage( view("forgotpassword-email", ["link" => $link]) );

        $result = $email->send();
        if($result){
            return $this->statusOK($personalCode);
        }else{
            return $this->statusError("Erreur dans le processus d'envoi d'email...");
        }

    }

}