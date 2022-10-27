const MODEL = (function () {
  const changePage = function (page, callback) {
    if (page == "") {
      $.get(`pages/home/home.html`, function (data) {
        $("#app").empty();
        $("#app").append(data);
      });
    } else {
      $.get(`pages/${page}/${page}.html`, function (data) {
        $("#app").empty();
        $("#app").append(data);
        if (callback) {
          callback();
        }
      });
    }
  };
  return {
    changePage,
  };
})();
