<?php

/**
 * Return the encrypted password to store in database
 */
function generateHash($password) {
    return password_hash($password, PASSWORD_BCRYPT);
}

/**
 * Check that the password is good
 */
function verify($clearPassword, $hashedPassword) {
    return password_verify($clearPassword, $hashedPassword);
}

/**
 * Generate a string that contains the user id and a timout to limit duration of session
 */
function generateToken($userId, $ipAddress = ""){
    $saltPhrase = md5("Security");
    $now = strtotime("+0 sec");
    return urlencode(base64_encode($saltPhrase . " " . $userId . " " . $now . " " . $ipAddress));
}

function computeTokenExpirationDate(){
    return date('Y-m-d H:i:s', strtotime("+1 hour") ); // 1 hour of session
}

function check_token($token, $user, $ipAddress = ""){
    $array = explode(' ', base64_decode(urldecode($token)));
    if(sizeof($array) != 4){
        // Wrong number of arguments
        return 'Wrong number of arguments';
    }
    if($array[0] != md5("Security")){
        // Wrong security pass
        return 'Wrong security pass';
    }
    if($array[1] != $user->id){
        // Wrong userId
        return "Wrong userId: $array[1] != $user->id";
    }
    if($array[3] != $ipAddress){
        // Wrong ip address
        return "Wrong ip address: $array[3] - $ipAddress";
    }
    $startTime = $array[2];
    $now = strtotime("+0 sec");
    $expirationTime = strtotime($user->expiration_token);
    
    if($startTime < $now && $now < $expirationTime){
        return "";
    }else{
        return "Wrong test: $startTime < $now < $expirationTime";
    }

}

function generateRandomCode($nbChars){
    return substr(md5(uniqid(rand(), true)), 0, $nbChars);
}

function buildPassToken($userId, $personalCode){
    $limitTime = strtotime("+600 sec"); // 10 minutes
    $prefix = generateRandomCode(10);
    $suffix = generateRandomCode(10);
    return urlencode(base64_encode( $prefix . "@" . $limitTime . "@" . $userId . "@" . $personalCode . "@" . $suffix));
}

function checkPasswordToken($passToken){
    if($passToken == ""){
        log_message('debug', "pass token is empty...");
        return [
            "message" => "empty"
        ];
    }
    $fullString = base64_decode(urldecode($passToken));
    $parts = explode('@', $fullString);
    if(sizeof($parts) != 5){
        log_message('debug', "pass token structure is not as expected: " . print_r($parts, true));
        return [
            "message" => "token_structure"
        ];
    }
    //log_message('debug', "parts=" . print_r($parts, true));
    
    $limitTime = intval($parts[1]);
    $userId = intval($parts[2]);
    $personalCode = $parts[3];
    //log_message('debug', "limitTime=" . $limitTime . "   now=" . strtotime("+0 sec"));
    if( $limitTime < strtotime("+0 sec")){
        log_message('debug', "Too late...");
        return [
            "message" => "time_over"
        ];
    }
    return [ "userId" => $userId,
        "personalCode" => $personalCode,
        "message" => "OK"
    ];
}

?>