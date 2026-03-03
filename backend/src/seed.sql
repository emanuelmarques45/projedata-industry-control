BEGIN;

-- =========================
-- RESET DOS DADOS
-- =========================
TRUNCATE TABLE product_raw_materials RESTART IDENTITY CASCADE;
TRUNCATE TABLE products RESTART IDENTITY CASCADE;
TRUNCATE TABLE raw_materials RESTART IDENTITY CASCADE;

-- =========================
-- RAW MATERIALS
-- =========================
INSERT INTO raw_materials (code, name, stock_quantity) VALUES
('RM-001', 'Steel', 500),
('RM-002', 'Plastic', 200),
('RM-003', 'Rubber', 100),
('RM-004', 'Wood', 150),
('RM-005', 'Aluminum', 300);

-- =========================
-- PRODUCTS
-- =========================
INSERT INTO products (code, name, price) VALUES
('PR-001', 'Knife', 50.00),
('PR-002', 'Hammer', 80.00),
('PR-003', 'Screwdriver', 30.00),
('PR-004', 'Cutting Board', 45.00);

-- =========================
-- PRODUCT x RAW MATERIAL
-- =========================

-- Knife
INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity)
SELECT p.id, rm.id, q.required_quantity
FROM (
  VALUES
    ('PR-001', 'RM-001', 3),
    ('PR-001', 'RM-002', 1),
    ('PR-001', 'RM-003', 1)
) AS q(product_code, raw_code, required_quantity)
JOIN products p ON p.code = q.product_code
JOIN raw_materials rm ON rm.code = q.raw_code;

-- Hammer
INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity)
SELECT p.id, rm.id, q.required_quantity
FROM (
  VALUES
    ('PR-002', 'RM-001', 4),
    ('PR-002', 'RM-005', 2)
) AS q(product_code, raw_code, required_quantity)
JOIN products p ON p.code = q.product_code
JOIN raw_materials rm ON rm.code = q.raw_code;

-- Screwdriver
INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity)
SELECT p.id, rm.id, q.required_quantity
FROM (
  VALUES
    ('PR-003', 'RM-001', 2),
    ('PR-003', 'RM-002', 1)
) AS q(product_code, raw_code, required_quantity)
JOIN products p ON p.code = q.product_code
JOIN raw_materials rm ON rm.code = q.raw_code;

-- Cutting Board
INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity)
SELECT p.id, rm.id, q.required_quantity
FROM (
  VALUES
    ('PR-004', 'RM-004', 3)
) AS q(product_code, raw_code, required_quantity)
JOIN products p ON p.code = q.product_code
JOIN raw_materials rm ON rm.code = q.raw_code;

COMMIT;