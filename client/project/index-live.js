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
query {
  viewer {
    name
    repositories(first: 9, orderBy: {field: CREATED_AT, direction: DESC}) {
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
    contentType: "application/json",
    headers: {
      Authorization: `bearer ${env.GITHUB_PERSONAL_ACCESS_TOKEN}`
    },
    data: JSON.stringify({
      query: query,
      variables: variables
    }),
    success: (response) => {
      console.log(response);
      onSuccess(response);
    }
  });
}

function starHandler(element) {
  // STAR OR UNSTAR REPO BASED ON ELEMENT STATE

}

$(window).ready(function() {
  // GET NAME AND REPOSITORIES FOR VIEWER
  gqlRequest(queryRepoList, null, (response) => {
    $('header h2').text(`Hello ${response.data.viewer.name}`);
    const repos = response.data.viewer.repositories;
    if (repos.totalCount > 0) {
      $('ul.repos').empty();
      repos.nodes.forEach((repo) => {
        const card = `<h3>${repo.name}</h3>`;
        $('ul.repos').append(`<li><div>${card}</div></li>`);
      });
    }
  });
});