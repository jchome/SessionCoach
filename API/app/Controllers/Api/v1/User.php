<?php
/*
 * Created by generator
 * 
 */
namespace App\Controllers\Api\v1;
use App\Controllers\Api\SecuredResourceController;

class User extends SecuredResourceController {

    protected $modelName = 'App\Models\UserModel';
    protected $format    = 'json';

    /**
     * Get all objects
     * 
     * GET /api/v1/users/
     * 
     */
    public function index(){
        $sortBy = $this->request->getGet('sort_by') ?? 'id'; // Par défaut, trier par ID
        $order  = $this->request->getGet('order') ?? 'asc';  // Ordre par défaut : ascendant
        if (!in_array($order, ['asc', 'desc'])) {
            return $this->fail('Invalid order parameter. Use "asc" or "desc".');
        }
        $page   = $this->request->getGet('page') ?? 1;       // Numéro de la page (1 par défaut)
        $limit  = $this->request->getGet('limit') ?? 10;     // Limite d'éléments par page (10 par défaut)
        $searchField = $this->request->getGet('search_on');
        $searchValue = $this->request->getGet('search_value');

        return $this->searchIndex($sortBy, $order, $page, $limit, $searchField, $searchValue);
    }

    /**
     * Get one object by its id
     * 
     * GET /api/v1/users/1
     * 
     */
    public function show($id = null){
        $object = $this->model->find($id);
        if (!$object) {
            return $this->failNotFound('Object not found');
        }
        return $this->respond($object);
    }


    /**
     * POST /api/v1/users/
     * body: {...}
     */
    public function create(){
        $data = $this->request->getJSON(true);
        
        if (!$this->validate([
                'name' => 'required',
                'login' => 'required',
                'password' => 'required',
        ])) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);

        helper(['image', 'database']);
        $data['id'] = empty($data['id']) ? null : intval($data['id']);
        $existingObject = $this->createData($data);
        $data['id'] = $existingObject['id'];

        $this->model->update($data['id'], $data);
        return $this->respondCreated($data);
    }
    
    /**
     * PUT /api/v1/users/{id}
     * body: {...}
     */
    public function update($id = null){
        $data = $this->request->getJSON(true);
        if (!$this->validate([
                'name' => 'required',
                'login' => 'required',
        ])) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $existingObject = $this->model->find($id);
        if (!$existingObject) {
            return $this->failNotFound('Object not found');
        }

        helper(['image', 'database']);
        $data['id'] = empty($data['id']) ? null : intval($data['id']);
        if(empty($data['password'])){
            unset($data['password']);
        }else{
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        return $this->updateData($id, $data);
    }

    
    /**
     * DELETE /api/v1/users/
     * 
     */
    public function delete($id = null){
        $object = $this->model->find($id);
        if (!$object) {
            return $this->failNotFound('Object not found');
        }

        $this->model->delete($id);
        return $this->respondDeleted($object);
    }


    /* -------------------------------------------------------- */
    /* -- Functions to override -- */
    /* -------------------------------------------------------- */

    protected function searchIndex($sortBy, $order, $page, $limit, $searchField, $searchValue){
        if (!empty($searchField) && !empty($searchValue)) {
            $items = $this->model->asObject()
                ->orderBy($sortBy, $order)
                ->like($searchField, $searchValue)
                ->paginate($limit, 'default', $page);
        }else{
            $items = $this->model->asObject()
                ->orderBy($sortBy, $order)
                ->paginate($limit, 'default', $page);
        }

        // Convert types for a better json format
        foreach($items as $item){
            $item->id = intval( $item->id );
        }

        $response = [
            'data' => $items,
            'pager' => $this->model->pager->getDetails(),
        ];
        return $this->respond($response);
    }


    protected function createData($data){
        $this->model->save($data);
        $data['id'] = $this->model->insertID();
        return $data;
    }

    protected function updateData($id, $data){
        $this->model->update($id, $data);
        return $this->respond($data);
    }


}
