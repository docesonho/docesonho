-- Primeiro, vamos alterar a tabela products para ter a estrutura correta
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id),
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Agora vamos copiar os dados da coluna category para category_id
-- Primeiro, precisamos criar uma função para fazer essa migração
CREATE OR REPLACE FUNCTION migrate_categories() RETURNS void AS $$
DECLARE
  product_record RECORD;
  category_id UUID;
BEGIN
  FOR product_record IN SELECT * FROM products LOOP
    -- Encontra ou cria a categoria
    SELECT id INTO category_id FROM categories WHERE name = product_record.category;
    
    IF category_id IS NULL THEN
      INSERT INTO categories (name, slug, active, order_index)
      VALUES (product_record.category, lower(replace(product_record.category, ' ', '-')), true, 0)
      RETURNING id INTO category_id;
    END IF;
    
    -- Atualiza o produto com o novo category_id
    UPDATE products 
    SET category_id = category_id
    WHERE id = product_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Executa a migração
SELECT migrate_categories();

-- Remove a coluna antiga category após a migração
ALTER TABLE products DROP COLUMN IF EXISTS category;

-- Adiciona a constraint NOT NULL após a migração
ALTER TABLE products ALTER COLUMN category_id SET NOT NULL; 