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
    repositories (first: 100, orderBy:{field: CREATED_AT, direction: DESC}) {
      totalCount
      nodes {
        name
        openIssues: issues (states: OPEN) {
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
    }
  });
}

function starHandler(element) {
  // STAR OR UNSTAR REPO BASED ON ELEMENT STATE

}

$(window).ready(function() {
  // GET NAME AND REPOSITORIES FOR VIEWER
  gqlRequest(queryRepoList, {}, (data) => {
    const name = data.viewer.name;
    $('header h2').text("Hello " + name);
    const repos = data.viewer.repositories;
    if (repos.totalCount > 0) {
      $("ul.repos").empty();
      repos.nodes.forEach((repo) => {
        console.log(repo);
        const card = `<li>
        <h3>${repo.name}</h3>
        <p>${repo.openIssues.totalCount} open issues</p>
        <p>${repo.openPRs.totalCount} open PRs</p>
        <p>${repo.ref.target.history.totalCount} commits</p>
        </li>`
        $("ul.repos").append(card);
      });
    }
  });
});