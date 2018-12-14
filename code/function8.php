<?php
    //return neighborhoods polygons with accident_number
    $dbconn = pg_connect("host=localhost dbname=test user=postgres password=heslo")
                or die('Could not connect: ' . pg_last_error());

    $query = "SELECT jsonb_build_object('type','FeatureCollection','features', jsonb_agg(features.feature)) FROM ( SELECT jsonb_build_object('type','Feature','geometry',ST_AsGeoJSON(ST_AsText(wkb_geometry))::jsonb, 'properties', to_jsonb(inputs)- 'alt_city' - 'objectid' - 'org_name' - 'org_type' - 'alt_email' - 'alt_fname' - 'alt_lname' - 'alt_phone' - 'alt_state' - 'geo_shape' - 'prim_city' - 'prim_fname' - 'prim_email' - 'prim_lname' - 'prim_phone' - 'prim_state' - 'contactdate'
- 'alt_web_site' - 'alt_zip_code' - 'geo_point_2d' - 'prim_address' - 'wkb_geometry' - 'shape_starea'- 'ogc_fid' - 'prim_website' - 'prim_zip_code' - 'org_type_other' - 'shape_stlength' - 'alt_st_address' ) AS feature FROM (SELECT * FROM neighborhoods LIMIT 246) inputs) features;";
    $tmp = pg_query($dbconn, $query);
    $tmp = pg_fetch_row($tmp);
    $tmp = preg_replace('/\\\\/', '', $tmp);
    $tmp = str_replace('"{', '{', $tmp);
    $data = str_replace('"}', '}', $tmp);

    echo json_encode($data[0]);
?>