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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('sku')->unique();
            $table->string('name');
            $table->decimal('price',10,2);
            $table->string('weight',10,2)->nullable();
            $table->text('description');
            $table->string('thumbnail');
            $table->string('images');
            $table->unsignedBigInteger('category');
            $table->integer('stock')->default(0);
            $table->timestamp('create_date')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
