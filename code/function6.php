<?php
    //return polygon of hospital distance
    $dbconn = pg_connect("host=localhost dbname=test user=postgres password=heslo")
    or die('Could not connect: ' . pg_last_error());

    $query = "WITH RECURSIVE t(n, geom) AS (";
    $query .= "SELECT 1, (SELECT ST_Buffer(CAST(ST_SetSRID(geometry, 4326) AS geography), 2000, 'quad_segs=8') FROM hospital_chapel_hill WHERE id = 1)";
    $query .= "UNION ALL ";
    $query .= "SELECT n+1, (SELECT ST_Buffer(CAST(ST_SetSRID(geometry, 4326) AS geography), n*2000, 'quad_segs=8') FROM hospital_chapel_hill) FROM t";
    $query .= ")";
    $query .= "SELECT jsonb_build_object('type','FeatureCollection','features', jsonb_agg(features.feature))FROM (SELECT jsonb_build_object('type','Feature','geometry', ST_AsGeoJSON(polygon)) AS feature FROM (SELECT ST_AsText(geom) as polygon FROM t LIMIT 10 ) inputs) features;";
    $tmp = pg_query($dbconn, $query);
    $tmp = pg_fetch_row($tmp);
    $tmp = preg_replace('/\\\\/', '', $tmp);
    $tmp = str_replace('"{', '{', $tmp);
    $data = str_replace('"}', '}', $tmp);

    echo json_encode($data[0]);
?>