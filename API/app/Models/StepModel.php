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

class StepModel extends Model {
	
    protected $table      = 'sc_step';
    protected $primaryKey = 'id';

    protected $useAutoIncrement = true;

    protected $returnType     = 'array';
    protected $useSoftDeletes = false;

    protected $allowedFields = [
	'id', // 
		'name', // 
		'duration', // 
		'visual', // 
		'description', // 
		'order', // 
		'module_id', // 
	];
    public static $empty = [
	'id' => '',
		'name' => '',
		'duration' => '',
		'visual' => '',
		'description' => '',
		'order' => '',
		'module_id' => '',        
    ];

	/***************************************************************************
	 * DO NOT MODIFY THIS FILE, IT IS GENERATED
	 ***************************************************************************/

}

?>
