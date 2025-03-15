Table users {
id string [pk]  
 email string
password string
username string
role string
avatar string
phone string
created_at datetime
updated_at datetime
}

Table main_categories {
id string [pk]  
 title string
description string
image string
slug string
}

Table sub_categories {
id string [pk]  
 title string
description string
image string
slug string
categoryId string
}

Table brands {
id string [pk]  
title string
logo string
description string
}

Table products {
id string [pk]
title string
price_default number
oldprice_default number
image string
description string
specification string  
 buyturn number //Stores the count of how many times the product has been purchased
stock_default number
brand_id string
sub_category_id string
created_at datetime
updated_at datetime
}

Ref: "sub_categories"."id" < "products"."sub_category_id"
Ref: "brands"."id" < "products"."brand_id"

Table banners {
id string [pk]
title string
image string
status boolean
description string
created_at datetime
updated_at datetime
}

Table banner_details {
id string [pk]
product_id string
banner_id string
created_at datetime
updated_at datetime
}
Ref: "products"."id" < "banner_details"."product_id"

Table feedbacks {
id string [pk]
product_id string
user_id string
star number
content string
created_at datetime
updated_at datetime
}
Ref: "products"."id" < "feedbacks"."product_id"
Ref: "users"."id" < "feedbacks"."user_id"

Table orders {
id string [pk]
user_id string
status boolean
note string
total number
created_at datetime
updated_at datetime
}
Ref: "users"."id" < "orders"."user_id"

Table order_details {
id string [pk]
order_id string
product_id string
price number
quantity number
created_at datetime
updated_at datetime
}

Ref: "orders"."id" < "order_details"."order_id"

Table news {
id string [pk]
title string
image string
content string
created_at datetime
updated_at datetime
}

Table news_details {
id int [pk]
product_id int
news_id int
created_at datetime
updated_at datetime
}
Ref: "news"."id" < "news_details"."news_id"
Ref: "products"."id" < "news_details"."product_id"
Ref: "products"."id" < "order_details"."product_id"

Ref: "main_categories"."id" < "sub_categories"."categoryId"
Ref: "banners"."id" < "banner_details"."banner_id"

Table variants {
id string [pk]
product_id string
attributes array
stock number
price number
created_at datetime
updated_at datetime

}

Table attributes {
id string [pk]
name string // Tên thuộc tính (VD: Màu sắc, Kích thước)
}

Table attribute_values {
id string [pk]
attributeId string
value string
}

Ref: "products"."id" < "variants"."product_id"

Ref: "attributes"."id" < "attribute_values"."attributeId"
