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
  $(`#${page}-features`).empty();
  $(`#${page}-features`).append(`
  <div class="rvt-flex rvt-justify-center rvt-p-all-xxl rvt-items-center">
    <div class="rvt-loader rvt-loader--xl" aria-label="Content loading"></div>
  </div>
  `);
  const query = `*[_type == "feature" && page == "${page}"] | order(order) {
    ...,
     desc[] {
       ...,
       markDefs[] {
         ...,
         _type == "internalLink" => {
         ...,
         "file": @.doc-> {
         ...,
         "url": file.asset->.url
       }
       }
       }
     }
    }`;

  const featureComponents = {
    marks: {
      internalLink: (props) => {
        console.log(props);
        return `<a target="blank_" href=${props.value.file.url}>${props.children}</a>`;
      },
    },
  };

  client.fetch(query).then((features) => {
    $(`#${page}-features`).empty();
    features.forEach((feature, ind) => {
      const description = toHTML(feature.desc, {
        components: featureComponents,
      });
      let url;
      let featureContent;
      if (feature?.link_type === "internal" && feature.i_url) {
        url = feature.i_url;
      } else if (feature?.link_type === "external" && feature.e_url) {
        url = feature.e_url;
      } else {
        url = null;
      }
      if (feature.contentType === "video") {
        featureContent = `<div class="rvt-flex">
        <iframe width="100%" height="315" frameBorder="0" src="${feature.video}" title="video"></iframe></div>`;
      } else {
        featureContent = `    
        <img
        src="${urlFor(feature.image).url()}"
        alt="${feature.alt}"
      />`;
      }
      if (url !== null) {
        $(`#${page}-features`)
          .append(`<div class="rvt-container-lg rvt-p-tb-xl rvt-p-tb-3-xl-md-up">
      <div class="rvt-billboard ${
        ind % 2 == 0 ? "" : "rvt-billboard--reverse"
      }">
        <div class="rvt-billboard__image">
          ${featureContent}
        </div>
        <div class="rvt-billboard__body">
          <h2 class="rvt-billboard__title">
            ${feature.title}
          </h2>
          <div class="rvt-billboard__content [ rvt-flow ]">
            ${description}
            <a class="rvt-cta" href="${url}">${feature.link_text}</a>
          </div>
        </div>
      </div>
    </div>`);
      } else {
        $(`#${page}-features`)
          .append(`<div class="rvt-container-lg rvt-p-tb-xl rvt-p-tb-3-xl-md-up">
    <div class="rvt-billboard ${ind % 2 == 0 ? "" : "rvt-billboard--reverse"}">
      <div class="rvt-billboard__image">
        ${featureContent}
      </div>
      <div class="rvt-billboard__body">
        <h2 class="rvt-billboard__title">
          ${feature.title}
        </h2>
        <div class="rvt-billboard__content [ rvt-flow ]">
          ${description}
        </div>
      </div>
    </div>
  </div>`);
      }
    });
  });
};

const getCards = (page, cardType) => {
  $(`#${page}-${cardType}Cards`).empty();
  const query = `*[_type == "card" && type == "${cardType}"] | order(order) {
    ...,
     desc[] {
       ...,
       markDefs[] {
         ...,
         _type == "internalLink" => {
         ...,
         "file": @.doc-> {
         ...,
         "url": file.asset->.url
       }
       }
       }
     }
    }`;

  const cardComponents = {
    marks: {
      internalLink: (props) => {
        console.log(props);
        return `<a target="blank_" href=${props.value.file.url}>${props.children}</a>`;
      },
    },
  };

  client.fetch(query).then((cards) => {
    $(`#${page}-${cardType}Cards`).empty();
    cards.forEach((card, ind) => {
      const description = toHTML(card.desc, {
        components: cardComponents,
      });
      let url;
      if (card?.link_type === "internal" && card.i_url) {
        url = card.i_url;
      } else if (card?.link_type === "external" && card.e_url) {
        url = card.e_url;
      } else {
        url = null;
      }
      if (url !== null) {
        $(`#${page}-${cardType}Cards`).append(`<div class="cardCustom">
        <div class="rvt-card">
          <div class="rvt-card__image">
            <img
              src="${urlFor(card.image).url()}"
              alt="${card.alt}"
            />
          </div>
          <div class="rvt-card__body rvt-m-bottom-md">
            <h2 class="rvt-card__title -rvt-m-bottom-xs">
              <a href="${url}">${card.title}</a>
            </h2>
            <div class="rvt-card__content [ rvt-flow ]">
              <p class="-rvt-m-bottom-md">
                ${description}
              </p>
            </div>
          </div>
        </div>
      </div>`);
      } else {
        $(`#${page}-${cardType}Cards`).append(`<div class="cardCustom"">
        <div class="rvt-card">
          <div class="rvt-card__image">
            <img
              src="${urlFor(card.image).url()}"
              alt="${card.alt}"
            />
          </div>
          <div class="rvt-card__body rvt-m-bottom-md">
            <h2 class="rvt-card__title -rvt-m-bottom-xs">
              ${card.title}
            </h2>
            <div class="rvt-card__content [ rvt-flow ] ">
              <p class="-rvt-m-bottom-md">
                ${description}
              </p>
            </div>
          </div>
        </div>
      </div>`);
      }
    });
  });
};

const getProfiles = (page, type) => {
  $(`#${page}-profiles`).empty();
  $(`#${page}-profiles`).append(`
  <div class="rvt-flex rvt-justify-center rvt-p-top-3-xl rvt-items-center">
    <div class="rvt-loader rvt-loader--xl" aria-label="Content loading"></div>
  </div>
  `);
  const query = `*[_type == "profile_type"] | order(order)`;
  client
    .fetch(query)
    .then((items) => {
      $(`#profile-profileTypes`).empty();
      items.forEach((item, ind) => {
        console.log(ind);
        if (item.slug.current === type) {
          $(`#profile-profileTypes`).append(`
      <li class="rvt-subnav__item">
        <a aria-current="page" id="${item.slug.current}" href="#/our-team">${item.title}</a>
      </li>`);
        } else {
          $(`#profile-profileTypes`).append(`
        <li class="rvt-subnav__item">
          <a id="${item.slug.current}" href="#/our-team">${item.title}</a>
        </li>`);
        }
      });
    })
    .then(() => {
      $(".rvt-subnav a").click(function (e) {
        e.preventDefault();
        $(".rvt-subnav a").removeAttr("aria-current");
        getProfiles(page, e.currentTarget.id);
        e.currentTarget.setAttribute("aria-current", "page");
      });
    });

  const queryProfiles = `*[_type == "profile" && role->.slug.current == "${type}"] | order(order)`;

  client.fetch(queryProfiles).then((profiles) => {
    $(`#${page}-profiles`).empty();
    $(`#${page}-profiles`).addClass("rvt-container-lg rvt-p-top-sm");
    const alumniProfiles = [];
    if (profiles.length > 0) {
      profiles.forEach((profile, ind) => {
        if (profile.alumni === false) {
          const bio = toHTML(profile.bio, {
            components: {
              /* optional object of custom components to use */
            },
          });

          $(`#${page}-profiles`).append(`

        <div
        class="rvt-flex-md-up rvt-flow rvt-flex-column rvt-flex-row-md-up rvt-items-center rvt-p-all-lg-md-up rvt-p-all-sm rvt-border-all rvt-border-radius rvt-m-bottom-xl"
      >
        <!-- Image -->
        <img
        class="rvt-m-right-xl-md-up rvt-border-radius-circle"
          src="${urlFor(profile.image).url()}"
          alt="${profile.alt}"
        />
        <!-- Content -->
        <div>
        <div class="rvt-card__eyebrow">${profile.roleTitle}</div>
          <h2>${profile.name}</h2>
          ${bio}
          <p class="rvt-ts-xs-md-up rvt-ts-xxs">${profile.email}</p>
        </div>
      </div>
      `);
        } else {
          alumniProfiles.push(profile);
        }
      });
      if (alumniProfiles.length > 0) {
        $(`#${page}-profiles`).append(`
        <div class="rvt-container-xxl">
          <h1 class="rvt-ts-lg rvt-border-bottom">Alumni</h1>
        </div>`);
        alumniProfiles.forEach((profile) => {
          const bio = toHTML(profile.bio, {
            components: {
              /* optional object of custom components to use */
            },
          });

          $(`#${page}-profiles`).append(`

        <div
        class="rvt-flex-md-up rvt-flow rvt-flex-column rvt-flex-row-md-up rvt-items-center rvt-p-all-lg-md-up rvt-p-all-sm rvt-border-all rvt-border-radius rvt-m-bottom-xl"
      >
        <!-- Image -->
        <img
        class="rvt-m-right-xl-md-up rvt-border-radius-circle"
          src="${urlFor(profile.image).url()}"
          alt="${profile.alt}"
        />
        <!-- Content -->
        <div>
        <div class="rvt-card__eyebrow">${profile.roleTitle}</div>
          <h2>${profile.name}</h2>
          ${bio}
          <p class="rvt-ts-xs-md-up rvt-ts-xxs">${profile.email}</p>
        </div>
      </div>
      `);
        });
      }
    } else {
      $(`#${page}-profiles`).append(`
          <h1>No Profiles Found</h1>        
        `);
    }
  });
};

const getResearch = (page) => {
  $(`#${page}-research`).empty();
  $(`#${page}-research`).append(`
  <div class="rvt-flex rvt-justify-center rvt-p-all-xxl rvt-items-center">
    <div class="rvt-loader rvt-loader--xl" aria-label="Content loading"></div>
  </div>
  `);
  const query = `*[_type == "research_doc" && featured == true] {
    ...,
    "doc_url": file.asset->url
  }`;

  client.fetch(query).then((research) => {
    $(`#${page}-research`).empty();
    if (research.length > 0) {
      $(`#${page}-research`).append(
        `<h1 class="rvt-ts-lg">More of our Research</h1>`
      );
      research.forEach((doc, ind) => {
        const description = toHTML(doc.description, {
          components: {
            /* optional object of custom components to use */
          },
        });
        $(`#${page}-research`).append(`  
      <li class="rvt-link-hub__item">
      <a class="rvt-link-hub__link" target="_blank" href="${doc.doc_url}">
        <span class="rvt-link-hub__text">${doc.title}</span>
        <span class="rvt-link-hub__description"
          >${description}</span
        >
      </a>
    </li>`);
      });
    }
  });
};

const changePage = function (page, callback) {
  if (page == "") {
    $.get(`pages/home/home.html`, function (data) {
      $("#app").empty();
      $("#app").append(data);
      getFeatures("home");
      $("body").scrollTop(0);
    });
  } else if (page === "contact-us") {
    $("body").scrollTop(0);
    $.get(`pages/contact-us/contact-us.html`, function (data) {
      $("#app").empty();
      $("#app").append(data);
      $("#contactForm").submit(function (e) {
        e.preventDefault(); // avoid to execute the actual submit of the form.

        const form = $(this).serialize();
        const actionUrl = $(this).attr("action");

        $.ajax({
          type: "POST",
          url: actionUrl,
          data: form, // serializes the form's elements.
          success: function (result) {
            $("#fname").val("");
            $("#lname").val("");
            $("#email").val("");
            $("#subject").val("");
            $("#message").val("");
            if (result !== "sent") {
              $("#submit").val("Error Occured, please try again");
            } else {
              $("#submit").val("Message Sent!");
              setTimeout(() => {
                $("#submit").val("Submit");
              }, "10000");
            }
          },
        });
      });
    });
  } else {
    $.get(`pages/${page}/${page}.html`, function (data) {
      $("#app").empty();
      $("#app").append(data);
      $("body").scrollTop(0);
      if (page === "resources-equipment") {
        getCards(page, "equipment");
      } else if (page === "get-involved") {
        getCards(page, "sRole");
      } else if (page === "our-team") {
        const query = `*[_type == "profile_type" && order == 1]`;
        client.fetch(query).then((item) => {
          getProfiles(page, item[0].slug.current);
        });
      } else if (page === "our-research") {
        getResearch(page);
      }
      if (callback) {
        callback(page);
      }
    });
  }
};

export { changePage, getFeatures };
