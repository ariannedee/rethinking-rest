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
    repositories(first: 6, orderBy: {field: CREATED_AT, direction: DESC}) {
      totalCount
      nodes {
        name
        openIssues: issues(states: OPEN) {
          totalCount
        }
        openPRs: pullRequests(states: OPEN) {
          totalCount
        }
        ... commitFragment
      }
    }
  }
}
` + commitFragment;

let mutationAddStar;

let mutationRemoveStar;

function gqlRequest(query, variables, onSuccess) {
  // MAKE GRAPHQL REQUEST
  $.post({
    url: "https://api.github.com/graphql",
    headers: {
      Authorization: `bearer ${env.GITHUB_PERSONAL_ACCESS_TOKEN}`
    },
    contentType: "application/json",
    data: JSON.stringify({
      query: query,
      variables: variables
    }),
    success: (response) => {
      if (response.errors) {
        console.log(response.errors);
      } else {
        onSuccess(response.data);
      }
    },
    error: (error) => {
      console.log(error);
    }
  });
}

function starHandler(element) {
  // STAR OR UNSTAR REPO BASED ON ELEMENT STATE

}

$(window).ready(function() {
  // GET NAME AND REPOSITORIES FOR VIEWER
  gqlRequest(queryRepoList, {}, (data) => {
    console.log(data);
    $("header h2").text(`Hello ${data.viewer.name}`);
    const repos = data.viewer.repositories;
    if (repos.totalCount > 0) {
      $("ul.repos").empty();
    }
    repos.nodes.forEach((node) => {
      const card = `
      <h3>${node.name}</h3>
      <p>${node.openIssues.totalCount} open issues</p>
      <p>${node.openPRs.totalCount} open PRs</p>
      <p>${node.ref.target.history.totalCount} commits</p>
      `
      $("ul.repos").append(`<li>${card}</li>`);
    });
  });
});