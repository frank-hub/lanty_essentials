<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'email', 'password', 'full_name', 'billing_address',
        'default_shipping_address', 'country', 'phone'
    ];

    protected $hidden  = ['password'];

    public function orders(){
        return $this->hasMany(Order::class);
    }
}
