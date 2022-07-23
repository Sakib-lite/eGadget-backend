## For deploying backend in heroku extracted the server part from eGadget repository
Had Some issues in next-express custom server

[Here](https://github.com/Sakib-lite/eGadget/tree/main/server) you can see all the commits of backend from beginning

- API Design
  - REST API

- Database
  - Mongoose(NoSQL)

- Packages
  - ExpressJS
  - JWT Token
  - Mongo Sanitizer
  - Compression
  - Sharp
  - Multer
  - Stripe
  - Dotenv
  - Validator
  - Xss-Clean
  - Bcrypt
  - Nodemailer
  - Slugify
  - Morgan

----------------------------------------------------
## User

- Role
  - User(default)
  - Admin
  - Moderator

#### Routing Pattern
-POST  Signup            -/api/users/signup /
-GET   Login             -/api/users/login /
-POST  Forgot-Password   -/api/users/forgot-password /
-PATCH Reset-Password    -/api/users/reset-password /
-PATCH Change-Password   -/api/users/change-password   /
-PATCH Update User info  -/api/users/(id) /
-GET   Get Me            -/api/users/me /
-GET   Get All Users     -/api/users (Restricted Route) /

----------------------------------------------------
## Mobile

#### Routing Pattern
-POST   Create Mobile            -/api/product/mobile /
-GET    Get All Mobiles          -/api/product/mobile /
-GET    Get Mobile by slug       -/api/product/mobile/(slug) /
-PATCH  Update Mobile            -/api/product/mobile/(id) /
-Delete Delete Mobile            -/api/product/mobile/(id) (Restricted Route) /
-GET    Mobile Statistics        -/api/product/mobile/mobile-statistics (Restricted Route) /

----------------------------------------------------
## Laptop

#### Routing Pattern
-POST   Create Laptop            -/api/product/laptop  /
-GET    Get All Laptops          -/api/product/laptop /
-GET    Get Laptop by slug       -/api/product/laptop/(slug) /
-PATCH  Update Laptop            -/api/product/laptop/(id) /
-Delete Delete Laptop            -/api/product/laptop/(id) (Restricted Route) /
-GET    Laptop Statistics        -/api/product/laptop/laptop-statistics (Restricted Route) /

----------------------------------------------------
## Other Products

#### Routing Pattern
-POST   Create Product            -/api/product/other /
-GET    Get All Products          -/api/product/other /
-GET    Get Product by slug       -/api/product/other/(slug) /
-PATCH  Update Product            -/api/product/other/(id) /
-Delete Delete Product            -/api/product/other/(id) (Restricted Route) /
-GET    Product Statistics        -/api/product/other/other-statistics (Restricted Route) /

----------------------------------------------------
## Search Products

#### Routing Pattern

-GET    Search Products           -/api/search?name=iphone /

----------------------------------------------------
## Review Products

#### Routing Pattern
-POST   Create Review             -api/product/mobile/(id)/review  (nested route with merged params) (Proteceted Route) /
-GET    Get All Reviews           -/api/review (restricted route) /
-GET    Get Review by Id          -/api/review/(id) /
-PATCH  Update Review             -/api/review/(id) (Proteceted Route) /
-Delete Delete Review             -/api/review/(id) (Proteceted Route) /
-GET    Review Statistics         -/api/review/review-stats /


----------------------------------------------------
## Order Products

#### Routing Pattern

-GET    Get Checkout Session      -/api/order/checkout-session (Proteceted Route) /
-POST   Webhook Checkout          -/webhook-checkout (Proteceted Route) /

- API Documentation
  - [Postman](https://documenter.getpostman.com/view/19059263/UzXKWe4k) 