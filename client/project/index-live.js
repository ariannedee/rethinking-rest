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
    repos: repositoriesContributedTo (first: 10, orderBy: {field: CREATED_AT, direction: DESC}) {
      totalCount
      nodes {
        name
        issues (states: OPEN) {
          totalCount
        }
        pullRequests (states: OPEN) {
          totalCount
        }
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
      Authorization: "bearer ..."
    },
    data: JSON.stringify({
      query: query,
      variables: variables
    }),
    success: onSuccess,
    error: (error) => console.log(error)
  });
}

function starHandler(element) {
  // STAR OR UNSTAR REPO BASED ON ELEMENT STATE

}

$(window).ready(function() {
  // GET NAME AND REPOSITORIES FOR VIEWER

  gqlRequest(queryRepoList, null, (response) => {
    console.log(response);
    $("header h2").text(`Hello ${response.data.viewer.name}`);
    const repos = response.data.viewer.repos;
    if (repos.totalCount > 0) {
      $("ul").empty();
    }
    repos.nodes.forEach((repo) => {
      let content = `
      <h3>${repo.name}</h3>
      <p>${repo.issues.totalCount} open issues</p>
      <p>${repo.pullRequests.totalCount} open PRs</p>
      `
      $("ul").append(`<li>${content}</li>`);
    });
  });
});