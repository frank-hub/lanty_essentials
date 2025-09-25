<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
                $table->foreignId('customer_id')->constrained()->onDelete('cascade');
                $table->decimal('amount', 10, 2);
                $table->string('shipping_address');
                $table->string('order_address');
                $table->string('order_email');
                $table->timestamp('order_date')->useCurrent();
                $table->enum('order_status', ['pending', 'processing', 'completed', 'cancelled'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
