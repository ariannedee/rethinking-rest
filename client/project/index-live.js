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
        starred: viewerHasStarred
        name
        issues (states: OPEN) {
          totalCount
        }
        pullRequests (states: OPEN) {
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
    contentType: "application/json",
    headers: {
      Authorization: "bearer ..."
    },
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
    error: (error) => console.log(error)
  });
}

function starHandler(element) {
  // STAR OR UNSTAR REPO BASED ON ELEMENT STATE

}

$(window).ready(function() {
  // GET NAME AND REPOSITORIES FOR VIEWER

  gqlRequest(queryRepoList, null, (data) => {
    $("header h2").text(`Hello ${data.viewer.name}`);
    const repos = data.viewer.repos;
    if (repos.totalCount > 0) {
      $("ul").empty();
    }
    repos.nodes.forEach((repo) => {
      const star = repo.starred? fullStar : emptyStar;
      let content = `
      <h3>
        ${repo.name}
        <span class="star">${star}</span>
      </h3>
      <p>${repo.issues.totalCount} open issues</p>
      <p>${repo.pullRequests.totalCount} open PRs</p>
      <p>${repo.ref.target.history.totalCount} commits</p>
      `
      $("ul").append(`<li>${content}</li>`);
    });
  });
});