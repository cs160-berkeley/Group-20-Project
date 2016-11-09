/*
 * the global settings that are:
 *	1. not relying on any page
 *	2. fixed parameters
 *	3. might be frequently changed but don't want to re-coding
 * are saved here
 */


// temporary screen
export var TMP_SCREEN;
// parameters
export var welcome_img_padding = 45;
export var welcome_img_size = 90;
export var welcome_button_height = 36;
export var home_list_item_height = 60;
export var home_list_item_padding = 10;
export var home_list_tag_width = 200;
export var home_list_topbar_height = 60;
export var home_list_topbar_img_size = 20;
export var device_list_item_padding = 10;
export var device_list_topbar_height = 60;
export var device_list_topbar_width = 250;
export var device_list_setting_height = 20;
export var device_image_size = 100;
export var bottom_bar_padding = 3;
export var bottom_bar_img_size = 30;//20;//36;
export var BAR_HEIGHT_TOP = 0; // 25;
export var BAR_HEIGHT_BOTTOM = 45;
// directories
var img_dir = "./assets/";
export var img_SwitchBGD = img_dir + "switchBackground.png";
export var img_SwitchFGD = img_dir + "switchForeground.png";
export var img_logo = img_dir + "Group.png";
export var img_plus = img_dir + "add.png";
export var img_off = img_dir +  "button_off.png";
export var img_on = img_dir +  "button_on.png";
export var img_lock = img_dir +  "button_lock.png";
export var img_unlock = img_dir +  "button_unlock.png";
var file_dir = "./files/";
export var file_init = file_dir + "init_data.json";
export var img_home = {
	activated: img_dir + "home.png",
	idel: img_dir + "idel_home.png"
};
export var img_fave = {
	activated: img_dir + "favorites.png",
	idel: img_dir + "idel_favorites.png"
};
export var img_note = {
	activated: img_dir + "notifications.png",
	idel: img_dir + "idel_notifications.png"
};
export var img_sett = {
	activated: img_dir + "settings.png",
	idel: img_dir + "idel_settings.png"
};
// uri
export var on_uri = mergeURI(application.url, img_on);
export var off_uri = mergeURI(application.url, img_off);
export var lock_uri = mergeURI(application.url, img_lock);
export var unlock_uri = mergeURI(application.url, img_unlock);
// connection settings
export var DeviceSimulator = "portdevice.project.kinoma.marvell.com";
export var deviceURL = "";
// colors
export var lightGray = "#F2F2F2";
export var lightGray2 = "#BDBDBD";
export var darkGray2 = "#4F4F4F";
export var darkGray = "#202020";
export var midGray = "#E0E0E0";
// skins
export var whiteSkin = new Skin({ fill: "white" });
export var lightGraySkin = new Skin({ fill: lightGray });
export var darkGraySkin = new Skin({ fill: darkGray });
export var midGraySkin = new Skin({ fill: midGray });
// text styles
export var titleText = new Style({ font: "bold 18px", color: darkGray });
export var buttonText = new Style({ font: "bold 18px", color: "#DDDDDD" });
export var hintText = new Style({ font: "10px", color: darkGray });
export var midText = new Style({ font: "bold 20px", color: darkGray });
export var smallText = new Style({ font: "15px", color: "black" });
export var largeText = new Style({ font: "bold 30px", color: darkGray });
export var lightGraySmallText = new Style({ font: "bold 15px", color: lightGray2 });
export var darkGraySmallText = new Style({ font: "bold 15px", color: darkGray2 });
export var darkGrayMidText = new Style({ font: "bold 20px", color: darkGray2 });
export var darkGrayMidText_thin = new Style({ font: "18px", color: darkGray2 });

// file io functions
export function load_json(uri) {
    //var uri = mergeURI(dir, filepath);
	var json = Files.readJSON(uri);
	return json;
}
export function save_data(json_file) {
	var dir = Files.documentsDirectory; // not working with application.url
	var uri = mergeURI(dir, file_dat);
	Files.writeJSON(uri, json_file);
}

var file_dat = "HoM.json";
export function load_data() {
	var dir_dat = Files.documentsDirectory;
	var dir_init = application.url;
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

// data
export var DATA;
var file_new = file_dir + "devices.json";
export var newDevicesFile = mergeURI(application.url, file_new);