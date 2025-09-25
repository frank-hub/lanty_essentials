<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('categoty',function(){
    return Inertia::render('category');
})->name('category');

Route::get('product_details',function(){
    return Inertia::render('product_details');
});

Route::get('cart',function(){
    return Inertia::render('cart');
});
Route::get('checkout',function(){
    return Inertia::render('checkout');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
