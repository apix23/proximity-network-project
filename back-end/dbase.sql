
drop table if exists stores_locations;
drop table if exists products;
drop table if exists stores;
drop table if exists stores_authentications;

 create table stores_authentications(
 	id						serial primary key,
 	store_manager           varchar(50) not null, 
    manager_email	        varchar(120) not null, 
    password 		        varchar(100) not null
    );
create table stores (
    id                  int PRIMARY key,
 	foreign key(id)     references stores_authentications(id),
    name                varchar(50) not null,
    store_description   varchar(255), 
    store_category      varchar(50) ,
    web_page            varchar(100), 
    store_email         varchar(120) not null,
    phone_number        varchar(20), 
    image 			    varchar(255)
);
create table stores_locations(
	store_id		      int, 
	address               VARCHAR(120),
    city                  VARCHAR(30),
    postcode              VARCHAR(12),
    country               VARCHAR(20), 
    foreign key(store_id) references stores(id)
 );
create table products (
    id                    serial primary key,
    store_id              int,
    foreign key(store_id) REFERENCES stores(id),
    product_type          varchar(50) not null, 
    brand                 varchar(30) not null, 
    category              varchar(50) not null,
    product_description   varchar(255),
    unit                  varchar(20), 
    price                 numeric(4,2), 
    producer              varchar(50), 
    origin                varchar(50),
    product_image		  varchar(100)
);

insert into stores_authentications ( store_manager, manager_email, password)
		values ( 'Juan mamon', 'calinga@gmail.com', 'pipo');
	
insert into stores (id, name, store_description, store_category, web_page,  store_email, phone_number) 
        values (1,'Ecoalimentaria', '', 'alimentación' , 'https://www.ecoalimentaria.es/es/', 'eco@mail.com', '632347635');


insert into stores_locations (store_id, address, city, postcode, country) 
        values (1, 'chulini 32', 'tarragona', '080231' , 'Spain'); 
   
   

INSERT INTO products (store_id, product_type, brand, category, product_description, unit, price, producer, origin) 
		VALUES(1, 'nuez', 'pipon', 'frutos secos', '', '1', '16.10', 'sequia', 'vilaller');   