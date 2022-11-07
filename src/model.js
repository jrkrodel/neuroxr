import { toHTML } from "@portabletext/to-html";
import imageUrlBuilder from "@sanity/image-url";

const sanityClient = require("@sanity/client");
const client = sanityClient({
  projectId: "0m0o2jn4",
  dataset: "production",
  apiVersion: "2022-11-02", // use current UTC date - see "specifying API version"!
  useCdn: true, // `false` if you want to ensure fresh data
});

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(client);

function urlFor(source) {
  return builder.image(source);
}

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
            src="${urlFor(feature.image).url()}"
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
              src="${urlFor(card.image).url()}"
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

const getProfiles = (page) => {
  $(`#${page}-profiles`).append(`
  <div class="rvt-flex rvt-justify-center rvt-p-all-xxl rvt-items-center">
    <div class="rvt-loader rvt-loader--xl" aria-label="Content loading"></div>
  </div>
  `);
  const query = `*[_type == "profile"]`;

  client.fetch(query).then((profiles) => {
    $(`#${page}-profiles`).empty();
    $(`#${page}-profiles`).addClass("rvt-row rvt-row--loose");
    profiles.forEach((profile, ind) => {
      const bio = toHTML(profile.bio, {
        components: {
          /* optional object of custom components to use */
        },
      });
      $(`#${page}-profiles`).append(`
        <li class="rvt-cols-6-md rvt-cols-4-lg [ rvt-flex rvt-m-bottom-xxl ]">
        <div class="rvt-card">
          <div class="rvt-avatar rvt-avatar--lg">
            <img
              class="rvt-avatar__image"
              src="${urlFor(profile.image).url()}"
              alt=""
            />
          </div>
          <div class="rvt-card__body">
            <div class="rvt-card__eyebrow">${profile.role}</div>
            <h2 class="rvt-card__title">
              <a href="#0">${profile.name}</a>
            </h2>
            <div class="rvt-card__content [ rvt-flow ]">
              ${bio}
            </div>
            <div class="rvt-card__meta">
              <div class="rvt-flex rvt-items-center">
                <svg
                  class="rvt-color-black-400 rvt-m-right-xs"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M16,12.8A3.2,3.2,0,0,1,12.8,16,12.8,12.8,0,0,1,0,3.2,3.2,3.2,0,0,1,3.2,0a3,3,0,0,1,.54,0,2.84,2.84,0,0,1,.53.14l1.2,5.27-1.73.9a9.55,9.55,0,0,0,5.91,5.91l.91-1.74,5.26,1.22a2.84,2.84,0,0,1,.14.53A3,3,0,0,1,16,12.8Z"
                  />
                </svg>
                <p class="rvt-m-all-none">${profile.phone}</p>
              </div>
              <div class="rvt-flex rvt-items-center rvt-m-top-xs">
                <svg
                  class="rvt-color-black-400 rvt-m-right-xs"
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill="currentColor"
                    d="M13.5,3H2.5A1.5,1.5,0,0,0,1,4.5v8A1.5,1.5,0,0,0,2.5,14h11A1.5,1.5,0,0,0,15,12.5v-8A1.5,1.5,0,0,0,13.5,3ZM11.41,5,8,7.77,4.59,5ZM3,12V6.29L7.11,9.62l.12.08a1.5,1.5,0,0,0,1.54,0L13,6.29V12Z"
                  />
                </svg>
                <a href="#0">${profile.email}</a>
              </div>
            </div>
          </div>
        </div>
      </li>`);
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
      } else if (page === "our-team") {
        getProfiles(page);
      }
      if (callback) {
        callback(page);
      }
    });
  }
};

export { changePage, getFeatures };
