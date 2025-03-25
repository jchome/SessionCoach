<?php

use Config\Mimes;

use function PHPUnit\Framework\throwException;

/**
 * reduce the size of the image
 */
function resizeImage($imgSrc, $finalWidth, $imgDest){
    list($width, $height, $imageType) = getimagesize($imgSrc);

    if($width <= $finalWidth){
        // The file does not need any size reduction
        copy($imgSrc, $imgDest);
        return;
    }
    $ratio = $width / $height;
    $newHeight = intval($finalWidth/$ratio);

    //log_message('debug','[image_helper.php] resizeImage(): newHeight: ' . $newHeight);
    //log_message('debug','[image_helper.php] resizeImage(): imageType: ' . $imageType);

    if($imageType == IMAGETYPE_JPEG){
        $src = imagecreatefromjpeg($imgSrc);
    }elseif( $imageType == IMAGETYPE_GIF ) {
        $src = imagecreatefromgif($imgSrc);
    } elseif( $imageType == IMAGETYPE_PNG ) {
        $src = imagecreatefrompng($imgSrc);
    }else{
        throwException(new Exception("Image type is unknown."));
    }
    //log_message('debug','[image_helper.php] resizeImage(): image loaded.');

    $dst = imagecreatetruecolor($finalWidth, $newHeight);
    
    // Keep transparency
    if( $imageType == IMAGETYPE_PNG || $imageType == IMAGETYPE_GIF){
        $background = imagecolorallocate($dst , 0, 0, 0);
        // Removing the black from the placeholder
        imagecolortransparent($dst, $background);

        // Turning off alpha blending (to ensure alpha channel information
        // is preserved, rather than removed (blending with the rest of the
        // image in the form of black))
        imagealphablending($dst, false);

        // Turning on alpha channel information saving (to ensure the full range
        // of transparency is preserved)
        imagesavealpha($dst, true);
    }
    
    $result = imagecopyresampled($dst, $src, 0, 0, 0, 0, $finalWidth, $newHeight, $width, $height);
    if(! $result){
        //log_message('debug','[image_helper.php] resizeImage(): imagecopyresampled failed.');
        return false;
    }
    //log_message('debug','[image_helper.php] resizeImage(): imagecopyresampled done.');

    if($imageType == IMAGETYPE_JPEG){
        imagejpeg($dst, $imgDest);
    }elseif( $imageType == IMAGETYPE_GIF ) {
        imagegif($dst, $imgDest);
    } elseif( $imageType == IMAGETYPE_PNG ) {
        imagepng($dst, $imgDest);
    }
    //log_message('debug','[image_helper.php] resizeImage(): dest image saved as ' . $imgDest);

    return true;
}

/**
 * 'inputData' like 'data:image/png;base64,iVBORw0KG...' 
 */
function extractMetadata($inputData){
    if($inputData == "" || !str_starts_with($inputData, "data:")){
        return ["mime" => "", "data" => ""];
    }

    list($type, $rawData) = explode(',', substr($inputData, 5) );
    list($mime, $encoding) = explode(';', $type);
    
    if($encoding != "base64"){
        throwException(new Exception("Unknown encoding " . $encoding));
    }
    $data = base64_decode($rawData);
    return [
        "mime" => $mime, 
        "data" => $data
    ];
}

function manageFileUpload($data, $fieldName, $existingObject = null){
    //log_message('debug', "data[fieldName]=" . $data[$fieldName]);
    if($data[$fieldName] == "DELETE"){
        if($existingObject != null && $existingObject[$fieldName] != ""){
            // Remove existing file
            try{
                unlink(PUBLIC_PATH . 'uploads/' . $existingObject[$fieldName]);
            }catch(Exception $e){
                log_message('debug', 'file not found: '. PUBLIC_PATH . 'uploads/' . $existingObject[$fieldName]);
            }
            $data[$fieldName] = "";
        }
        return $data;
    }

    if($data[$fieldName] != ""){
        // There is a new file
        if($existingObject != null && $existingObject[$fieldName] != ""){
            // Remove existing file
            //log_message('debug', "Remove existing file");
            try{
                unlink(PUBLIC_PATH . 'uploads/' . $existingObject[$fieldName]);
            }catch(Exception $e){
                log_message('debug', 'file not found: '. PUBLIC_PATH . 'uploads/' . $existingObject[$fieldName]);
            }
        }
        // Extract metadata + bytes from data['preview']
        $metadata = extractMetadata($data[$fieldName]);
        //log_message('debug', "metadata=" . print_r($metadata, true));
        if($metadata["data"] == ""){
            // The file is not changed
            return $data;
        }
        // Save file with the good extension
        $preview_ext = Mimes::guessExtensionFromType($metadata["mime"]);
        //log_message('debug', "preview_ext=" . $preview_ext);
        if($preview_ext == ""){
            $preview_ext = substr($data[$fieldName], strrpos($data[$fieldName], ".") + 1);
            log_message('debug', "Mime type is unkwown " . $data[$fieldName] . " -- Guessed: " . $preview_ext);
        }
        $filename =  'content_' . $data['id'] . '_'.$fieldName.'-'.time().'.' . $preview_ext;
        file_put_contents(PUBLIC_PATH . 'uploads/' . $filename, $metadata["data"]);
        $data[$fieldName] = $filename;
        //log_message('debug', "filename=" . $filename);
    }else{
        // No new file
        $data[$fieldName] = "";
    }

    return $data;
}

?>