<?php
/*
 * Created by generator
 *
 */

/***************************************************************************
 * DO NOT MODIFY THIS FILE, IT IS GENERATED
 ***************************************************************************/

namespace App\Models;
use CodeIgniter\Model;

class ModuleModel extends Model {
	
    protected $table      = 'sc_module';
    protected $primaryKey = 'id';

    protected $useAutoIncrement = true;

    protected $returnType     = 'array';
    protected $useSoftDeletes = false;

    protected $allowedFields = [
	'id', // 
		'name', // 
		'visual', // 
		'order', // 
		'session_id', // 
	];
    public static $empty = [
	'id' => '',
		'name' => '',
		'visual' => '',
		'order' => '',
		'session_id' => '',        
    ];

	/***************************************************************************
	 * DO NOT MODIFY THIS FILE, IT IS GENERATED
	 ***************************************************************************/

}

?>
