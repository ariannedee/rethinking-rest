const fullStar = "★";
const emptyStar = "☆";

const commitFragment = `
fragment commitFragment on Repository {
  ref(qualifiedName: "master") {
    target {
      ... on Commit {
        history {
          totalCount
        }
      }
    }
  }
}
`;

const queryRepoList = `
{
  viewer {
    name
    repositories(first: 6) {
      totalCount
      nodes {
        name
      }
    }
  }
}
`;

let mutationAddStar;

let mutationRemoveStar;

function gqlRequest(query, variables, onSuccess) {
  // MAKE GRAPHQL REQUEST
  $.post({
    url: "https://api.github.com/graphql",
    headers: {
      Authorization: "bearer e7ae5a8e59ada21a3c33ff0a3ee4b97e076a86c1"
    },
    contentType: "application/json",
    data: JSON.stringify({
      query: query,
      variables: variables
    }),
    success: (response) => {
      console.log(response);
      onSuccess(response);
    }
  })
}

function starHandler(element) {
  // STAR OR UNSTAR REPO BASED ON ELEMENT STATE

}

$(window).ready(function() {
  // GET NAME AND REPOSITORIES FOR VIEWER
  gqlRequest(queryRepoList, {}, (response) => {
    const viewer = response.data.viewer;
    $('header h2').text(`Hello ${viewer.name}`);

    const repos = viewer.repositories;
    if (repos.totalCount > 0) {
      $("ul.repos").empty();
    }
    repos.nodes.forEach((repo) => {
      const card = `<h3>${repo.name}</h3>`;
      $("ul.repos").append(`<li><div>${card}</div></li>`);
    });
  });
});