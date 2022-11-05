import { toHTML } from "@portabletext/to-html";

const sanityClient = require("@sanity/client");
const client = sanityClient({
  projectId: "0m0o2jn4",
  dataset: "production",
  apiVersion: "2022-11-02", // use current UTC date - see "specifying API version"!
  useCdn: true, // `false` if you want to ensure fresh data
});

const getFeatures = (page) => {
  $(`#${page}-features`).append(`
  <div class="rvt-flex rvt-justify-center rvt-p-all-xxl rvt-items-center">
    <div class="rvt-loader rvt-loader--xl" aria-label="Content loading"></div>
  </div>
  `);
  const query = `*[_type == "feature" && page == "${page}"]`;

  client.fetch(query).then((features) => {
    $(`#${page}-features`).empty();
    features.forEach((feature, ind) => {
      const description = toHTML(feature.desc, {
        components: {
          /* optional object of custom components to use */
        },
      });
      $(`#${page}-features`)
        .append(`<div class="rvt-container-lg rvt-p-tb-xl rvt-p-tb-3-xl-md-up">
      <div class="rvt-billboard ${
        ind % 2 == 0 ? "" : "rvt-billboard--reverse"
      }">
        <div class="rvt-billboard__image">
          <img
            src="https://rivet.iu.edu/img/placeholder/billboard-2.jpg"
            alt="Replace this value with appropriate alternative text"
          />
        </div>
        <div class="rvt-billboard__body">
          <h2 class="rvt-billboard__title">
            ${feature.title}
          </h2>
          <div class="rvt-billboard__content [ rvt-flow ]">
            ${description}
            <a class="rvt-cta" href="${feature.i_url}"> See all our people </a>
          </div>
        </div>
      </div>
    </div>`);
    });
  });
};

const getCards = (page, cardType) => {
  const query = `*[_type == "card" && type == "${cardType}"]`;

  client.fetch(query).then((cards) => {
    $(`#${page}-${cardType}Cards`).empty();
    cards.forEach((card, ind) => {
      const description = toHTML(card.desc, {
        components: {
          /* optional object of custom components to use */
        },
      });
      $(`#${page}-${cardType}Cards`).append(`<div class="rvt-cols-4-md ">
        <div class="rvt-card">
          <div class="rvt-card__image">
            <img
              src="https://rivet.iu.edu/img/placeholder/list-card-3.jpg"
              alt="Smiling students sitting outside on a bench"
            />
          </div>
          <div class="rvt-card__body">
            <h2 class="rvt-card__title">
              <a href="#">${card.title}</a>
            </h2>
            <div class="rvt-card__content [ rvt-flow ]">
              <p>
                ${description}
              </p>
            </div>
          </div>
        </div>
      </div>`);
    });
  });
};

const changePage = function (page, callback) {
  if (page == "") {
    $.get(`pages/home/home.html`, function (data) {
      $("#app").empty();
      $("#app").append(data);
      getFeatures("home");
    });
  } else {
    $.get(`pages/${page}/${page}.html`, function (data) {
      $("#app").empty();
      $("#app").append(data);
      if (page === "resources-equipment") {
        getCards(page, "equipment");
        getCards(page, "role");
      } else if (page === "get-involved") {
        getCards(page, "sRole");
      }
      if (callback) {
        callback(page);
      }
    });
  }
};

export { changePage, getFeatures };
