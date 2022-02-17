CREATE OR REPLACE FUNCTION updateIfChanged(newValue ANYELEMENT, field ANYELEMENT, allowNull BOOLEAN DEFAULT FALSE) RETURNS ANYELEMENT AS
$$
BEGIN
    IF
        (allowNull = FALSE AND newValue IS NULL) OR
        LOWER(newValue::varchar) = 'null' OR
        LOWER(newValue::varchar) = 'undefined' OR
        length(LOWER(newValue::varchar)) = 0
    THEN
        RETURN field;
    ELSE
        RETURN newValue;
    END IF;
END;
$$ LANGUAGE plpgsql;