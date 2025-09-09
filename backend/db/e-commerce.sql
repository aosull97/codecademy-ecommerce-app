CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "email" varchar(100) NOT NULL UNIQUE,
  "full_name" varchar(100),
  "pwd_hash" varchar(100),
);

CREATE TABLE "orders" (
  "id" SERIAL PRIMARY KEY,
  "status" varchar(100),
  "order_price" decimal(10,2),
  "order" varchar NOT NULL,
  "email", varchar(100)  NOT NULL,
  "created_at" date DEFAULT (now()) NOT NULL,
  
);

CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar(100) NOT NULL,
  "price" decimal(10,2) NOT NULL,
  "description" varchar,
  "category" varchar(100),
  "image_url" varchar(255),
  "status" varchar(100),
  "color" text,
  "extra_details" text,
);

CREATE TABLE "carts" (
  "id" SERIAL PRIMARY KEY,
  "product" TEXT,
  "price" DECIMAL(10, 2),
  "img" TEXT,
  "quantity" INTEGER,
  "email" VARCHAR(100),
  UNIQUE(product, email)
);


CREATE TABLE "wishlist" (
  "id" SERIAL PRIMARY KEY,
  "product" TEXT,
  "price" DECIMAL(10, 2),
  "img" TEXT,
  "email" VARCHAR(100),
  UNIQUE(product, email)
)

ALTER TABLE "orders" ADD FOREIGN KEY ("email") REFERENCES "users" ("email");


