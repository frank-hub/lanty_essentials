<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;

Route::get('/', [WelcomeController::class, 'index'])->name('home');



Route::prefix('cart')->name('cart.')->group(function () {
    Route::get('/', [CartController::class, 'index'])->name('index');
    Route::post('/add', [CartController::class, 'add'])->name('add');
    Route::patch('/{cartItem}', [CartController::class, 'update'])->name('update');
    Route::delete('/{cartItem}', [CartController::class, 'remove'])->name('remove');
    Route::delete('/', [CartController::class, 'clear'])->name('clear');
    Route::get('/count', [CartController::class, 'count'])->name('count');
});

Route::get('category',function(){
    return Inertia::render('category');
})->name('category');

Route::get('product_details/{id}',[WelcomeController::class, 'show'])->name('product_details');


Route::get('checkout',[CheckoutController::class, 'index'])->name('checkout');
Route::post('/checkout', [CheckoutController::class, 'store']);
Route::get('/checkout', [CheckoutController::class, 'index']);
Route::get('/checkout/success/{orderId}', [CheckoutController::class, 'success']);

Route::get('orders',function(){
    return Inertia::render('admin/orders');
});

Route::middleware(['auth', 'verified'])->group(function () {


    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/products', [ProductsController::class, 'index'])->name('products');

    Route::get('add_product',function(){
        return Inertia::render('admin/addProducts');
    });

    Route::post('/add_product', [ProductsController::class, 'store'])->name('add_product');

});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
