// for Pins
export var localPins;

// value
var lightGray = "#F2F2F2";
export var padding = 10;
export var height = 45;
export var height_label = 45;
export var width_label = 100;

// style
export var labelStyle = new Style( { font: "bold 20px", color: "black" } );
export var midStyle = new Style( { font: "bold 15px", color: "black" } );

// skin
export var whiteSkin = new Skin({ fill: "white" });
export var lightGraySkin = new Skin({ fill: lightGray });

// file i / o
var dir_dat = Files.documentsDirectory;
var dir_init = application.url;
var file_dat = "HoM.json";
var file_dir = "./files/";
var file_init = file_dir + "init_data.json";

function load_json(uri) {
	var json = Files.readJSON(uri);
	return json;
}

export function load_data() {
	var uri_dat = mergeURI(dir_dat, file_dat);
	var uri_init = mergeURI(dir_init, file_init);
	let info = Files.getInfo(uri_dat); // if the file exists or not
	var json;
   	if (info) {
    	trace("loaded data from " + uri_dat + "\n");
    	json = load_json(uri_dat);
    }
    else {
    	trace("loaded data from " + uri_init + "\n");
    	json = load_json(uri_init);
    }
	return json;
}

export function save_data(json_file) {
	var uri = mergeURI(dir_dat, file_dat);
	Files.writeJSON(uri, json_file);
}