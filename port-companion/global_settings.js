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
export var welcome_img_padding = 50;
export var welcome_img_size = 270;
export var welcome_button_height = 36;
export var home_list_item_height = 70;
export var home_list_item_padding_h = 5;
export var home_list_item_padding_w = 20;
export var home_list_tag_width = 200;
export var home_list_topbar_height = 60;
export var home_list_topbar_img_size = 25;
export var favorites_list_item_height = 70;
export var favorites_list_item_padding_h = 5;
export var favorites_list_item_padding_w = 20;
export var favorites_list_tag_width = 200;
export var favorites_list_topbar_height = 60;
export var favorites_list_topbar_img_size = 25;
export var device_list_item_padding = 5;
export var device_list_item_padding_h = 5;
export var device_list_item_padding_w = 20;
export var device_list_topbar_height = 70;
export var device_list_topbar_width = 250;
export var device_list_setting_height = 20;
export var device_image_size = 100;
export var bottom_bar_padding = 5;
export var bottom_bar_img_size = 30;//20;//36;
export var BAR_HEIGHT_TOP = 0; // 25;
export var BAR_HEIGHT_BOTTOM = 45;
// directories
var img_dir = "./assets/";
export var img_SwitchBGD = img_dir + "switchBackground.png";
export var img_SwitchFGD = img_dir + "switchForeground.png";
export var img_logo = img_dir + "logo.png";
export var img_plus = img_dir + "plus.png";
export var img_off = img_dir +  "buttonOff.png";
export var img_on = img_dir +  "buttonOn.png";
export var img_lock = img_dir +  "lockOn.png";
export var img_unlock = img_dir +  "lockOff.png";
var file_dir = "./files/";
export var file_init = file_dir + "init_data.json";
export var img_home = {
	activated: img_dir + "home-on.png",
	idel: img_dir + "home-off.png"
};
export var img_fave = {
	activated: img_dir + "favorites-on.png",
	idel: img_dir + "favorites-off.png"
};
export var img_note = {
	activated: img_dir + "notifs-on.png",
	idel: img_dir + "notifs-off.png"
};
export var img_sett = {
	activated: img_dir + "settings-on.png",
	idel: img_dir + "settings-off.png"
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
//var lightGray = "#F2F2F2";
var lightGray = "#F5F8FA";
var lightGray2 = "#BDBDBD";
var darkGray2 = "#4F4F4F";
var darkGray = "#202020";
var midGray = "#E0E0E0";
var red = "#F16373";
var blue = "#0CBBF7";
var white = "#ffffff";
var whiteTrans = "#ccffffff";
var green = "#92E1E0";

// skins
var whiteSkin = new Skin({ fill: "white" });
var redSkin = new Skin({ fill: red });
var blueSkin = new Skin({ fill: blue });
var greenSkin = new Skin({ fill: green });
var lightGraySkin = new Skin({ fill: lightGray });
var darkGraySkin = new Skin({ fill: darkGray });
var midGraySkin = new Skin({ fill: midGray });
// skins exported
export var skins = {
	//navbar: lightGraySkin,
	navbar: whiteSkin,
	background: {
		welcome: lightGraySkin,
		home: lightGraySkin,
		favorites: lightGraySkin,
		search_device: lightGraySkin,
		add_device: lightGraySkin,
		device: whiteSkin, //lightGraySkin,
		timing: whiteSkin,
	},
	foreground: {
		welcome: whiteSkin,
		home: whiteSkin,
		favorites: whiteSkin,
		search_device: whiteSkin,
		device: lightGraySkin,
		deviceTitle: blueSkin,
	},
	highlight: {
		search_device: blueSkin,
	}
};
// text styles
var titleText = new Style({ font: "bold 18px Roboto", color: darkGray });
var buttonText = new Style({ font: "bold 18px Roboto", color: white });
var hintText = new Style({ font: "10px Roboto", color: darkGray });
var midText = new Style({ font: "bold 20px Roboto", color: darkGray, horizontal: "left" });
var smallText = new Style({ font: "15px Roboto", color: "black", horizontal: "left" });
var largeText = new Style({ font: "bold 30px Roboto", color: darkGray });
var largeWhiteText = new Style({ font: "bold 30px Roboto", color: white });
var lightGraySmallText = new Style({ font: "bold 15px Roboto", color: lightGray2 });
var darkGraySmallText = new Style({ font: "bold 15px Roboto", color: darkGray2 });
var transSmallText = new Style({ font: "bold 15px Roboto", color: whiteTrans });
var darkGrayMidText = new Style({ font: "bold 20px Roboto", color: darkGray2, horizontal: "left" });
var darkGrayMidText_thin = new Style({ font: "18px Roboto", color: darkGray2,horizontal: "left" });
// exported text styles
export var texts = {
	welcome: {
		title: titleText,
		button: buttonText,
	},
	home: {
		title: largeText,
		navhint: hintText,
		content: midText,
		small: smallText,
	},
	favorites: {
		title: largeText,
		navhint: hintText,
		content: midText,
		small: smallText,
	},
	search_device: {
		name: midText,
		title: midText,
		topbutton: lightGraySmallText,
		darkGraySmallText,
	},
	add_device: {
		title: largeWhiteText,
		topbutton: transSmallText,
		content: darkGrayMidText_thin,
	},
	device: {
		title: largeText,
		subtitle: darkGrayMidText,
		content: darkGrayMidText_thin,
		topbutton: darkGraySmallText,
	},
	timing: {
		title: largeText,		darkGrayMidText,
		topbutton: darkGraySmallText,		content: darkGrayMidText_thin,
	}
}

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

export function synch_data() {
	if (deviceURL != "") {
		new Message(deviceURL + "update").invoke(Message.JSON).then(json => { 
			trace(json.success? "successfully updated hardware\n": "failed to update hardware\n");
		});
	}
}

// data
export var DATA;
var file_new = file_dir + "devices.json";
export var newDevicesFile = mergeURI(application.url, file_new);