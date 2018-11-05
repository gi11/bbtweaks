// ==UserScript==
// @name         bbtweaks_0.2
// @namespace    bbtweaks
// @version      0.2
// @description  some modifications for blackboard site
// @author       gill
// @match        https://blackboard.au.dk/webapps/*
// @include      https://blackboard.au.dk/webapps/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @homepage     https://github.com/gi11/bbtweaks
// ==/UserScript==

(function() {
    'use strict';
     window.addEventListener('load', function() {
         initSettings();
         courses = getCourses();
         refreshSavedSideMenuItems();
         extraMenuButtons();
         setSelectedMenuItemColor("#CCCCCC");
     }, false);
})();

var courses = [];
var coursecount = 10;

function initSettings()
{
    var sidemenu_conf = {'sidemenu_highlight_enabled' : {'label': 'Highlight current page in side menu', 'type': 'checkbox', 'default': true, 'section': ['Side Menu', '']}};
    var topmenu_conf = {'topmenu_extrabuttons_enabled' : {'label': 'Enable extra course buttons in top menu', 'type': 'checkbox', 'default': true, 'section': ['Top Menu', '']}};

    var c1 = initCourse(1, "_118000_1", 'DAB', 'Databaser', true);
    var c2 = initCourse(2, "_118001_1", 'SWT', 'Software Test', true);
    var c3 = initCourse(3, "_118002_1", 'SWD', 'Software Design', true);
    var c4 = initCourse(4, "_118005_1", 'IKN', 'Introduktion til kommunikationsnetværk', true);
    var c5 = initCourse(5, "_117999_1", 'GUI', 'GUI Programmering', true);
    var c6 = initCourse(6, "_118003_1", 'PRJ4', 'Semesterprojekt 4', true);
    var c7 = initCourse(7, "_117965_1", 'PR1', 'Praktikforberedelse', true);
    var c8 = initCourse(8, "1234565", 'I', 'Navn', false);
    var c9 = initCourse(9, "1234565", 'C', 'Navn', false);
    var c10 = initCourse(10, "1234565", 'S', 'Navn', false);

    var fields = Object.assign({}, sidemenu_conf, topmenu_conf, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10);
    var css = configCss();
    GM_config.init(
    {
        'id': 'bbconfig',
        'title': 'bbtweaks Settings',
        'fields': fields, // Fields object
        'css': css
    });
}

function initCourse(num, id, inits, name, enabled) {
    var f = {};
    f["course" + num + "_enabled"]  = {'label': 'Enabled', 'type': 'checkbox', 'default': enabled, 'section': ['', 'Course ' + num]};
    f["course" + num + "_inits"]    = {'label': 'Course Initials', 'type': 'text', 'default': inits};
    f["course" + num + "_id"]       = {'label': 'Course ID', 'type': 'text', 'default': id};
    f["course" + num + "_name"]     = {'label': 'Course Name', 'type': 'text', 'default': name};
    f["course" + num + "_subpages"] = {'label': 'Subpages JSON', 'type': 'textarea', 'default': JSON.stringify([{'name':'You need to visit the page once and reload before this works','url':'#'}])};
    return f;
}

function configCss(){
    var body = '#bbconfig {overflow: scroll;}';
    var container = '#bbconfig_wrapper {display: flex; flex-direction: row; flex-wrap: wrap;}';

    var title = '#bbconfig_header {flex: 1; order: -2; text-align: left !important; margin: 16px 16px 16px 16px !important;}';
    var btn_container = '#bbconfig_buttons_holder {flex: 0 0 200px; order: -1;}';

    var section_container = '#bbconfig .section_header_holder {display: flex; flex-direction: row; flex-wrap: wrap; flex: 0 0 100%;}';
    var section_header = '#bbconfig .section_header {display: flex; flex: 0 0 100%;}';
    var section_desc = '#bbconfig .section_desc {text-align: left; padding: 2px 4px 2px 4px; font-size: 10px; display: flex; flex: 0 0 100%;}';

    var coursefield_container = '#bbconfig .config_var[id^="bbconfig_course"] {display: flex; flex-direction: row; margin: 2px 8px 2px 8px !important; vertical-align: top !important;}';

    var checkbox = '#bbconfig input[type="checkbox"] {vertical-align: top; display: flex; flex-direction: column;}';
    var textbox = '#bbconfig input[type="text"] {vertical-align: top; display: flex; flex-direction: column;}';

    var course_enabled_checkbox = '#bbconfig input[id$="_enabled"][type="checkbox"] {}';
    var course_id_textbox = '#bbconfig input[id$="_id"][type="text"] {width: 100px;}';
    var course_inits_textbox = '#bbconfig input[id$="_inits"][type="text"] {width: 100px;}';
    var course_name_textbox = '#bbconfig input[id$="_name"][type="text"] {width: 200px;}';
    var course_subpages_textarea = '#bbconfig textarea[id$="_subpages"] {width: 200px; height: 22px; display: flex; flex-direction: column; vertical-align: top; font-size: 12px; font-family: monospace !important;}';

    return (container + title + coursefield_container + section_container + section_header + section_desc + btn_container + checkbox + textbox
        + course_enabled_checkbox + course_id_textbox + course_inits_textbox + course_name_textbox + course_subpages_textarea);
}

GM_registerMenuCommand('bbtweaks Settings', openTheSettings);
function openTheSettings() {
    GM_config.open();
}

function getCourses(){
    var courses = [];
    for (var i = 1; i <= coursecount; i++) {
        var c = constructCourseObject(i);
        courses.push(c);
    }
    return courses;
}

function constructCourseObject(number){
    var name = "course" + number;
    console.log("Getting data fields from " + name);
    var cObj = {"num": number,
                "id": GM_config.get(name + '_id'),
                "inits": GM_config.get(name + '_inits'),
                "name": GM_config.get(name + '_name'),
                "enabled": GM_config.get(name + '_enabled'),
                "subpages": GM_config.get(name + '_subpages')
               };
    console.log("constructed course object " + name + " with id = " + cObj.id + ", inits = " + cObj.inits + ", name = " + cObj.name + ", enabled = " + cObj.enabled);
    console.log("constructed course object has subpages = " + cObj.subpages);
    return cObj;
}

function extraMenuButtons() {
    var menus_enabled = GM_config.get('topmenu_extrabuttons_enabled');
    if (!menus_enabled) {
        return;
    }

    var stylenode = document.createElement('style');
    stylenode.innerHTML = dropDownBtnCss();
    document.body.appendChild(stylenode);

    var currenturl = window.location.href;
    var topmenucontainer = document.querySelectorAll("#appTabList tr")[0];

    var buttonshtml = "";
    console.log("courses length " + courses.length);
    courses.forEach(function(c) {
        if (c.enabled) {
            buttonshtml += generateCourseButton(c);
        }
    });

    var calendarBtnHtml = generateLinkButton("Calendar", toolUrl("calendar-mybb_____calendar-tool"), (currenturl.includes("toolId=calendar") ? true : false));
    var updatesBtnHtml = generateLinkButton("Updates", toolUrl("AlertsOnMyBb_____AlertsTool"), (currenturl.includes("toolId=Alerts") ? true : false));

    topmenucontainer.innerHTML = calendarBtnHtml + updatesBtnHtml + buttonshtml + topmenucontainer.innerHTML;
}

function toolUrl(tool_id){
    return "https://blackboard.au.dk/webapps/bb-social-learning-BBLEARN/execute/mybb?cmd=display&toolId=" + tool_id;
}

//generate html for buttons
function generateLinkButton(name, url, active){
    return '<td ' + ((active == true) ? 'class = "active"' : '') + '><a href="' + url + '" target="_top"><span>' + name + '</span><span class="hideoff"> Tab 2 of 5</span></a></td>';
}

function generateCourseButton(course){
    console.log("Generating button for page " + course.inits);
    var subpages = JSON.parse(course.subpages);
    var linkbtnhtml = '<div style="height: 8px !important;"></div>';
    for (var i = 0; i < subpages.length; i++) {
        if (subpages[i].url == "divider") {
            linkbtnhtml += '<div style="height: 8px !important;"></div>';
        }
        else if (subpages[i].url == "heading") {
            linkbtnhtml += '<div style="padding-bottom: 4px !important; color: #777777 !important;">'+ subpages[i].name +'</div>';
        }
        else {
            linkbtnhtml += '<a style="padding-bottom: 4px !important; margin-left: 10px !important;" href="' + subpages[i].url + '">'+ subpages[i].name +'</a>';
        }
    }
    var homepageurl = "https://blackboard.au.dk/webapps/blackboard/execute/courseMain?course_id=" + course.id;
    return '<td class="dropdown' + (window.location.href.includes(course.id) ? ' active' : '') + '"><a href="' + homepageurl + '" class="dropbtn">' + course.inits + '</a><div class="dropdown-content">' + linkbtnhtml + '</div></td>';
}

//Returns the assiciated course object, if the current page is from a known course (null if not)
function getCurrentCourse()
{
    var foundcourse = null;
    var currenturl = window.location.href;
    courses.forEach(function(c) {
        if(currenturl.includes(c.id)){
            foundcourse = c;
        }
    });
    if (foundcourse == null) { console.log("Not on known course page");}
    else {console.log("On known course page: " + foundcourse.name);}

    return foundcourse;
}

function refreshSavedSideMenuItems() //TODO: Limit how often this runs
{
    var currentcourse = getCurrentCourse();

    //Return if current page is not known course page
    if (currentcourse != null) {
        console.log("refreshSavedCourseContentItems: currentcourse = " + currentcourse.inits);
    } else {
        console.log("refreshSavedCourseContentItems: currentcourse = null");
        return;
    }

    var pages = [];
    //Find sidebar menu container and add menu element info to list
    var sidemenucontainer = document.getElementById("courseMenuPalette_contents");
    var sidemenuitems = sidemenucontainer.children;
    for (var i = 0; i < sidemenuitems.length; i++) {
        var sidemenuitem = sidemenuitems[i];
        var itemlink = sidemenuitem.firstChild;
        //Add to sidebar menu item info to the course object's subpage list
        if (sidemenuitem.classList.contains("subhead")) {
            //Current sidemenu item is header/category text
            var htext = itemlink.firstChild.innerHTML.trim();
            pages.push({name: htext, url: "heading"}); //use (misuse) url attribute to indicate this is a heading
        } else if (sidemenuitem.classList.contains("divider")) {
            //Current sidemenu item is divider
            pages.push({name: "---", url: "divider"}); //indicate this is a divider
        } else {
            //Current sidemenu item is (probably?) clickable menulink to course subpage
            var text = itemlink.firstChild.innerHTML.trim();
            pages.push({name: text, url: itemlink.href});
        }
    }

    //Save updated data
    var field = "course" + currentcourse.num + "_subpages";
    var data = JSON.stringify(pages);
    console.log("Updating field " + field + " with data: " + data);
    GM_config.set(field, data);
    GM_config.save();
}

//Changes background color of selected menu item
function setSelectedMenuItemColor(color)
{
    var highlight_enabled = GM_config.get('sidemenu_highlight_enabled');
    if (!highlight_enabled) {
        return;
    }
    //Check if current page is known course page, return if not
    var currentcourse = getCurrentCourse();
    if (currentcourse != null) {
        console.log("setSelectedMenuItemColor: currentcourse = " + currentcourse.inits);
    } else {
        console.log("setSelectedMenuItemColor: currentcourse = null");
        return;
    }

    var alternatetitles = {"Course Description": ["AU Kursusbeskrivelse","Home Page","Officiel Kursusbeskrivelse"], //TODO: Add to settings
                           "Announcements": ["✉ Meddelser","Meddelelser"],
                           "Course Evaluation": ["Evaluation","Evaluering"],
                           "Tools": ["Kursus-værktøjer (herunder deltagerliste)"]
                          }; //To handle the (hopefully) few cases where currentpagetext != menuitemtext
    var menucontainer = document.getElementById("courseMenuPalette_contents");
    var menuitems = menucontainer.children;

    var pagetitlenode = document.querySelectorAll("#breadcrumbs > div > ol > li.placeholder")[0]; //Maybe use actual tab/page title instead?
    var pagetitle = pagetitlenode.innerHTML.trim();

    //Loop though menu items, search for item matching current page
    var menuitemfound = false;
    for (var i = 0; i < menuitems.length; i++) {
        var item = menuitems[i];
        if (!item.classList.contains("subhead") && !item.classList.contains("divider")) { //Current item is (probably?) clickable menulink to course subpage
            var menuitemtext = item.firstChild.firstChild.innerHTML.trim();

            //Change backgroud color if menuitem is associated with current page
            if (menuitemtext == pagetitle
                || (alternatetitles.hasOwnProperty(pagetitle) && alternatetitles[pagetitle].includes(menuitemtext)))
            {
                item.style.cssText += "background-color: " + color + "; border-right: 3px solid #45be55 !important; border-left: 3px solid #45be55 !important;";
                menuitemfound = true;
                break;
            }
        }
    }
    if (!menuitemfound) {
        //Complain if no matching menu item was found for current page
        console.log('setSelectedMenuItemColor: No menuitem title found matching "' + pagetitle + '", possibly because of alternate menuitem title');
    }
}

function dropDownBtnCss(){
    //Dropdown button hover
    var dd_hover_content      = '.dropdown:hover .dropdown-content {display: block; opacity: 0.4;}';
    var dd_hover_btn          = '.dropdown:hover .dropbtn {background-color: #3e8e41;} ';
    //Dropdown container
    var dd_content            = '.dropdown-content { display: none; position: fixed; background-color: #f1f1f1; min-width: 200px; box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2); z-index: 1000;} ';
    //Dropdown container hover
    var dd_content_hover      = '.dropdown .dropdown-content:hover {display: block; opacity: 1;} ';
    //Links
    var dd_content_link       = '.dropdown-content a {font-size: 14px ; text-align: left; color: black !important; font-weight: normal !important; padding: 0px; text-decoration: none !important; display: block;} ';
    //Links hover
    var dd_content_link_hover = '.dropdown-content a:hover {background-color: #ddd;} ';
    return (dd_hover_content + dd_hover_btn + dd_content + dd_content_hover + dd_content_link + dd_content_link_hover);
}
