import { changePage, getFeatures } from "./model.js";

function route() {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace("#/", "");
  changePage(pageID, getFeatures);
  if (pageID !== "") {
    $("nav li").removeClass("rvt-header-menu__item--current");
    $("#" + pageID).addClass("rvt-header-menu__item--current");
  }
}

function initListeners() {
  $(window).on("hashchange", route);
  route();
}

$(document).ready(function () {
  try {
    initListeners();
  } catch {
    console.error();
  }
});