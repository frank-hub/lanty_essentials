<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\CategoryController;


Route::get('/', [WelcomeController::class, 'index'])->name('home');



Route::prefix('cart')->name('cart.')->group(function () {
    Route::get('/', [CartController::class, 'index'])->name('index');
    Route::post('/add', [CartController::class, 'add'])->name('add');
    Route::patch('/{cartItem}', [CartController::class, 'update'])->name('update');
    Route::delete('/{cartItem}', [CartController::class, 'remove'])->name('remove');
    Route::delete('/', [CartController::class, 'clear'])->name('clear');
    Route::get('/count', [CartController::class, 'count'])->name('count');
});

Route::prefix('category')->group(function () {
    Route::get('/product/{laundry}', [CategoryController::class, 'cat'])->name('category.laundry');
    Route::get('/product/{glass_jar}', [CategoryController::class, 'cat'])->name('category.glass_jar');
    Route::get('/product/{home}', [CategoryController::class, 'cat'])->name('category.home');
    Route::get('/product/{washing_machines}', [CategoryController::class, 'cat'])->name('category.washing_machines');
});

Route::get('shop',[WelcomeController::class, 'shop'])->name('shop');

Route::get('product_details/{id}',[WelcomeController::class, 'show'])->name('product_details');


Route::get('checkout',[CheckoutController::class, 'index'])->name('checkout');
Route::post('/checkout', [CheckoutController::class, 'store']);
Route::get('/checkout', [CheckoutController::class, 'index']);
Route::get('/checkout/success/{orderId}', [CheckoutController::class, 'success']);

Route::get('orders',[OrderController::class, 'index'])->name('orders')  ;
Route::put('admin/orders/{orderId}/status',[OrderController::class, 'updateStatus'])->name('updateStatus');

Route::prefix('admin/customers')->group(function () {
    Route::get('/', [CustomerController::class, 'index']);
    Route::get('{customerId}', [CustomerController::class, 'show']);
    Route::put('{customerId}', [CustomerController::class, 'update']);
    Route::delete('{customerId}', [CustomerController::class, 'destroy']);

    Route::post('filter', [CustomerController::class, 'filter']);
    Route::get('statistics', [CustomerController::class, 'statistics']);
    Route::post('export', [CustomerController::class, 'export']);
    Route::post('{customerId}/send-email', [CustomerController::class, 'sendEmail']);
    Route::get('{customerId}/tier', [CustomerController::class, 'getTier']);
    Route::get('{customerId}/orders', [CustomerController::class, 'orderHistory']);
    Route::post('bulk-update', [CustomerController::class, 'bulkUpdate']);
    Route::post('report', [CustomerController::class, 'report']);
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
    Route::get('/edit_product/{id}', [ProductsController::class, 'edit'])->name('edit_product');
    Route::post('/update_product/{id}', [ProductsController::class, 'update'])->name('update_product');
    Route::delete('/delete_product/{id}', [ProductsController::class, 'destroy'])->name('delete_product');

    // Route::get('inventory',[InventoryController::class, 'index'])->name('inventory');
    Route::get('/sms/bulk', [WelcomeController::class, 'sendBulk']);


});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
