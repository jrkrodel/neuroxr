import { toHTML } from "@portabletext/to-html";
import imageUrlBuilder from "@sanity/image-url";

//Imports for 3D functionality
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

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
    "linked_doc_url": research_doc_ref->.file.asset->.url,
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
        if (props.value.file) {
          if (props.value.file.url) {
            return `<a target="blank_" href=${props.value.file.url}>${props.children}</a>`;
          }
        } else {
          return `${props.children}`;
        }
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
      } else if (feature?.link_type === "research" && feature.linked_doc_url) {
        url = feature.linked_doc_url;
      } else {
        url = null;
      }

      if (feature.contentType === "video") {
        featureContent = `<div class="rvt-flex">
        <iframe width="100%" height="315" frameBorder="0" src="${feature.video}" title="video"></iframe></div>`;
      } else {
        featureContent = `    
        <img
        src="${urlFor(feature.image).height(375).width(575).url()}"
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
            <a class="rvt-cta" target=${
              feature?.link_type === "research" ? "_blank" : "_self"
            } href="${url}">${feature.link_text}</a>
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
    "linked_doc_url": research_doc_ref->.file.asset->.url,
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
        if (props.value.file) {
          if (props.value.file.url) {
            return `<a target="blank_" href=${props.value.file.url}>${props.children}</a>`;
          }
        } else {
          return `${props.children}`;
        }
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
      } else if (card?.link_type === "research" && card.linked_doc_url) {
        url = card.linked_doc_url;
      } else {
        url = null;
      }
      if (url !== null) {
        $(`#${page}-${cardType}Cards`).append(`<div class="rvt-cols-6-md">
        <div class="rvt-card">
          <div class="rvt-card__image">
            <img
              src="${urlFor(card.image).width(530).height(300).url()}"
              alt="${card.alt}"
            />
          </div>
          <div class="rvt-card__body rvt-m-bottom-md">
            <h2 class="rvt-card__title -rvt-m-bottom-xs">
              <a href="${url}"  target=${
          card?.link_type === "research" ? "_blank" : "_self"
        }>${card.title}</a>
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
        $(`#${page}-${cardType}Cards`).append(`<div class="rvt-cols-6-md">
        <div class="rvt-card">
          <div class="rvt-card__image">
            <img
              src="${urlFor(card.image).width(530).height(300).url()}"
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
    if (page === "resources-equipment") {
      if (cards.length % 2 !== 0) {
        $(`#${page}-${cardType}Cards`).append(`
      <div class="rvt-cols-6-md">
      <div class="rvt-card">
        <div class="rvt-card__image">
          <img
            src="./assests/RE_MoreToCome.jpg"
            width="530" 
            height="300"
            alt="Person with VR Headset outside"
          />
        </div>
        <div class="rvt-card__body rvt-m-bottom-md">
          <h2 class="rvt-card__title -rvt-m-bottom-xs">
            More to come!
          </h2>
          <div class="rvt-card__content [ rvt-flow ] ">
            <p class="-rvt-m-bottom-md">
            Stay tuned as we continue to grow our resources and equipment to stay on the cutting edge of XR technology.
            </p>
          </div>
        </div>
      </div>
    </div>`);
      }
    } else if (page === "get-involved") {
      if (cards.length % 2 !== 0) {
        $(`#${page}-${cardType}Cards`).append(`<div class="rvt-cols-6-md">
      <div class="rvt-card">
        <div class="rvt-card__image">
          <img
          src="./assests/GETINVOLVED_noRole.jpg"
          width="530" 
          height="300"
            alt="Many people working on computers"
          />
        </div>
        <div class="rvt-card__body rvt-m-bottom-md">
          <h2 class="rvt-card__title -rvt-m-bottom-xs">
            <a href="#/contact-us}">Don't see a role that fits?</a>
          </h2>
          <div class="rvt-card__content [ rvt-flow ]">
            <p class="-rvt-m-bottom-md">
            That’s OK! We still encourage you to contact us if you’re interested in contributing to NeuroXR.
            </p>
          </div>
        </div>
      </div>
    </div>`);
      }
    }
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

  const profileComponents = {
    marks: {
      profileLink: (props) => {
        return `<a href="${props.value.url}" class="rvt-cta">${props.text}</a>`;
      },
    },
  };

  client.fetch(queryProfiles).then((profiles) => {
    $(`#${page}-profiles`).empty();
    $(`#${page}-profiles`).addClass("rvt-container-lg rvt-p-top-sm");

    const alumniProfiles = [];
    if (profiles.length > 0) {
      profiles.forEach((profile, ind) => {
        let profileEmail;
        let profilePhoto;
        if (profile.email) {
          profileEmail = `<a
              class="rvt-ts-xs-md-up rvt-ts-xxs"
              href="mailto:${profile.email}"
            >
              ${profile.email}
            </a>`;
        } else {
          profileEmail = "";
        }
        if (profile.image) {
          profilePhoto = `<img
          class="rvt-m-right-xl-md-up rvt-border-radius-circle"
            src="${urlFor(profile.image).width(165).height(165).url()}"
            alt="${profile.alt}"
          />`;
        } else {
          profilePhoto = `<img
          width="165"
          height="165"
          class="rvt-m-right-xl-md-up rvt-border-radius-circle"
            src="./assests/blank_profile.png"
            alt="empty profile image"
          />`;
        }
        if (profile.alumni === false) {
          const bio = toHTML(profile.bio, {
            components: profileComponents,
          });

          $(`#${page}-profiles`).append(`

        <div
        class="rvt-flex-md-up rvt-flow rvt-flex-column rvt-flex-row-md-up rvt-items-start rvt-p-all-lg-md-up rvt-p-all-sm rvt-border-all rvt-border-radius rvt-m-bottom-xl"
      >
        <!-- Image -->
        ${profilePhoto}
        <!-- Content -->
        <div>
        <div class="rvt-card__eyebrow">${
          profile.roleTitle ? profile.roleTitle : ""
        }</div>
          <h2>${profile.name}</h2>
          ${bio}
          ${profileEmail}

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
          let profileEmail;
          let profilePhoto;
          if (profile.email) {
            profileEmail = `<a
              class="rvt-ts-xs-md-up rvt-ts-xxs"
              href="mailto:${profile.email}"
            >
              ${profile.email}
            </a>`;
          } else {
            profileEmail = "";
          }
          if (profile.image) {
            profilePhoto = `<img
          class="rvt-m-right-xl-md-up rvt-border-radius-circle"
            src="${urlFor(profile.image).width(165).height(165).url()}"
            alt="${profile.alt}"
          />`;
          } else {
            profilePhoto = `<img
          width="165"
          height="165"
          class="rvt-m-right-xl-md-up rvt-border-radius-circle"
            src="./assests/blank_profile.png"
            alt="empty profile image"
          />`;
          }
          const bio = toHTML(profile.bio, {
            components: profileComponents,
          });

          $(`#${page}-profiles`).append(`

        <div
        class="rvt-flex-md-up rvt-flow rvt-flex-column rvt-flex-row-md-up rvt-items-start rvt-p-all-lg-md-up rvt-p-all-sm rvt-border-all rvt-border-radius rvt-m-bottom-xl"
      >
        <!-- Image -->
        ${profilePhoto}
        <!-- Content -->
        <div>
        <div class="rvt-card__eyebrow">${
          profile.roleTitle ? profile.roleTitle : ""
        }</div>
          <h2>${profile.name}</h2>
          ${bio}
          ${profileEmail}
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
        `<h1 class="rvt-ts-lg">Publications and Posters</h1>`
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

//generate3DScene is an unused 3D Function for potential use in the future
//element - The id/html element to render the scene in
//Asset - the path to the 3d asset (currently OBJLoader is being used, as the asset we used to test it out was an ojb file, this can be updated or futher changed if different file types need to be loader)
//ScaleY and ScaleX - the scale of the render, allso effect camera perspective
//assetScale - the scale of the asset itself

// const generate3DScene = (element, asset, scaleY, scaleX, assetScale) => {
//   const scene = new THREE.Scene();

//   const light = new THREE.PointLight();
//   light.position.set(2.5, 7.5, 15);
//   scene.add(light);

//   const camera = new THREE.PerspectiveCamera(110, scaleX / scaleY, 0.1, 1000);

//   camera.position.z = 3;

//   const renderer = new THREE.WebGLRenderer({ alpha: true });
//   renderer.setSize(scaleX, scaleY);
//   $(element).append(renderer.domElement);

//   const controls = new OrbitControls(camera, renderer.domElement);
//   controls.enableZoom = false;
//   controls.enablePan = false;
//   controls.enableDamping = true;

//   const objLoader = new OBJLoader();
//   objLoader.load(
//     asset,
//     (object) => {
//       object.scale.setScalar(assetScale);
//       scene.add(object);
//     },
//     (xhr) => {
//       console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
//     },
//     (error) => {
//       console.log(error);
//     }
//   );

//   function animate() {
//     requestAnimationFrame(animate);

//     controls.update();

//     render();
//   }

//   function render() {
//     renderer.render(scene, camera);
//   }

//   animate();
// };

const changePage = function (page, callback) {
  if (page === "" || page === "home") {
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
            if (result !== "sent") {
              $("#submit").val(result);
              setTimeout(() => {
                $("#submit").val("Submit");
              }, "1500");
            } else {
              $("#fname").val("");
              $("#lname").val("");
              $("#email").val("");
              $("#subject").val("");
              $("#message").val("");
              $("#submit").val("Message Sent!");
              setTimeout(() => {
                $("#submit").val("Submit");
              }, "1500");
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
