<?php
namespace App\Controllers\Api\v2;
use App\Controllers\Api\v1\Session as V1Session;

class Session extends V1Session {

    protected function searchIndex($sortBy, $order, $page, $limit, $searchField, $searchValue){
        $user_id = 2; //= Pauline
        $this->model->builder()
            ->select('sc_session.*')
            ->join('sc_access', 'sc_access.session_id = sc_session.id')
            ->where('sc_access.user_id', $user_id)
            ->orderBy('sc_session.name', 'asc');

        $sessions = $this->model->get()->getResult();
        foreach($sessions as $session){
            $session->modules = $this->getModules($session->id);
        }
        $response = [
            'data' => $sessions
        ];
        return $this->respond($response);
    }

    private function getModules($session_id){
        $db = \Config\Database::connect();
        $query = $db->table('sc_module')
            ->select('sc_module.*')
            ->where('sc_module.session_id', $session_id)
            ->orderBy('sc_module.order', 'asc')
            ->get();
        $modules = $query->getResult();
        foreach($modules as $module){
            $module->steps = $this->getSteps($module->id);
        }
        return $modules;
    }

    private function getSteps($module_id){
        $db = \Config\Database::connect();
        $query = $db->table('sc_step')
            ->select('sc_step.*')
            ->where('sc_step.module_id', $module_id)
            ->orderBy('sc_step.order', 'asc')
            ->get();
        $steps = $query->getResult();
        return $steps;

    }
}