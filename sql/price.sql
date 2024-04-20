drop table price_data_process;
CREATE TABLE price_data_process (
	id BIGINT NOT NULL AUTO_INCREMENT,
    process_date INT NOT NULL,
    status VARCHAR(15) NOT NULL DEFAULT 'Initial',
    type VARCHAR(50) NOT NULL,
    created_date DATETIME DEFAULT NOW(),
    last_update_date DATETIME DEFAULT NOW() ON UPDATE NOW(),
    PRIMARY KEY (id)
);


drop table chain_link_price;
CREATE TABLE chain_link_price (
    id INT AUTO_INCREMENT PRIMARY KEY,
    price_name VARCHAR(500),
    price_desc VARCHAR(100),
    price_date BIGINT,
    decimals INT,
    round_phaseId INT,
    round_roundId INT,
    round_answer BIGINT,
    round_timestamp BIGINT,
    round_date timestamp 
);
drop table chain_link_eth_price;
CREATE TABLE chain_link_eth_price (
	id BIGINT NOT NULL AUTO_INCREMENT,
	price_date INT NOT NULL,                    -- Date of the price data
    price DECIMAL(10,2),          -- Latest price of Ethereum
    open DECIMAL(10,2),           -- Opening price of Ethereum
    high DECIMAL(10,2),           -- Highest price of Ethereum during the day
    low DECIMAL(10,2),            -- Lowest price of Ethereum during the day
    close DECIMAL(10,2),           -- Opening price of Ethereum
    total_volume VARCHAR(100),        -- Volume in thousands (K) for readability
    change_percentage VARCHAR(100),  -- Daily percentage change in price
	PRIMARY KEY (id)
);

drop table coingecko_eth_price;
CREATE TABLE coingecko_eth_price (
	id BIGINT NOT NULL AUTO_INCREMENT,
    price_date INT NOT NULL,
	price DECIMAL(10,2),       -- The price of Ethereum at the snapshot
    market_cap VARCHAR(100),   -- Market capitalization
    total_volume VARCHAR(100),  -- Total volume of transactions
    PRIMARY KEY (id)
);

drop table binance_eth_price;
CREATE TABLE binance_eth_price (
	id BIGINT NOT NULL AUTO_INCREMENT,
	price_date INT NOT NULL,                    -- Date of the price data
    price DECIMAL(10,2),          -- Latest price of Ethereum
    open DECIMAL(10,2),           -- Opening price of Ethereum
    high DECIMAL(10,2),           -- Highest price of Ethereum during the day
    low DECIMAL(10,2),            -- Lowest price of Ethereum during the day
    close DECIMAL(10,2),           -- Opening price of Ethereum
    total_volume VARCHAR(100),        -- Volume in thousands (K) for readability
    change_percentage VARCHAR(100),  -- Daily percentage change in price
	PRIMARY KEY (id)
);


drop table coinmarketcap_eth_price;
CREATE TABLE coinmarketcap_eth_price (
	id BIGINT NOT NULL AUTO_INCREMENT,
	price_date INT NOT NULL,                    -- Date of the price data
    price DECIMAL(10,2),          -- Latest price of Ethereum
    open DECIMAL(10,2),           -- Opening price of Ethereum
    high DECIMAL(10,2),           -- Highest price of Ethereum during the day
    low DECIMAL(10,2),            -- Lowest price of Ethereum during the day
    close DECIMAL(10,2),           -- Opening price of Ethereum
    total_volume VARCHAR(100),            -- Volume in thousands (K) for readability
    change_percentage VARCHAR(100),  -- Daily percentage change in price
	PRIMARY KEY (id)
);

drop table eth_price_summary;
CREATE TABLE eth_price_summary (
	id BIGINT NOT NULL AUTO_INCREMENT,
    source VARCHAR(50) NOT NULL,
	price_date INT NOT NULL,                    -- Date of the price data
    price DECIMAL(10,2)  NOT NULL default 0.00,          -- Latest price of Ethereum
    open DECIMAL(10,2),           -- Opening price of Ethereum
    high DECIMAL(10,2),           -- Highest price of Ethereum during the day
    low DECIMAL(10,2),            -- Lowest price of Ethereum during the day
    close DECIMAL(10,2),           -- Opening price of Ethereum
    total_volume VARCHAR(100),           -- Volume in thousands (K) for readability
    change_percentage VARCHAR(100),   -- Daily percentage change in price
	PRIMARY KEY (id)
);

select * from binance_eth_price;
select count(*), max(price_date), min(price_date) from binance_eth_price;
select * from coinmarkercap_eth_price;
select count(*), max(price_date), min(price_date) from coinmarkercap_eth_price;

-- migrate chain_link_price table data to chain_link_eth_price
INSERT INTO chain_link_eth_price (price_date, price, open, high, low, close)
SELECT 
    clp.price_date AS price_date,
    ROUND(AVG(round_answer / 100000000), 2) AS price,
    (SELECT ROUND(round_answer / 100000000, 2)
     FROM chain_link_price AS sub
     WHERE sub.price_date = clp.price_date
     AND sub.round_date = (SELECT MIN(round_date)
                           FROM chain_link_price
                           WHERE price_date = sub.price_date)) AS open,
    ROUND(MAX(round_answer / 100000000), 2) AS high,
    ROUND(MIN(round_answer / 100000000), 2) AS low,
    (SELECT ROUND(round_answer / 100000000, 2)
     FROM chain_link_price AS sub
     WHERE sub.price_date = clp.price_date
     AND sub.round_date = (SELECT MAX(round_date)
                           FROM chain_link_price
                           WHERE price_date = sub.price_date)) AS close
FROM 
    chain_link_price AS clp
GROUP BY
    clp.price_date;


-- migrate chain_link_eth_price table data to eth_price_summary

INSERT INTO eth_price_summary (source,price_date,price,open,high,low,close)
SELECT 'CHAINLINK' AS source, price_date, price,open, high,low,close FROM chain_link_eth_price;

-- migrate binance_eth_price table data to eth_price_summary
INSERT INTO eth_price_summary (source,price_date,price,open,high,low,close, total_volume, change_percentage)
SELECT 'BIAANCE' AS source, price_date, price,open, high,low,close, total_volume, change_percentage FROM binance_eth_price;

-- migrate coinmarketcap_eth_price table data to eth_price_summary
INSERT INTO eth_price_summary (source,price_date,price,open,high,low,close, total_volume, change_percentage)
SELECT 'COINMARKETCAP' AS source, price_date, price,open, high,low,close, total_volume, change_percentage FROM coinmarketcap_eth_price;

-- migrate coingecko_eth_price table data to eth_price_summary
INSERT INTO eth_price_summary (source,price_date,price,total_volume)
SELECT 'COINGECKO' AS source, price_date, price,total_volume FROM coingecko_eth_price;

-- check each source price records
select count(*), source, max(price_date), min(price_date) from eth_price_summary group by source;
