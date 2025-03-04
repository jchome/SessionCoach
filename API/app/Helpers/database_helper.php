<?php

/**
 * Create a new array with key = value of the key field
 */
function index_data($array, $keyName){
    $newArray = [];
    foreach ($array as $data):
        if(is_array($data)){
            $newArray[$data[$keyName]] = $data;
        }else{
            $newArray[$data->$keyName] = $data;
        }
    endforeach;
    return $newArray;
}

/**
 * Convert from dd/mm/yyyy to yyyy-mm-dd
 */
function toSqlDate($uiDate){
    if($uiDate == ""){
        return "";
    }
    $array = explode('/', $uiDate);
    if(sizeof($array) == 3){
        return $array[2] . '-' .  $array[1] . '-' . $array[0];
    }
    return $uiDate;
}

function toUiDate($sqlDate){
    if($sqlDate == ""){
        return "";
    }
    if($sqlDate == "0000-00-00"){
        return "";
    }
    $array = explode('-', $sqlDate);
    if(sizeof($array) == 3){
        return $array[2] . '/' .  $array[1] . '/' . $array[0];
    }
    return $sqlDate;

}

/**
 * Convert a time as 'hh:mm:ss' to a number of seconds
 */
function timeAsLong($timer){
    $startTimeArray = explode(':', $timer);
    return intval($startTimeArray[0]) * 60*60 +
        intval($startTimeArray[1]) * 60 +
        intval($startTimeArray[2]);
}

?>