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

    /**
     * Relationship: Customer has many Orders
     */
    public function orders()
    {
        return $this->hasMany(Order::class, 'customer_id');
    }

    /**
     * Relationship: Customer has many OrderDetails
     */
    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'customer_id');
    }
}
